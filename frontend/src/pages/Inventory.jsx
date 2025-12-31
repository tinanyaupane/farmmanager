import { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineExclamationTriangle,
  HiOutlineCube,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import { GiWheat, GiMedicines } from "react-icons/gi";
import { inventoryAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [stats, setStats] = useState({ totalItems: 0, lowStockItems: 0, totalValue: 0 });
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "feed",
    quantity: "",
    unit: "kg",
    unitPrice: "",
    minimumStock: "",
    supplier: "",
    notes: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [itemsRes, statsRes] = await Promise.all([
        inventoryAPI.getAll(),
        inventoryAPI.getStats(),
      ]);
      setItems(itemsRes.data || []);
      setStats(statsRes.data || { totalItems: 0, lowStockItems: 0, totalValue: 0 });
    } catch (error) {
      addToast("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem._id, formData);
        addToast("Item updated successfully!", "success");
      } else {
        await inventoryAPI.create(formData);
        addToast("Item added successfully!", "success");
      }
      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      addToast(error.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await inventoryAPI.delete(id);
      addToast("Item deleted successfully!", "success");
      fetchItems();
    } catch (error) {
      addToast(error.message || "Delete failed", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice || "",
      minimumStock: item.minimumStock || "",
      supplier: item.supplier || "",
      notes: item.notes || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "feed",
      quantity: "",
      unit: "kg",
      unitPrice: "",
      minimumStock: "",
      supplier: "",
      notes: "",
    });
    setEditingItem(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "feed": return <GiWheat className="text-amber-500" />;
      case "medicine": return <GiMedicines className="text-rose-500" />;
      case "equipment": return <HiOutlineCube className="text-sky-500" />;
      default: return <HiOutlineArchiveBox className="text-slate-500" />;
    }
  };

  const isLowStock = (item) => item.minimumStock && item.quantity <= item.minimumStock;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-slate-600">Loading inventory...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Inventory Management
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Track your farm supplies and stock levels</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-organic p-5 bg-gradient-to-br from-violet-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <HiOutlineCube className="text-2xl text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Items</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalItems || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-rose-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <HiOutlineExclamationTriangle className="text-2xl text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Low Stock</p>
              <p className="text-2xl font-bold text-rose-600">{stats.lowStockItems || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <HiOutlineArchiveBox className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.totalValue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-organic pl-12 w-full"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-organic w-auto"
        >
          <option value="all">All Categories</option>
          <option value="feed">Feed</option>
          <option value="medicine">Medicine</option>
          <option value="equipment">Equipment</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="card-organic p-12 text-center">
          <HiOutlineCube className="mx-auto text-6xl text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No items found</h3>
          <p className="text-sm text-slate-500 mt-2">
            {items.length === 0 ? "Add your first inventory item!" : "No items match your criteria."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item._id} className={`card-organic p-5 ${isLowStock(item) ? "border-rose-200 bg-rose-50/30" : ""}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500 capitalize">{item.category}</p>
                  </div>
                </div>
                {isLowStock(item) && (
                  <span className="badge badge-danger">Low Stock</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Quantity</p>
                  <p className="font-bold text-slate-900">{item.quantity} {item.unit}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Value</p>
                  <p className="font-bold text-emerald-600">₹{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}</p>
                </div>
              </div>

              {item.minimumStock && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Stock Level</span>
                    <span className={item.quantity <= item.minimumStock ? "text-rose-600" : "text-emerald-600"}>
                      {Math.round((item.quantity / item.minimumStock) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${item.quantity <= item.minimumStock ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                      style={{ width: `${Math.min((item.quantity / item.minimumStock) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-slate-500">{item.supplier || "No supplier"}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-organic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-organic"
                    required
                  >
                    <option value="feed">Feed</option>
                    <option value="medicine">Medicine</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-organic"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="l">Liters (l)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="box">Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input-organic"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="input-organic"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Stock Level</label>
                  <input
                    type="number"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                    className="input-organic"
                    min="0"
                    placeholder="Alert when below this"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="input-organic"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-organic"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
