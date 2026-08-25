const path = require("path");
const { getAuth, getFirestore } = require("./server/firebase");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

(async () => {
  try {
    console.log("[CLEANUP] Starting cleanup of old accounts...");
    const db = getFirestore();
    const auth = getAuth();

    const usersSnap = await db.collection("users").get();
    console.log(`[CLEANUP] Found ${usersSnap.docs.length} user document(s) in Firestore.`);

    let deletedCount = 0;

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const data = userDoc.data() || {};
      console.log(`[CLEANUP] Deleting user UID: ${uid} (email: ${data.email || "N/A"})...`);

      // Delete from Firebase Auth
      try {
        await auth.deleteUser(uid);
        console.log(`  - Firebase Auth record deleted.`);
      } catch (authErr) {
        console.log(`  - Firebase Auth note: ${authErr.message || authErr.code}`);
      }

      // Delete transactions subcollection
      try {
        const txSnap = await userDoc.ref.collection("transactions").get();
        let batch = db.batch();
        let count = 0;
        for (const doc of txSnap.docs) {
          batch.delete(doc.ref);
          count++;
          if (count >= 400) {
            await batch.commit();
            batch = db.batch();
            count = 0;
          }
        }
        if (count > 0) await batch.commit();
        console.log(`  - Deleted ${txSnap.docs.length} transaction(s).`);
      } catch (txErr) {
        console.log(`  - Transaction subcollection note: ${txErr.message}`);
      }

      // Delete user document
      await userDoc.ref.delete();
      console.log(`  - User document deleted from Firestore.`);
      deletedCount++;
    }

    console.log(`[CLEANUP] SUCCESS: Cleared ${deletedCount} account(s).`);
    process.exit(0);
  } catch (e) {
    console.error("[CLEANUP] ERROR:", e);
    process.exit(1);
  }
})();
