import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlineCurrencyRupee,
    HiOutlineCalendarDays,
} from "react-icons/hi2";
import { expenseAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const CATEGORIES = [
    { value: "feed", label: "Feed", color: "bg-amber-100 text-amber-700" },
    { value: "medicine", label: "Medicine", color: "bg-rose-100 text-rose-700" },
    { value: "labor", label: "Labor", color: "bg-sky-100 text-sky-700" },
    { value: "utilities", label: "Utilities", color: "bg-violet-100 text-violet-700" },
    { value: "equipment", label: "Equipment", color: "bg-emerald-100 text-emerald-700" },
    { value: "transport", label: "Transport", color: "bg-indigo-100 text-indigo-700" },
    { value: "maintenance", label: "Maintenance", color: "bg-orange-100 text-orange-700" },
    { value: "other", label: "Other", color: "bg-slate-100 text-slate-700" },
];

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [flocks, setFlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [stats, setStats] = useState({ thisMonth: 0, thisYear: 0, byCategory: {} });
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        category: "feed",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        vendor: "",
        paymentMethod: "cash",
        notes: "",
        flock: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [expensesRes, statsRes, flocksRes] = await Promise.all([
                expenseAPI.getAll(),
                expenseAPI.getStats(),
                flockAPI.getAll(),
            ]);
            setExpenses(expensesRes.data || []);
            setStats(statsRes.data || { thisMonth: 0, thisYear: 0, byCategory: {} });
            setFlocks(flocksRes.data || []);
        } catch (error) {
            addToast("Failed to load expenses", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                await expenseAPI.update(editingExpense._id, formData);
                addToast("Expense updated!", "success");
            } else {
                await expenseAPI.create(formData);
                addToast("Expense recorded!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;
        try {
            await expenseAPI.delete(id);
            addToast("Expense deleted!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            date: expense.date?.split("T")[0] || "",
            vendor: expense.vendor || "",
            paymentMethod: expense.paymentMethod || "cash",
            notes: expense.notes || "",
            flock: expense.flock?._id || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            category: "feed",
            description: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            vendor: "",
            paymentMethod: "cash",
            notes: "",
            flock: "",
        });
        setEditingExpense(null);
    };

    const filteredExpenses = expenses.filter(
        (e) => filterCategory === "all" || e.category === filterCategory
    );

    const getCategoryStyle = (category) => {
        return CATEGORIES.find((c) => c.value === category)?.color || "bg-slate-100 text-slate-700";
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
                        Expense Tracking
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
                    <p className="text-sm text-slate-500 mt-1">Track and manage farm expenses</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add Expense</span>
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="card-organic p-5 bg-gradient-to-br from-rose-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                            <HiOutlineCurrencyRupee className="text-2xl text-rose-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">This Month</p>
                            <p className="text-2xl font-bold text-slate-900">₹{stats.thisMonth?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <HiOutlineCalendarDays className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">This Year</p>
                            <p className="text-2xl font-bold text-slate-900">₹{stats.thisYear?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-violet-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                            <HiOutlineCurrencyRupee className="text-2xl text-violet-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Top Category</p>
                            <p className="text-lg font-bold text-slate-900 capitalize">
                                {Object.keys(stats.byCategory || {})[0] || "None"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                >
                    All
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setFilterCategory(cat.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterCategory === cat.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <HiOutlineCurrencyRupee className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No expenses found</h3>
                    <p className="text-sm text-slate-500 mt-2">Start tracking your farm expenses!</p>
                </div>
            ) : (
                <div className="card-organic overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Vendor</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryStyle(expense.category)}`}>
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{expense.description}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{expense.vendor || "-"}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-rose-600">₹{expense.amount?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(expense)} className="p-2 hover:bg-slate-100 rounded-lg">
                                                    <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                                </button>
                                                <button onClick={() => handleDelete(expense._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                                    <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingExpense ? "Edit Expense" : "Add Expense"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-organic"
                                        required
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="input-organic"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="input-organic"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="upi">UPI</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Vendor</label>
                                    <input
                                        type="text"
                                        value={formData.vendor}
                                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                        className="input-organic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Related Flock</label>
                                    <select
                                        value={formData.flock}
                                        onChange={(e) => setFormData({ ...formData, flock: e.target.value })}
                                        className="input-organic"
                                    >
                                        <option value="">None</option>
                                        {flocks.map((flock) => (
                                            <option key={flock._id} value={flock._id}>{flock.name}</option>
                                        ))}
                                    </select>
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
                                    {editingExpense ? "Update" : "Add Expense"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
