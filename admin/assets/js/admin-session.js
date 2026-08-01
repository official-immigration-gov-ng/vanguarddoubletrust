(() => {
  function money(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "$0.00";
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
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
    let state = { users: [] };

    logoutBtn?.addEventListener("click", async () => {
      try {
        await api("/api/admin/logout", { method: "POST" });
      } catch {}
      window.location.href = "/admin/login.html";
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
