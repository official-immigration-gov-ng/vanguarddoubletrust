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

app.set("trust proxy", 1);
app.disable("x-powered-by");

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
    account: req.user.account || null
  });
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
    if (!isStrongSecret(v)) {
      res.status(400).json({ error: "accountPin must be 8+ chars with uppercase, number, and special character." });
      return;
    }
    updates["security.accountPinHash"] = sha256Hex(v);
  }

  if (typeof transferPin === "string" && transferPin.trim()) {
    const v = transferPin.trim();
    if (!isStrongSecret(v)) {
      res.status(400).json({ error: "transferPin must be 8+ chars with uppercase, number, and special character." });
      return;
    }
    updates["security.transferPinHash"] = sha256Hex(v);
  }

  const db = getFirestore();
  await db.collection("users").doc(String(uid)).set(updates, { merge: true });

  res.json({ ok: true });
});

app.get("/customer/account.html", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "account.html"));
});

app.get("/customer/accountdetails.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "accountdetails.php"));
});

app.get("/customer/dashboard.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "dashboard.php.html"));
});

app.get("/customer/dashboard.php.html", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "dashboard.php.html"));
});

app.get("/customer/myprofile.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "myprofile.php"));
});

app.get("/customer/statement.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "statement.php"));
});

app.get("/customer/stocks.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "stocks.php"));
});

app.get("/customer/international.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "international.php"));
});

app.get("/customer/transferhistory.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "transferhistory.php"));
});

app.get("/customer/card.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "card.php"));
});

app.get("/customer/pin.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "pin.php"));
});

app.get("/customer/password.php", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "password.php"));
});

app.use(
  express.static(siteRoot, {
    index: false,
    dotfiles: "deny",
    fallthrough: true
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(siteRoot, "index.php.html"));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  process.stdout.write(`Server running on http://localhost:${port}\n`);
});
