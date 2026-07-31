const path = require("path");
const fs = require("fs");

const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const { connectMongo } = require("./db");
const User = require("./models/User");
const {
  getCookieName,
  getCookieOptions,
  getSessionExpiresInMs,
  createSessionForUser,
  destroySessionByToken,
  requireAuth
} = require("./auth");

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

app.get("/firebase-config.js", (req, res) => {
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
});

app.post("/api/sessionLogin", async (req, res) => {
  res.status(410).json({ error: "Deprecated" });
});

app.post("/api/sessionLogout", (req, res) => {
  res.status(410).json({ error: "Deprecated" });
});

function safeEmail(v) {
  const s = String(v || "").trim().toLowerCase();
  if (!s || !s.includes("@")) return "";
  return s;
}

function generateAccountNumber() {
  const n = Math.floor(1000000000 + Math.random() * 9000000000);
  return String(n);
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const body = req.body || {};
    const email = safeEmail(body.email);
    const password = String(body.password || "");
    if (!email || password.length < 8) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const user = await User.create({
      email,
      passwordHash,
      profile: {
        firstname: String(body.firstname || "").trim(),
        lastname: String(body.lastname || "").trim(),
        phone: String(body.phone || "").trim(),
        country: String(body.country || "").trim(),
        state: String(body.state || "").trim(),
        city: String(body.city || "").trim(),
        dob: String(body.dob || "").trim(),
        gender: String(body.gender || "").trim(),
        acctype: String(body.acctype || "").trim(),
        brname: String(body.brname || "").trim()
      },
      account: {
        accountNumber: generateAccountNumber(),
        status: "ACTIVE",
        branchCode: "RBSUS001",
        openingDate: now,
        lastLogin: now,
        currency: "USD",
        balance: 4365423
      }
    });

    if (typeof body.accountPin === "string" && /^\d{6}$/.test(body.accountPin.trim())) {
      user.accountPinHash = await bcrypt.hash(body.accountPin.trim(), 12);
    }
    if (typeof body.transferPin === "string" && /^\d{4}$/.test(body.transferPin.trim())) {
      user.transferPinHash = await bcrypt.hash(body.transferPin.trim(), 12);
    }
    await user.save();

    const { token, expiresAt } = await createSessionForUser(user._id);
    res.cookie(getCookieName(), token, {
      ...getCookieOptions(),
      maxAge: expiresAt.getTime() - Date.now()
    });

    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = safeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    user.account = user.account || {};
    user.account.lastLogin = new Date();
    await user.save();

    const { token, expiresAt } = await createSessionForUser(user._id);
    res.cookie(getCookieName(), token, {
      ...getCookieOptions(),
      maxAge: expiresAt.getTime() - Date.now()
    });

    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  const token = req.cookies?.[getCookieName()];
  try {
    await destroySessionByToken(token);
  } catch {}
  res.clearCookie(getCookieName(), getCookieOptions());
  res.status(200).json({ ok: true });
});

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

  const updates = { profile: {}, account: {} };

  if (typeof firstname === "string") updates.profile.firstname = firstname.trim();
  if (typeof lastname === "string") updates.profile.lastname = lastname.trim();
  if (typeof phone === "string") updates.profile.phone = phone.trim();
  if (typeof country === "string") updates.profile.country = country.trim();
  if (typeof state === "string") updates.profile.state = state.trim();
  if (typeof city === "string") updates.profile.city = city.trim();
  if (typeof dob === "string") updates.profile.dob = dob.trim();
  if (typeof gender === "string") updates.profile.gender = gender.trim();
  if (typeof acctype === "string") updates.profile.acctype = acctype.trim();
  if (typeof brname === "string") updates.profile.brname = brname.trim();

  const extra = {};
  if (typeof accountPin === "string" && /^\d{6}$/.test(accountPin.trim())) {
    extra.accountPinHash = await bcrypt.hash(accountPin.trim(), 12);
  }
  if (typeof transferPin === "string" && /^\d{4}$/.test(transferPin.trim())) {
    extra.transferPinHash = await bcrypt.hash(transferPin.trim(), 12);
  }

  const uid = req.user.uid;
  const user = await User.findById(uid);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  user.profile = { ...(user.profile?.toObject?.() || user.profile || {}), ...updates.profile };
  user.account = { ...(user.account?.toObject?.() || user.account || {}), ...updates.account };
  if (extra.accountPinHash) user.accountPinHash = extra.accountPinHash;
  if (extra.transferPinHash) user.transferPinHash = extra.transferPinHash;
  await user.save();

  res.json({ ok: true });
});

app.get("/customer/account.html", requireAuth, (req, res) => {
  res.sendFile(path.join(siteRoot, "customer", "account.html"));
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
(async () => {
  await connectMongo();
  app.listen(port, () => {
    process.stdout.write(`Server running on http://localhost:${port}\n`);
  });
})().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`);
  process.exit(1);
});
