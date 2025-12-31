import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlineUser,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineCurrencyRupee,
} from "react-icons/hi2";
import { customerAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const CUSTOMER_TYPES = [
    { value: "regular", label: "Regular", color: "bg-slate-100 text-slate-700" },
    { value: "wholesale", label: "Wholesale", color: "bg-emerald-100 text-emerald-700" },
    { value: "retail", label: "Retail", color: "bg-sky-100 text-sky-700" },
    { value: "dealer", label: "Dealer", color: "bg-violet-100 text-violet-700" },
];

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0, totalCredit: 0 });
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        type: "regular",
        creditLimit: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [customersRes, statsRes] = await Promise.all([
                customerAPI.getAll(),
                customerAPI.getStats(),
            ]);
            setCustomers(customersRes.data || []);
            setStats(statsRes.data || { totalCustomers: 0, activeCustomers: 0, totalCredit: 0 });
        } catch (error) {
            addToast("Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await customerAPI.update(editingCustomer._id, formData);
                addToast("Customer updated!", "success");
            } else {
                await customerAPI.create(formData);
                addToast("Customer added!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer?")) return;
        try {
            await customerAPI.delete(id);
            addToast("Customer deleted!", "success");
            fetchData();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email || "",
            address: customer.address || "",
            type: customer.type,
            creditLimit: customer.creditLimit || "",
            notes: customer.notes || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
            type: "regular",
            creditLimit: "",
            notes: "",
        });
        setEditingCustomer(null);
    };

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const getTypeStyle = (type) => {
        return CUSTOMER_TYPES.find((t) => t.value === type)?.color || "bg-slate-100 text-slate-700";
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
                        Customer Management
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your customer database</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add Customer</span>
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                            <HiOutlineUser className="text-2xl text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Customers</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <HiOutlineUser className="text-2xl text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Active Customers</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.activeCustomers}</p>
                        </div>
                    </div>
                </div>
                <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <HiOutlineCurrencyRupee className="text-2xl text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pending Credit</p>
                            <p className="text-2xl font-bold text-amber-600">₹{stats.totalCredit?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-organic pl-12 w-full"
                />
            </div>

            {/* Customers Grid */}
            {filteredCustomers.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <HiOutlineUser className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No customers found</h3>
                    <p className="text-sm text-slate-500 mt-2">Add your first customer!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCustomers.map((customer) => (
                        <div key={customer._id} className="card-organic p-5 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold">
                                        {customer.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeStyle(customer.type)}`}>
                                            {customer.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(customer)} className="p-2 hover:bg-slate-100 rounded-lg">
                                        <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                    </button>
                                    <button onClick={() => handleDelete(customer._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                        <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <HiOutlinePhone className="h-4 w-4" />
                                    <span>{customer.phone}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <HiOutlineEnvelope className="h-4 w-4" />
                                        <span>{customer.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">Total Purchases</p>
                                    <p className="font-bold text-emerald-600">₹{customer.totalPurchases?.toLocaleString() || 0}</p>
                                </div>
                                {customer.currentCredit > 0 && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Credit Due</p>
                                        <p className="font-bold text-amber-600">₹{customer.currentCredit?.toLocaleString()}</p>
                                    </div>
                                )}
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
                                {editingCustomer ? "Edit Customer" : "Add Customer"}
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input-organic"
                                    >
                                        {CUSTOMER_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Credit Limit</label>
                                    <input
                                        type="number"
                                        value={formData.creditLimit}
                                        onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                                        className="input-organic"
                                        min="0"
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
                                    {editingCustomer ? "Update" : "Add Customer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
