import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlineCalendarDays,
} from "react-icons/hi2";
import { GiChicken, GiNestEggs, GiWheat } from "react-icons/gi";
import { dailyLogAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

export default function DailyLogs() {
    const [logs, setLogs] = useState([]);
    const [flocks, setFlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [filterFlock, setFilterFlock] = useState("all");
    const [stats, setStats] = useState({});
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        flock: "",
        date: new Date().toISOString().split("T")[0],
        openingCount: "",
        mortality: 0,
        culled: 0,
        sold: 0,
        closingCount: "",
        eggsCollected: 0,
        eggsDamaged: 0,
        feedConsumed: "",
        feedType: "",
        waterConsumed: "",
        healthScore: 100,
        symptoms: "",
        treatment: "",
        avgWeight: "",
        temperature: "",
        humidity: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [logsRes, statsRes, flocksRes] = await Promise.all([
                dailyLogAPI.getAll(),
                dailyLogAPI.getStats(),
                flockAPI.getAll(),
            ]);
            setLogs(logsRes.data || []);
            setStats(statsRes.data || {});
            setFlocks(flocksRes.data || []);
        } catch (error) {
            addToast("Failed to load daily logs", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Auto-calculate closing count
        const closing = parseInt(formData.openingCount || 0)
            - parseInt(formData.mortality || 0)
            - parseInt(formData.culled || 0)
            - parseInt(formData.sold || 0);

        const data = { ...formData, closingCount: closing };

        try {
            if (editingLog) {
                await dailyLogAPI.update(editingLog._id, data);
                addToast("Daily log updated!", "success");
            } else {
                await dailyLogAPI.create(data);
                addToast("Daily log created!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this log?")) return;
        try {
            await dailyLogAPI.delete(id);
            addToast("Log deleted!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (log) => {
        setEditingLog(log);
        setFormData({
            flock: log.flock?._id || log.flock || "",
            date: log.date?.split("T")[0] || "",
            openingCount: log.openingCount || "",
            mortality: log.mortality || 0,
            culled: log.culled || 0,
            sold: log.sold || 0,
            closingCount: log.closingCount || "",
            eggsCollected: log.eggsCollected || 0,
            eggsDamaged: log.eggsDamaged || 0,
            feedConsumed: log.feedConsumed || "",
            feedType: log.feedType || "",
            waterConsumed: log.waterConsumed || "",
            healthScore: log.healthScore || 100,
            symptoms: log.symptoms || "",
            treatment: log.treatment || "",
            avgWeight: log.avgWeight || "",
            temperature: log.temperature || "",
            humidity: log.humidity || "",
            notes: log.notes || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            flock: "",
            date: new Date().toISOString().split("T")[0],
            openingCount: "",
            mortality: 0,
            culled: 0,
            sold: 0,
            closingCount: "",
            eggsCollected: 0,
            eggsDamaged: 0,
            feedConsumed: "",
            feedType: "",
            waterConsumed: "",
            healthScore: 100,
            symptoms: "",
            treatment: "",
            avgWeight: "",
            temperature: "",
            humidity: "",
            notes: "",
        });
        setEditingLog(null);
    };

    const filteredLogs = logs.filter((log) => {
        if (filterFlock === "all") return true;
        const flockId = typeof log.flock === "object" ? log.flock?._id : log.flock;
        return flockId === filterFlock;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
                        Daily Records
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Daily Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Track daily flock activities and production</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>New Entry</span>
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <HiOutlineCalendarDays className="text-2xl text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Today's Entries</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.todayEntries || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <GiNestEggs className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Today's Eggs</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.todayEggs?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-rose-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                            <GiChicken className="text-2xl text-rose-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Today's Mortality</p>
                            <p className="text-2xl font-bold text-rose-600">{stats.todayMortality || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                            <GiWheat className="text-2xl text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Weekly Feed</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.weeklyTotals?.totalFeed?.toLocaleString() || 0} kg</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
                <select
                    value={filterFlock}
                    onChange={(e) => setFilterFlock(e.target.value)}
                    className="input-organic w-auto"
                >
                    <option value="all">All Flocks</option>
                    {flocks.map((flock) => (
                        <option key={flock._id} value={flock._id}>{flock.name}</option>
                    ))}
                </select>
            </div>

            {/* Logs List */}
            {filteredLogs.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <HiOutlineCalendarDays className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No daily logs found</h3>
                    <p className="text-sm text-slate-500 mt-2">Start logging daily activities!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLogs.map((log) => (
                        <div key={log._id} className="card-organic p-5 hover:shadow-lg transition-all">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <GiChicken className="text-2xl text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {typeof log.flock === "object" ? log.flock?.name : "Unknown Flock"}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {new Date(log.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Birds</p>
                                        <p className="font-bold text-slate-900">{log.closingCount?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Eggs</p>
                                        <p className="font-bold text-amber-600">{log.eggsCollected?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Mortality</p>
                                        <p className="font-bold text-rose-600">{log.mortality}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Feed (kg)</p>
                                        <p className="font-bold text-sky-600">{log.feedConsumed || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Health</p>
                                        <p className={`font-bold ${log.healthScore >= 90 ? "text-emerald-600" : log.healthScore >= 75 ? "text-amber-600" : "text-rose-600"}`}>
                                            {log.healthScore}%
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(log)} className="p-2 hover:bg-slate-100 rounded-lg">
                                        <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                    </button>
                                    <button onClick={() => handleDelete(log._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                        <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                    </button>
                                </div>
                            </div>

                            {log.notes && (
                                <p className="mt-3 text-sm text-slate-500 italic border-t pt-3">{log.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingLog ? "Edit Daily Log" : "New Daily Log"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid gap-4 md:grid-cols-3">
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Opening Count *</label>
                                    <input
                                        type="number"
                                        value={formData.openingCount}
                                        onChange={(e) => setFormData({ ...formData, openingCount: e.target.value })}
                                        className="input-organic"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Bird Count */}
                            <div>
                                <h4 className="font-medium text-slate-900 mb-3">Bird Count Changes</h4>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Mortality</label>
                                        <input
                                            type="number"
                                            value={formData.mortality}
                                            onChange={(e) => setFormData({ ...formData, mortality: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Culled</label>
                                        <input
                                            type="number"
                                            value={formData.culled}
                                            onChange={(e) => setFormData({ ...formData, culled: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Sold</label>
                                        <input
                                            type="number"
                                            value={formData.sold}
                                            onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Closing Count</label>
                                        <input
                                            type="number"
                                            value={parseInt(formData.openingCount || 0) - parseInt(formData.mortality || 0) - parseInt(formData.culled || 0) - parseInt(formData.sold || 0)}
                                            className="input-organic bg-slate-100"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Egg Production */}
                            <div>
                                <h4 className="font-medium text-slate-900 mb-3">Egg Production (Layers)</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Eggs Collected</label>
                                        <input
                                            type="number"
                                            value={formData.eggsCollected}
                                            onChange={(e) => setFormData({ ...formData, eggsCollected: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Eggs Damaged</label>
                                        <input
                                            type="number"
                                            value={formData.eggsDamaged}
                                            onChange={(e) => setFormData({ ...formData, eggsDamaged: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Feed & Water */}
                            <div>
                                <h4 className="font-medium text-slate-900 mb-3">Feed & Water</h4>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Feed Consumed (kg)</label>
                                        <input
                                            type="number"
                                            value={formData.feedConsumed}
                                            onChange={(e) => setFormData({ ...formData, feedConsumed: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Feed Type</label>
                                        <input
                                            type="text"
                                            value={formData.feedType}
                                            onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                                            className="input-organic"
                                            placeholder="e.g., Layer Mash"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Water (L)</label>
                                        <input
                                            type="number"
                                            value={formData.waterConsumed}
                                            onChange={(e) => setFormData({ ...formData, waterConsumed: e.target.value })}
                                            className="input-organic"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Health */}
                            <div>
                                <h4 className="font-medium text-slate-900 mb-3">Health</h4>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Health Score (%)</label>
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
                                        <label className="block text-sm text-slate-600 mb-2">Symptoms</label>
                                        <input
                                            type="text"
                                            value={formData.symptoms}
                                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                            className="input-organic"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-2">Treatment</label>
                                        <input
                                            type="text"
                                            value={formData.treatment}
                                            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                            className="input-organic"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input-organic"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editingLog ? "Update" : "Save Log"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
