const { getAuth, getFirestore } = require("./firebase");

function getCookieName() {
  return process.env.SESSION_COOKIE_NAME || "vt_session";
}

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const crossSite =
    String(process.env.CROSS_SITE_COOKIES || "").toLowerCase() === "true" || String(process.env.CROSS_SITE_COOKIES || "") === "1";
  const sameSite = crossSite ? "none" : "lax";
  const domain = process.env.COOKIE_DOMAIN ? String(process.env.COOKIE_DOMAIN) : undefined;
  return {
    httpOnly: true,
    secure: crossSite ? true : isProd,
    sameSite,
    path: "/",
    ...(domain ? { domain } : {})
  };
}

function getSessionExpiresInMs() {
  const rawDays = process.env.SESSION_MAX_AGE_DAYS || "5";
  const days = Number(rawDays);
  const safeDays = Number.isFinite(days) && days > 0 ? days : 5;
  return safeDays * 24 * 60 * 60 * 1000;
}

async function requireAuth(req, res, next) {
  try {
    const cookieName = getCookieName();
    const sessionCookie = req.cookies?.[cookieName];
    if (!sessionCookie) {
      if (String(req.path || "").startsWith("/api/")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.status(401).redirect("/customer/login.php.html");
      return;
    }

    const auth = getAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    if (!decoded?.uid) {
      res.clearCookie(getCookieName(), getCookieOptions());
      if (String(req.path || "").startsWith("/api/")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.status(401).redirect("/customer/login.php.html");
      return;
    }

    const uid = String(decoded.uid);
    const email = decoded.email || null;
    const db = getFirestore();
    let doc = null;
    try {
      const snap = await db.collection("users").doc(uid).get();
      doc = snap.exists ? snap.data() : null;
    } catch {}

    req.user = {
      uid,
      email,
      profile: doc?.profile || null,
      account: doc?.account || null,
      createdAt: doc?.createdAt || null,
      updatedAt: doc?.updatedAt || null
    };
    next();
  } catch (e) {
    res.clearCookie(getCookieName(), getCookieOptions());
    if (String(req.path || "").startsWith("/api/")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(401).redirect("/customer/login.php.html");
  }
}

module.exports = {
  getCookieName,
  getCookieOptions,
  getSessionExpiresInMs,
  requireAuth
};
