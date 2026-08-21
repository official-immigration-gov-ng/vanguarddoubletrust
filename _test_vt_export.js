const vm = require("vm");
const fs = require("fs");
const path = require("path");
const filePath = process.argv[2] || path.join(__dirname, "customer", "assets", "js", "customer-i18n.js");
const code = fs.readFileSync(filePath, "utf8");
const sandbox = {
  window: {
    document: {
      getElementById: function () { return null; },
      createElement: function () {
        return {
          style: {},
          appendChild: function () {},
          removeChild: function () {},
          remove: function () {},
          classList: { add: function () {}, remove: function () {}, contains: function () { return false; } },
          addEventListener: function () {},
          removeEventListener: function () {},
          body: { appendChild: function () {}, insertBefore: function () {}, firstChild: null, classList: { add: function () {}, remove: function () {}, contains: function () { return false; } } },
          querySelector: function () { return null; },
          querySelectorAll: function () { return []; },
          closest: function () { return null; },
          getBoundingClientRect: function () { return { top: 0, left: 0 }; },
          set textContent(v) {},
          set innerHTML(v) {},
          set src(v) {},
          set alt(v) {},
          addEventListener: function () {},
          removeEventListener: function () {},
          submit: function () {},
          preventDefault: function () {},
          dispatchEvent: function () {},
          focus: function () {},
          blur: function () {},
          click: function () {},
          getAttribute: function () { return null; },
          setAttribute: function () {},
          removeAttribute: function () {},
          hasAttribute: function () { return false; },
          getElementsByTagName: function () { return []; },
          getElementsByClassName: function () { return []; }
        };
      },
      readyState: "complete",
      documentElement: { appendChild: function () {}, removeChild: function () {}, classList: { add: function () {}, remove: function () {}, contains: function () { return false; } } },
      body: {
        appendChild: function () {},
        insertBefore: function () {},
        firstChild: null,
        classList: { add: function () {}, remove: function () {}, contains: function () { return false; } },
        style: {},
        addEventListener: function () {},
        removeEventListener: function () {},
        querySelectorAll: function () { return []; },
        querySelector: function () { return null; }
      }
    },
    location: {
      pathname: "/_dev/customer/dashboard.php",
      search: "?vt=reset&force_gate=1",
      hostname: "localhost",
      protocol: "http:",
      host: "localhost:3002",
      href: "http://localhost:3002/_dev/customer/dashboard.php?vt=reset&force_gate=1"
    },
    VT: null,
    localStorage: {
      getItem: function () { return null; },
      setItem: function () {},
      removeItem: function () {}
    },
    sessionStorage: {
      getItem: function () { return null; },
      setItem: function () {},
      removeItem: function () {}
    },
    console: { log: function () {}, error: function () {}, warn: function () {}, info: function () {} },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Date: Date,
    Math: Math,
    JSON: JSON,
    Object: Object,
    Array: Array,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    parseInt: parseInt,
    parseFloat: parseFloat,
    navigator: { userAgent: "node", language: "en" },
    matchMedia: function () {
      return { matches: false, addListener: function () {}, removeListener: function () {}, addEventListener: function () {}, removeEventListener: function () {} };
    },
    fetch: function () {
      return Promise.resolve({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: { get: function () { return ""; } },
        json: function () { return Promise.resolve({ error: "unauthorized" }); },
        text: function () { return Promise.resolve("{\"error\":\"unauthorized\"}"); },
        blob: function () { return Promise.resolve(null); }
      });
    },
    firebase: null,
    addEventListener: function () {},
    removeEventListener: function () {},
    Image: function () {},
    FileReader: function () {},
    FormData: function () { this.entries = function () { return []; }; this.append = function () {}; },
    URLSearchParams,
    Promise,
    crypto: {
      getRandomValues: function (arr) { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256); return arr; }
    },
    history: { pushState: function () {}, replaceState: function () {}, back: function () {}, forward: function () {} },
    File: function () {},
    Blob: function () {},
    CustomEvent: function () {}
  },
  module: { exports: {} },
  define: null,
  self: null,
  require,
  Buffer,
  process,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  console,
  __dirname,
  __filename,
  exports: {}
};
sandbox.self = sandbox.window;
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.root = sandbox;
const ctx = vm.createContext(sandbox);
try {
  vm.runInContext(code, ctx, { timeout: 5000, displayErrors: true });
} catch (e) {
  console.log("VM ERROR: " + String(e && e.message || e));
  console.log("STACK: " + String(e && e.stack || "").substring(0, 500));
  process.exit(1);
}
const VT = sandbox.window.VT;
const mod = sandbox.module.exports;
const result = {
  VTExists: !!VT,
  I18NExists: !!(VT && VT.I18N),
  UIExists: !!(VT && VT.UI),
  bootstrapCustomerPage_type: (VT && VT.UI) ? typeof VT.UI.bootstrapCustomerPage : "no-UI-object",
  UI_keys: (VT && VT.UI) ? Object.keys(VT.UI).sort() : null,
  toast_type: (VT && VT.UI) ? typeof VT.UI.toast : "no-UI",
  safeShowKycGate_type: (VT && VT.UI) ? typeof VT.UI.showKycGate : "no-UI",
  applyAvatarImages_type: (VT && VT.UI) ? typeof VT.UI.applyAvatarImages : "no-UI",
  moduleExports_type: typeof mod,
  moduleExports_VT_exists: !!(mod && typeof mod === "object" && mod !== null && mod.UI),
  moduleExports_UI_bootstrap_type: (mod && mod.UI) ? typeof mod.UI.bootstrapCustomerPage : "no-mod-UI",
  moduleExports_keys: (mod && typeof mod === "object" && mod !== null) ? Object.keys(mod).sort() : null,
  root_VT: !!(sandbox.root && sandbox.root.VT),
  self_VT: !!(sandbox.self && sandbox.self.VT)
};
console.log(JSON.stringify(result, null, 2));
