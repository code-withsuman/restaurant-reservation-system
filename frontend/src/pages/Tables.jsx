import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TableCard from "../components/TableCard";
import DeleteTableModal from "../components/DeleteTableModal";
import tableService from "../services/tableService";

const BLANK = { number: "", capacity: 2, location: "Main Hall", status: "Available" };
const DEFAULT_LOCATIONS = ["Window", "Main Hall", "Patio", "Private Room"];

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingTarget, setDeletingTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Custom location addition states
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customLocationText, setCustomLocationText] = useState("");

  const dynamicLocations = Array.from(
    new Set([...DEFAULT_LOCATIONS, ...tables.map((t) => t.location).filter(Boolean)])
  );

  function refresh() {
    tableService.getAll().then(setTables);
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

  function update(field, value) {
    setFormError("");
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleLocationSelectChange(val) {
    setFormError("");
    if (val === "__ADD_NEW__") {
      setIsCustomLocation(true);
      setCustomLocationText("");
      setForm((f) => ({ ...f, location: "" }));
    } else {
      setIsCustomLocation(false);
      setForm((f) => ({ ...f, location: val }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const targetNumber = Number(form.number);
    const targetCapacity = Number(form.capacity);
    const finalLocation = isCustomLocation ? customLocationText.trim() : form.location;

    if (!finalLocation) {
      setFormError("⚠️ Please specify a valid table location.");
      return;
    }

    if (targetCapacity > 12) {
      setFormError("⚠️ Maximum table seating capacity is 12 guests.");
      return;
    }

    // Check if table number already exists for a different table
    const duplicate = tables.find(
      (t) => String(t.number) === String(targetNumber) && String(t.id) !== String(editingId)
    );

    if (duplicate) {
      setFormError(`⚠️ Table Number ${targetNumber} already exists! Please choose a unique table number.`);
      return;
    }

    const payload = {
      ...form,
      number: targetNumber,
      capacity: targetCapacity,
      location: finalLocation,
    };

    if (editingId) {
      await tableService.update(editingId, payload);
    } else {
      await tableService.create(payload);
    }

    setForm(BLANK);
    setEditingId(null);
    setFormError("");
    setIsCustomLocation(false);
    setCustomLocationText("");
    setShowForm(false);
    refresh();
  }

  function startEdit(table) {
    setFormError("");
    const isCustom = !DEFAULT_LOCATIONS.includes(table.location);
    setForm({ number: table.number, capacity: table.capacity, location: table.location, status: table.status });
    setIsCustomLocation(false);
    setCustomLocationText("");
    setEditingId(table.id);
    setShowForm(true);
    // Smooth scroll to form
    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  function requestDelete(id) {
    const target = tables.find((t) => t.id === id);
    if (target) setDeletingTarget(target);
  }

  async function confirmDelete() {
    if (!deletingTarget) return;
    setDeleteLoading(true);
    try {
      await tableService.remove(deletingTarget.id);
      refresh();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleteLoading(false);
      setDeletingTarget(null);
    }
  }

  async function handleStatusChange(id, status) {
    await tableService.setStatus(id, status);
    refresh();
  }

  const visible = statusFilter === "All" ? tables : tables.filter((t) => t.status === statusFilter);

  return (
    <DashboardLayout title="Table Management">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <select className="form-select" style={{ width: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {["All", "Available", "Reserved", "Occupied", "Cleaning"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          className="btn btn-primary-custom px-4 py-2 fw-semibold shadow-sm"
          onClick={() => {
            setForm(BLANK);
            setEditingId(null);
            setFormError("");
            setIsCustomLocation(false);
            setCustomLocationText("");
            setShowForm((v) => !v);
          }}
        >
          {showForm ? "Close Form" : "➕ Add Table"}
        </button>
      </div>

      {/* Styled Modern Add / Edit Table Form Card */}
      {showForm && (
        <div
          className="card-plain p-4 mb-4 border rounded-4 shadow-sm position-relative overflow-hidden"
          style={{ borderTop: "4px solid var(--secondary)" }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div>
              <h5 className="font-heading fw-bold mb-0 text-dark">
                {editingId ? "✏️ Edit Table Configuration" : "➕ Add New Table"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.83rem" }}>
                {editingId
                  ? `Modifying parameters for Table ${form.number || ""}`
                  : "Set up a new dining table for floor reservations."}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-circle"
              onClick={() => {
                setShowForm(false);
                setForm(BLANK);
                setEditingId(null);
                setFormError("");
                setIsCustomLocation(false);
                setCustomLocationText("");
              }}
              title="Close Form"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Validation Error Alert */}
          {formError && (
            <div className="alert alert-danger rounded-3 mb-3 py-2 px-3 d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: "0.88rem" }}>
              {formError}
            </div>
          )}

          {/* Input Fields */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.82rem" }}>
                  🔢 Table Number
                </label>
                <input
                  type="number"
                  className="form-control font-mono fw-bold"
                  required
                  min={1}
                  placeholder="e.g. 9"
                  value={form.number}
                  onChange={(e) => update("number", e.target.value)}
                />
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.82rem" }}>
                  👥 Seating Capacity
                </label>
                <select
                  className="form-select font-mono"
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Person (1 Seat)" : `Persons (${num} Seats)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Location Select or Custom Location Text Input */}
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.82rem" }}>
                  📍 Dining Location
                </label>
                {!isCustomLocation ? (
                  <select
                    className="form-select"
                    value={form.location}
                    onChange={(e) => handleLocationSelectChange(e.target.value)}
                  >
                    {dynamicLocations.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                    <option value="__ADD_NEW__">➕ Add New Custom Location...</option>
                  </select>
                ) : (
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rooftop Terrace"
                      value={customLocationText}
                      onChange={(e) => setCustomLocationText(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setIsCustomLocation(false);
                        setForm((f) => ({ ...f, location: dynamicLocations[0] || "Main Hall" }));
                      }}
                      title="Back to Dropdown"
                    >
                      ↩️
                    </button>
                  </div>
                )}
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.82rem" }}>
                  🚦 Current Status
                </label>
                <select className="form-select text-capitalize" value={form.status} onChange={(e) => update("status", e.target.value)}>
                  {["Available", "Reserved", "Occupied", "Cleaning"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Footer Action Buttons */}
            <div className="d-flex align-items-center gap-2 mt-4 pt-2 border-top">
              <button type="submit" className="btn btn-primary-custom fw-semibold px-4 py-2 text-nowrap">
                {editingId ? "💾 Save Changes" : "➕ Create Table"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary fw-semibold px-4 py-2"
                onClick={() => {
                  setShowForm(false);
                  setForm(BLANK);
                  setEditingId(null);
                  setFormError("");
                  setIsCustomLocation(false);
                  setCustomLocationText("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tables Grid */}
      <div className="row g-3">
        {visible.map((table) => (
          <div className="col-12 col-md-6 col-lg-4" key={table.id}>
            <TableCard
              table={table}
              onStatusChange={handleStatusChange}
              onEdit={startEdit}
              onDelete={requestDelete}
            />
          </div>
        ))}
        {visible.length === 0 && <p className="text-secondary">No tables match this filter.</p>}
      </div>

      {deletingTarget && (
        <DeleteTableModal
          table={deletingTarget}
          onConfirm={confirmDelete}
          onClose={() => setDeletingTarget(null)}
          loading={deleteLoading}
        />
      )}
    </DashboardLayout>
  );
}
