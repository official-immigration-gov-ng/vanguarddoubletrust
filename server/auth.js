const crypto = require("crypto");

const Session = require("./models/Session");
const User = require("./models/User");

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
    const token = req.cookies?.[cookieName];
    if (!token) {
      res.status(401).redirect("/customer/login.php.html");
      return;
    }

    const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).lean();
    if (!session) {
      res.clearCookie(getCookieName(), getCookieOptions());
      res.status(401).redirect("/customer/login.php.html");
      return;
    }

    const user = await User.findById(session.userId).lean();
    if (!user) {
      res.clearCookie(getCookieName(), getCookieOptions());
      res.status(401).redirect("/customer/login.php.html");
      return;
    }

    req.user = {
      uid: String(user._id),
      email: user.email,
      profile: user.profile || null,
      account: user.account || null
    };
    req.session = session;
    next();
  } catch (e) {
    res.clearCookie(getCookieName(), getCookieOptions());
    res.status(401).redirect("/customer/login.php.html");
  }
}

async function createSessionForUser(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + getSessionExpiresInMs());
  await Session.create({ token, userId, expiresAt });
  return { token, expiresAt };
}

async function destroySessionByToken(token) {
  if (!token) return;
  await Session.deleteOne({ token });
}

module.exports = {
  getCookieName,
  getCookieOptions,
  getSessionExpiresInMs,
  requireAuth,
  createSessionForUser,
  destroySessionByToken
};
