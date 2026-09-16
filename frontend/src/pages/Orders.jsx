import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { orderService, menuService } from "../services/menuService";
import reservationService from "../services/reservationService";

const STATUSES = ["Placed", "Preparing", "Ready", "Served"];
const BLANK_LINE = { menuId: "", qty: 1 };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationId, setReservationId] = useState("");
  const [lines, setLines] = useState([{ ...BLANK_LINE }]);
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    orderService.getAll().then(setOrders);
  }

  useEffect(() => {
    refresh();
    menuService.getAll().then(setMenu);
    reservationService.getAll().then((all) => setReservations(all.filter((r) => r.status === "Seated")));

    const handleUpdate = () => {
      refresh();
      menuService.getAll().then(setMenu);
      reservationService.getAll().then((all) => setReservations(all.filter((r) => r.status === "Seated")));
    };

    window.addEventListener("db_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("db_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  function menuPrice(id) {
    return menu.find((m) => m.id === id)?.price || 0;
  }

  function updateLine(idx, field, value) {
    setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  }

  function addLine() {
    setLines((ls) => [...ls, { ...BLANK_LINE }]);
  }

  function removeLine(idx) {
    setLines((ls) => ls.filter((_, i) => i !== idx));
  }

  const total = lines.reduce((sum, l) => sum + menuPrice(l.menuId) * Number(l.qty || 0), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    const validLines = lines.filter((l) => l.menuId);
    if (!reservationId || validLines.length === 0) return;
    await orderService.create({ reservationId, items: validLines, total });
    setLines([{ ...BLANK_LINE }]);
    setReservationId("");
    setShowForm(false);
    refresh();
  }

  async function advanceStatus(order) {
    const idx = STATUSES.indexOf(order.status);
    const next = STATUSES[Math.min(idx + 1, STATUSES.length - 1)];
    await orderService.update(order.id, { status: next });
    refresh();
  }

  function tableLabelFor(reservationId) {
    const r = reservations.find((res) => res.id === reservationId);
    return r ? `Table ${r.tableNumber} · ${r.customerName}` : reservationId;
  }

  return (
    <DashboardLayout title="Orders">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Kitchen queue</h5>
        <button className="btn btn-brass" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Close" : "+ Place order"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-plain p-3 mb-4">
          <label className="mono" style={{ fontSize: "0.75rem" }}>Seated table</label>
          <select className="form-select mb-3" required value={reservationId} onChange={(e) => setReservationId(e.target.value)}>
            <option value="">Select a seated table</option>
            {reservations.map((r) => (
              <option key={r.id} value={r.id}>Table {r.tableNumber} · {r.customerName}</option>
            ))}
          </select>

          {lines.map((line, idx) => (
            <div className="row g-2 align-items-end mb-2" key={idx}>
              <div className="col-7">
                <select className="form-select" value={line.menuId} onChange={(e) => updateLine(idx, "menuId", e.target.value)}>
                  <option value="">Select item</option>
                  {menu.map((m) => <option key={m.id} value={m.id}>{m.name} — ₹{m.price}</option>)}
                </select>
              </div>
              <div className="col-3">
                <input type="number" min={1} className="form-control" value={line.qty} onChange={(e) => updateLine(idx, "qty", e.target.value)} />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-outline-ink w-100" onClick={() => removeLine(idx)}>✕</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline-ink mb-3" onClick={addLine}>+ Add item</button>

          <div className="d-flex justify-content-between align-items-center">
            <strong>Total: ₹{total}</strong>
            <button className="btn btn-ink">Place order</button>
          </div>
        </form>
      )}

      <div className="row g-3">
        {orders.map((order) => (
          <div className="col-12 col-md-6 col-lg-4" key={order.id}>
            <div className="card-plain p-3 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between mb-1">
                <strong>{tableLabelFor(order.reservationId)}</strong>
                <span className="status-pill" style={{ background: "var(--parchment-dim)" }}>{order.status}</span>
              </div>
              <ul className="mb-2" style={{ fontSize: "0.88rem", paddingLeft: "1.1rem" }}>
                {order.items.map((it, i) => {
                  const m = menu.find((mm) => mm.id === it.menuId);
                  return <li key={i}>{m?.name || "Item"} × {it.qty}</li>;
                })}
              </ul>
              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="mono">₹{order.total}</span>
                {order.status !== "Served" && (
                  <button className="btn btn-sm btn-outline-ink" onClick={() => advanceStatus(order)}>
                    Mark {STATUSES[STATUSES.indexOf(order.status) + 1]}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-secondary">No orders yet.</p>}
      </div>
    </DashboardLayout>
  );
}
