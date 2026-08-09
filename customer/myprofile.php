<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Profile - VanguardDoubleTrust</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta content="Manage your personal information and security." name="description" />

    <link rel="icon" type="image/svg+xml" href="/assets/images/brand/favicon_VanguardDoubleTrust.svg" />
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
        --vt-primary: #0B0F14;
        --vt-primary-2: #0F172A;
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

      .vt-panel {
        margin-top: 14px;
        background: #fff;
        border: 1px solid var(--vt-border);
        border-radius: var(--vt-radius);
        box-shadow: var(--vt-shadow);
        overflow: hidden;
      }

      .vt-panel-head {
        padding: 12px 14px;
        border-bottom: 1px solid var(--vt-border);
        background: rgba(0, 51, 153, 0.03);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 900;
        font-size: 13px;
      }

      .vt-panel-head .bar {
        width: 3px;
        height: 16px;
        border-radius: 20px;
        background: linear-gradient(180deg, var(--vt-primary), var(--vt-primary-2));
      }

      .vt-panel-body {
        padding: 14px;
      }

      .vt-kv-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 10px;
      }

      @media (max-width: 1200px) {
        .vt-kv-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 768px) {
        .vt-kv-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .vt-kv {
        border: 1px solid var(--vt-border);
        border-radius: 16px;
        padding: 12px 12px;
        background: #fff;
        min-height: 74px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .vt-kv .ico {
        width: 36px;
        height: 36px;
        border-radius: 14px;
        background: rgba(0, 51, 153, 0.08);
        color: var(--vt-primary);
        display: grid;
        place-items: center;
        flex: 0 0 auto;
      }

      .vt-kv .txt {
        min-width: 0;
      }

      .vt-kv .k {
        font-size: 9px;
        letter-spacing: 0.12em;
        font-weight: 900;
        color: var(--vt-muted);
        text-transform: uppercase;
        line-height: 1.2;
      }

      .vt-kv .v {
        font-size: 12px;
        font-weight: 900;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .vt-pill {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 900;
        background: rgba(22, 163, 74, 0.12);
        color: #16a34a;
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
    <div class="vt-shell" id="profileRoot">
      <aside class="vt-sidebar">
        <div class="vt-brand">
          <div class="logo">VT</div>
          <div class="title">
            <strong>VanguardDoubleTrust</strong>
            <span>Customer</span>
          </div>
        </div>

        <div class="vt-section-label">MENU</div>
        <nav class="vt-nav">
          <a href="/customer/dashboard.php">
            <span class="ico"><i class="fas fa-grid-2"></i></span>
            Dashboard
          </a>
          <a class="active" href="/customer/myprofile.php">
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
          <a href="/customer/pin.php">
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
              <strong id="profileUserName">Loading...</strong>
              <span id="profileUserEmail"> </span>
            </div>
          </div>
        </header>

        <div class="vt-content">
          <div class="vt-page-title">
            <h1>My Profile</h1>
            <p>Manage your personal information and security.</p>
          </div>

          <section class="vt-panel">
            <div class="vt-panel-head">
              <span class="bar"></span>
              Personal Details
            </div>
            <div class="vt-panel-body">
              <div class="vt-kv-grid">
                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-user"></i></div>
                  <div class="txt">
                    <div class="k">Account Holder</div>
                    <div class="v" id="accountHolder">--</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-envelope"></i></div>
                  <div class="txt">
                    <div class="k">Email Address</div>
                    <div class="v" id="emailAddress">--</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-phone"></i></div>
                  <div class="txt">
                    <div class="k">Phone Number</div>
                    <div class="v" id="phoneNumber">--</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-calendar"></i></div>
                  <div class="txt">
                    <div class="k">Account Opening</div>
                    <div class="v" id="accountOpening">--</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-shield"></i></div>
                  <div class="txt">
                    <div class="k">Account Status</div>
                    <div class="v"><span class="vt-pill" id="accountStatus">ACTIVE</span></div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-code-branch"></i></div>
                  <div class="txt">
                    <div class="k">Branch Code</div>
                    <div class="v" id="branchCode">RBBS0001</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-clock"></i></div>
                  <div class="txt">
                    <div class="k">Last Login</div>
                    <div class="v" id="lastLogin">--</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-venus-mars"></i></div>
                  <div class="txt">
                    <div class="k">Gender</div>
                    <div class="v" id="gender">--</div>
                  </div>
                </div>

                <div class="vt-kv">
                  <div class="ico"><i class="fas fa-hashtag"></i></div>
                  <div class="txt">
                    <div class="k">Account Number</div>
                    <div class="v" id="accountNumber">--</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="vt-footer">
          <div>&copy; 2026 VanguardDoubleTrust. All rights reserved.</div>
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
