const http = require("http");
const crypto = require("crypto");
const path = require("path");
const { getAuth, getFirestore } = require("./server/firebase");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const FIREBASE_WEB_CONFIG = (() => {
  try {
    const raw = process.env.FIREBASE_WEB_CONFIG_JSON || "";
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
})();

function httpsRequest(method, host, pathname, opts) {
  opts = opts || {};
  return new Promise((resolve, reject) => {
    const req = require("https").request(
      {
        hostname: host,
        port: 443,
        path: pathname,
        method,
        headers: Object.assign({ "Content-Type": "application/json" }, opts.headers || {})
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try { resolve({ status: res.statusCode, body: d ? JSON.parse(d) : {} }); }
          catch (_) { resolve({ status: res.statusCode, body: { _raw: d } }); }
        });
      }
    );
    req.on("error", reject);
    if (opts.body) req.write(typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body));
    req.end();
  });
}

async function userIdTokenFor(uid) {
  if (!FIREBASE_WEB_CONFIG?.apiKey) {
    throw new Error("Missing FIREBASE_WEB_CONFIG_JSON apiKey");
  }
  const auth = getAuth();
  const customToken = await auth.createCustomToken(uid);
  const resp = await httpsRequest(
    "POST",
    "identitytoolkit.googleapis.com",
    `/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(FIREBASE_WEB_CONFIG.apiKey)}`,
    { body: { token: customToken, returnSecureToken: true } }
  );
  if (resp.status !== 200 || !resp.body?.idToken) {
    throw new Error("signInWithCustomToken failed: " + JSON.stringify(resp.body).slice(0, 500));
  }
  return String(resp.body.idToken);
}

const BASE = process.env.PORT ? ("http://localhost:" + process.env.PORT) : "http://localhost:3002";
const LOG = (...a) => console.log("[TEST]", ...a);

function httpReq(method, path, opts) {
  opts = opts || {};
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const headers = Object.assign(
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      opts.headers || {}
    );
    if (opts.cookies) headers["Cookie"] = opts.cookies;
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers
      },
      (res) => {
        const setCookies = (res.headers["set-cookie"] || []).map((c) => c.split(";")[0]);
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          let body;
          try { body = d ? JSON.parse(d) : {}; }
          catch (_) { body = { _raw: d, length: d.length }; }
          resolve({ status: res.statusCode, cookies: setCookies, body });
        });
      }
    );
    req.on("error", reject);
    if (opts.body) req.write(typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body));
    req.end();
  });
}

function cookieToHeader(cookies) { return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join("; "); }
function mergeCookies(into, cookieArr) {
  cookieArr.forEach((c) => {
    const [k, v] = c.split("=");
    if (k) into[k.trim()] = v;
  });
}

(async () => {
  try {
    LOG("Start");
    const userCookies = {};

    const userEmail = "vt_test_" + Math.floor(Math.random() * 1e9) + "@vanguarddoubletrust.test";
    const userPassword = "VanguardTest123!";
    const userPin = "123456";
    const userFirst = "VT";
    const userLast = "TestUser-" + Math.floor(Math.random() * 1e6);
    const userCountry = "US";
    const userLang = "en";

    LOG("Test user email:", userEmail);

    // Create user directly via Firebase Admin Auth + Firestore
    LOG("Creating user in Firebase Auth and Firestore...");
    const auth = getAuth();
    const db = getFirestore();
    const userRecord = await auth.createUser({
      email: userEmail,
      password: userPassword,
      displayName: `${userFirst} ${userLast}`
    });
    const uid = userRecord.uid;
    LOG("User created. UID:", uid);

    await db.collection("users").doc(String(uid)).set({
      email: userEmail,
      role: "customer",
      createdAt: new Date().toISOString(),
      profile: {
        firstname: userFirst,
        lastname: userLast,
        email: userEmail
      },
      security: {
        accountPinHash: crypto.createHash("sha256").update(userPin).digest("hex"),
        kycCompleted: false
      },
      account: {
        accountNumber: "9900" + Math.floor(10000000 + Math.random() * 90000000),
        balance: 5000.0,
        currency: "USD"
      }
    });
    LOG("User document created in Firestore users/" + uid);

    // 4) Login user + get session
    LOG("Getting Firebase idToken for user...");
    const idToken = await userIdTokenFor(uid);
    LOG("  idToken length:", idToken.length);
    LOG("Logging in user via /api/sessionLogin...");
    const uLogin = await httpReq("POST", "/api/sessionLogin", {
      body: { idToken, remember: true }
    });
    LOG("User login status:", uLogin.status, "body:", JSON.stringify(uLogin.body, null, 2).slice(0, 500));
    mergeCookies(userCookies, uLogin.cookies);
    if (uLogin.status !== 200 || !uLogin.body?.ok) { process.exit(3); }

    // 5) Verify PIN
    LOG("Verifying PIN...");
    const pinVerify = await httpReq("POST", "/api/pin/verify", {
      cookies: cookieToHeader(userCookies),
      body: { accountPin: userPin }
    });
    LOG("PIN verify status:", pinVerify.status, "body ok:", pinVerify.body?.ok);
    mergeCookies(userCookies, pinVerify.cookies);
    if (pinVerify.status !== 200 || !pinVerify.body?.ok) { LOG(pinVerify.body); process.exit(4); }

    // 6) GET /api/me → onboarding should be REQUIRED
    LOG("GET /api/me (BEFORE onboarding)");
    const meBefore = await httpReq("GET", "/api/me?vt_diag=1", { cookies: cookieToHeader(userCookies) });
    LOG("  status:", meBefore.status, "onboarding:", JSON.stringify(meBefore.body?.onboarding || null));
    if (meBefore.body?.onboarding?.required !== true) {
      LOG("FAIL: expected onboarding.required=true before KYC. Got:", meBefore.body?.onboarding);
      process.exit(5);
    }
    if (meBefore.body?.onboarding?.kycCompleted !== false) {
      LOG("FAIL: expected kycCompleted=false. Got:", meBefore.body?.onboarding);
      process.exit(5);
    }
    if (meBefore.body?.onboarding?.profilePicUploaded !== false) {
      LOG("FAIL: expected profilePicUploaded=false. Got:", meBefore.body?.onboarding);
      process.exit(5);
    }

    // 7) POST KYC
    LOG("POST /api/customer/kyc...");
    const kycRes = await httpReq("POST", "/api/customer/kyc?vt_diag=1", {
      cookies: cookieToHeader(userCookies),
      body: {
        firstname: userFirst,
        lastname: userLast,
        country: userCountry,
        preferredLanguage: userLang,
        gender: "other",
        dateOfBirth: "1990-01-01",
        nationality: "American",
        occupation: "QA Test Engineer",
        address: "123 Test Street",
        city: "Test City",
        state: "CA",
        zipCode: "90210",
        phone: "+15555550199"
      }
    });
    LOG("  status:", kycRes.status, "onboarding:", JSON.stringify(kycRes.body?.onboarding || null));
    if (kycRes.status !== 200) {
      LOG("FAIL: kyc save returned:", kycRes.status, kycRes.body);
      process.exit(6);
    }
    if (kycRes.body?.onboarding?.kycCompleted !== true) {
      LOG("FAIL: expected kycCompleted=true right after KYC submit. Got:", kycRes.body?.onboarding);
      process.exit(6);
    }
    if (kycRes.body?.onboarding?.required !== true) {
      LOG("WARNING: expected onboarding.required still=true (missing pic). Got:", kycRes.body?.onboarding);
    }

    // 8) GET /api/me → onboarding.required=true (missing pic), kycCompleted=true
    LOG("GET /api/me (AFTER KYC, BEFORE pic)");
    const meMid = await httpReq("GET", "/api/me?vt_diag=1", { cookies: cookieToHeader(userCookies) });
    LOG("  status:", meMid.status, "onboarding:", JSON.stringify(meMid.body?.onboarding || null));
    if (meMid.body?.onboarding?.kycCompleted !== true) {
      LOG("FAIL: on reload after KYC, server says kycCompleted=false — DATA NOT PERSISTED!");
      LOG("  sec.kycCompleted:", meMid.body?.security?.kycCompleted);
      LOG("  profile.country:", meMid.body?.profile?.country);
      LOG("  profile.firstname:", meMid.body?.profile?.firstname);
      process.exit(7);
    }
    if (meMid.body?.onboarding?.profilePicUploaded !== false) {
      LOG("FAIL: expected profilePicUploaded=false, got:", meMid.body?.onboarding);
      process.exit(7);
    }
    if (meMid.body?.onboarding?.required !== true) {
      LOG("WARNING: expected onboarding.required=true (missing pic). Got:", meMid.body?.onboarding);
    }

    // 9) POST profile-pic with a dataURL
    LOG("POST /api/customer/profile-pic...");
    const tinyPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
    const picRes = await httpReq("POST", "/api/customer/profile-pic?vt_diag=1", {
      cookies: cookieToHeader(userCookies),
      body: { secure_url: tinyPic, public_id: "vt-test-" + crypto.randomBytes(8).toString("hex"), width: 1, height: 1, format: "png", bytes: tinyPic.length }
    });
    LOG("  status:", picRes.status, "onboarding:", JSON.stringify(picRes.body?.onboarding || null));
    if (picRes.status !== 200) { LOG("FAIL pic:", picRes.status, picRes.body); process.exit(8); }
    if (picRes.body?.onboarding?.profilePicUploaded !== true) { LOG("FAIL pic.uploaded=false in resp:", picRes.body?.onboarding); process.exit(8); }

    // 10) GET /api/me → onboarding.required=false ✅
    LOG("GET /api/me (AFTER KYC+pic ONCE — SHOULD BE DONE FOREVER)");
    const meAfter = await httpReq("GET", "/api/me?vt_diag=1", { cookies: cookieToHeader(userCookies) });
    LOG("  status:", meAfter.status, "onboarding:", JSON.stringify(meAfter.body?.onboarding || null));
    if (meAfter.body?.onboarding?.required !== false) {
      LOG("=======================================");
      LOG("CRITICAL FAIL: ONBOARDING STILL REQUIRED AFTER BOTH STEPS SAVED!");
      LOG("This means KYC or pic isn't persisting to Firestore correctly.");
      LOG("onboarding:", meAfter.body?.onboarding);
      LOG("security.kycCompleted:", meAfter.body?.security?.kycCompleted);
      LOG("profile.country:", meAfter.body?.profile?.country, "firstname:", meAfter.body?.profile?.firstname, "lastname:", meAfter.body?.profile?.lastname, "lang:", meAfter.body?.profile?.preferredLanguage);
      LOG("profile.profilePic.length:", String(meAfter.body?.profile?.profilePic || meAfter.body?.profile?.photoURL || "").length);
      LOG("security.profilePic.length:", String(meAfter.body?.security?.profilePic || meAfter.body?.security?.photoURL || "").length);
      LOG("=======================================");
      process.exit(9);
    }
    LOG("✅ onboarding.required=false after one round — GATES WILL NOT RE-APPEAR on next login");

    // 11) Hit a gated page — should be 200, no redirect
    LOG("GET /customer/statement.php (gated page)");
    const gated = await httpReq("GET", "/customer/statement.php", { cookies: cookieToHeader(userCookies), headers: { Accept: "text/html" } });
    LOG("  status:", gated.status, "redirected?", gated.status === 301 || gated.status === 302 ? gated.body : "No");
    if (gated.status === 301 || gated.status === 302) {
      const loc = (Array.isArray(gated.cookies) ? gated.body._location : null) || (gated.body && typeof gated.body === "object" ? gated.body.location : null);
      LOG("FAIL: gated page redirected! loc:", loc);
      process.exit(10);
    }
    LOG("✅ Gated page loads without redirect (status", gated.status, ")");

    // 12) Log out user + log back in → onboarding.required still=false
    LOG("Simulating LOGOUT then re-LOGIN (next day onboarding)...");
    const userCookies2 = {};
    const idToken2 = await userIdTokenFor(uid);
    const uLogin2 = await httpReq("POST", "/api/sessionLogin", { body: { idToken: idToken2, remember: true } });
    if (uLogin2.status !== 200) { LOG("Relogin failed:", uLogin2.body); process.exit(11); }
    mergeCookies(userCookies2, uLogin2.cookies);
    const pin2 = await httpReq("POST", "/api/pin/verify", { cookies: cookieToHeader(userCookies2), body: { accountPin: userPin } });
    mergeCookies(userCookies2, pin2.cookies);
    const meAgain = await httpReq("GET", "/api/me?vt_diag=1", { cookies: cookieToHeader(userCookies2) });
    LOG("  After re-login onboarding:", JSON.stringify(meAgain.body?.onboarding || null));
    if (meAgain.body?.onboarding?.required !== false) {
      LOG("=======================================");
      LOG("CRITICAL FAIL: ONBOARDING RE-APPEARED ON NEXT LOGIN!");
      LOG("This means it's not truly saved to Firestore.");
      LOG("onboarding:", meAgain.body?.onboarding);
      LOG("security:", JSON.stringify(meAgain.body?.security).slice(0, 500));
      LOG("profile.firstname:", meAgain.body?.profile?.firstname, "country:", meAgain.body?.profile?.country);
      LOG("=======================================");
      process.exit(12);
    }
    LOG("✅ ONBOARDING STAYS DONE AFTER LOGOUT+RELOGIN — APPEARS EXACTLY ONCE ✓");
    LOG("ALL TESTS PASSED");
    process.exit(0);
  } catch (e) {
    console.error("TEST EXCEPTION:", e);
    process.exit(99);
  }
})();
