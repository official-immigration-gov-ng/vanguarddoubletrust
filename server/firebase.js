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
      try {
        return JSON.parse(rawFile);
      } catch {
        throw new Error("Invalid Firebase service account JSON file.");
      }
    }
  } catch {}

  const rawBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (rawBase64) {
    try {
      const decoded = Buffer.from(String(rawBase64), "base64").toString("utf8");
      return JSON.parse(decoded);
    } catch {
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON_BASE64. Must be base64-encoded JSON.");
    }
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("Missing Firebase service account. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON.");
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON. Must be valid JSON.");
  }
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
