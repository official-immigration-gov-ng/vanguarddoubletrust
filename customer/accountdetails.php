<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Account Details - VanguardDoubleTrust</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Account details" name="description">

    <link rel="icon" type="image/svg+xml" href="/assets/images/brand/favicon_VanguardDoubleTrust.svg">
    <link rel="icon" type="image/png" href="/assets/images/brand/favicon_1776155007.png">
    <link href="../css2-1?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="../ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/bootstrap.min.css" id="bootstrap-style" rel="stylesheet" type="text/css">
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css">
    <link href="assets/css/app.min.css" id="app-style" rel="stylesheet" type="text/css">
    <script src="../npm/sweetalert2%4011"></script>

    <style>
      html { filter: grayscale(1) contrast(1.1) brightness(1.02) !important; -webkit-filter: grayscale(1) contrast(1.1) brightness(1.02) !important; }
      body {
        background: #f8fafc;
        font-family: "Plus Jakarta Sans", sans-serif;
      }

      .wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 28px 16px;
      }

      .cardx {
        background: #ffffff;
        border-radius: 22px;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .hero {
        background: linear-gradient(135deg, #0B0F14 0%, #0F172A 100%);
        color: #fff;
        padding: 26px 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .hero h1 {
        font-size: 22px;
        margin: 0;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .bodyx {
        padding: 22px 26px 26px;
      }

      pre {
        background: #0b1220;
        color: #e2e8f0;
        border-radius: 14px;
        padding: 16px;
        overflow: auto;
        margin: 0;
      }

      .btn-logout {
        background: rgba(255, 255, 255, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: #fff;
        padding: 10px 14px;
        border-radius: 14px;
        font-weight: 700;
      }

      .btn-logout:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.2);
      }

      .btn-back {
        background: rgba(255, 255, 255, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: #fff;
        padding: 10px 14px;
        border-radius: 14px;
        font-weight: 700;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .btn-back:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.2);
      }
    </style>
  </head>

  <body>
    <div class="wrap" id="accountRoot">
      <div class="cardx">
        <div class="hero">
          <div>
            <h1 id="accountTitle">Account Details</h1>
            <div class="small" style="opacity: 0.85">Session-protected account area</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a class="btn-back" href="/customer/dashboard.php"><i class="fas fa-arrow-left"></i> Dashboard</a>
            <button class="btn-logout" id="logoutBtn" type="button">Logout <i class="fas fa-arrow-right ms-2"></i></button>
          </div>
        </div>
        <div class="bodyx">
          <div class="mb-3 text-secondary fw-bold">Current session</div>
          <pre id="meJson">{}</pre>
        </div>
      </div>
    </div>

    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
    <script src="firebase-config.js"></script>
    <script src="assets/js/auth-session.js"></script>
  </body>
</html>
