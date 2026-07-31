const { getAuth, getFirestore } = require("./firebase");

function getCookieName() {
  return process.env.SESSION_COOKIE_NAME || "vt_session";
}

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/"
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
      res.status(401).redirect("/customer/login.php.html");
      return;
    }

    const auth = getAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    if (!decoded?.uid) {
      res.clearCookie(getCookieName(), getCookieOptions());
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
      account: doc?.account || null
    };
    next();
  } catch (e) {
    res.clearCookie(getCookieName(), getCookieOptions());
    res.status(401).redirect("/customer/login.php.html");
  }
}

module.exports = {
  getCookieName,
  getCookieOptions,
  getSessionExpiresInMs,
  requireAuth
};
