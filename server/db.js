const mongoose = require("mongoose");

function normalizeMongoUri(uri, dbName) {
  if (!uri) return uri;
  const hasDbPath = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(uri);
  if (hasDbPath) return uri;
  const safeDb = dbName && String(dbName).trim() ? String(dbName).trim() : "vanguarddoubletrust";
  const hasQuery = uri.includes("?");
  if (hasQuery) {
    const parts = uri.split("?");
    const base = parts[0];
    const query = parts.slice(1).join("?");
    return `${base.replace(/\/+$/, "")}/${safeDb}?${query}`;
  }
  return `${uri.replace(/\/+$/, "")}/${safeDb}`;
}

async function connectMongo() {
  const uri = normalizeMongoUri(process.env.MONGODB_URI, process.env.MONGODB_DB);
  if (!uri) throw new Error("Missing MONGODB_URI");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  return mongoose.connection;
}

module.exports = { connectMongo };

