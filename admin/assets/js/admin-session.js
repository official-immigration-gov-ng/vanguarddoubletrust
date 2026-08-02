(() => {
  function money(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "$0.00";
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  function randomInt(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  function randomDigits(len) {
    const n = randomInt(0, Math.pow(10, len) - 1);
    return String(n).padStart(len, "0");
  }

  function randomPassword() {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const specials = "!@#$%&*_-+";
    const pick = (s) => s.charAt(Math.floor(Math.random() * s.length));
    let out = "";
    out += pick("ABCDEFGHJKLMNPQRSTUVWXYZ");
    out += pick(numbers);
    out += pick(specials);
    for (let i = 0; i < 9; i++) out += pick(letters + numbers);
    out += pick(specials);
    return out;
  }

  function setModalOpen(open) {
    const modal = document.getElementById("adminCreateModal");
    if (!modal) return;
    modal.style.display = open ? "block" : "none";
  }

  function setCreateOutput(text) {
    const out = document.getElementById("adminCreateOutput");
    if (!out) return;
    out.value = text || "";
  }

  async function api(path, options = {}) {
    const res = await fetch(path, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });

    if (!res.ok) {
      let msg = "Request failed";
      try {
        const data = await res.json();
        msg = String(data?.error || data?.detail || msg);
      } catch {}
      throw new Error(msg);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    return null;
  }

  function flash(message, isError) {
    const el = document.getElementById("adminFlash") || document.getElementById("adminLoginError");
    if (!el) return;
    el.textContent = message || "";
    el.style.color = isError ? "#fecaca" : "#bbf7d0";
  }

  function flashCreate(message, isError) {
    const el = document.getElementById("adminCreateFlash");
    if (!el) return;
    el.textContent = message || "";
    el.style.color = isError ? "#fecaca" : "#bbf7d0";
  }

  function wireAdminLogin() {
    const form = document.getElementById("adminLoginForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      flash("");

      const email = String(document.getElementById("adminEmail")?.value || "").trim();
      const password = String(document.getElementById("adminPassword")?.value || "");

      try {
        await api("/api/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        window.location.href = "/admin/dashboard.html";
      } catch (error) {
        flash(error?.message || "Unable to sign in", true);
      }
    });
  }

  function wireAdminDashboard() {
    const tableBody = document.getElementById("adminUsersBody");
    if (!tableBody) return;

    const searchInput = document.getElementById("adminUserSearch");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    const createBtn = document.getElementById("adminCreateUserBtn");
    const closeBtn = document.getElementById("adminCreateCloseBtn");
    const generateBtn = document.getElementById("adminGenerateBtn");
    const submitBtn = document.getElementById("adminCreateSubmitBtn");
    let state = { users: [] };

    logoutBtn?.addEventListener("click", async () => {
      try {
        await api("/api/admin/logout", { method: "POST" });
      } catch {}
      window.location.href = "/admin/login.html";
    });

    function collectCreateForm() {
      return {
        firstname: String(document.getElementById("createFirstname")?.value || "").trim(),
        lastname: String(document.getElementById("createLastname")?.value || "").trim(),
        email: String(document.getElementById("createEmail")?.value || "").trim(),
        password: String(document.getElementById("createPassword")?.value || ""),
        accountPin: String(document.getElementById("createAccountPin")?.value || "").trim(),
        transferCode: String(document.getElementById("createTransferCode")?.value || "").trim(),
        startingBalance: String(document.getElementById("createStartingBalance")?.value || "").trim()
      };
    }

    function fillCreateForm(next) {
      if (next.firstname != null) document.getElementById("createFirstname").value = next.firstname;
      if (next.lastname != null) document.getElementById("createLastname").value = next.lastname;
      if (next.email != null) document.getElementById("createEmail").value = next.email;
      if (next.password != null) document.getElementById("createPassword").value = next.password;
      if (next.accountPin != null) document.getElementById("createAccountPin").value = next.accountPin;
      if (next.transferCode != null) document.getElementById("createTransferCode").value = next.transferCode;
      if (next.startingBalance != null) document.getElementById("createStartingBalance").value = next.startingBalance;
    }

    function renderCreatedInfo(data) {
      const user = data?.user || {};
      const creds = data?.credentials || {};
      const account = data?.account || {};
      setCreateOutput(
        [
          `Customer Name: ${(user.firstname || "").trim()} ${(user.lastname || "").trim()}`.trim(),
          `Account No: ${account.accountNumber || user.accountNumber || ""}`,
          `Starting Balance: ${money(account.balance || 0)}`,
          `Login Email: ${creds.email || user.email || ""}`,
          `Login Password: ${creds.password || ""}`,
          `Account PIN: ${creds.accountPin || ""}`,
          `Transfer Code: ${creds.transferCode || ""}`,
          ""
        ].join("\n")
      );
    }

    createBtn?.addEventListener("click", () => {
      flashCreate("");
      setCreateOutput("");
      fillCreateForm({
        password: randomPassword(),
        accountPin: randomDigits(6),
        transferCode: randomDigits(6),
        startingBalance: "0"
      });
      setModalOpen(true);
    });

    closeBtn?.addEventListener("click", () => {
      setModalOpen(false);
    });

    generateBtn?.addEventListener("click", () => {
      flashCreate("");
      const cur = collectCreateForm();
      fillCreateForm({
        password: cur.password || randomPassword(),
        accountPin: /^\d{6}$/.test(cur.accountPin) ? cur.accountPin : randomDigits(6),
        transferCode: cur.transferCode ? cur.transferCode : randomDigits(6)
      });
    });

    submitBtn?.addEventListener("click", async () => {
      flashCreate("");
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating...";
      try {
        const payload = collectCreateForm();
        const data = await api("/api/admin/users", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        renderCreatedInfo(data);
        flashCreate("Customer created successfully.");
        await loadUsers();
      } catch (error) {
        flashCreate(error?.message || "Unable to create customer", true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
      }
    });

    function rowMarkup(user) {
      const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "No name set";
      return `
        <tr data-uid="${user.uid}">
          <td>
            <div class="name">${fullName}</div>
            <div class="sub">${user.email || "No email"}</div>
            <div class="sub">UID: ${user.uid}</div>
          </td>
          <td>
            <div>${user.accountNumber || "--"}</div>
            <div class="sub">${user.currency || "USD"}</div>
          </td>
          <td>
            <input type="number" step="0.01" min="0" data-field="balance" value="${Number(user.balance || 0)}" />
          </td>
          <td>
            <select data-field="status">
              <option value="ACTIVE" ${user.status === "ACTIVE" ? "selected" : ""}>ACTIVE</option>
              <option value="PENDING" ${user.status === "PENDING" ? "selected" : ""}>PENDING</option>
              <option value="SUSPENDED" ${user.status === "SUSPENDED" ? "selected" : ""}>SUSPENDED</option>
            </select>
            <div class="sub"><span class="status">${user.status || "ACTIVE"}</span></div>
          </td>
          <td>
            <input type="text" data-field="firstname" value="${user.firstname || ""}" placeholder="First name" style="margin-bottom:8px" />
            <input type="text" data-field="lastname" value="${user.lastname || ""}" placeholder="Last name" />
          </td>
          <td>
            <button class="btn" type="button" data-action="save">Save</button>
          </td>
        </tr>
      `;
    }

    function render(users) {
      if (!users.length) {
        tableBody.innerHTML = `<tr><td colspan="6" class="muted">No users found.</td></tr>`;
        return;
      }
      tableBody.innerHTML = users.map(rowMarkup).join("");
    }

    function filterUsers() {
      const q = String(searchInput?.value || "").trim().toLowerCase();
      if (!q) return state.users;
      return state.users.filter((user) => {
        return [user.firstname, user.lastname, user.email, user.accountNumber, user.status]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }

    async function loadUsers() {
      flash("");
      const session = await api("/api/admin/session");
      const data = await api("/api/admin/users");
      state.users = Array.isArray(data?.users) ? data.users : [];

      document.getElementById("adminIdentity").textContent = session?.admin?.email || "Admin";
      document.getElementById("adminTotalUsers").textContent = String(data?.summary?.totalUsers || 0);
      document.getElementById("adminTotalBalances").textContent = money(data?.summary?.totalBalance || 0);
      render(filterUsers());
    }

    searchInput?.addEventListener("input", () => {
      render(filterUsers());
    });

    tableBody.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-action='save']");
      if (!button) return;

      const row = button.closest("tr[data-uid]");
      if (!row) return;
      const uid = row.getAttribute("data-uid");
      const payload = {
        balance: row.querySelector("[data-field='balance']")?.value || "",
        status: row.querySelector("[data-field='status']")?.value || "ACTIVE",
        firstname: row.querySelector("[data-field='firstname']")?.value || "",
        lastname: row.querySelector("[data-field='lastname']")?.value || ""
      };

      button.disabled = true;
      button.textContent = "Saving...";
      flash("");

      try {
        await api(`/api/admin/users/${encodeURIComponent(uid)}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        flash("Customer account updated successfully.");
        await loadUsers();
      } catch (error) {
        flash(error?.message || "Unable to update user", true);
      } finally {
        button.disabled = false;
        button.textContent = "Save";
      }
    });

    loadUsers().catch((error) => {
      flash(error?.message || "Unable to load admin dashboard", true);
      if (/unauthorized/i.test(String(error?.message || ""))) {
        window.location.href = "/admin/login.html";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireAdminLogin();
    wireAdminDashboard();
  });
})();
