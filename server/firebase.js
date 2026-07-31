const admin = require("firebase-admin");

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
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

