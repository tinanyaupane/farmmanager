import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamationTriangle,
    HiOutlineCalendarDays,
} from "react-icons/hi2";
import { taskAPI, workerAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const CATEGORIES = [
    { value: "feeding", label: "Feeding", color: "bg-amber-100 text-amber-700" },
    { value: "cleaning", label: "Cleaning", color: "bg-sky-100 text-sky-700" },
    { value: "health", label: "Health Check", color: "bg-rose-100 text-rose-700" },
    { value: "collection", label: "Egg Collection", color: "bg-yellow-100 text-yellow-700" },
    { value: "maintenance", label: "Maintenance", color: "bg-violet-100 text-violet-700" },
    { value: "vaccination", label: "Vaccination", color: "bg-teal-100 text-teal-700" },
    { value: "other", label: "Other", color: "bg-slate-100 text-slate-700" },
];

const PRIORITIES = [
    { value: "low", label: "Low", color: "bg-slate-100 text-slate-600" },
    { value: "medium", label: "Medium", color: "bg-sky-100 text-sky-600" },
    { value: "high", label: "High", color: "bg-amber-100 text-amber-600" },
    { value: "urgent", label: "Urgent", color: "bg-rose-100 text-rose-600" },
];

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [flocks, setFlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, overdue: 0 });
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        dueTime: "",
        assignedTo: "",
        flock: "",
        isRecurring: false,
        recurringPattern: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, statsRes, workersRes, flocksRes] = await Promise.all([
                taskAPI.getAll(),
                taskAPI.getStats(),
                workerAPI.getAll(),
                flockAPI.getAll(),
            ]);
            setTasks(tasksRes.data || []);
            setStats(statsRes.data || { pending: 0, inProgress: 0, completed: 0, overdue: 0 });
            setWorkers(workersRes.data || []);
            setFlocks(flocksRes.data || []);
        } catch (error) {
            addToast("Failed to load tasks", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await taskAPI.update(editingTask._id, formData);
                addToast("Task updated!", "success");
            } else {
                await taskAPI.create(formData);
                addToast("Task created!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handleComplete = async (task) => {
        try {
            await taskAPI.complete(task._id);
            addToast("Task completed!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await taskAPI.delete(id);
            addToast("Task deleted!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || "",
            category: task.category,
            priority: task.priority,
            dueDate: task.dueDate?.split("T")[0] || "",
            dueTime: task.dueTime || "",
            assignedTo: task.assignedTo?._id || task.assignedTo || "",
            flock: task.flock?._id || task.flock || "",
            isRecurring: task.isRecurring || false,
            recurringPattern: task.recurringPattern || "",
            notes: task.notes || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "other",
            priority: "medium",
            dueDate: new Date().toISOString().split("T")[0],
            dueTime: "",
            assignedTo: "",
            flock: "",
            isRecurring: false,
            recurringPattern: "",
            notes: "",
        });
        setEditingTask(null);
    };

    const filteredTasks = tasks.filter(t => filterStatus === "all" || t.status === filterStatus);

    const getCategoryStyle = (cat) => CATEGORIES.find(c => c.value === cat)?.color || "bg-slate-100 text-slate-700";
    const getPriorityStyle = (pri) => PRIORITIES.find(p => p.value === pri)?.color || "bg-slate-100 text-slate-600";

    const isOverdue = (task) => {
        if (task.status === "completed") return false;
        return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
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
                        Task Management
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
                    <p className="text-sm text-slate-500 mt-1">Assign and track farm tasks</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>New Task</span>
                </button>
            </header>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <HiOutlineClock className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pending</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                            <HiOutlineCalendarDays className="text-2xl text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">In Progress</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
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
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {["all", "pending", "in_progress", "completed"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <HiOutlineCalendarDays className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No tasks found</h3>
                    <p className="text-sm text-slate-500 mt-2">Create your first task!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className={`card-organic p-4 hover:shadow-lg transition-all ${task.status === "completed" ? "opacity-60" : ""
                                } ${isOverdue(task) ? "border-l-4 border-l-rose-500" : ""}`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Complete button */}
                                {task.status !== "completed" && (
                                    <button
                                        onClick={() => handleComplete(task)}
                                        className="w-8 h-8 rounded-full border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                                    >
                                        <HiOutlineCheckCircle className="h-5 w-5 text-slate-400 hover:text-emerald-500" />
                                    </button>
                                )}
                                {task.status === "completed" && (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <HiOutlineCheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                )}

                                {/* Task info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className={`font-medium ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-900"}`}>
                                            {task.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(task.category)}`}>
                                            {task.category}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                        <span className={isOverdue(task) ? "text-rose-600 font-medium" : ""}>
                                            Due: {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            {task.dueTime && ` at ${task.dueTime}`}
                                        </span>
                                        {task.assignedTo && (
                                            <span>Assigned: {typeof task.assignedTo === "object" ? task.assignedTo.name : "Worker"}</span>
                                        )}
                                        {task.flock && (
                                            <span>Flock: {typeof task.flock === "object" ? task.flock.name : "Unknown"}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(task)} className="p-2 hover:bg-slate-100 rounded-lg">
                                        <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                    </button>
                                    <button onClick={() => handleDelete(task._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                        <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                    </button>
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
                                {editingTask ? "Edit Task" : "New Task"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-organic"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-organic"
                                    >
                                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="input-organic"
                                    >
                                        {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Due Date *</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Due Time</label>
                                    <input
                                        type="time"
                                        value={formData.dueTime}
                                        onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Assign To</label>
                                    <select
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        className="input-organic"
                                    >
                                        <option value="">Unassigned</option>
                                        {workers.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Related Flock</label>
                                    <select
                                        value={formData.flock}
                                        onChange={(e) => setFormData({ ...formData, flock: e.target.value })}
                                        className="input-organic"
                                    >
                                        <option value="">None</option>
                                        {flocks.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-organic"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editingTask ? "Update" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
