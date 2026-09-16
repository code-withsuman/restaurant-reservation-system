import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { customerService } from "../services/menuService";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    customerService.getAll().then(setCustomers);
  }, []);

  const visible = customers
    .filter((c) => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.visits || 0) - (a.visits || 0));

  return (
    <DashboardLayout title="Customers">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Search customers…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="eyebrow">{customers.length} on record</span>
      </div>

      <div className="card-plain p-3">
        <table className="table table-clean mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.id}>
                <td>
                  <span className="fw-semibold">{c.name}</span>
                  {(c.visits || 0) >= 5 && (
                    <span className="badge rounded-pill ms-2 role-badge-customer" style={{ fontSize: "0.68rem" }}>
                      Regular
                    </span>
                  )}
                </td>
                <td className="mono">{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.address || "—"}</td>
                <td className="mono">{c.visits || 0}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="text-secondary">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
