import { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineEllipsisVertical,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowDownTray,
  HiOutlinePrinter,
} from "react-icons/hi2";
import { salesAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";
import { exportData } from "../utils/export";
import InvoicePrint from "../components/InvoicePrint";
import { useAuth } from "../context/AuthContext";


export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ totalRevenue: 0, todaySales: 0, pendingPayments: 0 });
  const [printingSale, setPrintingSale] = useState(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customer: "",
    customerPhone: "",
    items: [{ name: "", quantity: 1, unitPrice: 0 }],
    saleDate: new Date().toISOString().split("T")[0],
    paymentStatus: "completed",
    paymentMethod: "cash",
    notes: "",
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const [salesRes, statsRes] = await Promise.all([
        salesAPI.getAll(),
        salesAPI.getStats(),
      ]);
      setSales(salesRes.data || []);
      setStats(statsRes.data || { totalRevenue: 0, todaySales: 0, pendingPayments: 0 });
    } catch (error) {
      addToast("Failed to load sales", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleData = {
        ...formData,
        totalAmount: calculateTotal(),
      };

      if (editingSale) {
        await salesAPI.update(editingSale._id, saleData);
        addToast("Sale updated successfully!", "success");
      } else {
        await salesAPI.create(saleData);
        addToast("Sale recorded successfully!", "success");
      }
      setShowModal(false);
      resetForm();
      fetchSales();
    } catch (error) {
      addToast(error.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await salesAPI.delete(id);
      addToast("Sale deleted successfully!", "success");
      fetchSales();
    } catch (error) {
      addToast(error.message || "Delete failed", "error");
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      customer: sale.customer,
      customerPhone: sale.customerPhone || "",
      items: sale.items || [{ name: "", quantity: 1, unitPrice: 0 }],
      saleDate: sale.saleDate?.split("T")[0] || "",
      paymentStatus: sale.paymentStatus,
      paymentMethod: sale.paymentMethod || "cash",
      notes: sale.notes || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      customer: "",
      customerPhone: "",
      items: [{ name: "", quantity: 1, unitPrice: 0 }],
      saleDate: new Date().toISOString().split("T")[0],
      paymentStatus: "completed",
      paymentMethod: "cash",
      notes: "",
    });
    setEditingSale(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || sale.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-slate-600">Loading sales...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Sales Management
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Sales & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Track your sales and manage invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportData("sales", sales)}
            className="btn-ghost flex items-center gap-2"
            title="Export to CSV"
          >
            <HiOutlineArrowDownTray className="h-5 w-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="h-5 w-5" />
            <span>Record Sale</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-organic p-5 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <HiOutlineCurrencyRupee className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
              <HiOutlineDocumentText className="text-2xl text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Today's Sales</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.todaySales?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-organic p-5 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <HiOutlineClock className="text-2xl text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending Payments</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.pendingPayments?.toLocaleString() || 0}</p>
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
            placeholder="Search by customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-organic pl-12 w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-organic w-auto"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <div className="card-organic p-12 text-center">
          <HiOutlineDocumentText className="mx-auto text-6xl text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No sales found</h3>
          <p className="text-sm text-slate-500 mt-2">
            {sales.length === 0 ? "Record your first sale!" : "No sales match your criteria."}
          </p>
        </div>
      ) : (
        <div className="card-organic overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Invoice</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-900">{sale.invoiceNumber || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{sale.customer}</p>
                      <p className="text-xs text-slate-500">{sale.customerPhone || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {sale.items?.map(i => i.name).join(", ") || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-600">₹{sale.totalAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(sale.saleDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${sale.paymentStatus === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                        }`}>
                        {sale.paymentStatus === "completed" ? <HiOutlineCheckCircle className="h-3 w-3" /> : <HiOutlineClock className="h-3 w-3" />}
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPrintingSale(sale)}
                          className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Print Invoice"
                        >
                          <HiOutlinePrinter className="h-4 w-4 text-sky-500" />
                        </button>
                        <button
                          onClick={() => handleEdit(sale)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                        >
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSale ? "Edit Sale" : "Record New Sale"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="input-organic"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="input-organic"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Items *</label>
                  <button type="button" onClick={addItem} className="text-sm text-emerald-600 hover:text-emerald-700">
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        className="input-organic flex-1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                        className="input-organic w-20"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                        className="input-organic w-24"
                        min="0"
                        required
                      />
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded">
                          <HiOutlineXMark className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-right text-lg font-bold text-emerald-600 mt-2">
                  Total: ₹{calculateTotal().toLocaleString()}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                    className="input-organic"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="input-organic"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
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
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

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
                  {editingSale ? "Update Sale" : "Record Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Modal */}
      {printingSale && (
        <InvoicePrint
          sale={printingSale}
          user={user}
          onClose={() => setPrintingSale(null)}
        />
      )}
    </section>
  );
}
