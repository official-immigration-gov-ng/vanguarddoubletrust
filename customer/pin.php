<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Security Settings - VanguardTrust</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta content="Manage your transaction security pin." name="description" />

    <link rel="icon" type="image/svg+xml" href="/assets/images/brand/favicon_vanguardtrust.svg" />
    <link rel="icon" type="image/png" href="/assets/images/brand/favicon_1776155007.png" />
    <link
      href="../css2-1?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link href="../ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    <link href="assets/css/bootstrap.min.css" id="bootstrap-style" rel="stylesheet" type="text/css" />
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" />

    <style>
      :root {
        --vt-primary: #003399;
        --vt-primary-2: #005d9d;
        --vt-bg: #f6f8fc;
        --vt-card: #ffffff;
        --vt-text: #0f172a;
        --vt-muted: #64748b;
        --vt-border: rgba(15, 23, 42, 0.08);
        --vt-shadow: 0 18px 42px -18px rgba(2, 6, 23, 0.25);
        --vt-radius: 18px;
      }

      body {
        font-family: "Plus Jakarta Sans", sans-serif;
        background: var(--vt-bg);
        color: var(--vt-text);
      }

      .vt-shell {
        min-height: 100vh;
        display: flex;
      }

      .vt-sidebar {
        width: 280px;
        background: #fff;
        border-right: 1px solid var(--vt-border);
        padding: 18px 14px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: auto;
      }

      .vt-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px 16px;
      }

      .vt-brand .logo {
        width: 40px;
        height: 40px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--vt-primary), var(--vt-primary-2));
        display: grid;
        place-items: center;
        color: #fff;
        font-weight: 800;
        letter-spacing: 0.5px;
      }

      .vt-brand .title {
        line-height: 1.1;
      }

      .vt-brand .title strong {
        display: block;
        font-size: 14px;
        font-weight: 800;
      }

      .vt-brand .title span {
        display: block;
        font-size: 12px;
        color: var(--vt-muted);
        font-weight: 600;
      }

      .vt-section-label {
        padding: 16px 12px 8px;
        font-size: 11px;
        letter-spacing: 0.12em;
        color: var(--vt-muted);
        font-weight: 800;
      }

      .vt-nav {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 0 6px;
      }

      .vt-nav a {
        text-decoration: none;
        color: var(--vt-text);
        border-radius: 14px;
        padding: 11px 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 13px;
      }

      .vt-nav a .ico {
        width: 32px;
        height: 32px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: rgba(0, 51, 153, 0.08);
        color: var(--vt-primary);
        flex: 0 0 auto;
      }

      .vt-nav a.active {
        background: linear-gradient(135deg, rgba(0, 51, 153, 0.12), rgba(0, 93, 157, 0.08));
        border: 1px solid rgba(0, 51, 153, 0.18);
      }

      .vt-nav a:hover {
        background: rgba(15, 23, 42, 0.04);
      }

      .vt-main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .vt-topbar {
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid var(--vt-border);
        background: rgba(246, 248, 252, 0.7);
        backdrop-filter: blur(16px);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .vt-top-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .vt-burger {
        border: 1px solid var(--vt-border);
        background: #fff;
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        box-shadow: 0 12px 24px -18px rgba(2, 6, 23, 0.35);
      }

      .vt-search {
        width: min(520px, 58vw);
        background: #fff;
        border: 1px solid var(--vt-border);
        border-radius: 16px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .vt-search input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 13px;
        font-weight: 600;
        color: var(--vt-text);
        background: transparent;
      }

      .vt-search i {
        color: var(--vt-muted);
      }

      .vt-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        background: #fff;
        border: 1px solid var(--vt-border);
        border-radius: 16px;
      }

      .vt-user .avatar {
        width: 34px;
        height: 34px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(0, 51, 153, 0.18), rgba(0, 93, 157, 0.12));
        border: 1px solid rgba(0, 51, 153, 0.18);
        display: grid;
        place-items: center;
        color: var(--vt-primary);
        font-weight: 900;
        font-size: 12px;
      }

      .vt-user .meta {
        line-height: 1.1;
        max-width: 240px;
      }

      .vt-user .meta strong {
        display: block;
        font-size: 13px;
        font-weight: 800;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .vt-user .meta span {
        display: block;
        font-size: 11px;
        color: var(--vt-muted);
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .vt-content {
        padding: 18px;
      }

      .vt-page-title h1 {
        font-size: 20px;
        font-weight: 900;
        margin: 0;
      }

      .vt-page-title p {
        margin: 4px 0 0;
        color: var(--vt-muted);
        font-weight: 700;
        font-size: 12px;
      }

      .pin-wrap {
        margin-top: 14px;
        display: grid;
        place-items: center;
      }

      .pin-card {
        width: min(760px, 100%);
        background: #fff;
        border: 1px solid var(--vt-border);
        border-radius: 18px;
        box-shadow: var(--vt-shadow);
        padding: 18px;
      }

      .pin-hero {
        text-align: center;
        padding: 12px 8px 16px;
      }

      .pin-icon {
        width: 54px;
        height: 54px;
        border-radius: 18px;
        margin: 0 auto 12px;
        background: rgba(0, 51, 153, 0.08);
        border: 1px solid rgba(0, 51, 153, 0.12);
        color: var(--vt-primary);
        display: grid;
        place-items: center;
      }

      .pin-hero h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 900;
      }

      .pin-hero p {
        margin: 6px 0 0;
        font-size: 12px;
        font-weight: 800;
        color: var(--vt-muted);
      }

      .pin-form {
        display: grid;
        gap: 12px;
        margin-top: 10px;
      }

      .pin-field label {
        display: block;
        font-size: 10px;
        letter-spacing: 0.1em;
        font-weight: 900;
        color: var(--vt-muted);
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .pin-input {
        position: relative;
      }

      .pin-input input {
        width: 100%;
        border: 1px solid var(--vt-border);
        border-radius: 12px;
        padding: 12px 44px 12px 12px;
        outline: none;
        font-weight: 800;
        font-size: 12px;
      }

      .pin-eye {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border-radius: 12px;
        border: 1px solid rgba(15, 23, 42, 0.1);
        background: #fff;
        display: grid;
        place-items: center;
        color: #64748b;
      }

      .pin-eye:hover {
        color: var(--vt-primary);
        border-color: rgba(0, 51, 153, 0.18);
      }

      .pin-rules {
        margin: 4px 0 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 6px;
        color: var(--vt-muted);
        font-weight: 800;
        font-size: 12px;
      }

      .pin-rules li {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pin-rules .ok {
        color: #16a34a;
      }

      .pin-rules .bad {
        color: #dc2626;
      }

      .pin-actions {
        margin-top: 6px;
      }

      .pin-btn {
        width: 100%;
        border: none;
        border-radius: 12px;
        padding: 14px 12px;
        font-weight: 900;
        font-size: 12px;
        background: #e2e8f0;
        color: #475569;
        cursor: not-allowed;
      }

      .pin-btn.ready {
        background: linear-gradient(135deg, var(--vt-primary), var(--vt-primary-2));
        color: #fff;
        cursor: pointer;
      }

      .vt-footer {
        padding: 12px 18px 20px;
        color: var(--vt-muted);
        font-size: 11px;
        font-weight: 700;
      }

      @media (max-width: 992px) {
        .vt-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          transform: translateX(-105%);
          transition: transform 0.18s ease;
          z-index: 100;
          box-shadow: 0 28px 60px -28px rgba(2, 6, 23, 0.55);
        }

        body.vt-sidebar-open .vt-sidebar {
          transform: translateX(0);
        }
      }
    </style>
  </head>

  <body>
    <div class="vt-shell" id="pinRoot">
      <aside class="vt-sidebar">
        <div class="vt-brand">
          <div class="logo">VT</div>
          <div class="title">
            <strong>VanguardTrust</strong>
            <span>Customer</span>
          </div>
        </div>

        <div class="vt-section-label">MENU</div>
        <nav class="vt-nav">
          <a href="/customer/dashboard.php">
            <span class="ico"><i class="fas fa-grid-2"></i></span>
            Dashboard
          </a>
          <a href="/customer/myprofile.php">
            <span class="ico"><i class="fas fa-user"></i></span>
            Account Details
          </a>
          <a href="/customer/statement.php">
            <span class="ico"><i class="fas fa-file-invoice"></i></span>
            Account Summary
          </a>
          <a href="/customer/stocks.php">
            <span class="ico"><i class="fas fa-chart-line"></i></span>
            Stocks &amp; Trading
          </a>
        </nav>

        <div class="vt-section-label">FUND TRANSFER</div>
        <nav class="vt-nav">
          <a href="#" onclick="return false;">
            <span class="ico"><i class="fas fa-right-left"></i></span>
            Local Transfer
          </a>
          <a href="/customer/international.php">
            <span class="ico"><i class="fas fa-globe"></i></span>
            International Transfer
          </a>
          <a href="/customer/transferhistory.php">
            <span class="ico"><i class="fas fa-clock-rotate-left"></i></span>
            Transfer History
          </a>
        </nav>

        <div class="vt-section-label">ACCOUNT</div>
        <nav class="vt-nav">
          <a href="/customer/card.php">
            <span class="ico"><i class="fas fa-credit-card"></i></span>
            ATM Card
          </a>
          <a class="active" href="/customer/pin.php">
            <span class="ico"><i class="fas fa-key"></i></span>
            Transaction Pin
          </a>
          <a href="/customer/password.php">
            <span class="ico"><i class="fas fa-lock"></i></span>
            Account Password
          </a>
          <a href="#" id="logoutBtn">
            <span class="ico"><i class="fas fa-arrow-right-from-bracket"></i></span>
            Logout
          </a>
        </nav>
      </aside>

      <main class="vt-main">
        <header class="vt-topbar">
          <div class="vt-top-left">
            <button class="vt-burger" id="sidebarToggle" type="button" aria-label="Toggle menu">
              <i class="fas fa-bars"></i>
            </button>

            <div class="vt-search">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Type credit or debit..." />
            </div>
          </div>

          <div class="vt-user">
            <div class="avatar" id="avatarInitials">VT</div>
            <div class="meta">
              <strong id="pinUserName">Loading...</strong>
              <span id="pinUserEmail"> </span>
            </div>
          </div>
        </header>

        <div class="vt-content">
          <div class="vt-page-title">
            <h1>Security Settings</h1>
            <p>Manage your transaction security pin.</p>
          </div>

          <div class="pin-wrap">
            <section class="pin-card">
              <div class="pin-hero">
                <div class="pin-icon"><i class="fas fa-shield-halved"></i></div>
                <h2>Update Transaction Pin</h2>
                <p>Keep your account safe with a strong PIN.</p>
              </div>

              <form id="pinForm" class="pin-form">
                <div class="pin-field">
                  <label for="currentPin">Current Transaction Pin</label>
                  <div class="pin-input">
                    <input id="currentPin" name="currentPin" type="password" autocomplete="current-password" />
                    <button class="pin-eye" type="button" data-toggle-eye="currentPin">
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="pin-field">
                  <label for="newPin">New Transaction Pin</label>
                  <div class="pin-input">
                    <input id="newPin" name="newPin" type="password" autocomplete="new-password" />
                    <button class="pin-eye" type="button" data-toggle-eye="newPin">
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                  <ul class="pin-rules">
                    <li id="ruleLen"><span class="bad"><i class="fas fa-xmark"></i></span> At least 8 characters</li>
                    <li id="ruleUpper"><span class="bad"><i class="fas fa-xmark"></i></span> An uppercase letter</li>
                    <li id="ruleNum"><span class="bad"><i class="fas fa-xmark"></i></span> A number</li>
                    <li id="ruleSpec"><span class="bad"><i class="fas fa-xmark"></i></span> A special character</li>
                  </ul>
                </div>

                <div class="pin-field">
                  <label for="confirmPin">Confirm New Pin</label>
                  <div class="pin-input">
                    <input id="confirmPin" name="confirmPin" type="password" autocomplete="new-password" />
                    <button class="pin-eye" type="button" data-toggle-eye="confirmPin">
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="pin-actions">
                  <button id="updatePinBtn" class="pin-btn" type="submit">Update Secure Pin</button>
                </div>
              </form>
            </section>
          </div>
        </div>

        <div class="vt-footer">
          <div>&copy; 2026 VanguardTrust. All rights reserved.</div>
        </div>
      </main>
    </div>

    <script src="assets/libs/jquery/jquery.min.js"></script>
    <script src="../assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/libs/simplebar/simplebar.min.js"></script>
    <script src="assets/libs/node-waves/waves.min.js"></script>

    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
    <script src="firebase-config.js"></script>
    <script src="assets/js/auth-session.js"></script>

    <script>
      (function () {
        var toggle = document.getElementById("sidebarToggle");
        if (toggle) {
          toggle.addEventListener("click", function () {
            document.body.classList.toggle("vt-sidebar-open");
          });
        }
      })();
    </script>
  </body>
</html>
