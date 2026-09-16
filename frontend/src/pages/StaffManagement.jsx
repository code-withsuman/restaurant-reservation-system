import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import db from "../services/db";

const DEPARTMENTS = ["Service", "Kitchen", "Front Desk", "Bar & Beverages", "Housekeeping", "Management"];
const SHIFTS = [
  "Morning (9 AM - 4 PM)",
  "Evening (4 PM - 11 PM)",
  "Night (6 PM - 1 AM)",
  "Full Day (10 AM - 10 PM)",
];

const DEFAULT_NEW_STAFF = {
  name: "",
  email: "",
  phone: "",
  designation: "Waiter / Server",
  department: "Service",
  shift: "Morning (9 AM - 4 PM)",
  status: "Active",
  password: "",
};

export default function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [newStaff, setNewStaff] = useState(DEFAULT_NEW_STAFF);
  const [editForm, setEditForm] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  function loadUsers() {
    db.getAll("users").then((data) => setUsers(data || []));
  }

  useEffect(() => {
    loadUsers();
    const handleUpdate = () => loadUsers();
    window.addEventListener("db_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("db_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  // ONLY show staff members (exclude admin and customer users)
  const staffMembers = users.filter((u) => u.role === "staff");

  const filteredStaff = staffMembers.filter((s) => {
    const matchesDept = filterDepartment === "all" || s.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" || (s.status || "Active").toLowerCase() === filterStatus.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (s.name || "").toLowerCase().includes(query) ||
      (s.email || "").toLowerCase().includes(query) ||
      (s.phone || "").includes(query) ||
      (s.designation || "").toLowerCase().includes(query) ||
      (s.department || "").toLowerCase().includes(query);
    return matchesDept && matchesStatus && matchesSearch;
  });

  async function handleAddStaff(e) {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    setActionLoading(true);

    try {
      const emailLower = newStaff.email.trim().toLowerCase();
      // Check if email already exists
      if (users.some((u) => u.email?.toLowerCase() === emailLower)) {
        throw new Error("A user account with this email address already exists.");
      }

      const created = await db.insert("users", {
        name: newStaff.name.trim(),
        email: emailLower,
        phone: newStaff.phone.trim(),
        designation: newStaff.designation.trim() || "Staff Member",
        department: newStaff.department || "Service",
        shift: newStaff.shift || "Morning (9 AM - 4 PM)",
        status: newStaff.status || "Active",
        role: "staff",
        password: newStaff.password || "staff123",
        createdAt: new Date().toISOString(),
      });

      setUsers((prev) => [...prev, created]);
      setMsg({ text: `Successfully created staff account for ${newStaff.name}!`, type: "success" });
      setShowAddModal(false);
      setNewStaff(DEFAULT_NEW_STAFF);
      loadUsers();
    } catch (err) {
      setMsg({ text: err.message, type: "danger" });
    } finally {
      setActionLoading(false);
    }
  }

  function startEdit(staff) {
    setEditingStaff(staff);
    setEditForm({
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      designation: staff.designation || "Staff Member",
      department: staff.department || "Service",
      shift: staff.shift || "Morning (9 AM - 4 PM)",
      status: staff.status || "Active",
      password: "", // empty means do not change
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingStaff || !editForm) return;
    setMsg({ text: "", type: "" });
    setActionLoading(true);

    try {
      const emailLower = editForm.email.trim().toLowerCase();
      // Check duplicate email if changed
      if (
        users.some(
          (u) => u.id !== editingStaff.id && u.email?.toLowerCase() === emailLower
        )
      ) {
        throw new Error("Another account with this email already exists.");
      }

      const patch = {
        name: editForm.name.trim(),
        email: emailLower,
        phone: editForm.phone.trim(),
        designation: editForm.designation.trim(),
        department: editForm.department,
        shift: editForm.shift,
        status: editForm.status,
      };

      if (editForm.password && editForm.password.trim() !== "") {
        patch.password = editForm.password.trim();
      }

      const updated = await db.update("users", editingStaff.id, patch);
      setUsers((prev) => prev.map((u) => (u.id === editingStaff.id ? { ...u, ...updated } : u)));
      setMsg({ text: `Successfully updated details for ${editForm.name}.`, type: "success" });
      setEditingStaff(null);
      setEditForm(null);
      loadUsers();
    } catch (err) {
      setMsg({ text: err.message, type: "danger" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirmDeleteStaff() {
    if (!deletingStaff) return;
    const target = deletingStaff;
    setDeleteLoading(true);

    // Optimistically remove from state immediately for instantaneous webpage update
    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    setDeletingStaff(null);

    try {
      await db.remove("users", target.id);
      setMsg({ text: `Removed staff member ${target.name}.`, type: "success" });
      loadUsers();
    } catch (err) {
      setMsg({ text: err.message, type: "danger" });
      loadUsers();
    } finally {
      setDeleteLoading(false);
    }
  }

  // Quick stat counts
  const totalStaffCount = staffMembers.length;
  const activeStaffCount = staffMembers.filter((s) => (s.status || "Active").toLowerCase() === "active").length;
  const serviceCount = staffMembers.filter((s) => s.department === "Service").length;
  const kitchenCount = staffMembers.filter((s) => s.department === "Kitchen").length;

  return (
    <DashboardLayout title="Staff">
      {/* Header Banner */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="font-heading fw-bold mb-1" style={{ color: "var(--dark)" }}>
            Staff
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Manage restaurant staff members, shift assignments, roles, and operational credentials.
          </p>
        </div>
        <button
          className="btn btn-primary-custom px-4 py-2.5 fw-semibold d-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setNewStaff(DEFAULT_NEW_STAFF);
            setShowAddModal(true);
          }}
        >
          <span>➕</span> Add New Staff
        </button>
      </div>

      {/* Alert Notifications */}
      {msg.text && (
        <div className={`alert alert-${msg.type} alert-dismissible fade show rounded-3 mb-4 shadow-sm`} role="alert">
          {msg.type === "success" ? "✅ " : "⚠️ "}
          {msg.text}
          <button type="button" className="btn-close" onClick={() => setMsg({ text: "", type: "" })}></button>
        </div>
      )}

      {/* Quick Summary Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card-plain p-3 d-flex align-items-center gap-3 shadow-sm rounded-4">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: "46px", height: "46px", backgroundColor: "#2563eb", fontSize: "1.3rem" }}
            >
              👥
            </div>
            <div>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                Total Staff
              </div>
              <div className="fw-bold fs-4 font-mono text-dark">{totalStaffCount}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card-plain p-3 d-flex align-items-center gap-3 shadow-sm rounded-4">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: "46px", height: "46px", backgroundColor: "#10b981", fontSize: "1.3rem" }}
            >
              🟢
            </div>
            <div>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                Active On Duty
              </div>
              <div className="fw-bold fs-4 font-mono text-dark">{activeStaffCount}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card-plain p-3 d-flex align-items-center gap-3 shadow-sm rounded-4">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: "46px", height: "46px", backgroundColor: "#d97706", fontSize: "1.3rem" }}
            >
              🍽️
            </div>
            <div>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                Service Team
              </div>
              <div className="fw-bold fs-4 font-mono text-dark">{serviceCount}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card-plain p-3 d-flex align-items-center gap-3 shadow-sm rounded-4">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: "46px", height: "46px", backgroundColor: "#ef4444", fontSize: "1.3rem" }}
            >
              👨‍🍳
            </div>
            <div>
              <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                Kitchen &amp; Chefs
              </div>
              <div className="fw-bold fs-4 font-mono text-dark">{kitchenCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="card-plain p-3 mb-4 shadow-sm rounded-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-muted">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search staff name, email, designation, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn btn-outline-secondary border-start-0" onClick={() => setSearchQuery("")}>
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-7">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
              {/* Department Filter Tabs */}
              <div className="btn-group" role="group">
                <button
                  className={`btn btn-sm ${filterDepartment === "all" ? "btn-ink" : "btn-outline-ink"}`}
                  onClick={() => setFilterDepartment("all")}
                >
                  All Depts ({staffMembers.length})
                </button>
                <button
                  className={`btn btn-sm ${filterDepartment === "Service" ? "btn-ink" : "btn-outline-ink"}`}
                  onClick={() => setFilterDepartment("Service")}
                >
                  Service ({serviceCount})
                </button>
                <button
                  className={`btn btn-sm ${filterDepartment === "Kitchen" ? "btn-ink" : "btn-outline-ink"}`}
                  onClick={() => setFilterDepartment("Kitchen")}
                >
                  Kitchen ({kitchenCount})
                </button>
              </div>

              {/* Status Filter */}
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="on leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Records Table */}
      <div className="card-plain shadow-sm rounded-4 overflow-hidden border">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)" }}>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3">Contact</th>
                <th className="py-3">Designation &amp; Dept</th>
                <th className="py-3">Shift Timing</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div style={{ fontSize: "2rem" }} className="mb-2">👥</div>
                    <div className="fw-semibold">No staff members found matching your search.</div>
                    <div style={{ fontSize: "0.85rem" }}>Try clearing search filters or add a new staff member.</div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const statusNormalized = (staff.status || "Active").toLowerCase();
                  const badgeClass =
                    statusNormalized === "active"
                      ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                      : statusNormalized === "on leave"
                      ? "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"
                      : "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25";

                  const deptColor =
                    staff.department === "Kitchen"
                      ? "#dc2626"
                      : staff.department === "Front Desk"
                      ? "#2563eb"
                      : staff.department === "Bar & Beverages"
                      ? "#7c3aed"
                      : "#d97706";

                  return (
                    <tr key={staff.id} style={{ transition: "background 0.2s" }}>
                      {/* Staff Member Info */}
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0 shadow-sm"
                            style={{ width: "42px", height: "42px", backgroundColor: deptColor, fontSize: "1rem" }}
                          >
                            {staff.name ? staff.name.charAt(0).toUpperCase() : "S"}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{staff.name}</div>
                            <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                              {staff.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 font-mono" style={{ fontSize: "0.88rem" }}>
                        <a
                          href={`tel:${staff.phone}`}
                          className="text-decoration-none text-dark d-inline-flex align-items-center gap-1.5"
                        >
                          <span>📞</span> {staff.phone || "—"}
                        </a>
                      </td>

                      {/* Designation & Department */}
                      <td className="py-3">
                        <div className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
                          {staff.designation || "Staff Member"}
                        </div>
                        <span
                          className="badge rounded-pill mt-1"
                          style={{
                            fontSize: "0.72rem",
                            backgroundColor: "rgba(0,0,0,0.06)",
                            color: "var(--dark)",
                          }}
                        >
                          📂 {staff.department || "Service"}
                        </span>
                      </td>

                      {/* Shift */}
                      <td className="py-3" style={{ fontSize: "0.85rem" }}>
                        <span className="d-inline-flex align-items-center gap-1 text-muted">
                          <span>⏰</span> {staff.shift || "Morning (9 AM - 4 PM)"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 text-center">
                        <span className={`badge px-2.5 py-1 rounded-pill text-capitalize fw-semibold ${badgeClass}`}>
                          ● {staff.status || "Active"}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 text-end px-4">
                        <div className="d-inline-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1 fw-semibold"
                            onClick={() => startEdit(staff)}
                            title="Edit Staff Member"
                          >
                            <span>✏️</span> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1 fw-semibold"
                            onClick={() => setDeletingStaff(staff)}
                            title="Delete Staff Member"
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="cancel-modal-card text-start"
            style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="font-heading fw-bold mb-1">Add New Staff Member</h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Create an operational staff account for restaurant duties.
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ramesh@desidelighthotels.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="9876543210"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Designation / Role <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Head Waiter, Sous Chef"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Department
                  </label>
                  <select
                    className="form-select"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Shift Timing
                  </label>
                  <select
                    className="form-select"
                    value={newStaff.shift}
                    onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                  >
                    {SHIFTS.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Staff Status
                  </label>
                  <select
                    className="form-select"
                    value={newStaff.status}
                    onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                  Staff Login Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Set login password (e.g. staff123)"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  required
                />
              </div>

              <div className="d-flex gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-fill py-2 fw-semibold rounded-3"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-custom flex-fill py-2 fw-semibold rounded-3"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Creating..." : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && editForm && (
        <div className="cancel-modal-overlay" onClick={() => setEditingStaff(null)}>
          <div
            className="cancel-modal-card text-start"
            style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="font-heading fw-bold mb-1">Edit Staff Member</h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Update details and operational settings for <strong>{editingStaff.name}</strong>.
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setEditingStaff(null)}
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Designation / Role <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Department
                  </label>
                  <select
                    className="form-select"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Shift Timing
                  </label>
                  <select
                    className="form-select"
                    value={editForm.shift}
                    onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                  >
                    {SHIFTS.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                    Staff Status
                  </label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
                  Change Password <span className="text-muted fw-normal">(Leave empty to keep current password)</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password if changing"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </div>

              <div className="d-flex gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-fill py-2 fw-semibold rounded-3"
                  onClick={() => setEditingStaff(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-custom flex-fill py-2 fw-semibold rounded-3"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingStaff}
        title={`Remove Staff Member "${deletingStaff?.name}"?`}
        message={
          <>
            Are you sure you want to remove staff member <strong className="text-dark">{deletingStaff?.name}</strong> ({deletingStaff?.email})? This staff account will be permanently deleted and cannot be undone.
          </>
        }
        onConfirm={handleConfirmDeleteStaff}
        onClose={() => setDeletingStaff(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}
