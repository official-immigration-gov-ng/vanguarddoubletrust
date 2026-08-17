<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Market &amp; Stocks - VanguardDoubleTrust</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta content="Market and stock trading." name="description" />

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
      html, body { filter: contrast(1000%) saturate(0%) brightness(1.05) !important; -webkit-filter: contrast(1000%) saturate(0%) brightness(1.05) !important; }
      html, body, :root, * {
        --vt-primary: #000000 !important; --vt-primary-2: #ffffff !important; --vt-bg: #ffffff !important;
        --vt-card-bg: #ffffff !important; --vt-card-2: #ffffff !important; --vt-text: #000000 !important;
        --vt-text-2: #000000 !important; --vt-muted: #000000 !important; --vt-border: #000000 !important;
        --vt-success: #000000 !important; --vt-danger: #000000 !important; --vt-warn: #000000 !important;
        --vt-info: #000000 !important; --vt-accent: #ffffff !important; --vt-avatar-bg: #ffffff !important;
        background: #ffffff !important; color: #000000 !important;
      }
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

      .vt-balance-pill {
        border: 1px solid var(--vt-border);
        background: #fff;
        border-radius: 999px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 900;
        font-size: 12px;
        color: var(--vt-text);
      }

      .vt-balance-pill small {
        font-size: 10px;
        font-weight: 900;
        color: var(--vt-muted);
      }

      .vt-content {
        padding: 18px;
      }

      .vt-page-title {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
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

      .mk-hero {
        margin-top: 14px;
        border-radius: 18px;
        overflow: hidden;
        background: linear-gradient(135deg, #001f5a 0%, #003a95 55%, #004aad 100%);
        box-shadow: var(--vt-shadow);
        position: relative;
        border: 1px solid rgba(0, 51, 153, 0.16);
      }

      .mk-hero .inner {
        padding: 18px;
        color: #fff;
      }

      .mk-hero .tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 900;
        font-size: 12px;
      }

      .mk-hero .tag span {
        opacity: 0.9;
      }

      .mk-hero .live {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 900;
        opacity: 0.9;
      }

      .mk-hero .dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #22c55e;
        box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.18);
      }

      .mk-chart {
        height: 160px;
        width: 100%;
        display: block;
      }

      .mk-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 16px;
        margin-top: 16px;
        align-items: start;
      }

      @media (max-width: 1100px) {
        .mk-grid {
          grid-template-columns: 1fr;
        }
      }

      .mk-card {
        background: #fff;
        border: 1px solid var(--vt-border);
        border-radius: 18px;
        box-shadow: 0 18px 42px -30px rgba(2, 6, 23, 0.45);
      }

      .mk-card .head {
        padding: 14px 14px 10px;
        font-weight: 900;
        font-size: 13px;
      }

      .mk-list {
        padding: 0 12px 14px;
        display: grid;
        gap: 10px;
      }

      .mk-row {
        border: 1px solid var(--vt-border);
        border-radius: 16px;
        padding: 12px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .mk-row .l {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .mk-row .logo {
        width: 36px;
        height: 36px;
        border-radius: 14px;
        background: rgba(0, 51, 153, 0.08);
        display: grid;
        place-items: center;
        color: var(--vt-primary);
        font-weight: 900;
        flex: 0 0 auto;
      }

      .mk-row .txt {
        min-width: 0;
      }

      .mk-row .sym {
        font-weight: 900;
        font-size: 12px;
        margin: 0;
      }

      .mk-row .name {
        font-weight: 800;
        font-size: 11px;
        color: var(--vt-muted);
        margin: 2px 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mk-row .r {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 0 0 auto;
      }

      .mk-price {
        font-weight: 900;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
        min-width: 84px;
        text-align: right;
      }

      .mk-btn {
        border: none;
        background: var(--vt-primary);
        color: #fff;
        border-radius: 10px;
        padding: 7px 12px;
        font-weight: 900;
        font-size: 11px;
      }

      .mk-btn:hover {
        background: #002c85;
      }

      .pf-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
      }

      .pf-table thead th {
        background: rgba(0, 51, 153, 0.06);
        color: var(--vt-primary);
        font-size: 10px;
        letter-spacing: 0.1em;
        font-weight: 900;
        padding: 10px 12px;
        border-top: 1px solid var(--vt-border);
        border-bottom: 1px solid var(--vt-border);
      }

      .pf-table thead th:first-child {
        border-left: 1px solid var(--vt-border);
        border-top-left-radius: 14px;
      }

      .pf-table thead th:last-child {
        border-right: 1px solid var(--vt-border);
        border-top-right-radius: 14px;
      }

      .pf-table tbody td {
        padding: 12px 12px;
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        font-weight: 800;
        font-size: 12px;
        color: var(--vt-text);
      }

      .pf-table tbody tr td:first-child {
        border-left: 1px solid rgba(15, 23, 42, 0.08);
      }

      .pf-table tbody tr td:last-child {
        border-right: 1px solid rgba(15, 23, 42, 0.08);
      }

      .pf-empty {
        padding: 18px 14px;
        color: var(--vt-muted);
        font-weight: 800;
        font-size: 12px;
      }

      .his-card {
        margin-top: 16px;
        background: #fff;
        border: 1px solid var(--vt-border);
        border-radius: 18px;
        box-shadow: 0 18px 42px -30px rgba(2, 6, 23, 0.45);
      }

      .his-card .head {
        padding: 14px 14px 10px;
        font-weight: 900;
        font-size: 13px;
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

        .vt-actions-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .vt-balance .mini {
          grid-template-columns: 1fr;
        }

        .vt-balance .amount {
          font-size: 24px;
          word-break: break-word;
        }

        .vt-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .vt-row .right {
          width: 100%;
          text-align: left;
        }

        .vt-list .head {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .mk-grid {
          grid-template-columns: 1fr;
        }

        .vt-page-title h1 {
          font-size: 20px;
        }

        .vt-balance-pill {
          width: 100%;
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

        .vt-action {
          padding: 11px 8px;
          font-size: 11px;
          gap: 8px;
        }

        .vt-action i {
          font-size: 14px;
        }

        .vt-card.pad {
          padding: 14px;
          border-radius: 16px;
        }

        .vt-sidebar {
          width: min(290px, 86vw);
        }

        .mk-card,
        .his-card {
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
    <div class="vt-shell" id="stocksRoot">
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
          <a href="/customer/myprofile.php">
            <span class="ico"><i class="fas fa-user"></i></span>
            <span data-i18n="nav_profile">Account Details</span>
          </a>
          <a href="/customer/statement.php">
            <span class="ico"><i class="fas fa-file-invoice"></i></span>
            <span data-i18n="nav_statement">Account Summary</span>
          </a>
          <a class="active" href="/customer/stocks.php">
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
              <input type="text" placeholder="Type credit or debit..." data-i18n-placeholder="search" />
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px">
            <div class="vt-balance-pill">
              <small>Balance</small>
              <span id="stocksBalance">$0.00</span>
            </div>
            <div class="vt-user">
              <div class="avatar" id="avatarInitials">VT</div>
              <div class="meta">
                <strong id="stocksUserName">Loading...</strong>
                <span id="stocksUserEmail"> </span>
              </div>
            </div>
          </div>
        </header>

        <div class="vt-content">
          <div class="vt-page-title">
            <div>
              <h1>Market &amp; Stocks</h1>
              <p>Track live market and manage your portfolio.</p>
            </div>
          </div>

          <section class="mk-hero">
            <div class="inner">
              <div class="tag">
                <span>S&amp;P 500</span>
                <span class="live"><span class="dot"></span> Live</span>
              </div>
            </div>
            <svg class="mk-chart" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-label="Market chart">
              <defs>
                <linearGradient id="mkLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stop-color="#a78bfa" stop-opacity="0.9" />
                  <stop offset="1" stop-color="#60a5fa" stop-opacity="0.9" />
                </linearGradient>
                <linearGradient id="mkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#a78bfa" stop-opacity="0.28" />
                  <stop offset="1" stop-color="#60a5fa" stop-opacity="0.02" />
                </linearGradient>
              </defs>
              <path id="mkArea" d="" fill="url(#mkFill)"></path>
              <path id="mkPath" d="" fill="none" stroke="url(#mkLine)" stroke-width="4" stroke-linecap="round"></path>
            </svg>
          </section>

          <section class="mk-grid">
            <div class="mk-card">
              <div class="head">Live Market</div>
              <div class="mk-list" id="liveMarket"></div>
            </div>

            <div class="mk-card">
              <div class="head">Portfolio</div>
              <div style="padding: 0 12px 14px">
                <table class="pf-table">
                  <thead>
                    <tr>
                      <th style="text-align: left">Asset</th>
                      <th style="text-align: right">Owned</th>
                      <th style="text-align: right">Action</th>
                    </tr>
                  </thead>
                  <tbody id="pfBody"></tbody>
                </table>
                <div id="pfEmpty" class="pf-empty">No stocks owned.</div>
              </div>
            </div>
          </section>

          <section class="his-card">
            <div class="head">History</div>
            <div style="padding: 0 12px 14px; overflow: auto">
              <table class="pf-table" style="min-width: 780px">
                <thead>
                  <tr>
                    <th style="text-align: left">Type</th>
                    <th style="text-align: left">Symbol</th>
                    <th style="text-align: right">Qty</th>
                    <th style="text-align: right">Total</th>
                    <th style="text-align: left">Date</th>
                  </tr>
                </thead>
                <tbody id="hisBody"></tbody>
              </table>
              <div id="hisEmpty" class="pf-empty">No activity yet.</div>
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
  function bootI18nAndKyc() {
    if (!window.VT || !window.VT.UI || !window.VT.UI.bootstrapCustomerPage) return;
    window.VT.UI.bootstrapCustomerPage({
      after: function (ctx) {
        if (window.console) window.console.log("[VT] Subpage ready: language=" + (ctx && ctx.language) + ", kyc=" + (ctx && ctx.kycCompleted));
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
