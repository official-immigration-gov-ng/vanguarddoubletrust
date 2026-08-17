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
      html, body { background: #0a0f1a !important; color: #ffffff !important; }
      html, body, :root, * {
        color-scheme: dark;
        --vt-primary: #e8c367 !important;
        --vt-primary-2: #ffffff !important;
        --vt-bg: #0a0f1a !important;
        --vt-bg-2: #10172a !important;
        --vt-bg-3: #121a2d !important;
        --vt-card-bg: #10172a !important;
        --vt-card: #10172a !important;
        --vt-card-2: #121a2d !important;
        --vt-text: #ffffff !important;
        --vt-text-2: #cdd5e3 !important;
        --vt-muted: #8a95ac !important;
        --vt-border: rgba(255,255,255,0.10) !important;
        --vt-line: rgba(255,255,255,0.08) !important;
        --vt-success: #6ee7a7 !important;
        --vt-ok: #6ee7a7 !important;
        --vt-danger: #ffffff !important;
        --vt-warn: #e8c367 !important;
        --vt-info: #ffffff !important;
        --vt-accent: #e8c367 !important;
        --vt-accent-2: #ffffff !important;
        --vt-avatar-bg: #121a2d !important;
        --vt-input-bg: #000000 !important;
        --vt-input-fg: #ffffff !important;
        --vt-shadow: 0 18px 42px -18px rgba(0,0,0,0.55) !important;
        --primary-color: #e8c367 !important;
        --secondary-color: #10172a !important;
        --dark-bg-color: #0a0f1a !important;
        --light-color: #ffffff !important;
        --white-color: #ffffff !important;
        --dark-color: #0a0f1a !important;
        --light-bg: #10172a !important;
        --gray-bg: #121a2d !important;
        --text-dark: #ffffff !important;
        --text-light: #0a0f1a !important;
        --border-color: rgba(255,255,255,0.10) !important;
        background: #0a0f1a !important;
        color: #ffffff !important;
      }
      * { border-color: rgba(255,255,255,0.10) !important; }
      :root {
        --vt-primary: #165DFF;
        --vt-primary-2: #0E42D2;
        --vt-bg: #f6f8fc;
        --vt-card: #ffffff;
        --vt-text: #0f172a;
        --vt-muted: #64748b;
        --vt-border: rgba(15, 23, 42, 0.08);
        --vt-shadow: 0 18px 42px -18px rgba(22, 93, 255, 0.18);
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
        border-radius: 50%;
        overflow: hidden;
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
          height: 100vh;
          width: min(304px, 84vw);
          transform: translateX(-105%);
          transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1);
          z-index: 100;
          padding: 14px 12px 22px;
          overflow-x: hidden;
          overflow-y: auto;
          box-shadow: 0 28px 60px -28px rgba(2, 6, 23, 0.55);
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        body.vt-sidebar-open .vt-sidebar {
          transform: translateX(0);
        }

        body.vt-sidebar-open {
          overflow: hidden;
          touch-action: none;
        }

        .vt-main {
          width: 100%;
        }
      }

      @media (max-width: 900px) {
        .vt-top-left,
        .vt-top-right,
        .vt-topbar {
          flex-wrap: wrap;
        }

        .vt-topbar {
          height: auto;
        }

        .vt-search {
          order: 3;
          width: 100%;
          margin-top: 8px;
        }

        .vt-user .meta {
          max-width: 44vw;
        }
      }

      @media (max-width: 720px) {
        .vt-content,
        .vt-topbar,
        .vt-footer {
          padding-left: 14px;
          padding-right: 14px;
        }

        .vt-topbar {
          padding-top: 10px;
          padding-bottom: 10px;
          gap: 10px;
        }

        .vt-kv-grid {
          grid-template-columns: 1fr;
        }

        .vt-page-title h1 {
          font-size: 20px;
        }

        .vt-user .meta span {
          display: none;
        }
      }

      @media (max-width: 560px) {
        .vt-topbar {
          padding-left: 10px;
          padding-right: 10px;
        }

        .vt-top-left {
          gap: 8px;
        }

        .vt-top-right {
          gap: 8px;
        }

        .vt-search {
          padding: 9px 12px;
          gap: 8px;
        }

        .vt-search input {
          font-size: 12.5px;
        }

        .vt-user {
          padding: 6px 8px;
          gap: 8px;
          border-radius: 14px;
        }

        .vt-user .meta {
          max-width: 46vw;
        }

        .vt-user .avatar {
          width: 34px;
          height: 34px;
        }
      }

      @media (max-width: 480px) {
        .vt-burger {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          flex: 0 0 auto;
        }

        .vt-user {
          padding: 6px 8px 6px 6px;
          gap: 6px;
          border-radius: 14px;
        }

        .vt-user .meta {
          max-width: 36vw;
        }

        .vt-user .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          font-size: 11px;
        }

        .vt-sidebar {
          width: min(290px, 86vw);
        }

        .vt-panel-body {
          padding: 14px;
        }

        .vt-panel {
          border-radius: 16px;
        }
      }

      .vt-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.42);
        z-index: 99;
      }

      body.vt-sidebar-open .vt-overlay {
        display: block;
      }
    </style>
  </head>

  <body>
    <div class="vt-overlay" id="sidebarOverlay"></div>
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
            <span data-i18n="nav_dashboard">Dashboard</span>
          </a>
          <a class="active" href="/customer/myprofile.php">
            <span class="ico"><i class="fas fa-user"></i></span>
            <span data-i18n="nav_profile">Account Details</span>
          </a>
          <a href="/customer/statement.php">
            <span class="ico"><i class="fas fa-file-invoice"></i></span>
            <span data-i18n="nav_statement">Account Summary</span>
          </a>
          <a href="/customer/stocks.php">
            <span class="ico"><i class="fas fa-chart-line"></i></span>
            <span data-i18n="nav_stocks">Stocks &amp; Trading</span>
          </a>
        </nav>

        <div class="vt-section-label">FUND TRANSFER</div>
        <nav class="vt-nav">
          <a href="/customer/international.php">
            <span class="ico"><i class="fas fa-building-columns"></i></span>
            <span data-i18n="actions_transfer">Bank Transfer</span>
          </a>
          <a href="/customer/transferhistory.php">
            <span class="ico"><i class="fas fa-clock-rotate-left"></i></span>
            <span data-i18n="nav_transferHistory">Transfer History</span>
          </a>
        </nav>

        <div class="vt-section-label">ACCOUNT</div>
        <nav class="vt-nav">
          <a href="/customer/card.php">
            <span class="ico"><i class="fas fa-credit-card"></i></span>
            <span data-i18n="nav_card">ATM Card</span>
          </a>
          <a href="/customer/pin.php">
            <span class="ico"><i class="fas fa-key"></i></span>
            <span data-i18n="nav_pin">Transaction Pin</span>
          </a>
          <a href="/customer/password.php">
            <span class="ico"><i class="fas fa-lock"></i></span>
            <span data-i18n="nav_password">Account Password</span>
          </a>
          <a href="#" id="logoutBtn">
            <span class="ico"><i class="fas fa-arrow-right-from-bracket"></i></span>
            <span data-i18n="nav_logout">Logout</span>
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
              <input type="text" data-i18n-placeholder="search" placeholder="Type credit or debit..." />
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

          <section class="vt-panel" style="margin-top:14px;">
            <div class="vt-panel-head">
              <span class="bar"></span>
              <span data-i18n="pic_section_title">Profile Picture</span>
            </div>
            <div class="vt-panel-body">
              <div style="display:flex;flex-direction:column;align-items:center;gap:18px;">
                <div id="profileAvatarBox" style="width:148px;height:148px;border-radius:50%;overflow:hidden;border:3px solid rgba(22,93,255,0.15);background:#EFF4FF;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px -18px rgba(22,93,255,0.25);">
                  <i class="fas fa-user" style="font-size:56px;color:#165DFF;"></i>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
                  <button type="button" class="btn btn-dark" id="profilePicUploadBtn" style="border-radius:14px;padding:10px 18px;font-weight:800;font-size:13px;">
                    <i class="fas fa-camera" style="margin-right:6px;"></i>
                    <span data-i18n="pic_upload_action">Upload Photo</span>
                  </button>
                  <button type="button" class="btn btn-outline-secondary" id="profilePicRemoveBtn" style="border-radius:14px;padding:10px 18px;font-weight:800;font-size:13px;display:none;">
                    <i class="fas fa-trash" style="margin-right:6px;"></i>
                    <span data-i18n="pic_remove">Remove picture</span>
                  </button>
                </div>
                <div style="margin-top:-8px;text-align:center;">
                  <div style="margin-top:8px;color:#64748b;font-size:11px;font-weight:700;" data-i18n="pic_hint">JPG, PNG, or WebP. Max 8 MB.</div>
                </div>
              </div>
            </div>
          </section>

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
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/auth-session.js?v=20260817b"></script>
    <script src="assets/js/customer-i18n.js?v=20260817b"></script>
    <script>
      (function () {
        function getProfilePicUrl(me) {
          if (!me) return "";
          if (me.profilePic) return String(me.profilePic).trim();
          const p = me.profile || {};
          return String(p.profilePic || p.photoURL || p.photo || p.avatar || "").trim();
        }

        function getUserInitials(me) {
          if (!me) return "VT";
          const p = me.profile || {};
          const first = String(p.firstname || p.firstName || "").trim().charAt(0);
          const last = String(p.lastname || p.lastName || "").trim().charAt(0);
          const name = String(me.name || me.displayName || "").trim();
          let fromName = "";
          if (name) {
            const parts = name.split(/\s+/).filter(Boolean);
            if (parts.length) fromName = (parts[0].charAt(0) + (parts[parts.length - 1] || "").charAt(0)).toUpperCase();
          }
          const parts = (first + last).toUpperCase();
          const out = parts || fromName || "VT";
          return out.slice(0, 2);
        }

        function getFullName(me) {
          if (!me) return "--";
          const p = me.profile || {};
          const f = String(p.firstname || p.firstName || "").trim();
          const l = String(p.lastname || p.lastName || "").trim();
          const n = String(me.name || me.displayName || "").trim();
          if (f || l) return ((f + " " + l).trim() || n || "--");
          return n || "--";
        }

        function getUserEmail(me) {
          if (!me) return "--";
          const p = me.profile || {};
          return String(me.email || p.email || "").trim() || "--";
        }

        function formatDate(v) {
          if (!v) return "--";
          try {
            const d = (v instanceof Date) ? v : new Date(v);
            if (!isFinite(d.getTime())) return "--";
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          } catch (_) {
            return "--";
          }
        }

        function renderAvatars(picUrl, me) {
          const box = document.getElementById("profileAvatarBox");
          const topAvatar = document.getElementById("avatarInitials");
          const removeBtn = document.getElementById("profilePicRemoveBtn");
          if (box) {
            if (picUrl) {
              box.innerHTML = `<img src="${picUrl}" alt="avatar" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
            } else {
              box.innerHTML = `<i class="fas fa-user" style="font-size:56px;color:#165DFF;"></i>`;
            }
          }
          if (topAvatar) {
            if (picUrl) {
              topAvatar.innerHTML = `<img src="${picUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;" />`;
            } else {
              topAvatar.textContent = getUserInitials(me);
            }
          }
          if (removeBtn) {
            if (picUrl) removeBtn.style.display = "";
            else removeBtn.style.display = "none";
          }
        }

        async function removeProfilePicture() {
          if (!latestMe) return;
          const hasConf = window.VT && VT.I18N && VT.I18N.t
            ? window.confirm(String(VT.I18N.t(latestLanguage || "en", "pic_remove") || "Remove picture?"))
            : window.confirm("Remove profile picture?");
          if (!hasConf) return;
          try {
            const toSend = { profilePic: "" };
            const saved = await (window.VT && window.VT.API && typeof window.VT.API.fetchJson === "function"
              ? window.VT.API.fetchJson("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toSend) })
              : fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json", "Accept": "application/json" }, credentials: "same-origin", body: JSON.stringify(toSend) }).then(function(r){ return r.json(); }));
            if (latestMe) {
              latestMe = Object.assign({}, latestMe, { profilePic: "", photoURL: "", photo: "", avatar: "" });
              if (!latestMe.profile) latestMe.profile = {};
              latestMe.profile = Object.assign({}, latestMe.profile, { profilePic: "", photoURL: "", photo: "", avatar: "" });
              delete latestMe.profile.profilePicPublicId;
              delete latestMe.profile.photoURLPublicId;
              delete latestMe.profile.photoPublicId;
              delete latestMe.profile.avatarPublicId;
              if (!latestMe.security) latestMe.security = {};
              latestMe.security = Object.assign({}, latestMe.security, { profilePic: "", photoURL: "", photo: "", avatar: "" });
              delete latestMe.security.profilePicPublicId;
              delete latestMe.security.photoURLPublicId;
              delete latestMe.security.photoPublicId;
              delete latestMe.security.avatarPublicId;
            }
            if (window.VT && window.VT.Cache && typeof window.VT.Cache.writeKyc === "function") {
              try { window.VT.Cache.writeKyc({ profilePic: "", photoURL: "", photo: "", avatar: "", profilePicPublicId: "", photoURLPublicId: "", photoPublicId: "", avatarPublicId: "" }); } catch (_) {}
            } else if (window.sessionStorage) {
              try {
                var key = "vt_kyc_state_v1";
                var raw = window.sessionStorage.getItem(key);
                if (raw) {
                  var p = JSON.parse(raw);
                  if (p && typeof p === "object") {
                    ["profilePic","photoURL","photo","avatar","profilePicPublicId","photoURLPublicId","photoPublicId","avatarPublicId"].forEach(function(k){ delete p[k]; });
                    p.savedAt = Date.now();
                    window.sessionStorage.setItem(key, JSON.stringify(p));
                  }
                }
                var permKey = "vt_kyc_perm_v1";
                var raw2 = window.localStorage ? window.localStorage.getItem(permKey) : null;
                if (raw2) {
                  var p2 = JSON.parse(raw2);
                  if (p2 && typeof p2 === "object") {
                    ["profilePic","photoURL","photo","avatar","profilePicPublicId","photoURLPublicId","photoPublicId","avatarPublicId"].forEach(function(k){ delete p2[k]; });
                    window.localStorage.setItem(permKey, JSON.stringify(p2));
                  }
                }
              } catch (_) {}
            }
            renderAvatars("", latestMe);
            updateUploadButtonLabel(false);
            if (window.VT && window.VT.UI && typeof window.VT.UI.toast === "function") {
              const msg = window.VT.I18N && VT.I18N.t ? String(window.VT.I18N.t(latestLanguage || "en", "pic_removed") || "Profile picture removed.") : "Profile picture removed.";
              window.VT.UI.toast(msg, "ok");
            }
          } catch (err) {
            const msg = err && err.message ? String(err.message) : "Unable to remove picture.";
            if (window.VT && window.VT.UI && typeof window.VT.UI.toast === "function") {
              window.VT.UI.toast(msg, "error");
            } else {
              window.alert(msg);
            }
          }
        }

        function updateUploadButtonLabel(hasPic) {
          const btn = document.getElementById("profilePicUploadBtn");
          if (!btn || !window.VT || !window.VT.I18N) return;
          const span = btn.querySelector("span[data-i18n]");
          const key = hasPic ? "pic_change_action" : "pic_upload_action";
          if (span) {
            span.setAttribute("data-i18n", key);
            const lang = latestLanguage || "en";
            const val = window.VT.I18N.t ? window.VT.I18N.t(lang, key) : (hasPic ? "Change Photo" : "Upload Photo");
            span.textContent = val || (hasPic ? "Change Photo" : "Upload Photo");
          }
        }

        function populateProfileFields(me) {
          const el = (id, text) => {
            const n = document.getElementById(id);
            if (n) n.textContent = text == null ? "--" : String(text);
          };
          el("accountHolder", getFullName(me));
          el("emailAddress", getUserEmail(me));
          el("profileUserName", getFullName(me));
          el("profileUserEmail", getUserEmail(me));
          const p = (me && me.profile) || {};
          const lang = latestLanguage || "en";
          const genderRaw = String(p.gender || "").trim();
          const genderVal = genderRaw
            ? (window.VT && window.VT.I18N && window.VT.I18N.t
                ? window.VT.I18N.t(lang, "kyc_gender_" + genderRaw.toLowerCase()) || (genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1))
                : (genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1)))
            : "--";
          el("phoneNumber", String(p.phone || p.phoneNumber || "").trim() || "--");
          el("accountOpening", formatDate(p.createdAt || me.createdAt || p.accountOpening || ""));
          el("branchCode", String(p.branchCode || "RBBS0001").trim() || "RBBS0001");
          el("lastLogin", formatDate(me.lastLogin || p.lastLogin || ""));
          el("gender", genderVal);
          el("accountNumber", String(p.accountNumber || me.accountNumber || "").trim() || "--");
        }

        let latestMe = null;
        let latestLanguage = "en";

        function openPicGateFromProfile() {
          if (!window.VT || !window.VT.UI || typeof window.VT.UI.showPicGate !== "function") {
            if (window.console) window.console.error("[VT] showPicGate not available");
            try { window.alert("Upload photo is currently unavailable. Please refresh the page and try again."); } catch (_) {}
            return;
          }
          window.VT.UI.showPicGate({
            me: latestMe || {},
            forceOpen: true,
            onComplete: function (res) {
              const r = res || {};
              const finalPic = String(r.profilePic || r.photoURL || r.photo || r.avatar || "").trim();
              const finalPub = String(r.publicId || r.profilePicPublicId || r.photoURLPublicId || r.photoPublicId || r.avatarPublicId || "").trim();
              const kycDone = !!(r.kycCompleted === true || r.kycDone === true || r.KYCDone === true);
              if (latestMe) {
                latestMe = Object.assign({}, latestMe, { profilePic: finalPic || (latestMe && latestMe.profilePic) || "" });
                if (finalPic) {
                  latestMe.photoURL = latestMe.photoURL || finalPic;
                  latestMe.photo = latestMe.photo || latestMe.photoURL || finalPic;
                  latestMe.avatar = latestMe.avatar || latestMe.photo || latestMe.photoURL || finalPic;
                }
                if (!latestMe.profile) latestMe.profile = {};
                latestMe.profile = Object.assign({}, latestMe.profile, {
                  profilePic: finalPic || (latestMe.profile && latestMe.profile.profilePic) || ""
                });
                if (finalPic) {
                  latestMe.profile.photoURL = latestMe.profile.photoURL || latestMe.profile.profilePic || finalPic;
                  latestMe.profile.photo = latestMe.profile.photo || latestMe.profile.photoURL || latestMe.profile.profilePic || finalPic;
                  latestMe.profile.avatar = latestMe.profile.avatar || latestMe.profile.photo || latestMe.profile.photoURL || latestMe.profile.profilePic || finalPic;
                }
                if (finalPub) {
                  latestMe.profile.profilePicPublicId = finalPub;
                  latestMe.profile.photoURLPublicId = latestMe.profile.photoURLPublicId || finalPub;
                  latestMe.profile.photoPublicId = latestMe.profile.photoPublicId || finalPub;
                  latestMe.profile.avatarPublicId = latestMe.profile.avatarPublicId || finalPub;
                }
                if (kycDone) {
                  if (!latestMe.security) latestMe.security = {};
                  latestMe.security.kycCompleted = true;
                  latestMe.security.KYCDone = true;
                  latestMe.security.kycDone = true;
                  latestMe.profile.kycCompleted = true;
                  latestMe.profile.KYCDone = true;
                  latestMe.profile.kycDone = true;
                }
              }
              const picUrl = getProfilePicUrl(latestMe);
              renderAvatars(picUrl, latestMe);
              updateUploadButtonLabel(!!picUrl);
            },
            onSkip: function () {}
          });
        }

        function bootI18nAndKyc() {
          if (!window.VT || !window.VT.UI || !window.VT.UI.bootstrapCustomerPage) return;
          const btn = document.getElementById("profilePicUploadBtn");
          if (btn) {
            btn.addEventListener("click", function () { openPicGateFromProfile(); });
          }
          const removeBtn = document.getElementById("profilePicRemoveBtn");
          if (removeBtn) {
            removeBtn.addEventListener("click", function () { removeProfilePicture(); });
          }
          try {
            if (window.VT.UI.setupMobileSidebarOutsideClick) {
              const closeSidebar = function () { try { document.body.classList.remove("vt-sidebar-open"); } catch (_) {} };
              try { window.VT.UI.setupMobileSidebarOutsideClick({ closeFn: closeSidebar }); } catch (_) {}
            }
          } catch (_) {}
          window.VT.UI.bootstrapCustomerPage({
            after: function (ctx) {
              const c = ctx || {};
              latestMe = c.me || null;
              latestLanguage = c.language || "en";
              const picUrl = getProfilePicUrl(latestMe);
              populateProfileFields(latestMe);
              renderAvatars(picUrl, latestMe);
              updateUploadButtonLabel(!!picUrl);
              if (window.console) window.console.log("[VT] Subpage ready: language=" + latestLanguage + ", kyc=" + (c.kycCompleted) + ", pic=" + !!picUrl);
            }
          }).catch(function (err) {
            if (window.console) window.console.error("[VT] bootstrapCustomerPage failed:", err);
          });
        }

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", bootI18nAndKyc);
        } else {
          bootI18nAndKyc();
        }
      })();
    </script>

    <script>
      (function () {
        var toggle = document.getElementById("sidebarToggle");
        var overlay = document.getElementById("sidebarOverlay");
        var body = document.body;

        function closeSidebar() {
          body.classList.remove("vt-sidebar-open");
        }

        if (toggle) {
          toggle.addEventListener("click", function () {
            body.classList.toggle("vt-sidebar-open");
          });
        }

        if (overlay) {
          overlay.addEventListener("click", closeSidebar);
        }

        if (window.addEventListener) {
          window.addEventListener(
            "keydown",
            function (e) {
              if (e.key === "Escape") closeSidebar();
            },
            false
          );
        }
      })();
    </script>
  </body>
</html>
