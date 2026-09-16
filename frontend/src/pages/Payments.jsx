import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { orderService, paymentService } from "../services/menuService";

const METHODS = ["Cash", "Card", "UPI"];

export default function Payments() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [method, setMethod] = useState("Cash");
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    orderService.getAll().then(setOrders);
    paymentService.getAll().then((all) => setPayments(all.slice().reverse()));
  }
  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("db_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("db_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  const unpaidOrders = orders.filter((o) => !payments.some((p) => p.orderId === o.id));

  async function handleSubmit(e) {
    e.preventDefault();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    await paymentService.create({ orderId, amount: order.total, method });
    setOrderId("");
    setShowForm(false);
    refresh();
  }

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <DashboardLayout title="Payments">
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="stat-card">
            <div className="stat-label">Total collected</div>
            <div className="stat-value">₹{totalCollected}</div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="stat-card">
            <div className="stat-label">Payments recorded</div>
            <div className="stat-value">{payments.length}</div>
          </div>
        </div>
        <div className="col-12 col-md-4 d-flex align-items-center">
          <button className="btn btn-brass w-100" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "+ Record payment"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-plain p-3 mb-4">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <label className="mono" style={{ fontSize: "0.75rem" }}>Order</label>
              <select className="form-select" required value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                <option value="">Select an unpaid order</option>
                {unpaidOrders.map((o) => <option key={o.id} value={o.id}>{o.id} — ₹{o.total}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="mono" style={{ fontSize: "0.75rem" }}>Method</label>
              <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                {METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-ink mt-3" style={{ width: 180 }}>Confirm payment</button>
        </form>
      )}

      <div className="card-plain p-3">
        <table className="table table-clean mb-0">
          <thead>
            <tr><th>Payment ID</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="mono">{p.id}</td>
                <td className="mono">{p.orderId}</td>
                <td>₹{p.amount}</td>
                <td>{p.method}</td>
                <td><span className="status-pill" style={{ background: "var(--sage-bg)", color: "var(--sage)" }}>{p.status}</span></td>
                <td className="mono">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="text-secondary">No payments recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
