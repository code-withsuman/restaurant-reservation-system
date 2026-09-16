import api from "./api";
import db from "./db";

const tableService = {
  async getAll() {
    try {
      const res = await api.get("/tables");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        return data.map((t) => ({ ...t, id: t._id || t.id }));
      }
      return data;
    } catch {
      return db.getAll("tables");
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/tables/${id}`);
      const t = res.data?.data || res.data;
      return { ...t, id: t._id || t.id };
    } catch {
      return db.getOne("tables", id);
    }
  },

  async create(table) {
    try {
      const res = await api.post("/tables", table);
      const created = res.data?.data || res.data;
      const result = { ...created, id: created._id || created.id };
      db.insert("tables", result);
      return result;
    } catch {
      return db.insert("tables", { status: "Available", ...table });
    }
  },

  async update(id, patch) {
    try {
      const res = await api.put(`/tables/${id}`, patch);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("tables", id, patch);
      return result;
    } catch {
      return db.update("tables", id, patch);
    }
  },

  async setStatus(id, status) {
    try {
      const res = await api.patch(`/tables/${id}/status`, { status });
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("tables", id, { status });
      return result;
    } catch {
      return db.update("tables", id, { status });
    }
  },

  async remove(id) {
    try {
      await api.delete(`/tables/${id}`);
      db.remove("tables", id);
      return true;
    } catch {
      return db.remove("tables", id);
    }
  },
};

export default tableService;
