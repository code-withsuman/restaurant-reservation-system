import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import reservationService from "../services/reservationService";
import tableService from "../services/tableService";
import { customerService, paymentService } from "../services/menuService";
import db from "../services/db";

export default function Reports() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    reservationService.getAll().then(setReservations);
    tableService.getAll().then(setTables);
    customerService.getAll().then(setCustomers);
    paymentService.getAll().then(setPayments);
  }, []);

  const today = db.todayStr();
  const todaysReservations = reservations.filter((r) => r.date === today);
  const monthRevenue = payments
    .filter((p) => new Date(p.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, p) => s + p.amount, 0);

  const tableCounts = {};
  reservations.forEach((r) => {
    tableCounts[r.tableNumber] = (tableCounts[r.tableNumber] || 0) + 1;
  });
  const popularTables = Object.entries(tableCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const occupancyRate = tables.length
    ? Math.round((tables.filter((t) => t.status === "Occupied").length / tables.length) * 100)
    : 0;

  return (
    <DashboardLayout title="Reports">
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3"><StatCard label="Reservations today" value={todaysReservations.length} /></div>
        <div className="col-6 col-lg-3"><StatCard label="Revenue this month" value={`₹${monthRevenue}`} accent="var(--sage)" /></div>
        <div className="col-6 col-lg-3"><StatCard label="Registered customers" value={customers.length} accent="var(--clay)" /></div>
        <div className="col-6 col-lg-3"><StatCard label="Current occupancy" value={`${occupancyRate}%`} accent="var(--burgundy)" /></div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card-plain p-3 h-100">
            <h6>Popular tables</h6>
            <table className="table table-clean mb-0">
              <thead><tr><th>Table</th><th>Bookings</th></tr></thead>
              <tbody>
                {popularTables.map(([num, count]) => (
                  <tr key={num}><td>Table {num}</td><td className="mono">{count}</td></tr>
                ))}
                {popularTables.length === 0 && <tr><td colSpan={2} className="text-secondary">No data yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card-plain p-3 h-100">
            <h6>Frequent customers</h6>
            <table className="table table-clean mb-0">
              <thead><tr><th>Name</th><th>Visits</th></tr></thead>
              <tbody>
                {[...customers].sort((a, b) => (b.visits || 0) - (a.visits || 0)).slice(0, 5).map((c) => (
                  <tr key={c.id}><td>{c.name}</td><td className="mono">{c.visits || 0}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
