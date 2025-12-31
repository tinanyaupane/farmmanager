import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineUser,
} from "react-icons/hi2";
import { workerAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const ROLES = [
    { value: "manager", label: "Manager", color: "bg-violet-100 text-violet-700" },
    { value: "supervisor", label: "Supervisor", color: "bg-sky-100 text-sky-700" },
    { value: "worker", label: "Worker", color: "bg-emerald-100 text-emerald-700" },
    { value: "caretaker", label: "Caretaker", color: "bg-amber-100 text-amber-700" },
];

const SHIFTS = [
    { value: "morning", label: "Morning (6AM-2PM)" },
    { value: "evening", label: "Evening (2PM-10PM)" },
    { value: "night", label: "Night (10PM-6AM)" },
    { value: "full", label: "Full Day" },
];

export default function Workers() {
    const [workers, setWorkers] = useState([]);
    const [flocks, setFlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, byRole: {} });
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        role: "worker",
        shift: "full",
        salary: "",
        salaryType: "monthly",
        joinDate: new Date().toISOString().split("T")[0],
        assignedFlocks: [],
        address: "",
        emergencyContact: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [workersRes, statsRes, flocksRes] = await Promise.all([
                workerAPI.getAll(),
                workerAPI.getStats(),
                flockAPI.getAll(),
            ]);
            setWorkers(workersRes.data || []);
            setStats(statsRes.data || { total: 0, active: 0, byRole: {} });
            setFlocks(flocksRes.data || []);
        } catch (error) {
            addToast("Failed to load workers", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWorker) {
                await workerAPI.update(editingWorker._id, formData);
                addToast("Worker updated!", "success");
            } else {
                await workerAPI.create(formData);
                addToast("Worker added!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this worker?")) return;
        try {
            await workerAPI.delete(id);
            addToast("Worker removed!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (worker) => {
        setEditingWorker(worker);
        setFormData({
            name: worker.name,
            phone: worker.phone,
            email: worker.email || "",
            role: worker.role,
            shift: worker.shift,
            salary: worker.salary || "",
            salaryType: worker.salaryType || "monthly",
            joinDate: worker.joinDate?.split("T")[0] || "",
            assignedFlocks: worker.assignedFlocks?.map(f => f._id) || [],
            address: worker.address || "",
            emergencyContact: worker.emergencyContact || "",
            notes: worker.notes || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            role: "worker",
            shift: "full",
            salary: "",
            salaryType: "monthly",
            joinDate: new Date().toISOString().split("T")[0],
            assignedFlocks: [],
            address: "",
            emergencyContact: "",
            notes: "",
        });
        setEditingWorker(null);
    };

    const getRoleStyle = (role) => ROLES.find(r => r.value === role)?.color || "bg-slate-100 text-slate-700";

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
                        Team Management
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Workers</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your farm team</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add Worker</span>
                </button>
            </header>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
                    <p className="text-sm text-slate-600">Total Workers</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
                    <p className="text-sm text-slate-600">Active</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-violet-50 to-white">
                    <p className="text-sm text-slate-600">Managers</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.byRole?.manager || 0}</p>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
                    <p className="text-sm text-slate-600">Caretakers</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.byRole?.caretaker || 0}</p>
                </div>
            </div>

            {/* Workers Grid */}
            {workers.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <HiOutlineUser className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No workers yet</h3>
                    <p className="text-sm text-slate-500 mt-2">Add your farm team members!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workers.map((worker) => (
                        <div key={worker._id} className={`card-organic p-5 hover:shadow-lg transition-all ${!worker.isActive ? 'opacity-60' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                                        {worker.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{worker.name}</h3>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleStyle(worker.role)}`}>
                                            {worker.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(worker)} className="p-2 hover:bg-slate-100 rounded-lg">
                                        <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                    </button>
                                    <button onClick={() => handleDelete(worker._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                        <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <HiOutlinePhone className="h-4 w-4" />
                                    <span>{worker.phone}</span>
                                </div>
                                {worker.email && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <HiOutlineEnvelope className="h-4 w-4" />
                                        <span>{worker.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500">Shift</p>
                                    <p className="font-medium capitalize">{worker.shift}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Salary</p>
                                    <p className="font-medium text-emerald-600">₹{worker.salary?.toLocaleString() || 0}/{worker.salaryType?.charAt(0)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingWorker ? "Edit Worker" : "Add Worker"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input-organic"
                                    >
                                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Shift</label>
                                    <select
                                        value={formData.shift}
                                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                        className="input-organic"
                                    >
                                        {SHIFTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Salary</label>
                                    <input
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        className="input-organic"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Salary Type</label>
                                    <select
                                        value={formData.salaryType}
                                        onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                                        className="input-organic"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Join Date</label>
                                    <input
                                        type="date"
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                                    <input
                                        type="tel"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="input-organic"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editingWorker ? "Update" : "Add Worker"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
