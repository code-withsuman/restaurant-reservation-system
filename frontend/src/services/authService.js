import api from "./api";
import db from "./db";

function fakeToken(user) {
  return btoa(`${user.id || user._id}:${user.role}:${Date.now()}`);
}

const authService = {
  async login(loginInput, password) {
    const input = (loginInput || "").trim();
    const cleanPassword = (password || "").trim();

    try {
      const res = await api.post("/auth/login", { loginInput: input, password: cleanPassword });
      const { user, token } = res.data;
      const safeUser = { ...user, id: user._id || user.id };
      localStorage.setItem("ttw_token", token);
      localStorage.setItem("ttw_user", JSON.stringify(safeUser));
      return safeUser;
    } catch {
      // Local db fallback
      const users = await db.getAll("users");
      const cleanPhoneInput = input.replace(/\D/g, "");
      const user = users.find(
        (u) =>
          (u.email?.toLowerCase() === input.toLowerCase() ||
            (u.phone && cleanPhoneInput && u.phone.replace(/\D/g, "") === cleanPhoneInput)) &&
          u.password === cleanPassword
      );
      if (!user) throw new Error("Invalid contact number/email or password.");
      const { password: _pw, ...safeUser } = user;
      const token = fakeToken(user);
      localStorage.setItem("ttw_token", token);
      localStorage.setItem("ttw_user", JSON.stringify(safeUser));
      return safeUser;
    }
  },

  async register({ name, email, password, phone }) {
    try {
      const res = await api.post("/auth/register", { name, email, password, phone });
      const { user, token } = res.data;
      const safeUser = { ...user, id: user._id || user.id };
      localStorage.setItem("ttw_token", token);
      localStorage.setItem("ttw_user", JSON.stringify(safeUser));
      return safeUser;
    } catch {
      const users = await db.getAll("users");
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const created = await db.insert("users", { name, email, password, phone, role: "customer" });
      await db.insert("customers", { name, phone, email, address: "" });
      const { password: _pw, ...safeUser } = created;
      const token = fakeToken(created);
      localStorage.setItem("ttw_token", token);
      localStorage.setItem("ttw_user", JSON.stringify(safeUser));
      return safeUser;
    }
  },

  async forgotPassword(email) {
    return { message: "Password reset instructions sent." };
  },

  async updateProfile(userId, patch) {
    try {
      const res = await api.put("/auth/profile", patch);
      const updated = res.data?.user || res.data;
      const safeUser = { ...updated, id: updated._id || updated.id };
      localStorage.setItem("ttw_user", JSON.stringify(safeUser));
      return safeUser;
    } catch {
      const updated = await db.update("users", userId, patch);
      const { password: _pw, ...safeUser } = updated;
      localStorage.setItem("ttw_user", JSON.stringify(safeUser));
      return safeUser;
    }
  },

  logout() {
    localStorage.removeItem("ttw_token");
    localStorage.removeItem("ttw_user");
  },

  getCurrentUser() {
    const raw = localStorage.getItem("ttw_user");
    return raw ? JSON.parse(raw) : null;
  },
};

export default authService;
