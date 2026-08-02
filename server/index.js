const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const { getAuth, getFirestore } = require("./firebase");
const { getCookieName, getCookieOptions, getSessionExpiresInMs, requireAuth } = require("./auth");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

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
  res.json({ ok: true, service: "vanguardtrust", ts: new Date().toISOString() });
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
      profile: {},
      account: {
        accountNumber: generateAccountNumber(),
        status: "ACTIVE",
        branchCode: "RBSUS001",
        openingDate: nowIso,
        lastLogin: nowIso,
        currency: "USD",
        balance: 4365423
      }
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
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    profile: req.user.profile || null,
    account: req.user.account || null,
    createdAt: req.user.createdAt || null,
    updatedAt: req.user.updatedAt || null,
    pinVerified: isPinVerified(req)
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
    gender,
    acctype,
    brname,
    accountPin,
    transferPin
  } = req.body || {};

  const uid = req.user.uid;
  await ensureUserDoc(uid, req.user.email);

  const updates = { updatedAt: new Date().toISOString() };

  if (typeof firstname === "string") updates["profile.firstname"] = firstname.trim();
  if (typeof lastname === "string") updates["profile.lastname"] = lastname.trim();
  if (typeof phone === "string") updates["profile.phone"] = phone.trim();
  if (typeof country === "string") updates["profile.country"] = country.trim();
  if (typeof state === "string") updates["profile.state"] = state.trim();
  if (typeof city === "string") updates["profile.city"] = city.trim();
  if (typeof dob === "string") updates["profile.dob"] = dob.trim();
  if (typeof gender === "string") updates["profile.gender"] = gender.trim();
  if (typeof acctype === "string") updates["profile.acctype"] = acctype.trim();
  if (typeof brname === "string") updates["profile.brname"] = brname.trim();

  if (typeof accountPin === "string" && accountPin.trim()) {
    const v = accountPin.trim();
    if (!isSixDigitPin(v)) {
      res.status(400).json({ error: "accountPin must be exactly 6 digits." });
      return;
    }
    updates["security.accountPinHash"] = sha256Hex(v);
  }

  if (typeof transferPin === "string" && transferPin.trim()) {
    const v = transferPin.trim();
    if (!isTransferCodeValid(v)) {
      res.status(400).json({ error: "transferPin must be 6 digits or 8+ chars with uppercase, number, and special character." });
      return;
    }
    updates["security.transferPinHash"] = sha256Hex(v);
  }

  const db = getFirestore();
  await db.collection("users").doc(String(uid)).set(updates, { merge: true });

  res.json({ ok: true });
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
    res.status(500).json({ error: "Unable to load users." });
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
            transferPinHash: sha256Hex(transferCode)
          },
          account: {
            accountNumber,
            status: "ACTIVE",
            branchCode: "RBSUS001",
            openingDate: nowIso,
            lastLogin: nowIso,
            currency: "USD",
            balance: startingBalance
          }
        },
        { merge: true }
      );

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
    res.status(500).json({ error: "Unable to create user." });
  }
});

app.patch("/api/admin/users/:uid", requireAdminAuth, async (req, res) => {
  const uid = String(req.params?.uid || "").trim();
  if (!uid) {
    res.status(400).json({ error: "Missing user id." });
    return;
  }

  const updates = { updatedAt: new Date().toISOString() };
  const balance = req.body?.balance;
  const status = req.body?.status;
  const firstname = req.body?.firstname;
  const lastname = req.body?.lastname;

  if (balance != null && balance !== "") {
    const nextBalance = Number(balance);
    if (!Number.isFinite(nextBalance) || nextBalance < 0) {
      res.status(400).json({ error: "Balance must be a valid non-negative number." });
      return;
    }
    updates["account.balance"] = nextBalance;
  }

  if (typeof status === "string" && status.trim()) {
    updates["account.status"] = status.trim().toUpperCase();
  }

  if (typeof firstname === "string") {
    updates["profile.firstname"] = firstname.trim();
  }

  if (typeof lastname === "string") {
    updates["profile.lastname"] = lastname.trim();
  }

  try {
    const db = getFirestore();
    await db.collection("users").doc(uid).set(updates, { merge: true });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Unable to update user." });
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
  res.redirect("/customer/login.php.html");
});

app.get("/customer/verify-pin", requireAuth, (req, res) => {
  res.redirect("/customer/verify-pin.php");
});

app.get("/customer/verify-pin.php", requireAuth, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "verify-pin.php"));
});

app.get("/customer/account.html", requireAuth, requirePinVerified, (req, res) => {
  res.type("html");
  res.sendFile(path.join(siteRoot, "customer", "account.html"));
});

app.get("/customer/accountdetails.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "accountdetails.php"));
});

app.get("/customer/dashboard.php", requireAuth, requirePinVerified, (req, res) => {
  res.type("html");
  res.sendFile(path.join(siteRoot, "customer", "dashboard.php.html"));
});

app.get("/customer/dashboard.php.html", requireAuth, requirePinVerified, (req, res) => {
  res.type("html");
  res.sendFile(path.join(siteRoot, "customer", "dashboard.php.html"));
});

app.get("/customer/dashboard", requireAuth, requirePinVerified, (req, res) => {
  res.redirect("/customer/dashboard.php.html");
});

app.get("/customer/myprofile.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "myprofile.php"));
});

app.get("/customer/statement.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "statement.php"));
});

app.get("/customer/stocks.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "stocks.php"));
});

app.get("/customer/international.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "international.php"));
});

app.get("/customer/transferhistory.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "transferhistory.php"));
});

app.get("/customer/card.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "card.php"));
});

app.get("/customer/pin.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "pin.php"));
});

app.get("/customer/password.php", requireAuth, requirePinVerified, (req, res) => {
  sendHtmlFile(res, path.join(siteRoot, "customer", "password.php"));
});

app.get(/^\/customer\/([A-Za-z0-9_-]+\.php)$/, requireAuth, requirePinVerified, (req, res, next) => {
  const rel = req.params?.[0];
  if (!rel) {
    next();
    return;
  }
  sendHtmlFile(res, path.join(siteRoot, "customer", rel));
});

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
  res.status(404).sendFile(path.join(siteRoot, "index.php.html"));
});

const port = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    process.stdout.write(`Server running on http://localhost:${port}\n`);
  });
}

module.exports = app;
