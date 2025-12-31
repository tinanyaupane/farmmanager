import { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineHeart,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { GiMedicines, GiSyringe, GiHealthNormal } from "react-icons/gi";
import { healthAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

export default function Health() {
  const [entries, setEntries] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({ totalEntries: 0, criticalCases: 0, vaccinations: 0 });
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    flock: "",
    date: new Date().toISOString().split("T")[0],
    recordType: "daily",
    healthScore: 100,
    mortality: 0,
    symptoms: "",
    treatment: "",
    vaccineName: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [entriesRes, statsRes, flocksRes] = await Promise.all([
        healthAPI.getAll(),
        healthAPI.getStats(),
        flockAPI.getAll(),
      ]);
      setEntries(entriesRes.data || []);
      setStats(statsRes.data || { totalEntries: 0, criticalCases: 0, vaccinations: 0 });
      setFlocks(flocksRes.data || []);
    } catch (error) {
      addToast("Failed to load health data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await healthAPI.update(editingEntry._id, formData);
        addToast("Health entry updated!", "success");
      } else {
        await healthAPI.create(formData);
        addToast("Health entry added!", "success");
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      addToast(error.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await healthAPI.delete(id);
      addToast("Entry deleted!", "success");
      fetchData();
    } catch (error) {
      addToast(error.message || "Delete failed", "error");
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      flock: entry.flock?._id || entry.flock || "",
      date: entry.date?.split("T")[0] || "",
      recordType: entry.recordType,
      healthScore: entry.healthScore,
      mortality: entry.mortality || 0,
      symptoms: entry.symptoms || "",
      treatment: entry.treatment || "",
      vaccineName: entry.vaccineName || "",
      notes: entry.notes || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      flock: "",
      date: new Date().toISOString().split("T")[0],
      recordType: "daily",
      healthScore: 100,
      mortality: 0,
      symptoms: "",
      treatment: "",
      vaccineName: "",
      notes: "",
    });
    setEditingEntry(null);
  };

  const filteredEntries = entries.filter((entry) => {
    const flockName = typeof entry.flock === "object" ? entry.flock?.name : "";
    const matchesSearch = flockName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || entry.recordType === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "vaccination": return <GiSyringe className="text-sky-500" />;
      case "treatment": return <GiMedicines className="text-rose-500" />;
      case "checkup": return <GiHealthNormal className="text-emerald-500" />;
      default: return <HiOutlineHeart className="text-amber-500" />;
    }
  };

  const getHealthColor = (score) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-100";
    if (score >= 75) return "text-amber-600 bg-amber-100";
    return "text-rose-600 bg-rose-100";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-slate-600">Loading health data...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Health Tracking
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Health Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor flock health, vaccinations, and treatments
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus className="h-5 w-5" />
          <span>Add Entry</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <HiOutlineHeart className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Entries</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalEntries || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-rose-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <HiOutlineExclamationTriangle className="text-2xl text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Critical Cases</p>
              <p className="text-2xl font-bold text-rose-600">{stats.criticalCases || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
              <GiSyringe className="text-2xl text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Vaccinations</p>
              <p className="text-2xl font-bold text-slate-900">{stats.vaccinations || 0}</p>
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
            placeholder="Search by flock..."
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
          <option value="daily">Daily Check</option>
          <option value="vaccination">Vaccination</option>
          <option value="treatment">Treatment</option>
          <option value="checkup">Checkup</option>
        </select>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="card-organic p-12 text-center">
          <HiOutlineHeart className="mx-auto text-6xl text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No health entries found</h3>
          <p className="text-sm text-slate-500 mt-2">
            {entries.length === 0 ? "Add your first health entry!" : "No entries match your criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div key={entry._id} className="card-organic p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                    {getTypeIcon(entry.recordType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {typeof entry.flock === "object" ? entry.flock?.name : "Unknown Flock"}
                      </h3>
                      <span className="badge badge-info capitalize">{entry.recordType}</span>
                    </div>
                    <p className="text-sm text-slate-500">{formatDate(entry.date)}</p>

                    {entry.symptoms && (
                      <p className="text-sm text-slate-600 mt-2">
                        <strong>Symptoms:</strong> {entry.symptoms}
                      </p>
                    )}
                    {entry.treatment && (
                      <p className="text-sm text-slate-600">
                        <strong>Treatment:</strong> {entry.treatment}
                      </p>
                    )}
                    {entry.vaccineName && (
                      <p className="text-sm text-sky-600">
                        <strong>Vaccine:</strong> {entry.vaccineName}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-slate-500 mt-1 italic">{entry.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(entry.healthScore)}`}>
                      Health: {entry.healthScore}%
                    </span>
                    {entry.mortality > 0 && (
                      <p className="text-xs text-rose-600 mt-1">
                        Mortality: {entry.mortality}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                    </button>
                  </div>
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
                {editingEntry ? "Edit Health Entry" : "Add Health Entry"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Flock *</label>
                  <select
                    value={formData.flock}
                    onChange={(e) => setFormData({ ...formData, flock: e.target.value })}
                    className="input-organic"
                    required
                  >
                    <option value="">Select Flock</option>
                    {flocks.map((flock) => (
                      <option key={flock._id} value={flock._id}>{flock.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-organic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Record Type *</label>
                  <select
                    value={formData.recordType}
                    onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                    className="input-organic"
                    required
                  >
                    <option value="daily">Daily Check</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="treatment">Treatment</option>
                    <option value="checkup">Checkup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Health Score (%)</label>
                  <input
                    type="number"
                    value={formData.healthScore}
                    onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                    className="input-organic"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mortality</label>
                  <input
                    type="number"
                    value={formData.mortality}
                    onChange={(e) => setFormData({ ...formData, mortality: e.target.value })}
                    className="input-organic"
                    min="0"
                  />
                </div>

                {formData.recordType === "vaccination" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vaccine Name</label>
                    <input
                      type="text"
                      value={formData.vaccineName}
                      onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                      className="input-organic"
                      placeholder="e.g., Newcastle, Marek's"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Symptoms</label>
                  <input
                    type="text"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="input-organic"
                    placeholder="Any observed symptoms..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Treatment Given</label>
                  <input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="input-organic"
                    placeholder="Medicine or treatment applied..."
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
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
