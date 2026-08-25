const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

const { getAuth, getFirestore } = require("./firebase");
const { getCookieName, getCookieOptions, getSessionExpiresInMs, requireAuth } = require("./auth");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

(function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
  try {
    if (cloudinaryUrl) {
      cloudinary.config(cloudinaryUrl);
    } else if (cloudName) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Cloudinary] Init skipped:", e && e.message ? String(e.message) : e);
    }
  }
})();

const CLOUDINARY_CLOUD_NAME = String(cloudinary.config().cloud_name || process.env.CLOUDINARY_CLOUD_NAME || "");
const CLOUDINARY_UPLOAD_PRESET = String(process.env.CLOUDINARY_UPLOAD_PRESET || "vanguarddoubletrust_profile_unsigned");
const CLOUDINARY_PROFILE_FOLDER = String(process.env.CLOUDINARY_PROFILE_FOLDER || "vanguarddoubletrust/profiles");
const CLOUDINARY_URL_PATTERN = CLOUDINARY_CLOUD_NAME
  ? new RegExp(`^https://res\\.cloudinary\\.com/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/`, "i")
  : /^https:\/\/res\.cloudinary\.com\//i;

const app = express();

function deriveFallbackSecret(purpose) {
  const seed = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) : "";
  if (seed) {
    return crypto.createHash("sha256").update(`${purpose}:${seed}`, "utf8").digest("hex");
  }
  return crypto.randomBytes(32).toString("hex");
}

const pinCookieName = process.env.PIN_COOKIE_NAME || "vt_pin_verified";
const pinCookieSecret = process.env.PIN_COOKIE_SECRET || deriveFallbackSecret("vt_pin_cookie_secret");
const adminCookieName = process.env.ADMIN_COOKIE_NAME || "vt_admin_session";
const adminCookieSecret = process.env.ADMIN_COOKIE_SECRET || deriveFallbackSecret("vt_admin_cookie_secret");

app.set("trust proxy", 1);
app.disable("x-powered-by");

const corsOrigins = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    next();
    return;
  }

  const allowed = corsOrigins.length === 0 ? false : corsOrigins.includes(origin);
  if (!allowed) {
    next();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

const siteRoot = path.resolve(__dirname, "..");

app.use((req, res, next) => {
  const blocked =
    req.path === "/package.json" ||
    req.path.startsWith("/server") ||
    req.path.startsWith("/node_modules") ||
    req.path.startsWith("/.env") ||
    req.path.startsWith("/.git");
  if (blocked) {
    res.status(404).end();
    return;
  }
  next();
});

app.use((req, res, next) => {
  const p = String(req.path || "");
  if (p.startsWith("/customer/") && (p.endsWith(".php") || p.endsWith(".php.html"))) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", "inline");
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(siteRoot, "index.php.html"));
});

app.get(/^\/css2(-\d+)?$/, (req, res) => {
  const filePath = path.join(siteRoot, req.path.slice(1));
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      res.status(404).end();
      return;
    }
    res.type("text/css; charset=utf-8").send(content);
  });
});

function sendFirebaseConfigJs(req, res) {
  try {
    const raw = process.env.FIREBASE_WEB_CONFIG_JSON;
    if (!raw) {
      res.status(200).type("application/javascript").send("window.__FIREBASE_CONFIG__ = null;");
      return;
    }

    res.status(200).type("application/javascript").send(`window.__FIREBASE_CONFIG__ = ${raw};`);
  } catch {
    res.status(200).type("application/javascript").send("window.__FIREBASE_CONFIG__ = null;");
  }
}

app.get("/firebase-config.js", sendFirebaseConfigJs);
app.get("/customer/firebase-config.js", sendFirebaseConfigJs);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "vanguarddoubletrust", ts: new Date().toISOString() });
});

app.post("/api/sessionLogin", async (req, res) => {
  try {
    const idToken = String(req.body?.idToken || "");
    if (!idToken) {
      res.status(400).json({ error: "Missing idToken" });
      return;
    }

    const auth = getAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const uid = String(decoded.uid);
    const email = decoded.email || null;

    const expiresIn = getSessionExpiresInMs();
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    res.cookie(getCookieName(), sessionCookie, { ...getCookieOptions(), maxAge: expiresIn });
    res.clearCookie(pinCookieName, getCookieOptions());

    try {
      await ensureUserDoc(uid, email);
      await touchLastLogin(uid);
    } catch (e) {
      process.stderr.write(`[firebase] Firestore bootstrap failed: ${e?.message || e}\n`);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    process.stderr.write(`[firebase] Session login failed: ${e?.message || e}\n`);
    res.status(401).json({
      error: "Session login failed",
      detail: process.env.NODE_ENV === "production" ? undefined : String(e?.message || e)
    });
  }
});

app.post("/api/sessionLogout", async (req, res) => {
  const cookieName = getCookieName();
  const sessionCookie = req.cookies?.[cookieName];
  res.clearCookie(cookieName, getCookieOptions());
  res.clearCookie(pinCookieName, getCookieOptions());

  try {
    if (sessionCookie) {
      const auth = getAuth();
      const decoded = await auth.verifySessionCookie(sessionCookie).catch(() => null);
      if (decoded?.sub) {
        await auth.revokeRefreshTokens(decoded.sub).catch(() => {});
      }
    }
  } catch {}

  res.status(200).json({ ok: true });
});

function generateAccountNumber() {
  const n = Math.floor(1000000000 + Math.random() * 9000000000);
  return String(n);
}

app.post("/api/auth/register", async (req, res) => {
  res.status(410).json({ error: "Deprecated. Use Firebase client auth + /api/sessionLogin." });
});

app.post("/api/auth/login", async (req, res) => {
  res.status(410).json({ error: "Deprecated. Use Firebase client auth + /api/sessionLogin." });
});

app.post("/api/auth/logout", async (req, res) => {
  res.status(410).json({ error: "Deprecated. Use /api/sessionLogout." });
});

function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function makeTxId() {
  try {
    return crypto.randomUUID();
  } catch {
    return crypto.randomBytes(16).toString("hex");
  }
}

function nowIso() {
  return new Date().toISOString();
}

async function writeTransaction({ uid, type, amount, currency, status, note, from, to, reference, createdBy }) {
  const txId = makeTxId();
  const payload = {
    uid: String(uid),
    type: String(type || "").trim(),
    amount: Number(amount),
    currency: String(currency || "USD"),
    status: String(status || "PENDING"),
    createdAt: nowIso(),
    ...(note != null ? { note: String(note) } : {}),
    ...(from != null ? { from } : {}),
    ...(to != null ? { to } : {}),
    ...(reference != null ? { reference: String(reference) } : {}),
    ...(createdBy != null ? { createdBy: String(createdBy) } : {})
  };

  const db = getFirestore();
  const batch = db.batch();
  const userTxRef = db.collection("users").doc(String(uid)).collection("transactions").doc(txId);
  const globalRef = db.collection("transactions").doc(txId);
  batch.set(userTxRef, payload);
  batch.set(globalRef, payload);
  await batch.commit();
  return { id: txId, ...payload };
}

function isStrongSecret(value) {
  const s = String(value || "");
  return s.length >= 8 && /[A-Z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);
}

function isSixDigitPin(value) {
  return /^\d{6}$/.test(String(value || "").trim());
}

function isTransferCodeValid(value) {
  const v = String(value || "").trim();
  if (!v) return false;
  return isSixDigitPin(v) || isStrongSecret(v);
}

function signPinCookie(uid, expMs) {
  const payload = `${uid}.${expMs}`;
  const sig = crypto.createHmac("sha256", pinCookieSecret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function base64UrlEncode(value) {
  return Buffer.from(String(value || ""), "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const raw = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = raw.length % 4 === 0 ? "" : "=".repeat(4 - (raw.length % 4));
  return Buffer.from(raw + pad, "base64").toString("utf8");
}

function signAdminCookie(email, expMs) {
  const payload = base64UrlEncode(JSON.stringify({ e: String(email || ""), x: Number(expMs) }));
  const sig = crypto.createHmac("sha256", adminCookieSecret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyPinCookie(token, uid) {
  const raw = String(token || "");
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [tUid, tExp, tSig] = parts;
  if (!tUid || !tExp || !tSig) return false;
  if (String(tUid) !== String(uid)) return false;
  const expMs = Number(tExp);
  if (!Number.isFinite(expMs) || expMs <= Date.now()) return false;
  const expected = crypto.createHmac("sha256", pinCookieSecret).update(`${tUid}.${tExp}`).digest("hex");
  try {
    const a = Buffer.from(String(tSig), "hex");
    const b = Buffer.from(String(expected), "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function verifyAdminCookie(token, email) {
  const raw = String(token || "");
  const parts = raw.split(".");
  if (parts.length !== 2) return false;
  const [payload, tSig] = parts;
  if (!payload || !tSig) return false;
  const expected = crypto.createHmac("sha256", adminCookieSecret).update(payload).digest("hex");
  try {
    const a = Buffer.from(String(tSig), "hex");
    const b = Buffer.from(String(expected), "hex");
    if (a.length !== b.length) return false;
    if (!crypto.timingSafeEqual(a, b)) return false;

    const decoded = JSON.parse(base64UrlDecode(payload));
    const tEmail = decoded?.e;
    const expMs = Number(decoded?.x);
    if (!tEmail || !Number.isFinite(expMs) || expMs <= Date.now()) return false;
    return String(tEmail) === String(email);
  } catch {
    return false;
  }
}

function isPinVerified(req) {
  const token = req.cookies?.[pinCookieName];
  const uid = req.user?.uid;
  if (!token || !uid) return false;
  return verifyPinCookie(token, uid);
}

function requirePinVerified(req, res, next) {
  if (isPinVerified(req)) {
    next();
    return;
  }
  res.redirect("/customer/verify-pin.php");
}

function getUserFromReqOrUser(reqOrUser) {
  if (!reqOrUser) return {};
  if (reqOrUser.user && typeof reqOrUser.user === "object") return reqOrUser.user;
  return reqOrUser;
}

function hasKycCompleted(reqOrUser) {
  const u = getUserFromReqOrUser(reqOrUser);
  const p = (u && typeof u.profile === "object" && u.profile) ? u.profile : {};
  const s = (u && typeof u.security === "object" && u.security) ? u.security : {};
  const directFlag = Boolean(
    s?.kycCompleted === true || s?.KYCDone === true || s?.kycDone === true ||
    p?.kycCompleted === true || p?.KYCDone === true || p?.kycDone === true ||
    u?.kycCompleted === true || u?.KYCDone === true || u?.kycDone === true
  );
  const first = String(p?.firstname || u?.firstname || "").trim();
  const last = String(p?.lastname || u?.lastname || "").trim();
  const country = String(p?.country || u?.country || "").trim();
  const lang = String(p?.preferredLanguage || u?.preferredLanguage || "").trim();
  const heuristic = Boolean(first && last && country && lang);
  return Boolean(directFlag || heuristic);
}

function hasProfilePic(reqOrUser) {
  const u = getUserFromReqOrUser(reqOrUser);
  const p = (u && typeof u.profile === "object" && u.profile) ? u.profile : {};
  const s = (u && typeof u.security === "object" && u.security) ? u.security : {};
  const pic = String(
    p?.profilePic || p?.photoURL || p?.photo || p?.avatar ||
    s?.profilePic || s?.photoURL || s?.photo || s?.avatar ||
    u?.profilePic || u?.photoURL || u?.photo || u?.avatar || ""
  ).trim();
  return Boolean(pic && pic !== "");
}

function onboardingIsRequired(reqOrUser) {
  const u = getUserFromReqOrUser(reqOrUser);
  const ob = u && typeof u.onboarding === "object" ? u.onboarding : null;
  if (ob && typeof ob.required === "boolean") {
    return ob.required;
  }
  return !(hasKycCompleted(u) && hasProfilePic(u));
}

function requireKycAndProfilePic(req, res, next) {
  if (!req.user) {
    next();
    return;
  }
  if (!onboardingIsRequired(req)) {
    next();
    return;
  }
  if (String(req.path || "").startsWith("/api/")) {
    res.status(403).json({
      error: "Onboarding incomplete.",
      onboarding: {
        required: true,
        kycCompleted: hasKycCompleted(req),
        profilePicUploaded: hasProfilePic(req)
      }
    });
    return;
  }
  res.redirect("/customer/dashboard.php#onboarding");
}

function adminCredentials() {
  return {
    email: String(process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
    password: String(process.env.ADMIN_PASSWORD || "")
  };
}

function isAdminConfigured() {
  const creds = adminCredentials();
  return Boolean(creds.email && creds.password);
}

function isAdminAuthenticated(req) {
  const creds = adminCredentials();
  if (!creds.email) return false;
  const token = req.cookies?.[adminCookieName];
  if (!token) return false;
  return verifyAdminCookie(token, creds.email);
}

function requireAdminAuth(req, res, next) {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: "Admin credentials are not configured on the server." });
    return;
  }
  if (!isAdminAuthenticated(req)) {
    if (String(req.path || "").startsWith("/api/")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.redirect("/admin/login.html");
    return;
  }
  req.admin = { email: adminCredentials().email };
  next();
}

function normalizeFirebaseAdminError(error, fallbackMessage) {
  // TEMPORARY – show real error
  console.error("REAL FIREBASE ERROR:", error);
  return {
    status: 500,
    error: String(error?.message || error || fallbackMessage || "Unknown error")
  };
}

async function ensureUserDoc(uid, email) {
  const db = getFirestore();
  const ref = db.collection("users").doc(String(uid));
  const snap = await ref.get().catch(() => null);
  if (snap?.exists) return;

  const nowIso = new Date().toISOString();
  await ref.set(
    {
      email: email || null,
      createdAt: nowIso,
      updatedAt: nowIso,
      profile: { preferredLanguage: "en" },
      security: { twoFactorEnabled: true },
      account: {
        accountNumber: generateAccountNumber(),
        status: "ACTIVE",
        branchCode: "RBSUS001",
        openingDate: nowIso,
        lastLogin: nowIso,
        currency: "USD",
        balance: 4365423
      },
      onboarding: { required: true }
    },
    { merge: true }
  );
}

async function touchLastLogin(uid) {
  const db = getFirestore();
  const ref = db.collection("users").doc(String(uid));
  await ref.set({ account: { lastLogin: new Date().toISOString() }, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
}

app.get("/api/me", requireAuth, async (req, res) => {
  const uid = String(req.user?.uid || "");
  let freshUser = req.user || {};
  if (uid) {
    try {
      const db = getFirestore();
      const snap = await db.collection("users").doc(uid).get();
      if (snap && snap.exists) {
        const dbData = snap.data() || {};
        const accountObj = typeof dbData.account === "object" && dbData.account ? dbData.account : {};
        const profileObj = typeof dbData.profile === "object" && dbData.profile ? dbData.profile : {};
        const securityObj = typeof dbData.security === "object" && dbData.security ? dbData.security : {};
        freshUser = Object.assign({}, req.user || {}, {
          uid: uid,
          email: (req.user && req.user.email) || (profileObj && profileObj.email) || dbData.email || null,
          account: accountObj,
          profile: profileObj,
          security: securityObj,
          country: profileObj.country || dbData.country || null,
          preferredLanguage: profileObj.preferredLanguage || dbData.preferredLanguage || "en",
          firstname: profileObj.firstname || dbData.firstname || "",
          lastname: profileObj.lastname || dbData.lastname || "",
          profilePic: profileObj.profilePic || profileObj.photoURL || dbData.profilePic || dbData.photoURL || "",
          createdAt: dbData.createdAt || (req.user && req.user.createdAt) || null,
          updatedAt: dbData.updatedAt || (req.user && req.user.updatedAt) || null
        });
        req.user = freshUser;
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[VT] /api/me firestore refresh failed:", e && e.message ? String(e.message) : e);
      }
    }
  }

  const sec = freshUser?.security || {};
  const prof = freshUser?.profile || {};
  const ob = freshUser?.onboarding || {};
  const kycCompleted = hasKycCompleted(freshUser);
  const picDone = hasProfilePic(freshUser);

  const finalLang = String(prof?.preferredLanguage || prof?.language || sec?.preferredLanguage || freshUser?.preferredLanguage || "en");
  const finalPicUrl = String(
    prof?.profilePic || prof?.photoURL || prof?.photo || prof?.avatar ||
    sec?.profilePic || sec?.photoURL || sec?.photo || sec?.avatar ||
    freshUser?.profilePic || freshUser?.photoURL || ""
  );

  const finalProfile = Object.assign({}, prof || {}, {
    firstname: prof?.firstname || freshUser?.firstname || "",
    lastname: prof?.lastname || freshUser?.lastname || "",
    country: prof?.country || freshUser?.country || "",
    preferredLanguage: finalLang,
    phone: prof?.phone || freshUser?.phone || "",
    dateOfBirth: prof?.dateOfBirth || prof?.dob || freshUser?.dateOfBirth || "",
    gender: prof?.gender || freshUser?.gender || "",
    address: prof?.address || freshUser?.address || "",
    city: prof?.city || freshUser?.city || "",
    state: prof?.state || freshUser?.state || "",
    zipCode: prof?.zipCode || prof?.zip || prof?.postal || freshUser?.zipCode || "",
    nationality: prof?.nationality || freshUser?.nationality || "",
    occupation: prof?.occupation || freshUser?.occupation || "",
    profilePic: finalPicUrl,
    photoURL: finalPicUrl,
    photo: finalPicUrl,
    avatar: finalPicUrl,
    profilePicPublicId: prof?.profilePicPublicId || sec?.profilePicPublicId || null,
    kycCompleted: kycCompleted,
    kycDone: kycCompleted,
    KYCDone: kycCompleted,
    kycCompletedAt: prof?.kycCompletedAt || prof?.KYCDoneAt || prof?.kycDoneAt || sec?.kycCompletedAt || null
  });

  const finalSecurity = Object.assign({}, sec || {}, {
    twoFactorEnabled: Boolean(sec?.twoFactorEnabled !== false),
    kycCompleted: kycCompleted,
    kycDone: kycCompleted,
    KYCDone: kycCompleted,
    kycCompletedAt: sec?.kycCompletedAt || prof?.kycCompletedAt || null,
    profilePic: finalPicUrl,
    photoURL: finalPicUrl,
    photo: finalPicUrl,
    avatar: finalPicUrl,
    accountPinHashSet: Boolean(sec?.accountPinHash)
  });

  const persistedOnboardingRequired = (typeof ob?.required === "boolean") ? ob.required : null;
  const onboardingRequired = (persistedOnboardingRequired != null)
    ? persistedOnboardingRequired
    : !(kycCompleted && picDone);

  const onboardingInfo = {
    required: onboardingRequired,
    kycCompleted: kycCompleted,
    profilePicUploaded: picDone
  };

  res.json({
    uid: freshUser.uid,
    email: freshUser.email || null,
    profile: finalProfile,
    account: freshUser.account || null,
    security: finalSecurity,
    preferredLanguage: finalLang,
    profilePic: finalPicUrl,
    photoURL: finalPicUrl,
    photo: finalPicUrl,
    avatar: finalPicUrl,
    createdAt: freshUser.createdAt || null,
    updatedAt: freshUser.updatedAt || null,
    pinVerified: isPinVerified(req),
    onboarding: onboardingInfo
  });
});

app.get("/api/upload/config", (req, res) => {
  res.json({
    ok: true,
    provider: "cloudinary",
    cloudName: CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: CLOUDINARY_UPLOAD_PRESET || "",
    folder: CLOUDINARY_PROFILE_FOLDER || "",
    enabled: Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET),
    maxBytes: 8 * 1024 * 1024,
    allowedFormats: ["jpg", "jpeg", "png", "webp", "gif", "avif"]
  });
});

function isSafeCloudinaryUrl(secureUrl) {
  if (typeof secureUrl !== "string" || !secureUrl) return false;
  const trimmed = secureUrl.trim();
  if (!trimmed) return false;
  if (trimmed.length > 2000000) return false;
  if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch (e) {
      return false;
    }
  }
  return false;
}

app.post("/api/customer/profile-pic", requireAuth, async (req, res) => {
  const b = req.body || {};
  const secureUrl = typeof b?.secure_url === "string" ? String(b.secure_url).trim() : "";
  const publicId = cleanString(b?.public_id || b?.publicId, 260);
  const width = Number.isFinite(Number(b?.width)) ? Math.max(0, Math.min(20000, Number(b.width))) : 0;
  const height = Number.isFinite(Number(b?.height)) ? Math.max(0, Math.min(20000, Number(b.height))) : 0;
  const format = cleanString(b?.format, 16);
  const bytes = Number.isFinite(Number(b?.bytes)) ? Math.max(0, Math.min(128 * 1024 * 1024, Number(b.bytes))) : 0;

  if (!secureUrl || !isSafeCloudinaryUrl(secureUrl)) {
    res.status(400).json({ error: "Invalid profile picture URL." });
    return;
  }

  const uid = req.user.uid;
  await ensureUserDoc(uid, req.user.email);
  const nowIso = new Date().toISOString();

  const existingSnap = await (async () => {
    try {
      const db = getFirestore();
      const s = await db.collection("users").doc(String(uid)).get().catch(() => null);
      if (s && s.exists) return s.data() || {};
    } catch (_) {}
    return {};
  })();
  const existingProfForCheck = existingSnap.profile || req.user?.profile || {};
  const existingSecForCheck = existingSnap.security || req.user?.security || {};
  const picDoneForCheck = Boolean(secureUrl) || hasProfilePic({ profile: existingProfForCheck, security: existingSecForCheck, ...existingSnap });
  const kycDoneForCheck = hasKycCompleted({ profile: existingProfForCheck, security: existingSecForCheck, ...existingSnap });
  const onboardingRequiredForSave = !(kycDoneForCheck && picDoneForCheck);

  const updates = {
    updatedAt: nowIso,
    profile: {
      profilePic: secureUrl,
      photoURL: secureUrl,
      photo: secureUrl,
      avatar: secureUrl,
      ...(publicId ? { profilePicPublicId: publicId, photoURLPublicId: publicId, photoPublicId: publicId, avatarPublicId: publicId } : {}),
      ...(width ? { profilePicWidth: width } : {}),
      ...(height ? { profilePicHeight: height } : {}),
      ...(format ? { profilePicFormat: format } : {}),
      ...(bytes ? { profilePicBytes: bytes } : {})
    },
    security: {
      profilePic: secureUrl,
      photoURL: secureUrl,
      photo: secureUrl,
      avatar: secureUrl,
      ...(publicId ? { profilePicPublicId: publicId } : {})
    },
    profilePic: secureUrl,
    photoURL: secureUrl,
    photo: secureUrl,
    avatar: secureUrl,
    onboarding: { required: onboardingRequiredForSave }
  };

  try {
    const db = getFirestore();
    await db.collection("users").doc(String(uid)).set(updates, { merge: true });
    const refreshedSnap = await db.collection("users").doc(String(uid)).get().catch(() => null);
    const dbData = refreshedSnap && refreshedSnap.exists ? (refreshedSnap.data() || {}) : null;
    const dbProf = (dbData && dbData.profile) || (req.user?.profile) || {};
    const dbSec = (dbData && dbData.security) || (req.user?.security) || {};
    const fullUser = { uid, profile: dbProf, security: dbSec, ...dbData };
    const kycDone = hasKycCompleted(fullUser);
    const picDone = hasProfilePic(fullUser);
    const finalOnboardingRequired = (dbData?.onboarding && typeof dbData.onboarding.required === "boolean")
      ? dbData.onboarding.required
      : !(kycDone && picDone);

    res.status(200).json({
      ok: true,
      profilePic: secureUrl,
      photoURL: secureUrl,
      photo: secureUrl,
      avatar: secureUrl,
      profilePicPublicId: publicId || null,
      photoURLPublicId: publicId || null,
      photoPublicId: publicId || null,
      avatarPublicId: publicId || null,
      kycCompleted: kycDone,
      kycDone: kycDone,
      KYCDone: kycDone,
      onboarding: {
        required: finalOnboardingRequired,
        kycCompleted: kycDone,
        profilePicUploaded: picDone
      },
      profile: Object.assign({}, dbProf || {}, {
        profilePic: secureUrl,
        photoURL: secureUrl,
        photo: secureUrl,
        avatar: secureUrl,
        profilePicPublicId: publicId || dbProf.profilePicPublicId || null,
        kycCompleted: kycDone,
        kycDone: kycDone,
        KYCDone: kycDone
      }),
      security: Object.assign({}, dbSec || {}, {
        profilePic: secureUrl,
        photoURL: secureUrl,
        photo: secureUrl,
        avatar: secureUrl,
        profilePicPublicId: publicId || dbSec.profilePicPublicId || null,
        kycCompleted: kycDone,
        kycDone: kycDone,
        KYCDone: kycDone
      })
    });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to save profile picture.");
    res.status(normalized.status).json({ error: normalized.error });
    return;
  }
});

function cleanString(v, maxLen) {
  if (typeof v !== "string") return "";
  const s = v.trim();
  if (!s) return "";
  if (maxLen && s.length > maxLen) return s.slice(0, maxLen);
  return s;
}

function buildAllowedLanguageSet() {
  return new Set([
    "aa","ab","af","ak","am","an","ar","as","av","ay","az","ba","be","bg","bh","bi","bm","bn","bo","br","bs","ca","ce","ch","co","cr","cs","cu","cv","cy","da","de","dv","dz","ee","el","en","eo","es","et","eu","fa","ff","fi","fj","fo","fr","fy","ga","gd","gl","gn","gu","gv","ha","he","hi","ho","hr","ht","hu","hy","hz","ia","id","ie","ig","ii","ik","io","is","it","iu","ja","jv","ka","kg","ki","kj","kk","kl","km","kn","ko","kr","ks","ku","kv","kw","ky","la","lb","lg","li","ln","lo","lt","lu","lv","mg","mh","mi","mk","ml","mn","mr","ms","mt","my","na","nb","nd","ne","ng","nl","nn","no","nr","nv","ny","oc","oj","om","or","os","pa","pi","pl","ps","pt","qu","rm","rn","ro","ru","rw","sa","sc","sd","se","sg","sh","si","sk","sl","sm","sn","so","sq","sr","ss","st","su","sv","sw","ta","te","tg","th","ti","tk","tl","tn","to","tr","ts","tt","tw","ty","ug","uk","ur","uz","ve","vi","vo","wa","wo","xh","yi","yo","za","zh","zu",
    "en-US","en-GB","en-CA","en-AU","en-NZ","en-IN","en-ZA","en-NG","en-PH","es-ES","es-MX","es-AR","es-CL","es-CO","es-PE","pt-BR","pt-PT","fr-FR","fr-CA","fr-BE","fr-CH","de-DE","de-AT","de-CH","it-IT","it-CH","nl-NL","nl-BE","sv-SE","nb-NO","da-DK","fi-FI","pl-PL","ru-RU","uk-UA","zh-CN","zh-TW","zh-HK","ja-JP","ko-KR","ar-SA","ar-AE","ar-EG","ar-MA","hi-IN","bn-BD","bn-IN","ur-PK","ur-IN","ta-IN","ta-LK","te-IN","ml-IN","mr-IN","gu-IN","pa-IN","th-TH","vi-VN","id-ID","ms-MY","ms-SG","tr-TR","he-IL","fa-IR","ps-AF","ku-IQ","ha-NG","yo-NG","ig-NG","sw-KE","sw-TZ","am-ET","so-SO","tl-PH","hu-HU","cs-CZ","sk-SK","ro-RO","bg-BG","sr-RS","hr-HR","sl-SI","el-GR","lt-LT","lv-LV","et-EE","az-AZ","kk-KZ","uz-UZ","ky-KG","tg-TJ","ka-GE","hy-AM","be-BY","mk-MK","sq-AL","af-ZA","zu-ZA","xh-ZA","st-ZA","tn-ZA","ss-ZA","ve-ZA","nr-ZA"
  ]);
}

app.post("/api/customer/kyc", requireAuth, async (req, res) => {
  const b = req.body || {};
  const phone = cleanString(b.phone, 40);
  const country = cleanString(b.country, 80);
  const preferredLanguage = cleanString(b.preferredLanguage, 16) || "en";
  const dateOfBirth = cleanString(b.dateOfBirth || b.dob, 32);
  const gender = cleanString(b.gender, 32);
  const address = cleanString(b.address, 240);
  const city = cleanString(b.city, 100);
  const state = cleanString(b.state, 100);
  const zipCode = cleanString(b.zipCode || b.zip || b.postal, 32);
  const nationality = cleanString(b.nationality, 100);
  const occupation = cleanString(b.occupation, 120);

  if (!country) {
    res.status(400).json({ error: "Country is required." });
    return;
  }

  const allowedLangs = buildAllowedLanguageSet();
  const langCode = allowedLangs.has(preferredLanguage)
    ? preferredLanguage
    : allowedLangs.has(preferredLanguage.split("-")[0])
      ? preferredLanguage.split("-")[0]
      : "en";

  const uid = req.user.uid;
  await ensureUserDoc(uid, req.user.email);
  const nowIso = new Date().toISOString();

  const existingSnapshot = await (async () => {
    try {
      const db = getFirestore();
      const existingSnap = await db.collection("users").doc(String(uid)).get().catch(() => null);
      if (existingSnap && existingSnap.exists) return existingSnap.data() || {};
    } catch (_) {}
    return {};
  })();
  const existingProfile = typeof existingSnapshot?.profile === "object" && existingSnapshot.profile ? existingSnapshot.profile : {};
  const existingSecurity = typeof existingSnapshot?.security === "object" && existingSnapshot.security ? existingSnapshot.security : {};

  const finalFirstName = cleanString(b.firstname || b.firstName || existingProfile.firstname || existingProfile.firstName, 80) || cleanString(existingProfile.firstname, 80);
  const finalLastName = cleanString(b.lastname || b.lastName || existingProfile.lastname || existingProfile.lastName, 80) || cleanString(existingProfile.lastname, 80);
  const finalPhone = phone || existingProfile.phone || "";
  const finalDob = dateOfBirth || existingProfile.dateOfBirth || existingProfile.dob || "";
  const finalGender = gender || existingProfile.gender || "";
  const finalAddress = address || existingProfile.address || "";
  const finalCity = city || existingProfile.city || "";
  const finalState = state || existingProfile.state || "";
  const finalZip = zipCode || existingProfile.zipCode || existingProfile.zip || "";
  const finalNationality = nationality || existingProfile.nationality || "";
  const finalOccupation = occupation || existingProfile.occupation || "";

  const userProfileUpdate = Object.assign({}, existingProfile, {
    firstname: finalFirstName,
    lastname: finalLastName,
    country: country,
    preferredLanguage: langCode,
    phone: finalPhone,
    dateOfBirth: finalDob,
    gender: finalGender,
    address: finalAddress,
    city: finalCity,
    state: finalState,
    zipCode: finalZip,
    nationality: finalNationality,
    occupation: finalOccupation,
    kycCompleted: true,
    kycDone: true,
    KYCDone: true,
    kycCompletedAt: nowIso,
    kycDoneAt: nowIso,
    KYCDoneAt: nowIso
  });

  const userSecurityUpdate = Object.assign({}, existingSecurity, {
    kycCompleted: true,
    kycDone: true,
    KYCDone: true,
    kycCompletedAt: nowIso,
    kycDoneAt: nowIso,
    KYCDoneAt: nowIso
  });

  const onboardingRequired = !(hasKycCompleted({ profile: userProfileUpdate, security: userSecurityUpdate, ...existingSnapshot }) && hasProfilePic({ profile: userProfileUpdate, security: userSecurityUpdate, ...existingSnapshot }));

  const updates = {
    updatedAt: nowIso,
    profile: userProfileUpdate,
    security: userSecurityUpdate,
    country: country,
    preferredLanguage: langCode,
    firstname: finalFirstName,
    lastname: finalLastName,
    kycCompleted: true,
    onboarding: { required: onboardingRequired }
  };

  let dbSnapshot = null;
  try {
    const db = getFirestore();
    await db.collection("users").doc(String(uid)).set(updates, { merge: true });
    const refreshedSnap = await db.collection("users").doc(String(uid)).get().catch(() => null);
    dbSnapshot = refreshedSnap && refreshedSnap.exists ? (refreshedSnap.data() || {}) : null;
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to save KYC profile.");
    res.status(normalized.status).json({ error: normalized.error });
    return;
  }

  const profSnapshot = ((dbSnapshot && dbSnapshot.profile) || userProfileUpdate) ;
  const secSnapshot = ((dbSnapshot && dbSnapshot.security) || userSecurityUpdate) ;
  const fullRefreshedUser = { uid, profile: profSnapshot, security: secSnapshot, ...dbSnapshot };

  const picUrl = String(
    profSnapshot.profilePic || profSnapshot.photoURL || profSnapshot.photo || profSnapshot.avatar ||
    secSnapshot.profilePic || secSnapshot.photoURL || secSnapshot.photo || secSnapshot.avatar ||
    existingProfile.profilePic || existingProfile.photoURL || ""
  );
  const kycDoneFinal = hasKycCompleted(fullRefreshedUser);
  const picDoneFinal = hasProfilePic(fullRefreshedUser);
  const finalOnboardingRequired = (dbSnapshot?.onboarding && typeof dbSnapshot.onboarding.required === "boolean")
    ? dbSnapshot.onboarding.required
    : !(kycDoneFinal && picDoneFinal);

  res.status(200).json({
    ok: true,
    preferredLanguage: langCode,
    profilePic: picUrl,
    onboarding: {
      required: finalOnboardingRequired,
      kycCompleted: kycDoneFinal,
      profilePicUploaded: picDoneFinal
    },
    profile: Object.assign({}, profSnapshot, {
      firstname: finalFirstName,
      lastname: finalLastName,
      country: country,
      preferredLanguage: langCode,
      dateOfBirth: finalDob,
      gender: finalGender,
      address: finalAddress,
      city: finalCity,
      state: finalState,
      zipCode: finalZip,
      nationality: finalNationality,
      occupation: finalOccupation,
      phone: finalPhone,
      profilePic: picUrl,
      photoURL: picUrl,
      photo: picUrl,
      avatar: picUrl,
      profilePicPublicId: profSnapshot.profilePicPublicId || null,
      kycCompleted: true,
      kycDone: true,
      KYCDone: true,
      kycCompletedAt: nowIso,
      kycDoneAt: nowIso,
      KYCDoneAt: nowIso
    }),
    security: Object.assign({}, secSnapshot, {
      kycCompleted: true,
      kycDone: true,
      KYCDone: true,
      kycCompletedAt: nowIso,
      kycDoneAt: nowIso,
      KYCDoneAt: nowIso,
      twoFactorEnabled: Boolean(secSnapshot.twoFactorEnabled || false)
    })
  });
});

app.post("/api/pin/verify", requireAuth, async (req, res) => {
  const pin = String(req.body?.accountPin || "").trim();
  if (!isSixDigitPin(pin)) {
    res.status(400).json({ error: "Account PIN must be exactly 6 digits." });
    return;
  }

  const uid = req.user.uid;
  const db = getFirestore();
  const snap = await db.collection("users").doc(String(uid)).get().catch(() => null);
  const data = snap?.exists ? snap.data() : null;
  const storedHash = data?.security?.accountPinHash || null;
  if (!storedHash) {
    res.status(400).json({ error: "Account PIN is not set for this account." });
    return;
  }

  const hash = sha256Hex(pin);
  if (String(hash) !== String(storedHash)) {
    res.status(401).json({ error: "Invalid Account PIN." });
    return;
  }

  const expMs = Date.now() + getSessionExpiresInMs();
  res.cookie(pinCookieName, signPinCookie(uid, expMs), getCookieOptions());
  res.status(200).json({ ok: true });
});

app.put("/api/profile", requireAuth, async (req, res) => {
  const {
    firstname,
    lastname,
    phone,
    country,
    state,
    city,
    dob,
    dateOfBirth,
    gender,
    acctype,
    brname,
    accountPin,
    transferPin,
    preferredLanguage,
    address,
    zipCode,
    zip,
    postal,
    nationality,
    occupation,
    profilePic,
    profile_pic,
    photoUrl,
    photoURL,
    avatar
  } = req.body || {};

  const uid = req.user.uid;
  await ensureUserDoc(uid, req.user.email);

  const db = getFirestore();
  const existingSnapshot = await (async () => {
    try {
      const snap = await db.collection("users").doc(String(uid)).get().catch(() => null);
      if (snap && snap.exists) return snap.data() || {};
    } catch (_) {}
    return {};
  })();

  const prof = typeof existingSnapshot?.profile === "object" && existingSnapshot.profile ? existingSnapshot.profile : ((req.user?.profile) || {});
  const sec = typeof existingSnapshot?.security === "object" && existingSnapshot.security ? existingSnapshot.security : ((req.user?.security) || {});

  const newProfile = Object.assign({}, prof);
  const newSecurity = Object.assign({}, sec);

  if (typeof firstname === "string") newProfile.firstname = firstname.trim();
  if (typeof lastname === "string") newProfile.lastname = lastname.trim();
  if (typeof phone === "string") newProfile.phone = phone.trim();
  if (typeof country === "string") newProfile.country = country.trim();
  if (typeof state === "string") newProfile.state = state.trim();
  if (typeof city === "string") newProfile.city = city.trim();
  if (typeof dob === "string" && dob.trim()) newProfile.dateOfBirth = dob.trim();
  if (typeof dateOfBirth === "string" && dateOfBirth.trim()) newProfile.dateOfBirth = dateOfBirth.trim();
  if (typeof gender === "string") newProfile.gender = gender.trim();
  if (typeof acctype === "string") newProfile.acctype = acctype.trim();
  if (typeof brname === "string") newProfile.brname = brname.trim();
  if (typeof address === "string") newProfile.address = address.trim();
  if (typeof zipCode === "string" && zipCode.trim()) newProfile.zipCode = zipCode.trim();
  else if (typeof zip === "string" && zip.trim()) newProfile.zipCode = zip.trim();
  else if (typeof postal === "string" && postal.trim()) newProfile.zipCode = postal.trim();
  if (typeof nationality === "string" && nationality.trim()) newProfile.nationality = nationality.trim();
  if (typeof occupation === "string" && occupation.trim()) newProfile.occupation = occupation.trim();

  const rawPic =
    (typeof profilePic === "string" ? profilePic : "") ||
    (typeof profile_pic === "string" ? profile_pic : "") ||
    (typeof photoUrl === "string" ? photoUrl : "") ||
    (typeof photoURL === "string" ? photoURL : "") ||
    (typeof avatar === "string" ? avatar : "");
  if (rawPic !== "" ||
      typeof profilePic !== "undefined" ||
      typeof profile_pic !== "undefined" ||
      typeof photoUrl !== "undefined" ||
      typeof photoURL !== "undefined" ||
      typeof avatar !== "undefined") {
    const safe = rawPic.trim();
    if (safe === "") {
      newProfile.profilePic = "";
      newProfile.photoURL = "";
      newProfile.photo = "";
      newProfile.avatar = "";
      newSecurity.profilePic = "";
      newSecurity.photoURL = "";
      newSecurity.photo = "";
      newSecurity.avatar = "";
    } else if (isSafeCloudinaryUrl(safe)) {
      newProfile.profilePic = safe;
      newProfile.photoURL = safe;
      newProfile.photo = safe;
      newProfile.avatar = safe;
      newSecurity.profilePic = safe;
      newSecurity.photoURL = safe;
      newSecurity.photo = safe;
      newSecurity.avatar = safe;
    } else {
      res.status(400).json({ error: "Invalid profile picture URL. Please upload via Cloudinary first." });
      return;
    }
  }

  if (typeof preferredLanguage === "string" && preferredLanguage.trim()) {
    const allowedLangs = buildAllowedLanguageSet();
    let langCode = preferredLanguage.trim();
    if (!allowedLangs.has(langCode)) {
      const base = langCode.split("-")[0];
      langCode = allowedLangs.has(base) ? base : (prof?.preferredLanguage || "en");
    }
    newProfile.preferredLanguage = langCode;
  }

  if (typeof accountPin === "string" && accountPin.trim()) {
    const v = accountPin.trim();
    if (!isSixDigitPin(v)) {
      res.status(400).json({ error: "accountPin must be exactly 6 digits." });
      return;
    }
    newSecurity.accountPinHash = sha256Hex(v);
  }

  if (typeof transferPin === "string" && transferPin.trim()) {
    const v = transferPin.trim();
    if (!isTransferCodeValid(v)) {
      res.status(400).json({ error: "transferPin must be 6 digits or 8+ chars with uppercase, number, and special character." });
      return;
    }
    newSecurity.transferPinHash = sha256Hex(v);
  }

  const nowIso = new Date().toISOString();
  if (newProfile.country && newProfile.preferredLanguage && newProfile.firstname && newProfile.lastname) {
    newSecurity.kycCompleted = true;
    newSecurity.KYCDone = true;
    newSecurity.kycDone = true;
    newProfile.kycCompleted = true;
    newProfile.KYCDone = true;
    newProfile.kycDone = true;
  }

  const kycForOnboarding = hasKycCompleted({ profile: newProfile, security: newSecurity, ...existingSnapshot });
  const picForOnboarding = hasProfilePic({ profile: newProfile, security: newSecurity, ...existingSnapshot });
  const obRequiredForSave = !(kycForOnboarding && picForOnboarding);

  const updates = {
    updatedAt: nowIso,
    profile: newProfile,
    security: newSecurity,
    country: newProfile.country || "",
    preferredLanguage: newProfile.preferredLanguage || "en",
    firstname: newProfile.firstname || "",
    lastname: newProfile.lastname || "",
    profilePic: newProfile.profilePic || "",
    photoURL: newProfile.photoURL || "",
    kycCompleted: Boolean(newSecurity.kycCompleted || newProfile.kycCompleted),
    onboarding: { required: obRequiredForSave }
  };

  let refreshedSnap = null;
  try {
    await db.collection("users").doc(String(uid)).set(updates, { merge: true });
    const r = await db.collection("users").doc(String(uid)).get().catch(() => null);
    refreshedSnap = r && r.exists ? (r.data() || {}) : null;
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to save profile.");
    res.status(normalized.status).json({ error: normalized.error });
    return;
  }

  const fsProf = (refreshedSnap && refreshedSnap.profile) || newProfile || {};
  const fsSec = (refreshedSnap && refreshedSnap.security) || newSecurity || {};
  const fsOb = (refreshedSnap && refreshedSnap.onboarding) || {};
  const fullRefUser = { uid, profile: fsProf, security: fsSec, ...refreshedSnap };
  const picUrl = String(
    fsProf.profilePic || fsProf.photoURL || fsProf.photo || fsProf.avatar ||
    fsSec.profilePic || fsSec.photoURL || fsSec.photo || fsSec.avatar || ""
  );
  const kycCompleted = hasKycCompleted(fullRefUser);
  const picCompleted = hasProfilePic(fullRefUser);
  const persistedOb = typeof fsOb.required === "boolean" ? fsOb.required : null;
  const obRequiredFinal = (persistedOb != null) ? persistedOb : !(kycCompleted && picCompleted);

  res.json({
    ok: true,
    profilePic: picUrl,
    photoURL: picUrl,
    photo: picUrl,
    avatar: picUrl,
    kycCompleted,
    kycDone: kycCompleted,
    KYCDone: kycCompleted,
    onboarding: {
      required: obRequiredFinal,
      kycCompleted: kycCompleted,
      profilePicUploaded: picCompleted
    },
    profile: Object.assign({}, fsProf || {}, {
      kycCompleted,
      kycDone: kycCompleted,
      KYCDone: kycCompleted,
      profilePic: picUrl,
      photoURL: picUrl,
      photo: picUrl,
      avatar: picUrl
    }),
    security: Object.assign({}, fsSec || {}, {
      kycCompleted,
      kycDone: kycCompleted,
      KYCDone: kycCompleted,
      profilePic: picUrl,
      photoURL: picUrl,
      photo: picUrl,
      avatar: picUrl
    })
  });
});

app.get("/api/customer/transactions", requireAuth, requireKycAndProfilePic, async (req, res) => {
  try {
    const uid = req.user.uid;
    const rawLimit = Number(req.query?.limit || 20);
    const limit = Number.isFinite(rawLimit) ? Math.min(200, Math.max(1, rawLimit)) : 20;
    const db = getFirestore();
    const snap = await db.collection("users").doc(String(uid)).collection("transactions")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get()
      .catch(() => null);
    const transactions = (snap && snap.docs ? snap.docs : []).map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));
    let runningBalance = null;
    try {
      const userSnap = await db.collection("users").doc(String(uid)).get().catch(() => null);
      if (userSnap && userSnap.exists) {
        const userData = userSnap.data() || {};
        runningBalance = Number(userData?.account?.balance || 0);
      }
    } catch (_) {}
    res.json({ ok: true, transactions, balance: runningBalance });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to load transactions.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

app.get("/api/customer/lookup-account", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const accountNumber = String(req.query?.accountNumber || "").trim();
    const email = String(req.query?.email || "").trim().toLowerCase();
    if (!accountNumber && !email) {
      res.status(400).json({ error: "accountNumber or email query parameter is required." });
      return;
    }
    const db = getFirestore();
    let targetDoc = null;
    if (accountNumber) {
      const byAccount = await db.collection("users").where("account.accountNumber", "==", accountNumber).limit(1).get().catch(() => null);
      if (byAccount && byAccount.docs && byAccount.docs.length) targetDoc = byAccount.docs[0];
    }
    if (!targetDoc && email) {
      const byEmail = await db.collection("users").doc(email).get().catch(() => null);
      if (byEmail && byEmail.exists) targetDoc = byEmail;
    }
    if (!targetDoc || !targetDoc.exists) {
      res.status(404).json({ error: "Recipient account not found." });
      return;
    }
    const td = targetDoc.data() || {};
    if (String(targetDoc.id) === String(uid)) {
      res.status(400).json({ error: "You cannot transfer to your own account." });
      return;
    }
    const p = td.profile || {};
    const a = td.account || {};
    const fullName = `${String(p.firstname || "").trim()} ${String(p.lastname || "").trim()}`.trim() || String(td.email || "").trim();
    res.json({
      ok: true,
      recipient: {
        uid: targetDoc.id,
        email: td.email || "",
        fullName,
        accountNumber: a.accountNumber || "",
        currency: a.currency || "USD",
        status: a.status || ""
      }
    });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to look up account.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

app.post("/api/customer/transfer", requireAuth, requireKycAndProfilePic, async (req, res) => {
  const b = req.body || {};
  const uid = req.user.uid;
  const toAccountNumber = String(b.toAccountNumber || b.to || "").trim();
  const toEmail = String(b.toEmail || "").trim().toLowerCase();
  const amountRaw = b.amount;
  const amount = Number(amountRaw);
  const currency = String(b.currency || "USD").trim().toUpperCase() || "USD";
  const memo = String(b.memo || b.note || b.reference || "").trim();
  const transferCode = String(b.transferCode || b.transferPin || "").trim();

  if (!toAccountNumber && !toEmail) {
    res.status(400).json({ error: "Recipient accountNumber or email is required." });
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ error: "Amount must be a positive number." });
    return;
  }
  if (!isTransferCodeValid(transferCode)) {
    res.status(400).json({ error: "Transfer code is required and must be 6 digits or 8+ chars with uppercase, number, and special character." });
    return;
  }
  const db = getFirestore();
  const senderSnap = await db.collection("users").doc(String(uid)).get();
  if (!senderSnap.exists) {
    res.status(404).json({ error: "Your account was not found." });
    return;
  }
  const senderDoc = senderSnap.data() || {};
  const senderStoredHash = senderDoc?.security?.transferPinHash || senderDoc?.security?.transferCodeHash || null;
  if (!senderStoredHash) {
    res.status(400).json({ error: "Transfer code is not configured for your account. Please contact support." });
    return;
  }
  if (String(sha256Hex(transferCode)) !== String(senderStoredHash)) {
    res.status(401).json({ error: "Invalid transfer code." });
    return;
  }
  const senderAccount = senderDoc?.account || {};
  const senderStatus = String(senderAccount?.status || "").toUpperCase();
  if (senderStatus && senderStatus !== "ACTIVE") {
    res.status(400).json({ error: `Your account status is ${senderStatus}. Transfers are not available.` });
    return;
  }
  const senderKycDone = !!(senderDoc?.security?.kycCompleted === true);
  const senderHasPic = !!(
    senderDoc?.profile?.profilePic ||
    senderDoc?.profile?.photoURL ||
    senderDoc?.profile?.photo ||
    senderDoc?.profile?.avatar ||
    senderDoc?.security?.profilePic
  );
  if (!senderKycDone || !senderHasPic) {
    res.status(403).json({ error: "KYC and profile picture must be completed before performing transfers. Please complete your profile first." });
    return;
  }
  const currentBalance = Number(senderAccount?.balance || 0);
  if (currentBalance < amount) {
    res.status(400).json({ error: `Insufficient balance. Available: ${senderAccount?.currency || "USD"} ${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.` });
    return;
  }
  let recipientRef = null;
  if (toAccountNumber) {
    const byAccount = await db.collection("users").where("account.accountNumber", "==", toAccountNumber).limit(1).get().catch(() => null);
    if (byAccount && byAccount.docs && byAccount.docs.length) recipientRef = byAccount.docs[0];
  }
  if (!recipientRef && toEmail) {
    const byEmail = await db.collection("users").where("email", "==", toEmail).limit(1).get().catch(() => null);
    if (byEmail && byEmail.docs && byEmail.docs.length) recipientRef = byEmail.docs[0];
  }
  if (!recipientRef || !recipientRef.exists) {
    res.status(404).json({ error: "Recipient account not found." });
    return;
  }
  const recipientUid = recipientRef.id;
  if (recipientUid === String(uid)) {
    res.status(400).json({ error: "You cannot transfer to your own account." });
    return;
  }
  const recipientDoc = recipientRef.data() || {};
  const recipientAccount = recipientDoc?.account || {};
  const recipientStatus = String(recipientAccount?.status || "").toUpperCase();
  if (recipientStatus && recipientStatus !== "ACTIVE") {
    res.status(400).json({ error: "Recipient account is not active." });
    return;
  }
  const recipientCurrency = String(recipientAccount?.currency || senderAccount?.currency || "USD").toUpperCase() || "USD";
  if (recipientCurrency !== currency) {
    res.status(400).json({ error: `Recipient uses a different currency (${recipientCurrency}). Please use Bank Transfer for cross-currency payments.` });
    return;
  }
  const reference = `TX-${makeTxId()}`;
  const nowIsoStamp = nowIso();
  const senderName = `${String(senderDoc?.profile?.firstname || "").trim()} ${String(senderDoc?.profile?.lastname || "").trim()}`.trim() || String(senderDoc?.email || "");
  const recipientName = `${String(recipientDoc?.profile?.firstname || "").trim()} ${String(recipientDoc?.profile?.lastname || "").trim()}`.trim() || String(recipientDoc?.email || "");
  const senderAccountNumber = senderAccount?.accountNumber || "";
  const recipientAccountNumber = recipientAccount?.accountNumber || "";
  const batch = db.batch();
  const senderRef = db.collection("users").doc(String(uid));
  const recRef = db.collection("users").doc(String(recipientUid));
  batch.set(senderRef, {
    updatedAt: nowIsoStamp,
    account: { balance: Number((currentBalance - amount).toFixed(2)) }
  }, { merge: true });
  const recBalance = Number(recipientAccount?.balance || 0);
  batch.set(recRef, {
    updatedAt: nowIsoStamp,
    account: { balance: Number((recBalance + amount).toFixed(2)) }
  }, { merge: true });
  await batch.commit();
  const debitTx = await writeTransaction({
    uid: String(uid),
    type: "TRANSFER_OUT",
    amount: Number(Number(amount).toFixed(2)),
    currency,
    status: "COMPLETED",
    note: memo || `Transfer to ${recipientName || recipientAccountNumber}`,
    from: { uid: String(uid), accountNumber: senderAccountNumber, name: senderName, email: senderDoc?.email || "" },
    to: { uid: recipientUid, accountNumber: recipientAccountNumber, name: recipientName, email: recipientDoc?.email || "" },
    reference
  }).catch(() => null);
  const creditTx = await writeTransaction({
    uid: recipientUid,
    type: "TRANSFER_IN",
    amount: Number(Number(amount).toFixed(2)),
    currency,
    status: "COMPLETED",
    note: memo || `Transfer from ${senderName || senderAccountNumber}`,
    from: { uid: String(uid), accountNumber: senderAccountNumber, name: senderName, email: senderDoc?.email || "" },
    to: { uid: recipientUid, accountNumber: recipientAccountNumber, name: recipientName, email: recipientDoc?.email || "" },
    reference
  }).catch(() => null);
  res.status(200).json({
    ok: true,
    reference,
    amount: Number(Number(amount).toFixed(2)),
    currency,
    newBalance: Number((currentBalance - amount).toFixed(2)),
    debitTransaction: debitTx || null,
    creditTransactionId: creditTx && creditTx.id ? creditTx.id : null,
    recipient: {
      uid: recipientUid,
      accountNumber: recipientAccountNumber,
      name: recipientName,
      email: recipientDoc?.email || ""
    }
  });
});

app.post("/api/admin/login", async (req, res) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: "Admin credentials are not configured on the server." });
    return;
  }

  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const creds = adminCredentials();

  if (email !== creds.email || password !== creds.password) {
    res.status(401).json({ error: "Invalid admin credentials." });
    return;
  }

  const expiresIn = getSessionExpiresInMs();
  res.cookie(adminCookieName, signAdminCookie(creds.email, Date.now() + expiresIn), {
    ...getCookieOptions(),
    maxAge: expiresIn
  });
  res.status(200).json({ ok: true, email: creds.email });
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie(adminCookieName, getCookieOptions());
  res.status(200).json({ ok: true });
});

app.get("/api/admin/session", requireAdminAuth, (req, res) => {
  res.json({ ok: true, admin: req.admin });
});

app.get("/api/admin/users", requireAdminAuth, async (req, res) => {
  try {
    const db = getFirestore();
    const snap = await db.collection("users").get();
    const users = snap.docs
      .map((doc) => {
        const data = doc.data() || {};
        const profile = data.profile || {};
        const account = data.account || {};
        return {
          uid: doc.id,
          email: data.email || null,
          firstname: profile.firstname || "",
          lastname: profile.lastname || "",
          phone: profile.phone || "",
          accountNumber: account.accountNumber || "",
          balance: Number(account.balance || 0),
          status: account.status || "ACTIVE",
          currency: account.currency || "USD",
          updatedAt: data.updatedAt || null,
          createdAt: data.createdAt || null
        };
      })
      .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));

    res.json({
      ok: true,
      users,
      summary: {
        totalUsers: users.length,
        totalBalance: users.reduce((sum, user) => sum + Number(user.balance || 0), 0)
      }
    });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to load users.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

app.get("/api/admin/users/:uid", requireAdminAuth, async (req, res) => {
  const uid = String(req.params?.uid || "").trim();
  if (!uid) {
    res.status(400).json({ error: "Missing user id." });
    return;
  }
  try {
    const db = getFirestore();
    const auth = getAuth();
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: "Customer not found." });
      return;
    }
    const data = userDoc.data() || {};
    const profile = data.profile || {};
    const account = data.account || {};
    const security = data.security || {};

    let authRecord = null;
    try {
      const r = await auth.getUser(uid);
      authRecord = {
        uid: r.uid,
        email: r.email || null,
        emailVerified: !!r.emailVerified,
        disabled: !!r.disabled,
        displayName: r.displayName || null,
        lastSignInTime: r.metadata?.lastSignInTime || null,
        creationTime: r.metadata?.creationTime || null,
        customClaims: r.customClaims || null
      };
    } catch {}

    let transactions = [];
    try {
      const txSnap = await db
        .collection("users")
        .doc(uid)
        .collection("transactions")
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();
      transactions = txSnap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
    } catch {}

    const pinHashSet = Boolean(security?.accountPinHash);
    const transferPinHashSet = Boolean(security?.transferPinHash);

    const finalPicUrl = String(
      profile.profilePic || profile.photoURL || profile.photo || profile.avatar ||
      security.profilePic || security.photoURL || security.photo || security.avatar ||
      data.profilePic || data.photoURL || data.photo || data.avatar || ""
    ).trim();

    const ob = typeof data.onboarding === "object" && data.onboarding ? data.onboarding : {};
    const kycCompleted = hasKycCompleted({ profile, security, ...data });
    const picDone = hasProfilePic({ profile, security, ...data });
    const persistedObRequired = typeof ob.required === "boolean" ? ob.required : null;
    const obRequired = (persistedObRequired != null) ? persistedObRequired : !(kycCompleted && picDone);

    res.json({
      ok: true,
      user: {
        uid,
        email: data.email || null,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        profile: {
          firstname: profile.firstname || profile.firstName || data.firstname || data.firstName || "",
          lastname: profile.lastname || profile.lastName || data.lastname || data.lastName || "",
          phone: profile.phone || profile.phoneNumber || data.phone || data.phoneNumber || "",
          address: profile.address || data.address || "",
          gender: profile.gender || data.gender || "",
          dateOfBirth: profile.dateOfBirth || profile.dob || data.dateOfBirth || data.dob || "",
          occupation: profile.occupation || data.occupation || "",
          nationality: profile.nationality || data.nationality || "",
          city: profile.city || data.city || "",
          state: profile.state || data.state || "",
          zipCode: profile.zipCode || profile.zip || profile.postal || data.zipCode || data.zip || data.postal || "",
          country: profile.country || data.country || "",
          profilePic: finalPicUrl,
          photoURL: finalPicUrl,
          photo: finalPicUrl,
          avatar: finalPicUrl,
          profilePicPublicId: profile.profilePicPublicId || security.profilePicPublicId || data.profilePicPublicId || null,
          preferredLanguage: profile.preferredLanguage || profile.language || data.preferredLanguage || "en",
          kycCompleted: kycCompleted,
          kycDone: kycCompleted,
          KYCDone: kycCompleted,
          kycCompletedAt: profile.kycCompletedAt || profile.KYCDoneAt || profile.kycDoneAt || security.kycCompletedAt || data.kycCompletedAt || null
        },
        account: {
          accountNumber: account.accountNumber || "",
          branchCode: account.branchCode || "",
          openingDate: account.openingDate || null,
          lastLogin: account.lastLogin || null,
          currency: account.currency || "USD",
          balance: Number(account.balance || 0),
          status: account.status || "ACTIVE",
          accountType: account.accountType || "SAVINGS",
          routingNumber: account.routingNumber || "",
          iban: account.iban || "",
          swiftBic: account.swiftBic || ""
        },
        security: {
          accountPinHashSet: pinHashSet,
          transferPinHashSet: transferPinHashSet,
          twoFactorEnabled: Boolean(security?.twoFactorEnabled !== false),
          lastPinChangeAt: security?.lastPinChangeAt || null,
          lastPasswordChangeAt: security?.lastPasswordChangeAt || null,
          kycCompleted: kycCompleted,
          kycDone: kycCompleted,
          KYCDone: kycCompleted,
          profilePic: finalPicUrl,
          photoURL: finalPicUrl,
          photo: finalPicUrl,
          avatar: finalPicUrl
        },
        onboarding: {
          required: obRequired,
          kycCompleted: kycCompleted,
          profilePicUploaded: picDone
        },
        auth: authRecord,
        transactions
      }
    });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to load customer details.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

function generateStrongPassword() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const specials = "!@#$%&*_-+";
  const pick = (s) => s.charAt(Math.floor(Math.random() * s.length));
  let out = "";
  out += pick("ABCDEFGHJKLMNPQRSTUVWXYZ");
  out += pick(numbers);
  out += pick(specials);
  for (let i = 0; i < 9; i++) out += pick(letters + numbers);
  out += pick(specials);
  return out;
}

function generateSixDigits() {
  const n = Math.floor(Math.random() * 1000000);
  return String(n).padStart(6, "0");
}

app.post("/api/admin/users/:uid/regenerate-credentials", requireAdminAuth, async (req, res) => {
  const uid = String(req.params?.uid || "").trim();
  if (!uid) {
    res.status(400).json({ error: "Missing user id." });
    return;
  }
  try {
    const db = getFirestore();
    const auth = getAuth();

    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) {
      res.status(404).json({ error: "Customer not found." });
      return;
    }
    const data = doc.data() || {};
    const profile = data.profile || {};
    const account = data.account || {};
    const email = String(data.email || "").trim();
    if (!email) {
      res.status(400).json({ error: "Customer has no email on file." });
      return;
    }

    const newPassword = generateStrongPassword();
    const newPin = generateSixDigits();
    const newTransferCode = generateSixDigits();
    const nowIso = new Date().toISOString();

    await auth.updateUser(uid, { password: newPassword });

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          updatedAt: nowIso,
          security: {
            accountPinHash: sha256Hex(newPin),
            transferPinHash: sha256Hex(newTransferCode),
            lastPinChangeAt: nowIso,
            lastPasswordChangeAt: nowIso
          }
        },
        { merge: true }
      );

    try {
      await auth.revokeRefreshTokens(uid);
    } catch {}

    res.json({
      ok: true,
      credentials: {
        email,
        password: newPassword,
        accountPin: newPin,
        transferCode: newTransferCode
      },
      account: {
        accountNumber: account.accountNumber || "",
        currency: account.currency || "USD",
        balance: Number(account.balance || 0),
        status: account.status || "ACTIVE"
      },
      user: {
        uid,
        email,
        firstname: profile.firstname || "",
        lastname: profile.lastname || ""
      }
    });
  } catch (e) {
    const code = String(e?.code || "");
    if (code === "auth/user-not-found") {
      res.status(404).json({ error: "Firebase auth record not found." });
      return;
    }
    const normalized = normalizeFirebaseAdminError(e, "Unable to regenerate credentials.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

app.get("/api/admin/transactions", requireAdminAuth, async (req, res) => {
  try {
    const rawLimit = Number(req.query?.limit || 100);
    const limit = Number.isFinite(rawLimit) ? Math.min(500, Math.max(1, rawLimit)) : 100;
    const db = getFirestore();
    const snap = await db.collection("transactions").orderBy("createdAt", "desc").limit(limit).get();
    const transactions = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));
    res.json({ ok: true, transactions });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to load transactions.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

app.post("/api/admin/users", requireAdminAuth, async (req, res) => {
  try {
    const firstname = String(req.body?.firstname || "").trim();
    const lastname = String(req.body?.lastname || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const accountPin = String(req.body?.accountPin || "").trim();
    const transferCode = String(req.body?.transferCode || req.body?.transferPin || "").trim();
    const startingBalanceRaw = req.body?.startingBalance;
    const startingBalance =
      startingBalanceRaw == null || startingBalanceRaw === "" ? 0 : Number(startingBalanceRaw);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "Login email is required and must be valid." });
      return;
    }
    if (!password || String(password).length < 6) {
      res.status(400).json({ error: "Login password is required (min 6 characters)." });
      return;
    }
    if (!firstname && !lastname) {
      res.status(400).json({ error: "Customer name is required." });
      return;
    }
    if (!isSixDigitPin(accountPin)) {
      res.status(400).json({ error: "Account PIN must be exactly 6 digits." });
      return;
    }
    if (!isTransferCodeValid(transferCode)) {
      res.status(400).json({ error: "Transfer code must be 6 digits or 8+ chars with uppercase, number, and special character." });
      return;
    }
    if (!Number.isFinite(startingBalance) || startingBalance < 0) {
      res.status(400).json({ error: "Starting balance must be a valid non-negative number." });
      return;
    }

    const auth = getAuth();
    const created = await auth.createUser({
      email,
      password,
      displayName: `${firstname} ${lastname}`.trim()
    });

    const uid = String(created.uid);
    const nowIso = new Date().toISOString();
    const accountNumber = generateAccountNumber();

    try {
      const db = getFirestore();
      await db
        .collection("users")
        .doc(uid)
        .set(
          {
            email,
            createdAt: nowIso,
            updatedAt: nowIso,
            profile: {
              firstname,
              lastname
            },
            security: {
              accountPinHash: sha256Hex(accountPin),
              transferPinHash: sha256Hex(transferCode),
              twoFactorEnabled: true
            },
            account: {
              accountNumber,
              status: "ACTIVE",
              branchCode: "RBSUS001",
              openingDate: nowIso,
              lastLogin: nowIso,
              currency: "USD",
              balance: startingBalance
            },
            onboarding: { required: true }
          },
          { merge: true }
        );

      if (startingBalance > 0) {
        await writeTransaction({
          uid,
          type: "OPENING_BALANCE",
          amount: startingBalance,
          currency: "USD",
          status: "COMPLETED",
          note: "Opening balance",
          reference: `OPEN-${uid}-${Date.now()}`,
          createdBy: req.admin?.email || null
        }).catch(() => {});
      }
    } catch (firestoreError) {
      await auth.deleteUser(uid).catch(() => {});
      throw firestoreError;
    }

    res.status(200).json({
      ok: true,
      user: {
        uid,
        email,
        firstname,
        lastname,
        accountNumber
      },
      credentials: {
        email,
        password,
        accountPin,
        transferCode
      },
      account: {
        accountNumber,
        balance: startingBalance,
        currency: "USD"
      }
    });
  } catch (e) {
    const code = String(e?.code || "");
    if (code === "auth/email-already-exists") {
      res.status(409).json({ error: "A user with this email already exists." });
      return;
    }
    const normalized = normalizeFirebaseAdminError(e, "Unable to create user.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});


app.patch("/api/admin/users/:uid", requireAdminAuth, async (req, res) => {
  const uid = String(req.params?.uid || "").trim();

  if (!uid) {
    res.status(400).json({ error: "Missing user id." });
    return;
  }

  const updates = {
    updatedAt: new Date().toISOString()
  };

  const balance = req.body?.balance;
  const status = req.body?.status;
  const firstname = req.body?.firstname;
  const lastname = req.body?.lastname;
  const accountNumber = req.body?.accountNumber;

  let deltaInfo = null;

  /*
   * BALANCE
   */
  if (balance != null && balance !== "") {
    const nextBalance = Number(balance);

    if (!Number.isFinite(nextBalance) || nextBalance < 0) {
      res.status(400).json({
        error: "Balance must be a valid non-negative number."
      });
      return;
    }

    updates["account.balance"] = nextBalance;
    deltaInfo = { nextBalance };
  }

  /*
   * STATUS
   */
  if (typeof status === "string" && status.trim()) {
    const normalizedStatus = status.trim().toUpperCase();

    const allowedStatuses = [
      "ACTIVE",
      "PENDING",
      "EXPIRED",
      "SUSPENDED",
      "BLOCKED",
      "CLOSED"
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      res.status(400).json({
        error: "Invalid account status."
      });
      return;
    }

    updates["account.status"] = normalizedStatus;
  }

  /*
   * FIRST NAME
   */
  if (typeof firstname === "string") {
    updates["profile.firstname"] = firstname.trim();
  }

  /*
   * LAST NAME
   */
  if (typeof lastname === "string") {
    updates["profile.lastname"] = lastname.trim();
  }

  /*
   * ACCOUNT NUMBER REPAIR
   */
  if (typeof accountNumber === "string") {
    const newAccountNumber = accountNumber.trim();

    if (!newAccountNumber) {
      res.status(400).json({
        error: "Account number cannot be empty."
      });
      return;
    }

    if (!/^[A-Za-z0-9_-]{6,32}$/.test(newAccountNumber)) {
      res.status(400).json({
        error: "Account number must contain 6-32 letters, numbers, hyphens or underscores."
      });
      return;
    }

    /*
     * Make sure another customer does not already have
     * this account number.
     */
    const db = getFirestore();

    const duplicateSnap = await db
      .collection("users")
      .where("account.accountNumber", "==", newAccountNumber)
      .limit(2)
      .get();

    const duplicate = duplicateSnap.docs.find(
      (doc) => doc.id !== uid
    );

    if (duplicate) {
      res.status(409).json({
        error: "That account number is already assigned to another customer."
      });
      return;
    }

    updates["account.accountNumber"] = newAccountNumber;
  }

  try {
    const db = getFirestore();
    const userRef = db.collection("users").doc(uid);

    const existingSnap = await userRef.get();

    if (!existingSnap.exists) {
      res.status(404).json({
        error: "Customer account not found."
      });
      return;
    }

    const existingData = existingSnap.data() || {};
    const currentBalance = Number(
      existingData?.account?.balance || 0
    );

    const currency = String(
      existingData?.account?.currency || "USD"
    );

    if (deltaInfo) {
      deltaInfo.prevBalance = Number.isFinite(currentBalance)
        ? currentBalance
        : 0;

      deltaInfo.currency = currency;
    }

    await userRef.set(updates, {
      merge: true
    });

    /*
     * Keep the existing admin balance transaction behavior.
     */
    if (
      deltaInfo &&
      Number.isFinite(deltaInfo.prevBalance) &&
      Number.isFinite(deltaInfo.nextBalance)
    ) {
      const delta =
        Number(deltaInfo.nextBalance) -
        Number(deltaInfo.prevBalance);

      if (delta !== 0) {
        await writeTransaction({
          uid,
          type: delta > 0
            ? "ADMIN_CREDIT"
            : "ADMIN_DEBIT",
          amount: Math.abs(delta),
          currency: deltaInfo.currency || "USD",
          status: "COMPLETED",
          note: "Admin balance update",
          reference: `ADMIN-${uid}-${Date.now()}`,
          createdBy: req.admin?.email || null
        }).catch(() => {});
      }
    }

    res.json({
      ok: true,
      message: "Customer account repaired successfully."
    });

  } catch (e) {
    console.error("[ADMIN] User update failed:", e);

    res.status(500).json({
      error: "Unable to update customer account."
    });
  }
});

app.delete("/api/admin/users/:uid", requireAdminAuth, async (req, res) => {
  const uid = String(req.params?.uid || "").trim();

  if (!uid) {
    res.status(400).json({
      error: "Missing user id."
    });
    return;
  }

  try {
    const db = getFirestore();
    const auth = getAuth();

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      res.status(404).json({
        error: "Customer account not found."
      });
      return;
    }

    /*
     * Delete Firebase Authentication account first.
     *
     * This prevents the customer from logging in again
     * even if Firestore cleanup encounters a problem.
     */
    try {
      await auth.deleteUser(uid);
    } catch (authError) {
      const authCode = String(authError?.code || "");

      /*
       * If the Auth account is already gone, continue
       * cleaning the Firestore data.
       */
      if (authCode !== "auth/user-not-found") {
        console.error(
          "[ADMIN] Firebase Auth deletion failed:",
          authError
        );

        res.status(500).json({
          error: "Unable to delete the customer's login account."
        });

        return;
      }
    }

    /*
     * Delete all customer transactions stored beneath
     * users/{uid}/transactions.
     */
    const transactionSnap = await userRef
      .collection("transactions")
      .get();

    let batch = db.batch();
    let batchCount = 0;

    for (const doc of transactionSnap.docs) {
      batch.delete(doc.ref);
      batchCount++;

      if (batchCount >= 400) {
        await batch.commit();

        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    /*
     * Delete global transaction records belonging to
     * this customer.
     */
    const globalTransactions = await db
      .collection("transactions")
      .where("uid", "==", uid)
      .get();

    batch = db.batch();
    batchCount = 0;

    for (const doc of globalTransactions.docs) {
      batch.delete(doc.ref);
      batchCount++;

      if (batchCount >= 400) {
        await batch.commit();

        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    /*
     * Finally remove the main customer document.
     */
    await userRef.delete();

    console.log(
      `[ADMIN] Permanently deleted customer ${uid} by ${req.admin?.email || "admin"}`
    );

    res.json({
      ok: true,
      message: "Customer account permanently deleted."
    });

  } catch (error) {
    console.error(
      "[ADMIN] Permanent user deletion failed:",
      error
    );

    res.status(500).json({
      error: "Unable to permanently delete customer account."
    });
  }
});

app.post("/api/admin/clear-users", requireAdminAuth, async (req, res) => {
  try {
    const db = getFirestore();
    const auth = getAuth();

    const usersSnap = await db.collection("users").get();
    let deletedCount = 0;

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      try {
        await auth.deleteUser(uid);
      } catch (_) {}

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
      } catch (_) {}

      try {
        const globalTx = await db.collection("transactions").where("uid", "==", uid).get();
        let batch = db.batch();
        let count = 0;
        for (const doc of globalTx.docs) {
          batch.delete(doc.ref);
          count++;
          if (count >= 400) {
            await batch.commit();
            batch = db.batch();
            count = 0;
          }
        }
        if (count > 0) await batch.commit();
      } catch (_) {}

      await userDoc.ref.delete().catch(() => {});
      deletedCount++;
    }

    console.log(`[ADMIN] Bulk cleared ${deletedCount} user accounts by ${req.admin?.email || "admin"}`);
    res.json({ ok: true, message: `Successfully cleared ${deletedCount} old customer account(s).`, deletedCount });
  } catch (e) {
    const normalized = normalizeFirebaseAdminError(e, "Unable to clear customer accounts.");
    res.status(normalized.status).json({ error: normalized.error });
  }
});

function sendHtmlFile(res, absPath) {
  try {
    const html = fs.readFileSync(absPath, "utf8");
    res.setHeader("Content-Disposition", "inline");
    res.status(200).type("html").send(html);
  } catch {
    res.status(404).end();
  }
}

function resolvePageFile(relFromSiteRoot) {
  const candidate = path.join(siteRoot, relFromSiteRoot);
  if (relFromSiteRoot.endsWith(".php.html")) {
    const phpSibling = candidate.slice(0, -".html".length);
    if (fs.existsSync(phpSibling)) return phpSibling;
  }
  if (fs.existsSync(candidate)) return candidate;
  if (relFromSiteRoot.endsWith(".php")) {
    const htmlSibling = candidate + ".html";
    if (fs.existsSync(htmlSibling)) return htmlSibling;
  }
  return candidate;
}

function sendPage(res, relFromSiteRoot) {
  const resolved = resolvePageFile(relFromSiteRoot);
  sendHtmlFile(res, resolved);
}

app.get("/admin", (req, res) => {
  res.redirect(isAdminAuthenticated(req) ? "/admin/dashboard.html" : "/admin/login.html");
});

app.get("/admin/login", (req, res) => {
  res.redirect("/admin/login.html");
});

app.get("/admin/login.html", (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "admin", "login.html"));
});

app.get("/admin/dashboard", requireAdminAuth, (req, res) => {
  res.redirect("/admin/dashboard.html");
});

app.get("/admin/dashboard.html", requireAdminAuth, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "admin", "dashboard.html"));
});

app.get("/customer/login", (req, res) => {
  res.redirect("/customer/login.php");
});

app.get("/customer/login.php", (req, res) => {
  sendPage(res, "customer/login.php");
});

app.get("/customer/register.php", (req, res) => {
  sendPage(res, "customer/register.php");
});

app.get("/customer/verify-pin", requireAuth, (req, res) => {
  res.redirect("/customer/verify-pin.php");
});

app.get("/customer/verify-pin.php", requireAuth, (req, res) => {
  sendPage(res, "customer/verify-pin.php");
});

app.get("/customer/account.html", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/account.html");
});

app.get("/customer/accountdetails.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/accountdetails.php");
});

app.get("/customer/dashboard.php", requireAuth, requirePinVerified, (req, res) => {
  sendPage(res, "customer/dashboard.php");
});

app.get("/customer/dashboard", requireAuth, (req, res) => {
  if (isPinVerified(req)) {
    res.redirect("/customer/dashboard.php");
    return;
  }
  res.redirect("/customer/verify-pin.php");
});

app.get("/customer/myprofile.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/myprofile.php");
});

app.get("/customer/statement.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/statement.php");
});

app.get("/customer/stocks.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/stocks.php");
});

app.get("/customer/international.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/international.php");
});

app.get("/customer/transferhistory.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/transferhistory.php");
});

app.get("/customer/card.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/card.php");
});

app.get("/customer/pin.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/pin.php");
});

app.get("/customer/password.php", requireAuth, requirePinVerified, requireKycAndProfilePic, (req, res) => {
  sendPage(res, "customer/password.php");
});

app.get(/^\/customer\/([A-Za-z0-9_-]+\.php\.html)$/, (req, res, next) => {
  const rel = req.params?.[0];
  if (!rel) { next(); return; }
  const canonical = rel.slice(0, -".html".length);
  const phpExists = fs.existsSync(path.join(siteRoot, "customer", canonical));
  if (phpExists) {
    res.redirect(301, "/customer/" + canonical);
    return;
  }
  sendPage(res, "customer/" + rel);
});

app.get(/^\/customer\/([A-Za-z0-9_-]+\.php)$/, requireAuth, (req, res, next) => {
  const rel = req.params?.[0];
  if (!rel) {
    next();
    return;
  }
  if (rel === "login.php" || rel === "register.php") {
    next();
    return;
  }
  const absPath = resolvePageFile("customer/" + rel);
  const isOrphanPhpHtml = !fs.existsSync(path.join(siteRoot, "customer/" + rel)) && fs.existsSync(absPath);
  if (isOrphanPhpHtml) {
    sendPage(res, "customer/" + rel);
    return;
  }
  if (rel === "verify-pin.php") {
    sendPage(res, "customer/" + rel);
    return;
  }
  if (rel === "dashboard.php") {
    if (isPinVerified(req)) {
      sendPage(res, "customer/" + rel);
    } else {
      res.redirect("/customer/verify-pin.php");
    }
    return;
  }
  if (!isPinVerified(req)) {
    res.redirect("/customer/verify-pin.php");
    return;
  }
  if (onboardingIsRequired(req)) {
    res.redirect("/customer/dashboard.php#onboarding");
    return;
  }
  sendPage(res, "customer/" + rel);
});

app.use("/_dev", express.static(siteRoot, {
  index: false,
  dotfiles: "deny",
  setHeaders(res, filePath) {
    const lower = String(filePath || "").toLowerCase();
    if (lower.endsWith(".php") || lower.endsWith(".php.html")) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", "inline");
      return;
    }
    if (lower.endsWith(".css") || lower.endsWith(".js")) {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    }
  }
}));

app.use(
  express.static(siteRoot, {
    index: false,
    dotfiles: "deny",
    fallthrough: true,
    setHeaders(res, filePath) {
      const lower = String(filePath || "").toLowerCase();
      if (lower.endsWith(".php")) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Disposition", "inline");
        return;
      }
      if (lower.endsWith(".css") || lower.endsWith(".js")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
    }
  })
);

app.use((req, res) => {
  if (String(req.path || "").startsWith("/api/")) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  sendPage(res, "index.php.html");
});

const port = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    process.stdout.write(`Server running on http://localhost:${port}\n`);
  });
}

module.exports = app;
