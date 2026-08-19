<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Verify Identity - VanguardDoubleTrust</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta content="Verify your account pin to proceed." name="description" />

    <link rel="icon" type="image/svg+xml" href="/assets/images/brand/favicon_VanguardDoubleTrust.svg" />
    <link rel="icon" type="image/png" href="/assets/images/brand/favicon_1776155007.png" />
    <link href="../css2-1?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link href="../ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    <link href="assets/css/bootstrap.min.css" id="bootstrap-style" rel="stylesheet" type="text/css" />
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" />
    <script src="../npm/sweetalert2%4011"></script>

    <style>
      :root {
        color-scheme: dark;
        --vt-primary: #e8c367;
        --vt-primary-2: #ffffff;
        --vt-bg: #0a0f1a;
        --vt-bg-2: #10172a;
        --vt-bg-3: #121a2d;
        --vt-card-bg: #10172a;
        --vt-card: #10172a;
        --vt-card-2: #121a2d;
        --vt-text: #ffffff;
        --vt-text-2: #cdd5e3;
        --vt-muted: #8a95ac;
        --vt-border: rgba(255,255,255,0.10);
        --vt-line: rgba(255,255,255,0.08);
        --vt-success: #6ee7a7;
        --vt-ok: #6ee7a7;
        --vt-danger: #ffffff;
        --vt-warn: #e8c367;
        --vt-info: #ffffff;
        --vt-accent: #e8c367;
        --vt-accent-2: #ffffff;
        --vt-avatar-bg: #121a2d;
        --vt-input-bg: #000000;
        --vt-input-fg: #ffffff;
        --vt-shadow: 0 18px 42px -18px rgba(0,0,0,0.55);
        --primary-color: #e8c367;
        --secondary-color: #10172a;
        --dark-bg-color: #0a0f1a;
        --light-color: #ffffff;
        --white-color: #ffffff;
        --dark-color: #0a0f1a;
        --light-bg: #10172a;
        --gray-bg: #121a2d;
        --text-dark: #ffffff;
        --text-light: #0a0f1a;
        --border-color: rgba(255,255,255,0.10);
      }
      button, .btn, [class*="button"], [role="button"],
      input[type="submit"], input[type="button"],
      a.btn, a[class*="-btn"] {
        background: var(--vt-primary) !important;
        background-color: var(--vt-primary) !important;
        color: #0a0f1a !important;
        border-color: var(--vt-primary) !important;
      }
      button.btn-secondary, .btn-secondary, .btn-outline, .btn-outline-primary,
      button.outline, .button.secondary, [class*="outline"] {
        background: transparent !important;
        background-color: transparent !important;
        color: var(--vt-primary) !important;
        border-color: var(--vt-primary) !important;
      }
      * { border-color: rgba(255,255,255,0.10) !important; }
      html, body { background: var(--vt-bg); color: var(--vt-text); }
      :root {
        --vt-primary: #0b0f14;
        --vt-primary-2: #0f172a;
        --vt-bg: #f6f8fc;
        --vt-card: #ffffff;
        --vt-text: #0f172a;
        --vt-muted: #64748b;
        --vt-border: rgba(15, 23, 42, 0.1);
        --vt-shadow: 0 24px 60px -24px rgba(2, 6, 23, 0.35);
        --vt-radius: 20px;
      }

      body {
        font-family: "Plus Jakarta Sans", sans-serif;
        background: var(--vt-bg);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .vt-card {
        width: min(560px, 100%);
        background: var(--vt-card);
        border-radius: var(--vt-radius);
        border: 1px solid var(--vt-border);
        box-shadow: var(--vt-shadow);
        padding: 34px 34px 28px;
      }

      .vt-avatar {
        width: 62px;
        height: 62px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--vt-primary), var(--vt-primary-2));
        display: grid;
        place-items: center;
        color: #fff;
        font-weight: 900;
        letter-spacing: 0.06em;
        margin: 0 auto 10px;
      }

      .vt-title {
        text-align: center;
        font-weight: 900;
        font-size: 18px;
        color: var(--vt-text);
        margin: 0;
      }

      .vt-sub {
        text-align: center;
        margin: 4px 0 22px;
        color: var(--vt-muted);
        font-weight: 600;
        font-size: 13px;
      }

      .vt-label {
        font-weight: 800;
        font-size: 12px;
        color: var(--vt-text);
        margin-bottom: 8px;
      }

      .vt-input {
        border-radius: 14px;
        padding: 14px 16px;
        border: 1px solid rgba(15, 23, 42, 0.14);
        height: 52px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-align: center;
      }

      .vt-input:focus {
        border-color: rgba(11, 15, 20, 0.45);
        box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.12);
      }

      .vt-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--vt-primary), var(--vt-primary-2));
        border: none;
        border-radius: 14px;
        padding: 14px 16px;
        font-weight: 900;
        box-shadow: 0 18px 40px -18px rgba(11, 15, 20, 0.45);
      }

      .vt-btn:hover {
        filter: brightness(1.02);
      }

      .vt-footer {
        text-align: center;
        margin-top: 14px;
        color: var(--vt-muted);
        font-weight: 700;
        font-size: 12px;
      }

      .vt-link {
        color: var(--vt-primary);
        text-decoration: none;
        font-weight: 900;
      }
      /* ===== BRIGHT READABLE BUTTONS (LOGOUT / PROCEED / DANGER / ACTION) ===== */
      .tf-btn, #submitTransfer, [id*="proceed"], [class*="proceed"], [class*="confirmBtn"],
      button.confirm, .swal2-confirm, .btn-primary,
      button[onclick*="proceed"], button[onclick*="submit"] {
        background: #2563eb !important;
        background-color: #2563eb !important;
        background-image: none !important;
        color: #ffffff !important;
        border-color: #2563eb !important;
        font-weight: 800 !important;
      }
      .tf-btn:hover, #submitTransfer:hover, [id*="proceed"]:hover, [class*="confirmBtn"]:hover,
      .swal2-confirm:hover, .btn-primary:hover {
        background-color: #1d4ed8 !important;
        border-color: #1d4ed8 !important;
        color: #ffffff !important;
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35) !important;
      }
      .btn-logout, #logoutBtn, #logoutBtn2, #quickLogoutBtn, #adminLogoutBtn,
      #pinVerifyLogout, [id*="Logout"], [class*="logout"], [class*="Logout"],
      .btn-danger, .btn.btn-dark, button.btn-dark, [class*="cancelBtn"],
      .swal2-cancel, button.cancel, [class*="cancel"] {
        background: #dc2626 !important;
        background-color: #dc2626 !important;
        background-image: none !important;
        color: #ffffff !important;
        border-color: #dc2626 !important;
        font-weight: 800 !important;
      }
      .btn-logout:hover, #logoutBtn:hover, #logoutBtn2:hover,
      #quickLogoutBtn:hover, #adminLogoutBtn:hover, #pinVerifyLogout:hover,
      .btn-danger:hover, .btn.btn-dark:hover, .swal2-cancel:hover {
        background-color: #b91c1c !important;
        border-color: #b91c1c !important;
        color: #ffffff !important;
        box-shadow: 0 6px 20px rgba(220, 38, 38, 0.35) !important;
      }
      .vt-action {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #0a0f1a !important;
        border-color: rgba(255,255,255,0.30) !important;
        font-weight: 800 !important;
      }
      .vt-action i {
        color: #2563eb !important;
      }
      .vt-action:hover {
        background: #f8fafc !important;
        color: #0a0f1a !important;
        box-shadow: 0 14px 32px -20px rgba(0,0,0,0.5) !important;
      }
    </style>
  </head>

  <body>
    <div class="vt-card" id="pinVerifyRoot">
      <div class="vt-avatar" id="avatarInitials">VT</div>
      <h1 class="vt-title" id="pinVerifyName">Verify Identity</h1>
      <div class="vt-sub">Verify your identity to proceed.</div>

      <form id="pinVerifyForm" autocomplete="off">
        <div class="mb-3">
          <div class="vt-label">Account PIN (6-Digits)</div>
          <input
            class="form-control vt-input"
            inputmode="numeric"
            pattern="\d{6}"
            maxlength="6"
            id="accountPin"
            type="password"
            placeholder="••••••"
            autocomplete="off"
            spellcheck="false"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary vt-btn" id="verifyPinBtn" disabled>
          Verify Identity <i class="fas fa-shield-check ms-2"></i>
        </button>
      </form>

      <div class="vt-footer">
        <a href="#" class="vt-link" id="pinVerifyLogout">Sign Out</a>
        <div class="mt-3 small text-muted">&copy; 2026 VanguardDoubleTrust. All rights reserved.</div>
      </div>
    </div>

    <script src="assets/libs/jquery/jquery.min.js"></script>
    <script src="../assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/libs/simplebar/simplebar.min.js"></script>
    <script src="assets/libs/node-waves/waves.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
    <script src="assets/js/runtime-config.js"></script>
    <script src="firebase-config.js"></script>
    <script src="assets/js/auth-session.js"></script>
  </body>
</html>
