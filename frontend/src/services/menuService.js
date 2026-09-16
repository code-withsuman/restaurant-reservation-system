import api from "./api";
import db from "./db";

export const menuService = {
  async getAll() {
    try {
      const res = await api.get("/menu");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) return data.map((item) => ({ ...item, id: item._id || item.id }));
      return data;
    } catch {
      return db.getAll("menu");
    }
  },
  async create(item) {
    try {
      const res = await api.post("/menu", item);
      const created = res.data?.data || res.data;
      const result = { ...created, id: created._id || created.id };
      db.insert("menu", result);
      return result;
    } catch {
      return db.insert("menu", item);
    }
  },
  async update(id, patch) {
    try {
      const res = await api.put(`/menu/${id}`, patch);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("menu", id, patch);
      return result;
    } catch {
      return db.update("menu", id, patch);
    }
  },
  async remove(id) {
    try {
      await api.delete(`/menu/${id}`);
      db.remove("menu", id);
      return true;
    } catch {
      return db.remove("menu", id);
    }
  },
};

export const orderService = {
  async getAll() {
    try {
      const res = await api.get("/orders");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) return data.map((o) => ({ ...o, id: o._id || o.id }));
      return data;
    } catch {
      return db.getAll("orders");
    }
  },
  async create(order) {
    try {
      const res = await api.post("/orders", order);
      const created = res.data?.data || res.data;
      const result = { ...created, id: created._id || created.id };
      db.insert("orders", result);
      return result;
    } catch {
      return db.insert("orders", { status: "Placed", ...order });
    }
  },
  async update(id, patch) {
    try {
      const res = await api.put(`/orders/${id}`, patch);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("orders", id, patch);
      return result;
    } catch {
      return db.update("orders", id, patch);
    }
  },
  async remove(id) {
    try {
      await api.delete(`/orders/${id}`);
      db.remove("orders", id);
      return true;
    } catch {
      return db.remove("orders", id);
    }
  },
};

export const paymentService = {
  async getAll() {
    try {
      const res = await api.get("/payments");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) return data.map((p) => ({ ...p, id: p._id || p.id }));
      return data;
    } catch {
      return db.getAll("payments");
    }
  },
  async create(payment) {
    try {
      const res = await api.post("/payments", payment);
      const created = res.data?.data || res.data;
      const result = { ...created, id: created._id || created.id };
      db.insert("payments", result);
      return result;
    } catch {
      return db.insert("payments", { status: "Paid", createdAt: new Date().toISOString(), ...payment });
    }
  },
};

export const customerService = {
  async getAll() {
    try {
      const res = await api.get("/customers");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) return data.map((c) => ({ ...c, id: c._id || c.id }));
      return data;
    } catch {
      return db.getAll("customers");
    }
  },
  async create(c) {
    try {
      const res = await api.post("/customers", c);
      const created = res.data?.data || res.data;
      const result = { ...created, id: created._id || created.id };
      db.insert("customers", result);
      return result;
    } catch {
      return db.insert("customers", c);
    }
  },
  async update(id, patch) {
    try {
      const res = await api.put(`/customers/${id}`, patch);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("customers", id, patch);
      return result;
    } catch {
      return db.update("customers", id, patch);
    }
  },
  async remove(id) {
    try {
      await api.delete(`/customers/${id}`);
      db.remove("customers", id);
      return true;
    } catch {
      return db.remove("customers", id);
    }
  },
};

export default { menuService, orderService, paymentService, customerService };
