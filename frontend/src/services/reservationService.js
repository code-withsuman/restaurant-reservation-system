import api from "./api";
import db from "./db";

const reservationService = {
  async getAll() {
    try {
      const res = await api.get("/reservations");
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) return data.map((r) => ({ ...r, id: r._id || r.id }));
      return data;
    } catch {
      return db.getAll("reservations");
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/reservations/${id}`);
      const data = res.data?.data || res.data;
      return { ...data, id: data._id || data.id };
    } catch {
      return db.getOne("reservations", id);
    }
  },

  async create(reservation) {
    try {
      const res = await api.post("/reservations", reservation);
      const created = res.data?.data || res.data;
      const result = { ...created, id: created._id || created.id };
      db.insert("reservations", result);
      return result;
    } catch {
      const created = await db.insert("reservations", { status: "Confirmed", ...reservation });
      if (reservation.tableId) {
        await db.update("tables", reservation.tableId, { status: "Reserved" });
      }
      return created;
    }
  },

  async update(id, patch) {
    try {
      const res = await api.put(`/reservations/${id}`, patch);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("reservations", id, patch);
      return result;
    } catch {
      return db.update("reservations", id, patch);
    }
  },

  async cancel(id) {
    try {
      const res = await api.put(`/reservations/${id}/cancel`);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("reservations", id, { status: "Cancelled" });
      return result;
    } catch {
      const r = await db.getOne("reservations", id);
      if (r?.tableId) await db.update("tables", r.tableId, { status: "Available" });
      return db.update("reservations", id, { status: "Cancelled" });
    }
  },

  async checkIn(id) {
    try {
      const res = await api.put(`/reservations/${id}/check-in`);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("reservations", id, { status: "Seated" });
      return result;
    } catch {
      const r = await db.getOne("reservations", id);
      if (r?.tableId) await db.update("tables", r.tableId, { status: "Occupied" });
      return db.update("reservations", id, { status: "Seated" });
    }
  },

  async checkOut(id) {
    try {
      const res = await api.put(`/reservations/${id}/check-out`);
      const updated = res.data?.data || res.data;
      const result = { ...updated, id: updated._id || updated.id };
      db.update("reservations", id, { status: "Completed" });
      return result;
    } catch {
      const r = await db.getOne("reservations", id);
      if (r?.tableId) await db.update("tables", r.tableId, { status: "Cleaning" });
      return db.update("reservations", id, { status: "Completed" });
    }
  },

  async remove(id) {
    try {
      await api.delete(`/reservations/${id}`);
      db.remove("reservations", id);
      return true;
    } catch {
      return db.remove("reservations", id);
    }
  },

  async claimByPhone(phone, userId) {
    if (!phone || !userId) return 0;
    const all = await this.getAll();
    const matches = all.filter((r) => r.phone === phone && !r.customerId);
    await Promise.all(matches.map((r) => this.update(r.id, { customerId: userId })));
    return matches.length;
  },
};

export default reservationService;
