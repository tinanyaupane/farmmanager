import { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineEllipsisVertical,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from "react-icons/hi2";
import { GiChicken, GiNestEggs, GiRooster } from "react-icons/gi";
import { flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

export default function Flocks() {
  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlock, setEditingFlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({ totalBirds: 0, totalFlocks: 0, avgHealth: 0 });
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    type: "layer",
    breed: "",
    birdCount: "",
    shed: "",
    startDate: new Date().toISOString().split("T")[0],
    healthScore: 100,
    notes: "",
  });

  // Fetch flocks on mount
  useEffect(() => {
    fetchFlocks();
  }, []);

  const fetchFlocks = async () => {
    try {
      setLoading(true);
      const [flocksRes, statsRes] = await Promise.all([
        flockAPI.getAll(),
        flockAPI.getStats(),
      ]);
      setFlocks(flocksRes.data || []);
      setStats(statsRes.data || { totalBirds: 0, totalFlocks: 0, avgHealth: 0 });
    } catch (error) {
      addToast("Failed to load flocks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlock) {
        await flockAPI.update(editingFlock._id, formData);
        addToast("Flock updated successfully!", "success");
      } else {
        await flockAPI.create(formData);
        addToast("Flock created successfully!", "success");
      }
      setShowModal(false);
      resetForm();
      fetchFlocks();
    } catch (error) {
      addToast(error.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flock?")) return;
    try {
      await flockAPI.delete(id);
      addToast("Flock deleted successfully!", "success");
      fetchFlocks();
    } catch (error) {
      addToast(error.message || "Delete failed", "error");
    }
  };

  const handleEdit = (flock) => {
    setEditingFlock(flock);
    setFormData({
      name: flock.name,
      type: flock.type,
      breed: flock.breed || "",
      birdCount: flock.birdCount,
      shed: flock.shed || "",
      startDate: flock.startDate?.split("T")[0] || "",
      healthScore: flock.healthScore,
      notes: flock.notes || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "layer",
      breed: "",
      birdCount: "",
      shed: "",
      startDate: new Date().toISOString().split("T")[0],
      healthScore: 100,
      notes: "",
    });
    setEditingFlock(null);
  };

  // Filter flocks
  const filteredFlocks = flocks.filter((flock) => {
    const matchesSearch = flock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || flock.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate age from startDate
  const getAge = (startDate) => {
    if (!startDate) return "N/A";
    const start = new Date(startDate);
    const now = new Date();
    const weeks = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    return `${weeks} weeks`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-slate-600">Loading flocks...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Flock Management
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Flocks & Batches</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your poultry flocks and monitor their health
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus className="h-5 w-5" />
          <span>Add New Flock</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <GiChicken className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Birds</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalBirds?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <GiRooster className="text-2xl text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Flocks</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalFlocks || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
              <HiOutlineArrowTrendingUp className="text-2xl text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Avg. Health Score</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgHealth || 0}%</p>
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
            placeholder="Search flocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-organic pl-12 w-full"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-organic w-auto"
        >
          <option value="all">All Types</option>
          <option value="layer">Layers</option>
          <option value="broiler">Broilers</option>
        </select>
      </div>

      {/* Flocks Grid */}
      {filteredFlocks.length === 0 ? (
        <div className="card-organic p-12 text-center">
          <GiChicken className="mx-auto text-6xl text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No flocks found</h3>
          <p className="text-sm text-slate-500 mt-2">
            {flocks.length === 0
              ? "Add your first flock to get started!"
              : "No flocks match your search criteria."}
          </p>
          {flocks.length === 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4"
            >
              Add Your First Flock
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFlocks.map((flock) => (
            <FlockCard
              key={flock._id}
              flock={flock}
              onEdit={() => handleEdit(flock)}
              onDelete={() => handleDelete(flock._id)}
              getAge={getAge}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editingFlock ? "Edit Flock" : "Add New Flock"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Flock Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Layer Flock A1"
                    className="input-organic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-organic"
                    required
                  >
                    <option value="layer">Layer</option>
                    <option value="broiler">Broiler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g., Hy-Line Brown"
                    className="input-organic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bird Count *
                  </label>
                  <input
                    type="number"
                    value={formData.birdCount}
                    onChange={(e) => setFormData({ ...formData, birdCount: e.target.value })}
                    placeholder="500"
                    className="input-organic"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Shed/Location
                  </label>
                  <input
                    type="text"
                    value={formData.shed}
                    onChange={(e) => setFormData({ ...formData, shed: e.target.value })}
                    placeholder="e.g., Shed 1"
                    className="input-organic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-organic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Health Score (%)
                  </label>
                  <input
                    type="number"
                    value={formData.healthScore}
                    onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                    placeholder="100"
                    className="input-organic"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    className="input-organic"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingFlock ? "Update Flock" : "Create Flock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function FlockCard({ flock, onEdit, onDelete, getAge }) {
  const [showMenu, setShowMenu] = useState(false);

  const getTypeIcon = () => {
    if (flock.type === "layer") {
      return <GiNestEggs className="text-2xl text-amber-500" />;
    }
    return <GiRooster className="text-2xl text-emerald-500" />;
  };

  const getHealthColor = (score) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-100";
    if (score >= 75) return "text-amber-600 bg-amber-100";
    return "text-rose-600 bg-rose-100";
  };

  return (
    <div className="card-organic p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            {getTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{flock.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{flock.type} • {flock.breed || "N/A"}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <HiOutlineEllipsisVertical className="h-5 w-5 text-slate-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border z-10">
              <button
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <HiOutlinePencilSquare className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <HiOutlineTrash className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500">Birds</p>
          <p className="font-bold text-slate-900">{flock.birdCount?.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500">Age</p>
          <p className="font-bold text-slate-900">{getAge(flock.startDate)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(flock.healthScore)}`}>
          Health: {flock.healthScore}%
        </span>
        <span className="text-xs text-slate-500">{flock.shed || "No shed"}</span>
      </div>
    </div>
  );
}
