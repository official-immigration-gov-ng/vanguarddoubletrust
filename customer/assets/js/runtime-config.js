(() => {
  const meta = document.querySelector('meta[name="vt-api-base"]');
  const metaBase = meta ? meta.getAttribute("content") : "";
  const rawBase = String(window.__VT_API_BASE__ || metaBase || "").trim();
  const normalize = (s) => String(s || "").trim().replace(/\/+$/, "");

  const saved = (() => {
    try {
      return window.localStorage.getItem("vt_api_base") || "";
    } catch {
      return "";
    }
  })();

  const base = normalize(rawBase || saved);
  if (base) {
    window.__VT_API_BASE__ = base;
    try {
      window.localStorage.setItem("vt_api_base", base);
    } catch {}
  }

  window.__FIREBASE_CONFIG__ =
    window.__FIREBASE_CONFIG__ ||
    {
      apiKey: "AIzaSyBtZ2Ik0S0MNISFvRQa0sZdIQiEubNG1U0",
      authDomain: "vanguardtrust-fdc63.firebaseapp.com",
      projectId: "vanguardtrust-fdc63",
      storageBucket: "vanguardtrust-fdc63.firebasestorage.app",
      messagingSenderId: "893262930775",
      appId: "1:893262930775:web:b4dc98cea83ab8fbb05412",
      measurementId: "G-RWTDFTQYR9"
    };
})();
