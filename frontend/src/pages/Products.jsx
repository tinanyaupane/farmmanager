import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineXMark,
    HiOutlineCurrencyRupee,
    HiOutlineTag,
} from "react-icons/hi2";
import { GiNestEggs, GiChicken } from "react-icons/gi";
import { productAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const CATEGORIES = [
    { value: "eggs", label: "Eggs", icon: GiNestEggs, color: "bg-amber-100 text-amber-700" },
    { value: "birds", label: "Birds", icon: GiChicken, color: "bg-emerald-100 text-emerald-700" },
    { value: "meat", label: "Meat", icon: GiChicken, color: "bg-rose-100 text-rose-700" },
    { value: "manure", label: "Manure", color: "bg-orange-100 text-orange-700" },
    { value: "other", label: "Other", color: "bg-slate-100 text-slate-700" },
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        category: "eggs",
        unit: "dozen",
        basePrice: "",
        wholesalePrice: "",
        retailPrice: "",
        description: "",
    });

    const [priceData, setPriceData] = useState({
        basePrice: "",
        wholesalePrice: "",
        retailPrice: "",
        reason: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productAPI.getAll();
            setProducts(res.data || []);
        } catch (error) {
            addToast("Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productAPI.update(editingProduct._id, formData);
                addToast("Product updated!", "success");
            } else {
                await productAPI.create(formData);
                addToast("Product created!", "success");
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            addToast(error.message || "Operation failed", "error");
        }
    };

    const handlePriceUpdate = async (e) => {
        e.preventDefault();
        try {
            await productAPI.updatePrice(selectedProduct._id, priceData);
            addToast("Price updated!", "success");
            setShowPriceModal(false);
            setPriceData({ basePrice: "", wholesalePrice: "", retailPrice: "", reason: "" });
            fetchProducts();
        } catch (error) {
            addToast(error.message || "Price update failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await productAPI.delete(id);
            addToast("Product deleted!", "success");
            fetchProducts();
        } catch (error) {
            addToast(error.message || "Delete failed", "error");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            unit: product.unit,
            basePrice: product.basePrice,
            wholesalePrice: product.wholesalePrice || "",
            retailPrice: product.retailPrice || "",
            description: product.description || "",
        });
        setShowModal(true);
    };

    const openPriceModal = (product) => {
        setSelectedProduct(product);
        setPriceData({
            basePrice: product.basePrice,
            wholesalePrice: product.wholesalePrice || "",
            retailPrice: product.retailPrice || "",
            reason: "",
        });
        setShowPriceModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "eggs",
            unit: "dozen",
            basePrice: "",
            wholesalePrice: "",
            retailPrice: "",
            description: "",
        });
        setEditingProduct(null);
    };

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
                        Pricing Management
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Products & Pricing</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage product prices and track price history</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add Product</span>
                </button>
            </header>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="card-organic p-12 text-center">
                    <HiOutlineTag className="mx-auto text-6xl text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No products found</h3>
                    <p className="text-sm text-slate-500 mt-2">Add products to manage pricing!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div key={product._id} className="card-organic p-5 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                        {product.category === "eggs" && <GiNestEggs className="text-2xl text-amber-500" />}
                                        {product.category === "birds" && <GiChicken className="text-2xl text-emerald-500" />}
                                        {product.category === "meat" && <GiChicken className="text-2xl text-rose-500" />}
                                        {!["eggs", "birds", "meat"].includes(product.category) && (
                                            <HiOutlineTag className="text-2xl text-slate-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryStyle(product.category)}`}>
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                    <span className="text-sm text-slate-600">Base Price</span>
                                    <span className="text-lg font-bold text-emerald-600">₹{product.basePrice}/{product.unit}</span>
                                </div>
                                {product.wholesalePrice && (
                                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                        <span className="text-sm text-slate-500">Wholesale</span>
                                        <span className="font-medium text-slate-700">₹{product.wholesalePrice}/{product.unit}</span>
                                    </div>
                                )}
                                {product.retailPrice && (
                                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                        <span className="text-sm text-slate-500">Retail</span>
                                        <span className="font-medium text-slate-700">₹{product.retailPrice}/{product.unit}</span>
                                    </div>
                                )}
                            </div>

                            {product.priceHistory?.length > 1 && (
                                <p className="text-xs text-slate-500 mb-4">
                                    Last updated: {new Date(product.priceHistory[product.priceHistory.length - 1]?.date).toLocaleDateString("en-IN")}
                                </p>
                            )}

                            <div className="flex items-center gap-2 pt-3 border-t">
                                <button
                                    onClick={() => openPriceModal(product)}
                                    className="flex-1 btn-primary text-sm py-2"
                                >
                                    <HiOutlineCurrencyRupee className="inline h-4 w-4 mr-1" />
                                    Update Price
                                </button>
                                <button onClick={() => handleEdit(product)} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <HiOutlinePencilSquare className="h-4 w-4 text-slate-500" />
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-rose-50 rounded-lg">
                                    <HiOutlineTrash className="h-4 w-4 text-rose-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-organic"
                                        placeholder="e.g., Farm Fresh Eggs"
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
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Unit *</label>
                                    <input
                                        type="text"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="input-organic"
                                        placeholder="e.g., dozen, kg, piece"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Base Price *</label>
                                    <input
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                        className="input-organic"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Wholesale Price</label>
                                    <input
                                        type="number"
                                        value={formData.wholesalePrice}
                                        onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                        className="input-organic"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Retail Price</label>
                                    <input
                                        type="number"
                                        value={formData.retailPrice}
                                        onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                                        className="input-organic"
                                        min="0"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-organic"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? "Update" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Price Update Modal */}
            {showPriceModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Update Price</h2>
                                <p className="text-sm text-slate-500">{selectedProduct.name}</p>
                            </div>
                            <button onClick={() => setShowPriceModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePriceUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">New Base Price *</label>
                                <input
                                    type="number"
                                    value={priceData.basePrice}
                                    onChange={(e) => setPriceData({ ...priceData, basePrice: e.target.value })}
                                    className="input-organic"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Wholesale Price</label>
                                <input
                                    type="number"
                                    value={priceData.wholesalePrice}
                                    onChange={(e) => setPriceData({ ...priceData, wholesalePrice: e.target.value })}
                                    className="input-organic"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Retail Price</label>
                                <input
                                    type="number"
                                    value={priceData.retailPrice}
                                    onChange={(e) => setPriceData({ ...priceData, retailPrice: e.target.value })}
                                    className="input-organic"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Change</label>
                                <input
                                    type="text"
                                    value={priceData.reason}
                                    onChange={(e) => setPriceData({ ...priceData, reason: e.target.value })}
                                    className="input-organic"
                                    placeholder="e.g., Market price increase"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowPriceModal(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" className="btn-primary">Update Price</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
