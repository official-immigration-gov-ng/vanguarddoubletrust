const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

function getServiceAccount() {
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const defaultPath = path.join(__dirname, "serviceAccount.json");
  const filePath = envPath ? path.resolve(envPath) : defaultPath;
  try {
    if (fs.existsSync(filePath)) {
      const rawFile = fs.readFileSync(filePath, "utf8");
      return JSON.parse(rawFile);
    }
  } catch {}

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("Missing Firebase service account. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON.");
  }
  return JSON.parse(raw);
}

function getAdminApp() {
  if (admin.apps.length > 0) return admin.app();

  const serviceAccount = getServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  return admin.app();
}

function getAuth() {
  getAdminApp();
  return admin.auth();
}

function getFirestore() {
  getAdminApp();
  return admin.firestore();
}

module.exports = {
  getAuth,
  getFirestore
};
