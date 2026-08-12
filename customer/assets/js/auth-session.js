(() => {
  function apiBase() {
    const raw = String(window.__VT_API_BASE__ || "").trim();
    if (raw) return raw.replace(/\/+$/, "");
    try {
      const saved = String(window.localStorage.getItem("vt_api_base") || "").trim();
      if (saved) return saved.replace(/\/+$/, "");
    } catch {}
    return "";
  }

  function apiUrl(pathname) {
    const p = String(pathname || "");
    const base = apiBase();
    if (!base) return p;
    if (p.startsWith("http://") || p.startsWith("https://")) return p;
    const rel = p.startsWith("/") ? p : `/${p}`;
    return `${base}${rel}`;
  }

  function hasSwal() {
    return typeof window !== "undefined" && window.Swal && typeof window.Swal.fire === "function";
  }

  function toast(type, title) {
    if (hasSwal()) {
      window.Swal.fire({
        toast: true,
        position: "top-end",
        icon: type,
        title,
        showConfirmButton: false,
        timer: 3500
      });
      return;
    }
    window.alert(title);
  }

  function modalError(title, text) {
    if (hasSwal()) {
      window.Swal.fire({ icon: "error", title, text });
      return;
    }
    window.alert(`${title}\n${text}`);
  }

  function getFirebaseConfig() {
    const cfg = window.__FIREBASE_CONFIG__;
    if (!cfg) {
      throw new Error("Missing Firebase web config. Set FIREBASE_WEB_CONFIG_JSON on the server.");
    }
    return cfg;
  }

  function initFirebaseOnce() {
    if (!window.firebase) throw new Error("Firebase SDK not loaded");
    if (window.firebase.apps && window.firebase.apps.length) return;
    window.firebase.initializeApp(getFirebaseConfig());
  }

  async function sessionLoginWithIdToken(idToken) {
    const res = await fetch(apiUrl("/api/sessionLogin"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken })
    });
    if (!res.ok) {
      let msg = "Session login failed";
      try {
        const data = await res.json();
        msg = String(data?.detail || data?.error || msg);
      } catch {}
      throw new Error(msg);
    }
  }

  async function sessionLogin(email, password) {
    initFirebaseOnce();
    const auth = window.firebase.auth();
    await auth.signInWithEmailAndPassword(String(email || "").trim(), String(password || ""));
    const idToken = await auth.currentUser.getIdToken(true);
    await sessionLoginWithIdToken(idToken);
  }

  async function sessionLogout() {
    await fetch(apiUrl("/api/sessionLogout"), { method: "POST", credentials: "include" });
  }

  async function upsertProfile(profile) {
    const res = await fetch(apiUrl("/api/profile"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile)
    });
    if (!res.ok) {
      throw new Error("Profile save failed");
    }
  }

  var VT_KYC_CACHE_KEY_AUTH = "vt_kyc_state_v1";
  var VT_KYC_PERM_KEY_AUTH = "vt_kyc_perm_v1";
  var VT_KYC_CACHE_TTL_MS_AUTH = 24 * 60 * 60 * 1000;

  function readVtKycCacheAuth() {
    try {
      if (typeof window === "undefined") return null;
      var ss = null;
      try {
        if (window.sessionStorage) {
          var raw = window.sessionStorage.getItem(VT_KYC_CACHE_KEY_AUTH);
          if (raw) ss = JSON.parse(raw);
        }
      } catch (_) { ss = null; }
      var ls = null;
      try {
        if (window.localStorage) {
          var raw2 = window.localStorage.getItem(VT_KYC_PERM_KEY_AUTH);
          if (raw2) ls = JSON.parse(raw2);
        }
      } catch (_) { ls = null; }
      var merged = Object.assign({}, ls || {}, ss || {});
      if (ls && ls.kycCompleted === true && merged.kycCompleted !== true) merged.kycCompleted = true;
      if (ss && ss.kycCompleted === true && merged.kycCompleted !== true) merged.kycCompleted = true;
      var lsPic = String(ls?.profilePic || ls?.photoURL || ls?.photo || ls?.avatar || "");
      var ssPic = String(ss?.profilePic || ss?.photoURL || ss?.photo || ss?.avatar || "");
      var finalPic = ssPic || lsPic || "";
      if (finalPic) {
        merged.profilePic = merged.profilePic || finalPic;
        merged.photoURL = merged.photoURL || finalPic;
        merged.photo = merged.photo || finalPic;
        merged.avatar = merged.avatar || finalPic;
      }
      var lsPub = String(ls?.profilePicPublicId || ls?.photoURLPublicId || ls?.photoPublicId || ls?.avatarPublicId || "");
      var ssPub = String(ss?.profilePicPublicId || ss?.photoURLPublicId || ss?.photoPublicId || ss?.avatarPublicId || "");
      var finalPub = ssPub || lsPub || "";
      if (finalPub) {
        merged.profilePicPublicId = merged.profilePicPublicId || finalPub;
        merged.photoURLPublicId = merged.photoURLPublicId || finalPub;
        merged.photoPublicId = merged.photoPublicId || finalPub;
        merged.avatarPublicId = merged.avatarPublicId || finalPub;
      }
      if (ss && typeof ss === "object" && ss !== null) {
        var savedAt = Number(ss.savedAt || 0);
        if (!savedAt || Date.now() - savedAt > VT_KYC_CACHE_TTL_MS_AUTH) {
          if (ls && ls.kycCompleted === true) return Object.assign({}, merged, { kycCompleted: true });
          if (finalPic) return merged;
          return null;
        }
      } else if (!ls && !ss) {
        return null;
      }
      return merged;
    } catch (_) { return null; }
  }

  function applyVtKycCacheToMeAuth(me) {
    if (!me || typeof me !== "object") return me;
    var cached = readVtKycCacheAuth();
    if (!cached) return me;
    var merged = Object.assign({}, me);
    if (cached.kycCompleted) {
      merged.security = Object.assign({}, merged.security || {});
      merged.security.kycCompleted = true;
      merged.security.KYCDone = true;
      merged.security.kycDone = true;
      if (!merged.security.kycCompletedAt) merged.security.kycCompletedAt = cached.kycCompletedAt || (new Date()).toISOString();
      if (!merged.security.KYCDoneAt) merged.security.KYCDoneAt = cached.KYCDoneAt || merged.security.kycCompletedAt || (new Date()).toISOString();
      if (!merged.security.kycDoneAt) merged.security.kycDoneAt = cached.kycDoneAt || merged.security.kycCompletedAt || (new Date()).toISOString();
      merged.profile = Object.assign({}, merged.profile || {});
      merged.profile.kycCompleted = true;
      merged.profile.KYCDone = true;
      merged.profile.kycDone = true;
      if (!merged.profile.kycCompletedAt) merged.profile.kycCompletedAt = cached.kycCompletedAt || merged.security.kycCompletedAt || (new Date()).toISOString();
      if (!merged.profile.KYCDoneAt) merged.profile.KYCDoneAt = cached.KYCDoneAt || merged.profile.kycCompletedAt || (new Date()).toISOString();
      if (!merged.profile.kycDoneAt) merged.profile.kycDoneAt = cached.kycDoneAt || merged.profile.kycCompletedAt || (new Date()).toISOString();
      if (cached.country) merged.profile.country = cached.country;
      if (cached.preferredLanguage) {
        merged.profile.preferredLanguage = cached.preferredLanguage;
        if (!merged.preferredLanguage) merged.preferredLanguage = cached.preferredLanguage;
      }
    }
    var cachedPic = String(cached.profilePic || cached.photoURL || cached.photo || cached.avatar || "");
    var cachedPicPublic = String(cached.profilePicPublicId || cached.photoURLPublicId || cached.photoPublicId || cached.avatarPublicId || "");
    if (cachedPic) {
      merged.profilePic = merged.profilePic || cachedPic;
      merged.photoURL = merged.photoURL || merged.profilePic || cachedPic;
      merged.photo = merged.photo || merged.photoURL || merged.profilePic || cachedPic;
      merged.avatar = merged.avatar || merged.photo || merged.photoURL || merged.profilePic || cachedPic;
      merged.profile = Object.assign({}, merged.profile || {});
      merged.profile.profilePic = merged.profile.profilePic || cachedPic;
      merged.profile.photoURL = merged.profile.photoURL || merged.profile.profilePic || cachedPic;
      merged.profile.photo = merged.profile.photo || merged.profile.photoURL || merged.profile.profilePic || cachedPic;
      merged.profile.avatar = merged.profile.avatar || merged.profile.photo || merged.profile.photoURL || merged.profile.profilePic || cachedPic;
      if (cachedPicPublic) {
        merged.profile.profilePicPublicId = merged.profile.profilePicPublicId || cachedPicPublic;
        merged.profile.photoURLPublicId = merged.profile.photoURLPublicId || cachedPicPublic;
        merged.profile.photoPublicId = merged.profile.photoPublicId || cachedPicPublic;
        merged.profile.avatarPublicId = merged.profile.avatarPublicId || cachedPicPublic;
      }
      merged.security = Object.assign({}, merged.security || {});
      merged.security.profilePic = merged.security.profilePic || cachedPic;
      merged.security.photoURL = merged.security.photoURL || merged.security.profilePic || cachedPic;
      merged.security.photo = merged.security.photo || merged.security.photoURL || merged.security.profilePic || cachedPic;
      merged.security.avatar = merged.security.avatar || merged.security.photo || merged.security.photoURL || merged.security.profilePic || cachedPic;
      if (cachedPicPublic) {
        merged.security.profilePicPublicId = merged.security.profilePicPublicId || cachedPicPublic;
        merged.security.photoURLPublicId = merged.security.photoURLPublicId || cachedPicPublic;
        merged.security.photoPublicId = merged.security.photoPublicId || cachedPicPublic;
        merged.security.avatarPublicId = merged.security.avatarPublicId || cachedPicPublic;
      }
    }
    return merged;
  }

  async function getMe() {
    const res = await fetch(apiUrl("/api/me"), { credentials: "include" });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const host = window.location.hostname;
      const isLocal =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "" ||
        window.location.protocol === "file:";
      if (!isLocal) return null;
      return (
        loadJson(safeStorageKey("demo_me"), null) || {
          uid: "demo",
          email: "pj03165@gmail.com",
          profile: {
            firstname: "Frank",
            lastname: "James",
            phone: "+4478789166724",
            gender: "Male",
            createdAt: new Date().toISOString()
          }
        }
      );
    }
    try {
      const raw = await res.json();
      return applyVtKycCacheToMeAuth(raw || null);
    } catch {
      return null;
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value == null ? "" : String(value);
  }

  function initialsFromName(name) {
    if (!name) return "VT";
    const parts = String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    if (!parts.length) return "VT";
    return parts.map((p) => p.slice(0, 1).toUpperCase()).join("");
  }

  function formatDate(d) {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  }

  function formatDateTime(d) {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    const day = date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    return `${day} ${time}`;
  }

  function accountNumberFromUid(uid) {
    if (!uid) return "";
    let h = 2166136261;
    for (let i = 0; i < uid.length; i++) {
      h ^= uid.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    const n = Math.abs(h) % 10000000000;
    return String(n).padStart(10, "0");
  }

  function wireLoginForm() {
    const form = document.getElementById("multiStepForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email-1")?.value?.trim();
      const password = document.getElementById("password-1")?.value || "";
      if (!email || !password) {
        toast("warning", "Please enter email and password");
        return;
      }

      try {
        await sessionLogin(email, password);
        window.location.href = "/customer/verify-pin.php";
      } catch (err) {
        modalError("Login failed", err?.message || "Unable to sign in");
      }
    });
  }

  async function verifyAccountPin(accountPin) {
    const res = await fetch(apiUrl("/api/pin/verify"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accountPin })
    });
    if (!res.ok) {
      let msg = "Invalid Account PIN";
      try {
        const data = await res.json();
        msg = String(data?.error || data?.detail || msg);
      } catch {}
      throw new Error(msg);
    }
  }

  function wirePinVerifyPage() {
    const root = document.getElementById("pinVerifyRoot");
    if (!root) return;

    const form = document.getElementById("pinVerifyForm");
    const pinInput = document.getElementById("accountPin");
    const nameEl = document.getElementById("pinVerifyName");
    const initialsEl = document.getElementById("avatarInitials");
    const logoutBtn = document.getElementById("pinVerifyLogout");
    const submitBtn = document.getElementById("verifyPinBtn");

    if (form) {
      form.noValidate = true;
    }
    if (pinInput) {
      pinInput.setAttribute("novalidate", "novalidate");
    }

    function syncPinState() {
      if (!pinInput) return;
      const raw = String(pinInput.value || "");
      const digits = raw.replace(/[^\d]/g, "").slice(0, 6);
      if (raw !== digits) {
        pinInput.value = digits;
      }
      if (submitBtn) submitBtn.disabled = !/^\d{6}$/.test(digits);
      try {
        pinInput.setCustomValidity("");
      } catch {}
    }

    logoutBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await sessionLogout();
      } finally {
        try {
          if (window.firebase?.auth) {
            initFirebaseOnce();
            await window.firebase.auth().signOut();
          }
        } catch (_) {}
        window.location.href = "/customer/login.php.html";
      }
    });

    pinInput?.addEventListener("input", syncPinState);
    pinInput?.addEventListener("change", syncPinState);
    pinInput?.addEventListener("paste", syncPinState);
    pinInput?.addEventListener("invalid", (e) => {
      e.preventDefault();
      try {
        pinInput?.setCustomValidity("");
      } catch {}
    });
    pinInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        try {
          pinInput?.setCustomValidity("");
        } catch {}
        form?.requestSubmit();
      }
    });
    syncPinState();

    submitBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        pinInput?.setCustomValidity("");
      } catch {}
      form?.requestSubmit();
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        pinInput?.setCustomValidity("");
      } catch {}
      const pin = String(pinInput?.value || "").trim();
      if (!/^\d{6}$/.test(pin)) {
        toast("warning", "Account PIN must be exactly 6 digits");
        syncPinState();
        return;
      }
      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          const originalLabel = submitBtn.innerHTML;
          submitBtn.innerHTML = 'Verifying <i class="fas fa-circle-notch fa-spin ms-2"></i>';
          try {
            await verifyAccountPin(pin);
          } finally {
            submitBtn.innerHTML = originalLabel;
          }
        } else {
          await verifyAccountPin(pin);
        }
        const url = new URL(window.location.href);
        const next = String(url.searchParams.get("next") || "").trim();
        if (next && /^\/[^/].*/.test(next)) {
          window.location.href = next;
        } else {
          window.location.href = "/customer/dashboard.php";
        }
      } catch (err) {
        syncPinState();
        modalError("Verification failed", err?.message || "Invalid Account PIN");
      }
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }
      if (me?.pinVerified) {
        window.location.href = "/customer/dashboard.php";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";
      if (nameEl) nameEl.textContent = name;
      if (initialsEl) initialsEl.textContent = initialsFromName(name);
      syncPinState();
    })();
  }

  function wireRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstname = document.getElementById("firstname")?.value?.trim() || "";
      const lastname = document.getElementById("lastname")?.value?.trim() || "";
      const phone = document.getElementById("phone")?.value?.trim() || "";
      const email = document.getElementById("email")?.value?.trim() || "";
      const country = document.getElementById("country")?.value?.trim() || "";
      const state = document.getElementById("state")?.value?.trim() || "";
      const city = document.getElementById("city")?.value?.trim() || "";
      const dob = document.getElementById("dob")?.value || "";
      const gender = document.getElementById("gender")?.value || "";
      const acctype = document.getElementById("acctype")?.value || "";
      const brname = document.getElementById("brname")?.value || "";
      const password = document.getElementById("accountpassword")?.value || "";
      const accountPin = document.getElementById("otp")?.value || "";
      const transferPin = document.getElementById("transactionpassword")?.value || "";

      if (!email || !password) {
        toast("warning", "Email and password are required");
        return;
      }

      try {
        initFirebaseOnce();
        const auth = window.firebase.auth();
        await auth.createUserWithEmailAndPassword(String(email || "").trim(), String(password || ""));
        const idToken = await auth.currentUser.getIdToken(true);
        await sessionLoginWithIdToken(idToken);
        await upsertProfile({
          firstname,
          lastname,
          phone,
          email,
          country,
          state,
          city,
          dob,
          gender,
          acctype,
          brname,
          accountPin,
          transferPin
        });
        window.location.href = "/customer/verify-pin.php";
      } catch (err) {
        modalError("Registration failed", err?.message || "Unable to create account");
      }
    });
  }

  function wireDashboardPage() {
    const root = document.getElementById("dashboardRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const name = me?.profile?.firstname
        ? `${me.profile.firstname} ${me?.profile?.lastname || ""}`.trim()
        : me?.email || me?.uid || "VanguardDoubleTrust";
      const liveBalance = balanceFromMe(me);

      setText("dashboardUserName", name);
      setText("dashboardUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));
      setText("balanceAmount", formatMoney(liveBalance));
      setText("savingAccountValue", formatMoney(liveBalance));
      setText("portfolioValue", "$0.00");
      setText("totalAssets", formatMoney(liveBalance));
    })();
  }

  function wireProfilePage() {
    const root = document.getElementById("profileRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";

      setText("profileUserName", name);
      setText("profileUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      setText("accountHolder", name);
      setText("emailAddress", me?.email || "--");
      setText("phoneNumber", me?.profile?.phone || "--");

      const opening = me?.account?.openingDate || me?.createdAt || me?.profile?.createdAt || me?.profile?.created_at || me?.profile?.created || null;
      setText("accountOpening", formatDate(opening) || formatDate(new Date()));
      setText("lastLogin", formatDateTime(me?.account?.lastLogin || new Date()));
      setText("gender", me?.profile?.gender || "--");

      const acct = accountNumberFromMe(me);
      setText("accountNumber", acct || "--");
    })();
  }

  function maskAccountNumber(num) {
    if (!num) return "";
    const s = String(num);
    const last4 = s.slice(-4);
    return `**** ${last4}`;
  }

  function formatMoney(amount) {
    const n = Number(amount);
    if (!Number.isFinite(n)) return "$0.00";
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  function accountNumberFromMe(me) {
    return me?.account?.accountNumber || me?.profile?.accountNumber || accountNumberFromUid(me?.uid);
  }

  function balanceFromMe(me) {
    const n = Number(me?.account?.balance);
    return Number.isFinite(n) && n >= 0 ? n : getBalanceUSD();
  }

  function safeStorageKey(name) {
    return `vt_${name}`;
  }

  function balanceKey() {
    return safeStorageKey("balance_usd");
  }

  function getBalanceUSD() {
    const b = Number(window.localStorage.getItem(balanceKey()));
    if (Number.isFinite(b) && b >= 0) return b;
    const init = 4365423;
    try {
      window.localStorage.setItem(balanceKey(), String(init));
    } catch {}
    return init;
  }

  function setBalanceUSD(value) {
    const v = Number(value);
    if (!Number.isFinite(v) || v < 0) return;
    try {
      window.localStorage.setItem(balanceKey(), String(v));
    } catch {}
  }

  function loadJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function transactionsKey() {
    return safeStorageKey("transactions");
  }

  function transfersKey() {
    return safeStorageKey("transfers");
  }

  function getTransfers() {
    const key = transfersKey();
    const t = loadJson(key, null);
    if (Array.isArray(t)) return t;
    const seed = [];
    saveJson(key, seed);
    return seed;
  }

  function addTransferHistory(tr) {
    if (!tr || typeof tr !== "object") return;
    const key = transfersKey();
    const list = Array.isArray(loadJson(key, null)) ? loadJson(key, []) : [];
    list.push(tr);
    saveJson(key, list);
  }

  function seedTransactionsIfMissing() {
    const key = transactionsKey();
    const existing = loadJson(key, null);
    if (Array.isArray(existing) && existing.length) return existing;
    const seed = [
      {
        at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 170).toISOString(),
        id: "#TRX003900122",
        type: "DEPOSIT",
        desc: "Deposit to Account",
        amount: 4365423,
        status: "Completed"
      }
    ];
    saveJson(key, seed);
    return seed;
  }

  function getTransactions() {
    const key = transactionsKey();
    const t = loadJson(key, null);
    if (Array.isArray(t) && t.length) return t;
    return seedTransactionsIfMissing();
  }

  function addTransaction(tx) {
    if (!tx || typeof tx !== "object") return;
    const key = transactionsKey();
    const list = Array.isArray(loadJson(key, null)) ? loadJson(key, []) : [];
    list.push(tx);
    saveJson(key, list);
  }

  function newTxId() {
    const n = Math.floor(100000000 + Math.random() * 900000000);
    return `#TRX${n}`;
  }

  function wireStatementPage() {
    const root = document.getElementById("statementRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const pageSizeEl = document.getElementById("stPageSize");
    const searchEl = document.getElementById("stSearch");
    const tbody = document.getElementById("stTbody");
    const info = document.getElementById("stInfo");

    const state = {
      all: getTransactions(),
      pageSize: Number(pageSizeEl?.value || 25),
      q: "",
      page: 1
    };

    function normalize(s) {
      return String(s || "").toLowerCase();
    }

    function filteredRows() {
      if (!state.q) return state.all;
      const q = normalize(state.q);
      return state.all.filter((t) => {
        return (
          normalize(t.at).includes(q) ||
          normalize(t.id).includes(q) ||
          normalize(t.type).includes(q) ||
          normalize(t.desc).includes(q) ||
          normalize(t.status).includes(q) ||
          normalize(t.amount).includes(q)
        );
      });
    }

    function render() {
      if (!tbody || !info) return;
      const rows = filteredRows();
      const total = rows.length;
      const pageSize = state.pageSize;
      const pages = Math.max(1, Math.ceil(total / pageSize));
      state.page = Math.min(state.page, pages);

      const start = (state.page - 1) * pageSize;
      const end = Math.min(start + pageSize, total);

      tbody.innerHTML = "";
      for (let i = start; i < end; i++) {
        const t = rows[i];
        const date = formatDateTime(t.at) || "--";
        const amount = formatMoney(t.amount);
        const signClass = Number(t.amount) >= 0 ? "pos" : "neg";
        const amountText = `${Number(t.amount) >= 0 ? "+" : "-"}${amount.replace("-", "")}`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${date}</td>
          <td>${t.id}</td>
          <td>${t.type}</td>
          <td>${t.desc}</td>
          <td class="st-amount ${signClass}">${amountText}</td>
          <td><span class="st-pill">${t.status}</span></td>
        `;
        tbody.appendChild(tr);
      }

      info.textContent = `Showing ${total ? start + 1 : 0} to ${end} of ${total} entries`;

      const pager = document.getElementById("stPager");
      if (pager) {
        pager.innerHTML = "";
        const prev = document.createElement("a");
        prev.href = "#";
        prev.textContent = "Previous";
        prev.style.fontWeight = "900";
        prev.style.color = state.page > 1 ? "#0B0F14" : "#94a3b8";
        prev.style.textDecoration = "none";
        prev.onclick = (e) => {
          e.preventDefault();
          if (state.page > 1) {
            state.page -= 1;
            render();
          }
        };

        const next = document.createElement("a");
        next.href = "#";
        next.textContent = "Next";
        next.style.fontWeight = "900";
        next.style.color = state.page < pages ? "#0B0F14" : "#94a3b8";
        next.style.textDecoration = "none";
        next.onclick = (e) => {
          e.preventDefault();
          if (state.page < pages) {
            state.page += 1;
            render();
          }
        };

        const mid = document.createElement("span");
        mid.textContent = ` Page ${state.page} of ${pages} `;
        mid.style.fontWeight = "900";
        mid.style.color = "#64748b";

        pager.appendChild(prev);
        pager.appendChild(mid);
        pager.appendChild(next);
      }
    }

    pageSizeEl?.addEventListener("change", () => {
      state.pageSize = Number(pageSizeEl.value || 25);
      state.page = 1;
      render();
    });

    searchEl?.addEventListener("input", () => {
      state.q = searchEl.value || "";
      state.page = 1;
      render();
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";
      const acct = accountNumberFromMe(me);

      setText("statementUserName", name);
      setText("statementUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      setText("stAccountHolder", name);
      setText("stAccountNumber", maskAccountNumber(acct) || "--");

      setText("stCurrentBalance", formatMoney(balanceFromMe(me)));

      render();
    })();
  }

  function wireInternationalTransferPage() {
    const root = document.getElementById("internationalRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const form = document.getElementById("internationalForm");
    const btn = document.getElementById("submitTransfer");
    const debitFrom = document.getElementById("debitFrom");
    const balEl = document.getElementById("internationalBalance");
    const helloLine = document.getElementById("helloLine");

    function setReady(ready) {
      if (!btn) return;
      if (ready) {
        btn.classList.add("ready");
        btn.disabled = false;
        btn.style.cursor = "pointer";
        return;
      }
      btn.classList.remove("ready");
      btn.disabled = true;
      btn.style.cursor = "not-allowed";
    }

    function getField(id) {
      return (document.getElementById(id)?.value || "").trim();
    }

    function validate() {
      const bankName = getField("bankName");
      const bankAddress = getField("bankAddress");
      const receiverName = getField("receiverName");
      const accountNumber = getField("accountNumber");
      const swift = getField("swift");
      const amount = Number(getField("amount"));
      const debit = (debitFrom?.value || "").trim();
      const ok =
        bankName &&
        bankAddress &&
        receiverName &&
        accountNumber &&
        swift &&
        Number.isFinite(amount) &&
        amount > 0 &&
        debit;
      setReady(Boolean(ok));
      return Boolean(ok);
    }

    form?.addEventListener("input", validate);
    debitFrom?.addEventListener("change", validate);

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        toast("warning", "Please complete all fields");
        return;
      }

      const receiverName = getField("receiverName");
      const bankName = getField("bankName");
      const bankAddress = getField("bankAddress");
      const swift = getField("swift");
      const accountNumber = getField("accountNumber");
      const amount = Number(getField("amount"));

      const balance = getBalanceUSD();
      if (amount > balance) {
        modalError("Insufficient balance", "Your available balance is not enough for this transfer.");
        return;
      }

      const doIt = async () => {
        setBalanceUSD(balance - amount);
        if (balEl) balEl.textContent = formatMoney(getBalanceUSD());

        const txId = newTxId();
        addTransaction({
          at: new Date().toISOString(),
          id: txId,
          type: "TRANSFER",
          desc: `International transfer to ${receiverName} (${bankName})`,
          amount: -Math.abs(amount),
          status: "Pending"
        });

        addTransferHistory({
          at: new Date().toISOString(),
          id: txId,
          beneficiary: receiverName,
          bank: bankName,
          bankAddress,
          swift,
          accountNumber,
          amount: -Math.abs(amount),
          status: "Pending"
        });

        toast("success", "Transfer submitted");
        form.reset();
        setReady(false);
      };

      if (hasSwal()) {
        const res = await window.Swal.fire({
          icon: "question",
          title: "Confirm transfer",
          text: `Send ${formatMoney(amount)} to ${receiverName}?`,
          showCancelButton: true,
          confirmButtonText: "Proceed",
          cancelButtonText: "Cancel"
        });
        if (!res.isConfirmed) return;
        await doIt();
        return;
      }

      if (!window.confirm(`Send ${formatMoney(amount)} to ${receiverName}?`)) return;
      await doIt();
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "Customer";

      setText("internationalUserName", name);
      setText("internationalUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));
      setText("helloLine", `Dear ${name}`);

      if (balEl) balEl.textContent = formatMoney(balanceFromMe(me));

      const acct = accountNumberFromMe(me) || "3623953156";
      if (debitFrom) {
        debitFrom.innerHTML = "";
        const opt = document.createElement("option");
        opt.value = acct;
        opt.textContent = acct;
        debitFrom.appendChild(opt);
      }

      const sec = document.getElementById("securityText");
      if (sec) {
        const a = Math.floor(Math.random() * 200) + 10;
        const b = Math.floor(Math.random() * 255);
        const c = Math.floor(Math.random() * 255);
        const d = Math.floor(Math.random() * 255);
        sec.textContent = `Security Alert: Your IP address ${a}.${b}.${c}.${d} has been logged for security monitoring. Please ensure all beneficiary details are correct before proceeding.`;
      }

      setReady(false);
      validate();
    })();
  }

  function wireTransferHistoryPage() {
    const root = document.getElementById("transferHistoryRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const pageSizeEl = document.getElementById("thPageSize");
    const searchEl = document.getElementById("thSearch");
    const tbody = document.getElementById("thTbody");
    const info = document.getElementById("thInfo");

    const state = {
      all: getTransfers(),
      pageSize: Number(pageSizeEl?.value || 10),
      q: "",
      page: 1
    };

    function normalize(s) {
      return String(s || "").toLowerCase();
    }

    function filteredRows() {
      if (!state.q) return state.all;
      const q = normalize(state.q);
      return state.all.filter((t) => {
        return (
          normalize(t.at).includes(q) ||
          normalize(t.id).includes(q) ||
          normalize(t.beneficiary).includes(q) ||
          normalize(t.bank).includes(q) ||
          normalize(t.amount).includes(q) ||
          normalize(t.status).includes(q)
        );
      });
    }

    function render() {
      if (!tbody || !info) return;
      state.all = getTransfers();
      const rows = filteredRows();
      const total = rows.length;
      const pageSize = state.pageSize;
      const pages = Math.max(1, Math.ceil(total / pageSize));
      state.page = Math.min(state.page, pages);

      const start = (state.page - 1) * pageSize;
      const end = Math.min(start + pageSize, total);

      tbody.innerHTML = "";
      if (!total) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="6" style="text-align:center;color:#64748b;font-weight:900">No data available in table</td>`;
        tbody.appendChild(tr);
      } else {
        for (let i = start; i < end; i++) {
          const t = rows[i];
          const date = formatDateTime(t.at) || "--";
          const amount = formatMoney(t.amount);
          const signClass = Number(t.amount) >= 0 ? "pos" : "neg";
          const amountText = `${Number(t.amount) >= 0 ? "+" : "-"}${amount.replace("-", "")}`;
          const status = t.status || "Pending";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${t.id || ""}</td>
            <td>${date}</td>
            <td>${t.beneficiary || ""}</td>
            <td>${t.bank || ""}</td>
            <td style="text-align:right" class="st-amount ${signClass}">${amountText}</td>
            <td><span class="th-pill">${status}</span></td>
          `;
          tbody.appendChild(tr);
        }
      }

      info.textContent = `Showing ${total ? start + 1 : 0} to ${end} of ${total} entries`;

      const pager = document.getElementById("thPager");
      if (pager) {
        pager.innerHTML = "";
        const prev = document.createElement("a");
        prev.href = "#";
        prev.textContent = "Previous";
        prev.style.fontWeight = "900";
        prev.style.color = state.page > 1 ? "#0B0F14" : "#94a3b8";
        prev.style.textDecoration = "none";
        prev.style.padding = "6px 10px";
        prev.style.border = "1px solid rgba(15,23,42,0.12)";
        prev.style.borderRadius = "8px";
        prev.onclick = (e) => {
          e.preventDefault();
          if (state.page > 1) {
            state.page -= 1;
            render();
          }
        };

        const next = document.createElement("a");
        next.href = "#";
        next.textContent = "Next";
        next.style.fontWeight = "900";
        next.style.color = state.page < pages ? "#0B0F14" : "#94a3b8";
        next.style.textDecoration = "none";
        next.style.padding = "6px 10px";
        next.style.border = "1px solid rgba(15,23,42,0.12)";
        next.style.borderRadius = "8px";
        next.onclick = (e) => {
          e.preventDefault();
          if (state.page < pages) {
            state.page += 1;
            render();
          }
        };

        pager.appendChild(prev);
        pager.appendChild(next);
      }
    }

    pageSizeEl?.addEventListener("change", () => {
      state.pageSize = Number(pageSizeEl.value || 10);
      state.page = 1;
      render();
    });

    searchEl?.addEventListener("input", () => {
      state.q = searchEl.value || "";
      state.page = 1;
      render();
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";

      setText("transferHistoryUserName", name);
      setText("transferHistoryUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      render();
    })();
  }

  function cardKey() {
    return safeStorageKey("card");
  }

  function seedCardIfMissing(name) {
    const existing = loadJson(cardKey(), null);
    if (existing && typeof existing === "object") return existing;
    const base = `5555${String(Math.floor(100000000000 + Math.random() * 900000000000))}`;
    const number = base.slice(0, 16);
    const now = new Date();
    const mm = String(((now.getMonth() + 1 + 8) % 12) || 12).padStart(2, "0");
    const yy = String((now.getFullYear() + 4) % 100).padStart(2, "0");
    const card = {
      number,
      holder: name || "VanguardDoubleTrust",
      expiry: `${mm}/${yy}`,
      type: "Visa Platinum",
      currency: "USD ($)",
      security: "3D Secure Enabled",
      usage: "Global Transactions"
    };
    saveJson(cardKey(), card);
    return card;
  }

  function formatCardNumber(num) {
    if (!num) return "**** **** **** ****";
    const s = String(num).replace(/\D+/g, "").slice(0, 16);
    return s.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }

  function maskCardNumber(num) {
    const s = String(num || "").replace(/\D+/g, "");
    const last4 = s.slice(-4);
    return `**** **** **** ${last4 || "****"}`;
  }

  function wireCardPage() {
    const root = document.getElementById("cardRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const copyBtn = document.getElementById("copyCardNumberBtn");
    const toggleBtn = document.getElementById("toggleCardBtn");

    const state = { reveal: false, card: null };

    function render() {
      if (!state.card) return;
      setText("cardNumberDisplay", state.reveal ? formatCardNumber(state.card.number) : maskCardNumber(state.card.number));
      setText("cardHolderDisplay", state.card.holder || "--");
      setText("cardExpiryDisplay", state.card.expiry || "--/--");
      setText("cardTypeValue", state.card.type || "Visa Platinum");
      setText("cardCurrencyValue", state.card.currency || "USD ($)");
      setText("cardSecurityValue", state.card.security || "3D Secure Enabled");
      setText("cardUsageValue", state.card.usage || "Global Transactions");
      if (toggleBtn) toggleBtn.textContent = state.reveal ? "Hide" : "Show";
    }

    copyBtn?.addEventListener("click", async () => {
      if (!state.card?.number) return;
      try {
        await navigator.clipboard.writeText(formatCardNumber(state.card.number).replace(/\s+/g, ""));
        toast("success", "Card number copied");
      } catch {
        toast("warning", "Unable to copy");
      }
    });

    toggleBtn?.addEventListener("click", () => {
      state.reveal = !state.reveal;
      render();
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";

      setText("cardUserName", name);
      setText("cardUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      state.card = seedCardIfMissing(name);
      render();
    })();
  }

  function pinHashKey() {
    return safeStorageKey("transaction_pin_hash");
  }

  async function sha256Hex(value) {
    const data = new TextEncoder().encode(String(value || ""));
    const digest = await crypto.subtle.digest("SHA-256", data);
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function setRuleState(liId, ok) {
    const el = document.getElementById(liId);
    if (!el) return;
    const iconWrap = el.querySelector("span");
    if (!iconWrap) return;
    if (ok) {
      iconWrap.className = "ok";
      iconWrap.innerHTML = '<i class="fas fa-check"></i>';
      return;
    }
    iconWrap.className = "bad";
    iconWrap.innerHTML = '<i class="fas fa-xmark"></i>';
  }

  function validatePinStrength(pin) {
    const s = String(pin || "");
    const okLen = s.length >= 8;
    const okUpper = /[A-Z]/.test(s);
    const okNum = /\d/.test(s);
    const okSpec = /[^A-Za-z0-9]/.test(s);
    setRuleState("ruleLen", okLen);
    setRuleState("ruleUpper", okUpper);
    setRuleState("ruleNum", okNum);
    setRuleState("ruleSpec", okSpec);
    return okLen && okUpper && okNum && okSpec;
  }

  function setPinButtonReady(ready) {
    const btn = document.getElementById("updatePinBtn");
    if (!btn) return;
    if (ready) {
      btn.classList.add("ready");
      btn.disabled = false;
      btn.style.cursor = "pointer";
      return;
    }
    btn.classList.remove("ready");
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  }

  function wirePinPage() {
    const root = document.getElementById("pinRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const form = document.getElementById("pinForm");
    const currentPin = document.getElementById("currentPin");
    const newPin = document.getElementById("newPin");
    const confirmPin = document.getElementById("confirmPin");

    root.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("[data-toggle-eye]");
      if (!btn) return;
      const id = btn.getAttribute("data-toggle-eye");
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) icon.className = input.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    });

    function validate() {
      const cur = (currentPin?.value || "").trim();
      const np = (newPin?.value || "").trim();
      const cp = (confirmPin?.value || "").trim();
      const okStrength = validatePinStrength(np);
      const okMatch = np && cp && np === cp;
      const ok = Boolean(cur && okStrength && okMatch);
      setPinButtonReady(ok);
      return ok;
    }

    newPin?.addEventListener("input", validate);
    confirmPin?.addEventListener("input", validate);
    currentPin?.addEventListener("input", validate);

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        toast("warning", "Please complete all fields correctly");
        return;
      }

      const cur = (currentPin?.value || "").trim();
      const np = (newPin?.value || "").trim();

      try {
        const existingHash = window.localStorage.getItem(pinHashKey());
        if (existingHash) {
          const curHash = await sha256Hex(cur);
          if (curHash !== existingHash) {
            modalError("Invalid PIN", "Current PIN is incorrect.");
            return;
          }
        }
      } catch {}

      if (hasSwal()) {
        const res = await window.Swal.fire({
          icon: "question",
          title: "Update PIN?",
          text: "This will replace your current transaction PIN.",
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: "Cancel"
        });
        if (!res.isConfirmed) return;
      } else if (!window.confirm("Update your transaction PIN?")) {
        return;
      }

      try {
        const hash = await sha256Hex(np);
        window.localStorage.setItem(pinHashKey(), hash);
      } catch {}

      try {
        await upsertProfile({ transferPin: np });
      } catch {}

      toast("success", "Transaction PIN updated");
      form.reset();
      validatePinStrength("");
      setPinButtonReady(false);
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";

      setText("pinUserName", name);
      setText("pinUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      if (!window.localStorage.getItem(pinHashKey())) {
        try {
          const seed = "Demo@1234";
          const hash = await sha256Hex(seed);
          window.localStorage.setItem(pinHashKey(), hash);
        } catch {}
      }

      validatePinStrength("");
      setPinButtonReady(false);
    })();
  }

  function passwordHashKey() {
    return safeStorageKey("login_password_hash");
  }

  async function tryFirebasePasswordUpdate(currentPassword, nextPassword) {
    try {
      if (!window.firebase?.auth) return false;
      initFirebaseOnce();
      const auth = window.firebase.auth();
      const user = auth?.currentUser;
      const email = user?.email;
      if (!user || !email) return false;
      const provider = window.firebase?.auth?.EmailAuthProvider;
      if (!provider?.credential) return false;
      const credential = provider.credential(email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(nextPassword);
      return true;
    } catch {
      return false;
    }
  }

  function validatePasswordStrength(pwd) {
    const s = String(pwd || "");
    const okLen = s.length >= 8;
    const okUpper = /[A-Z]/.test(s);
    const okNum = /\d/.test(s);
    const okSpec = /[^A-Za-z0-9]/.test(s);
    setRuleState("rulePwdLen", okLen);
    setRuleState("rulePwdUpper", okUpper);
    setRuleState("rulePwdNum", okNum);
    setRuleState("rulePwdSpec", okSpec);
    return okLen && okUpper && okNum && okSpec;
  }

  function setPasswordButtonReady(ready) {
    const btn = document.getElementById("updatePasswordBtn");
    if (!btn) return;
    if (ready) {
      btn.classList.add("ready");
      btn.disabled = false;
      btn.style.cursor = "pointer";
      return;
    }
    btn.classList.remove("ready");
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  }

  function wirePasswordPage() {
    const root = document.getElementById("passwordRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const form = document.getElementById("passwordForm");
    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    root.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("[data-toggle-eye]");
      if (!btn) return;
      const id = btn.getAttribute("data-toggle-eye");
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) icon.className = input.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    });

    function validate() {
      const cur = (currentPassword?.value || "").trim();
      const np = (newPassword?.value || "").trim();
      const cp = (confirmPassword?.value || "").trim();
      const okStrength = validatePasswordStrength(np);
      const okMatch = np && cp && np === cp;
      const ok = Boolean(cur && okStrength && okMatch);
      setPasswordButtonReady(ok);
      return ok;
    }

    newPassword?.addEventListener("input", validate);
    confirmPassword?.addEventListener("input", validate);
    currentPassword?.addEventListener("input", validate);

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        toast("warning", "Please complete all fields correctly");
        return;
      }

      const cur = (currentPassword?.value || "").trim();
      const np = (newPassword?.value || "").trim();

      try {
        const existingHash = window.localStorage.getItem(passwordHashKey());
        if (existingHash) {
          const curHash = await sha256Hex(cur);
          if (curHash !== existingHash) {
            modalError("Invalid Password", "Current password is incorrect.");
            return;
          }
        }
      } catch {}

      if (hasSwal()) {
        const res = await window.Swal.fire({
          icon: "question",
          title: "Update Password?",
          text: "This will replace your login password.",
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: "Cancel"
        });
        if (!res.isConfirmed) return;
      } else if (!window.confirm("Update your login password?")) {
        return;
      }

      const firebaseOk = await tryFirebasePasswordUpdate(cur, np);

      try {
        const hash = await sha256Hex(np);
        window.localStorage.setItem(passwordHashKey(), hash);
      } catch {}

      toast("success", firebaseOk ? "Password updated" : "Password updated");
      form.reset();
      validatePasswordStrength("");
      setPasswordButtonReady(false);
    });

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";

      setText("passwordUserName", name);
      setText("passwordUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      if (!window.localStorage.getItem(passwordHashKey())) {
        try {
          const seed = "Demo@1234";
          const hash = await sha256Hex(seed);
          window.localStorage.setItem(passwordHashKey(), hash);
        } catch {}
      }

      validatePasswordStrength("");
      setPasswordButtonReady(false);
    })();
  }

  function wireStocksPage() {
    const root = document.getElementById("stocksRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    const mkPath = document.getElementById("mkPath");
    const mkArea = document.getElementById("mkArea");
    const liveMarket = document.getElementById("liveMarket");
    const pfBody = document.getElementById("pfBody");
    const pfEmpty = document.getElementById("pfEmpty");
    const hisBody = document.getElementById("hisBody");
    const hisEmpty = document.getElementById("hisEmpty");

    const prices = {
      AAPL: 338.19,
      TSLA: 298.32,
      NVDA: 190.01,
      AMZN: 226.65,
      GOOGL: 336.71
    };

    const assets = [
      { sym: "AAPL", name: "Apple Inc.", logo: "" },
      { sym: "TSLA", name: "Tesla, Inc.", logo: "T" },
      { sym: "NVDA", name: "NVIDIA Corp", logo: "N" },
      { sym: "AMZN", name: "Amazon.com", logo: "a" },
      { sym: "GOOGL", name: "Alphabet Inc.", logo: "G" }
    ];

    const portfolioKey = safeStorageKey("portfolio");
    const historyKey = safeStorageKey("stock_history");

    function getBalance() {
      return getBalanceUSD();
    }

    function setBalance(b) {
      setBalanceUSD(b);
    }

    function loadPortfolio() {
      return loadJson(portfolioKey, {});
    }

    function savePortfolio(p) {
      saveJson(portfolioKey, p);
    }

    function loadHistory() {
      return loadJson(historyKey, []);
    }

    function saveHistory(h) {
      saveJson(historyKey, h);
    }

    function toChartPath(series) {
      const w = 1000;
      const h = 260;
      const padX = 20;
      const padY = 30;
      const min = Math.min.apply(null, series);
      const max = Math.max.apply(null, series);
      const range = max - min || 1;
      const step = (w - padX * 2) / (series.length - 1);

      let d = "";
      for (let i = 0; i < series.length; i++) {
        const x = padX + step * i;
        const y = padY + ((max - series[i]) / range) * (h - padY * 2);
        d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
      }
      return d;
    }

    function toAreaPath(lineD) {
      return `${lineD} L1000,260 L0,260 Z`;
    }

    let chart = [];
    for (let i = 0; i < 60; i++) {
      const base = 4200;
      const t = i / 6;
      chart.push(base + Math.sin(t) * 55 + Math.sin(t / 2) * 30 + i * 3.2);
    }

    function rerenderChart() {
      if (!mkPath || !mkArea) return;
      const d = toChartPath(chart);
      mkPath.setAttribute("d", d);
      mkArea.setAttribute("d", toAreaPath(d));
    }

    function renderMarket() {
      if (!liveMarket) return;
      liveMarket.innerHTML = "";
      assets.forEach((a) => {
        const row = document.createElement("div");
        row.className = "mk-row";
        const price = prices[a.sym] ?? 0;
        row.innerHTML = `
          <div class="l">
            <div class="logo">${a.logo}</div>
            <div class="txt">
              <p class="sym">${a.sym}</p>
              <p class="name">${a.name}</p>
            </div>
          </div>
          <div class="r">
            <div class="mk-price" data-price="${a.sym}">${formatMoney(price)}</div>
            <button class="mk-btn" type="button" data-buy="${a.sym}">Buy</button>
          </div>
        `;
        liveMarket.appendChild(row);
      });
    }

    function renderPortfolio() {
      const pf = loadPortfolio();
      const entries = Object.keys(pf)
        .sort()
        .map((sym) => ({ sym, qty: Number(pf[sym]?.qty || 0) }))
        .filter((x) => x.qty > 0);

      if (pfBody) pfBody.innerHTML = "";
      if (pfEmpty) pfEmpty.style.display = entries.length ? "none" : "block";

      if (!pfBody) return;
      entries.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="text-align:left">${p.sym}</td>
          <td style="text-align:right">${p.qty}</td>
          <td style="text-align:right">
            <button class="mk-btn" type="button" data-sell="${p.sym}" style="background:#0f172a">Sell</button>
          </td>
        `;
        pfBody.appendChild(tr);
      });
    }

    function renderHistory() {
      const h = loadHistory().slice().reverse();
      if (hisBody) hisBody.innerHTML = "";
      if (hisEmpty) hisEmpty.style.display = h.length ? "none" : "block";
      if (!hisBody) return;

      h.slice(0, 12).forEach((x) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="text-align:left">${x.type}</td>
          <td style="text-align:left">${x.sym}</td>
          <td style="text-align:right">${x.qty}</td>
          <td style="text-align:right">${formatMoney(x.total)}</td>
          <td style="text-align:left">${formatDateTime(x.at) || ""}</td>
        `;
        hisBody.appendChild(tr);
      });
    }

    function renderBalance() {
      setText("stocksBalance", formatMoney(getBalance()));
    }

    function commitTrade(type, sym, qty) {
      const q = Number(qty);
      if (!Number.isFinite(q) || q <= 0) return false;
      const price = Number(prices[sym] || 0);
      if (!Number.isFinite(price) || price <= 0) return false;
      const total = price * q;

      const bal = getBalance();
      const pf = loadPortfolio();
      const cur = Number(pf[sym]?.qty || 0);

      if (type === "BUY") {
        if (bal < total) {
          modalError("Insufficient balance", "Your balance is not enough for this trade.");
          return false;
        }
        pf[sym] = { qty: cur + q };
        setBalance(bal - total);
      } else {
        if (cur < q) {
          modalError("Not enough shares", "You do not have enough shares to sell.");
          return false;
        }
        pf[sym] = { qty: cur - q };
        setBalance(bal + total);
      }

      savePortfolio(pf);
      const h = loadHistory();
      h.push({ type, sym, qty: q, total, at: new Date().toISOString() });
      saveHistory(h);
      return true;
    }

    function wireEvents() {
      root.addEventListener("click", (e) => {
        const el = e.target;
        const symBuy = el?.getAttribute?.("data-buy");
        const symSell = el?.getAttribute?.("data-sell");
        if (symBuy) {
          const qty = window.prompt(`Buy ${symBuy} - quantity?`, "1");
          if (!qty) return;
          if (commitTrade("BUY", symBuy, qty)) {
            renderBalance();
            renderPortfolio();
            renderHistory();
          }
          return;
        }
        if (symSell) {
          const qty = window.prompt(`Sell ${symSell} - quantity?`, "1");
          if (!qty) return;
          if (commitTrade("SELL", symSell, qty)) {
            renderBalance();
            renderPortfolio();
            renderHistory();
          }
        }
      });
    }

    function tick() {
      assets.forEach((a) => {
        const p = Number(prices[a.sym] || 0);
        const drift = (Math.random() - 0.5) * 0.012;
        const np = Math.max(1, p * (1 + drift));
        prices[a.sym] = Math.round(np * 100) / 100;
      });

      const last = chart[chart.length - 1];
      const drift = (Math.random() - 0.35) * 8;
      chart.push(last + drift);
      if (chart.length > 60) chart.shift();

      rerenderChart();

      const priceEls = root.querySelectorAll("[data-price]");
      priceEls.forEach((n) => {
        const s = n.getAttribute("data-price");
        if (!s) return;
        n.textContent = formatMoney(prices[s] ?? 0);
      });
    }

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }

      const firstname = me?.profile?.firstname || "";
      const lastname = me?.profile?.lastname || "";
      const name = firstname || lastname ? `${firstname} ${lastname}`.trim() : me?.email || me?.uid || "VanguardDoubleTrust";

      setText("stocksUserName", name);
      setText("stocksUserEmail", me?.email || "");
      setText("avatarInitials", initialsFromName(name));

      rerenderChart();
      renderMarket();
      renderBalance();
      renderPortfolio();
      renderHistory();
      wireEvents();

      window.setInterval(tick, 3000);
      window.setTimeout(tick, 1200);
    })();
  }

  function wireAccountPage() {
    const root = document.getElementById("accountRoot");
    if (!root) return;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await sessionLogout();
        } finally {
          try {
            if (window.firebase?.auth) {
              initFirebaseOnce();
              await window.firebase.auth().signOut();
            }
          } catch (_) {}
          window.location.href = "/customer/login.php.html";
        }
      });
    }

    (async () => {
      const me = await getMe();
      if (!me) {
        window.location.href = "/customer/login.php.html";
        return;
      }
      const el = document.getElementById("meJson");
      if (el) el.textContent = JSON.stringify(me, null, 2);
      const name = me?.profile?.firstname || me?.email || me?.uid;
      const title = document.getElementById("accountTitle");
      if (title && name) title.textContent = `Welcome, ${name}`;
    })();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireLoginForm();
    wireRegisterForm();
    wirePinVerifyPage();
    wireDashboardPage();
    wireProfilePage();
    wireStatementPage();
    wireInternationalTransferPage();
    wireTransferHistoryPage();
    wireCardPage();
    wirePinPage();
    wirePasswordPage();
    wireStocksPage();
    wireAccountPage();
  });
})();
