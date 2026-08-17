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
      html { filter: grayscale(1) !important; -webkit-filter: grayscale(1) !important; }
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
