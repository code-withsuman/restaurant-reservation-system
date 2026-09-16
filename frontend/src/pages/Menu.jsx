import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { menuService } from "../services/menuService";
import { useAuth } from "../context/AuthContext";
import { getMenuItemImage } from "../utils/menuImages";

const BLANK = { name: "", category: "Starters", price: "", description: "", image: "" };
const CATEGORIES = ["Starters", "Main Course", "Desserts", "Beverages"];

export default function Menu() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("All");
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canManage = user?.role === "admin" || user?.role === "staff";

  function refresh() {
    menuService.getAll().then((data) => {
      if (Array.isArray(data)) setItems(data);
    });
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
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      image: form.image?.trim() || getMenuItemImage({ name: form.name, category: form.category }),
    };
    if (editingId) await menuService.update(editingId, payload);
    else await menuService.create(payload);
    setForm(BLANK);
    setEditingId(null);
    setShowForm(false);
    refresh();
  }

  function startEdit(item) {
    setForm({
      name: item.name || "",
      category: item.category || "Starters",
      price: item.price || "",
      description: item.description || "",
      image: item.image || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await menuService.remove(deletingItem.id);
      refresh();
    } finally {
      setDeleteLoading(false);
      setDeletingItem(null);
    }
  }

  const visible = category === "All" ? items : items.filter((i) => i.category === category);

  return (
    <DashboardLayout title="Menu Management">
      {/* Top Filter & Add Toolbar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <div className="d-flex align-items-center gap-2">
          <label className="fw-semibold text-muted mb-0" style={{ fontSize: "0.85rem" }}>Filter:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: 190 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <span className="badge bg-secondary bg-opacity-10 text-muted ms-1">
            {visible.length} {visible.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {canManage && (
          <button
            className="btn btn-brass d-flex align-items-center gap-2 fw-semibold px-3 py-2 shadow-sm"
            onClick={() => {
              setForm(BLANK);
              setEditingId(null);
              setShowForm((v) => !v);
            }}
          >
            {showForm ? "✕ Close Form" : "➕ Add New Menu Item"}
          </button>
        )}
      </div>

      {/* Add / Edit Item Form */}
      {showForm && canManage && (
        <form onSubmit={handleSubmit} className="card-plain p-4 mb-4 shadow-sm border rounded-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h5 className="font-heading fw-bold mb-0 text-dark">
              {editingId ? `✏️ Edit "${form.name || "Item"}"` : "🍽️ Add New Menu Item"}
            </h5>
            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
              Fill in the dish details & authentic photo URL
            </span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.78rem" }}>ITEM NAME *</label>
              <input
                className="form-control"
                required
                placeholder="e.g. Kosha Mangsho"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.78rem" }}>CATEGORY *</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.78rem" }}>PRICE (₹) *</label>
              <input
                type="number"
                min={0}
                className="form-control"
                required
                placeholder="340"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.78rem" }}>IMAGE URL</label>
              <input
                className="form-control"
                placeholder="Paste food image URL or leave blank"
                value={form.image || ""}
                onChange={(e) => update("image", e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.78rem" }}>DESCRIPTION</label>
              <input
                className="form-control"
                placeholder="Brief appetizing description of the dish..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          </div>

          {/* Optional Live Preview */}
          {form.name && (
            <div className="mt-3 p-2 rounded-3 bg-light d-flex align-items-center gap-3 border">
              <img
                src={form.image || getMenuItemImage({ name: form.name, category: form.category })}
                alt="preview"
                className="rounded-3 shadow-sm"
                style={{ width: 64, height: 64, objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getMenuItemImage({ name: form.name, category: form.category });
                }}
              />
              <div>
                <strong className="d-block text-dark font-heading">{form.name}</strong>
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {form.category} · ₹{form.price || "0"}
                </span>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-brass fw-semibold px-4 py-2" type="submit">
              {editingId ? "💾 Save Changes" : "➕ Add to Menu"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-3"
              onClick={() => {
                setForm(BLANK);
                setEditingId(null);
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Menu Cards Grid */}
      <div className="row g-4">
        {visible.map((item) => {
          const itemImg = getMenuItemImage(item);
          return (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="menu-grid-card shadow-sm">
                {/* Food Image Banner with Badges */}
                <div className="menu-card-img-wrap">
                  <img
                    src={itemImg}
                    alt={item.name}
                    className="menu-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/menu/basanti_pulao.jpg";
                    }}
                  />
                  <div className="menu-price-pill">₹{item.price}</div>
                  <div className="menu-category-pill">{item.category}</div>
                </div>

                {/* Card Content & Details */}
                <div className="menu-card-content">
                  <h5 className="menu-card-title text-truncate" title={item.name}>
                    {item.name}
                  </h5>
                  <p className="menu-card-desc">
                    {item.description || "Freshly prepared authentic delicacy with traditional spices and herbs."}
                  </p>

                  {canManage && (
                    <div className="d-flex gap-2 pt-2 border-top border-secondary border-opacity-10 mt-auto">
                      <button
                        className="btn btn-sm tbl-edit-btn flex-fill d-flex align-items-center justify-content-center gap-1 py-1.5 fw-semibold"
                        onClick={() => startEdit(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm tbl-delete-btn flex-fill d-flex align-items-center justify-content-center gap-1 py-1.5 fw-semibold"
                        onClick={() => setDeletingItem(item)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="col-12 text-center py-5">
            <div className="py-4">
              <span style={{ fontSize: "3rem" }}>🍽️</span>
              <h5 className="mt-3 font-heading">No items in this category</h5>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                Select another category or add a new menu item.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Custom Delete Confirmation Popup */}
      <ConfirmDeleteModal
        isOpen={!!deletingItem}
        title={`Delete "${deletingItem?.name}"?`}
        message={
          <>
            Are you sure you want to remove <strong className="text-dark">{deletingItem?.name}</strong> from the menu? This action cannot be undone.
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingItem(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}
