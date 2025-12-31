import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { GiSyringe } from "react-icons/gi";
import { vaccinationAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const ROUTES = [
    { value: "drinking_water", label: "Drinking Water" },
    { value: "spray", label: "Spray" },
    { value: "injection", label: "Injection" },
    { value: "eye_drop", label: "Eye Drop" },
    { value: "wing_web", label: "Wing Web" },
];

export default function Vaccinations() {
    const [vaccinations, setVaccinations] = useState([]);
    const [flocks, setFlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVax, setEditingVax] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [stats, setStats] = useState({ upcoming: 0, overdue: 0, completed: 0, total: 0 });
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        flock: "",
        vaccineName: "",
        scheduledDate: new Date().toISOString().split("T")[0],
        ageInDays: "",
        administrationRoute: "drinking_water",
        dosage: "",
        manufacturer: "",
        batchNumber: "",
        cost: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [vaxRes, statsRes, flocksRes] = await Promise.all([
                vaccinationAPI.getAll(),
                vaccinationAPI.getStats(),
                flockAPI.getAll(),
            ]);
            setVaccinations(vaxRes.data || []);
            setStats(statsRes.data || { upcoming: 0, overdue: 0, completed: 0, total: 0 });
            setFlocks(flocksRes.data || []);
        } catch (error) {
            addToast("Failed to load vaccinations", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVax) {
                await vaccinationAPI.update(editingVax._id, formData);
                addToast("Vaccination updated!", "success");
            } else {
                await vaccinationAPI.create(formData);
                addToast("Vaccination scheduled!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handleComplete = async (vax) => {
        try {
            await vaccinationAPI.complete(vax._id, {});
            addToast("Vaccination marked as complete!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Failed to complete", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this vaccination?")) return;
        try {
            await vaccinationAPI.delete(id);
            addToast("Vaccination deleted!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (vax) => {
        setEditingVax(vax);
        setFormData({
            flock: vax.flock?._id || vax.flock || "",
            vaccineName: vax.vaccineName,
            scheduledDate: vax.scheduledDate?.split("T")[0] || "",
            ageInDays: vax.ageInDays || "",
            administrationRoute: vax.administrationRoute || "drinking_water",
            dosage: vax.dosage || "",
            manufacturer: vax.manufacturer || "",
            batchNumber: vax.batchNumber || "",
            cost: vax.cost || "",
            notes: vax.notes || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            flock: "",
            vaccineName: "",
            scheduledDate: new Date().toISOString().split("T")[0],
            ageInDays: "",
            administrationRoute: "drinking_water",
            dosage: "",
            manufacturer: "",
            batchNumber: "",
            cost: "",
            notes: "",
        });
        setEditingVax(null);
    };

    const filteredVaccinations = vaccinations.filter((vax) => {
        if (filterStatus === "all") return true;
        return vax.status === filterStatus;
    });

    const getStatusStyle = (status, scheduledDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduled = new Date(scheduledDate);

        if (status === "completed") {
            return "bg-emerald-100 text-emerald-700";
        }
        if (status === "scheduled" && scheduled < today) {
            return "bg-rose-100 text-rose-700";
        }
        if (status === "scheduled") {
            return "bg-amber-100 text-amber-700";
        }
        return "bg-slate-100 text-slate-700";
    };

    const getStatusLabel = (status, scheduledDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduled = new Date(scheduledDate);

        if (status === "completed") return "Completed";
        if (status === "scheduled" && scheduled < today) return "Overdue";
        return "Scheduled";
    };

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
                        Vaccination Management
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Vaccinations</h1>
                    <p className="text-sm text-slate-500 mt-1">Schedule and track flock vaccinations</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Schedule Vaccination</span>
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <HiOutlineClock className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Upcoming (7 days)</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.upcoming}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-rose-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                            <HiOutlineExclamationTriangle className="text-2xl text-rose-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Overdue</p>
                            <p className="text-2xl font-bold text-rose-600">{stats.overdue}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <HiOutlineCheckCircle className="text-2xl text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Completed</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                            <GiSyringe className="text-2xl text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {["all", "scheduled", "completed"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Vaccinations List */}
            {filteredVaccinations.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <GiSyringe className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No vaccinations found</h3>
                    <p className="text-sm text-slate-500 mt-2">Schedule your first vaccination!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredVaccinations.map((vax) => (
                        <div key={vax._id} className="card-organic p-5 hover:shadow-lg transition-all">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                                        <GiSyringe className="text-2xl text-sky-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{vax.vaccineName}</h3>
                                        <p className="text-sm text-slate-500">
                                            {typeof vax.flock === "object" ? vax.flock?.name : "Unknown Flock"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Age: {vax.ageInDays} days • Route: {vax.administrationRoute?.replace("_", " ")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">
                                            {new Date(vax.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(vax.status, vax.scheduledDate)}`}>
                                            {getStatusLabel(vax.status, vax.scheduledDate)}
                                        </span>
                                    </div>

                                    <div className="flex gap-1">
                                        {vax.status === "scheduled" && (
                                            <button
                                                onClick={() => handleComplete(vax)}
                                                className="p-2 hover:bg-emerald-50 rounded-lg"
                                                title="Mark as complete"
                                            >
                                                <HiOutlineCheckCircle className="h-5 w-5 text-emerald-500" />
                                            </button>
                                        )}
                                        <button onClick={() => handleEdit(vax)} className="p-2 hover:bg-slate-100 rounded-lg">
                                            <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                        </button>
                                        <button onClick={() => handleDelete(vax._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                            <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {(vax.manufacturer || vax.batchNumber || vax.cost) && (
                                <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs text-slate-500">
                                    {vax.manufacturer && <span>Manufacturer: {vax.manufacturer}</span>}
                                    {vax.batchNumber && <span>Batch: {vax.batchNumber}</span>}
                                    {vax.cost > 0 && <span>Cost: ₹{vax.cost}</span>}
                                </div>
                            )}
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
                                {editingVax ? "Edit Vaccination" : "Schedule Vaccination"}
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Vaccine Name *</label>
                                    <input
                                        type="text"
                                        value={formData.vaccineName}
                                        onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                                        className="input-organic"
                                        placeholder="e.g., Newcastle, Marek's"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Date *</label>
                                    <input
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Age (days) *</label>
                                    <input
                                        type="number"
                                        value={formData.ageInDays}
                                        onChange={(e) => setFormData({ ...formData, ageInDays: e.target.value })}
                                        className="input-organic"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Route</label>
                                    <select
                                        value={formData.administrationRoute}
                                        onChange={(e) => setFormData({ ...formData, administrationRoute: e.target.value })}
                                        className="input-organic"
                                    >
                                        {ROUTES.map((route) => (
                                            <option key={route.value} value={route.value}>{route.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Dosage</label>
                                    <input
                                        type="text"
                                        value={formData.dosage}
                                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturer</label>
                                    <input
                                        type="text"
                                        value={formData.manufacturer}
                                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Batch Number</label>
                                    <input
                                        type="text"
                                        value={formData.batchNumber}
                                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Cost</label>
                                    <input
                                        type="number"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        className="input-organic"
                                        min="0"
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
                                    {editingVax ? "Update" : "Schedule"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
