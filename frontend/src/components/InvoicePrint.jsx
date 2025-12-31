import { useRef } from "react";
import { HiOutlinePrinter, HiOutlineXMark } from "react-icons/hi2";

export default function InvoicePrint({ sale, user, onClose }) {
    const invoiceRef = useRef(null);

    const handlePrint = () => {
        const content = invoiceRef.current;
        if (!content) return;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${sale.invoiceNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        padding: 40px;
                        color: #1e293b;
                        line-height: 1.6;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .invoice-header {
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        padding: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .farm-name {
                        font-size: 24px;
                        font-weight: 700;
                    }
                    .invoice-title {
                        font-size: 32px;
                        font-weight: 300;
                    }
                    .invoice-body {
                        padding: 30px;
                    }
                    .invoice-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .info-section h3 {
                        font-size: 12px;
                        text-transform: uppercase;
                        color: #64748b;
                        margin-bottom: 8px;
                    }
                    .info-section p {
                        font-size: 14px;
                        color: #334155;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th {
                        background: #f8fafc;
                        text-align: left;
                        padding: 12px;
                        font-size: 12px;
                        text-transform: uppercase;
                        color: #64748b;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    td {
                        padding: 16px 12px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .text-right { text-align: right; }
                    .totals {
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 2px solid #e2e8f0;
                    }
                    .total-row {
                        display: flex;
                        justify-content: flex-end;
                        gap: 40px;
                        padding: 8px 0;
                    }
                    .grand-total {
                        font-size: 24px;
                        font-weight: 700;
                        color: #10b981;
                    }
                    .invoice-footer {
                        background: #f8fafc;
                        padding: 20px 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #64748b;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .status-paid {
                        background: #d1fae5;
                        color: #059669;
                    }
                    .status-pending {
                        background: #fef3c7;
                        color: #d97706;
                    }
                    .status-partial {
                        background: #dbeafe;
                        color: #2563eb;
                    }
                    @media print {
                        body { padding: 0; }
                        .invoice-container { border: none; }
                    }
                </style>
            </head>
            <body>
                ${content.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "paid": return "status-paid";
            case "partial": return "status-partial";
            default: return "status-pending";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in overflow-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                {/* Actions */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
                    <h2 className="text-lg font-semibold">Invoice Preview</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="btn-primary flex items-center gap-2"
                        >
                            <HiOutlinePrinter className="h-5 w-5" />
                            Print / Save PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <HiOutlineXMark className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div ref={invoiceRef} className="p-6">
                    <div className="invoice-container">
                        {/* Header */}
                        <div className="invoice-header" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="farm-name" style={{ fontSize: "24px", fontWeight: 700 }}>
                                    {user?.farmName || "FarmManager"}
                                </div>
                                <div style={{ fontSize: "14px", opacity: 0.9 }}>
                                    {user?.location || "Your Farm Location"}
                                </div>
                            </div>
                            <div className="invoice-title" style={{ fontSize: "32px", fontWeight: 300 }}>
                                INVOICE
                            </div>
                        </div>

                        {/* Body */}
                        <div className="invoice-body" style={{ padding: "30px" }}>
                            {/* Info */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                                <div>
                                    <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>Bill To</h3>
                                    <p style={{ fontWeight: 600 }}>{sale.customerName || sale.customer?.name || "Walk-in Customer"}</p>
                                    <p style={{ color: "#64748b", fontSize: "14px" }}>{sale.customer?.phone || ""}</p>
                                    <p style={{ color: "#64748b", fontSize: "14px" }}>{sale.customer?.email || ""}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>Invoice Details</h3>
                                    <p><strong>Invoice #:</strong> {sale.invoiceNumber}</p>
                                    <p><strong>Date:</strong> {new Date(sale.createdAt).toLocaleDateString()}</p>
                                    <p>
                                        <span
                                            className={`status-badge ${getStatusClass(sale.paymentStatus)}`}
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                background: sale.paymentStatus === "paid" ? "#d1fae5" : sale.paymentStatus === "partial" ? "#dbeafe" : "#fef3c7",
                                                color: sale.paymentStatus === "paid" ? "#059669" : sale.paymentStatus === "partial" ? "#2563eb" : "#d97706",
                                            }}
                                        >
                                            {sale.paymentStatus?.toUpperCase() || "PENDING"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc" }}>
                                        <th style={{ textAlign: "left", padding: "12px", fontSize: "12px", textTransform: "uppercase", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>Item</th>
                                        <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", textTransform: "uppercase", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>Qty</th>
                                        <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", textTransform: "uppercase", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>Price</th>
                                        <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", textTransform: "uppercase", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.items?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={{ padding: "16px 12px", borderBottom: "1px solid #e2e8f0" }}>
                                                {item.productName || item.name || "Product"}
                                            </td>
                                            <td style={{ padding: "16px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                                                {item.quantity} {item.unit || ""}
                                            </td>
                                            <td style={{ padding: "16px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                                                ₹{item.price?.toLocaleString() || item.unitPrice?.toLocaleString() || 0}
                                            </td>
                                            <td style={{ padding: "16px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                                                ₹{((item.quantity || 0) * (item.price || item.unitPrice || 0)).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #e2e8f0" }}>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "8px 0" }}>
                                    <span>Subtotal:</span>
                                    <span>₹{(sale.subtotal || sale.totalAmount || 0).toLocaleString()}</span>
                                </div>
                                {sale.discount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "8px 0", color: "#dc2626" }}>
                                        <span>Discount:</span>
                                        <span>-₹{sale.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "8px 0", fontSize: "24px", fontWeight: 700, color: "#10b981" }}>
                                    <span>Total:</span>
                                    <span>₹{(sale.totalAmount || 0).toLocaleString()}</span>
                                </div>
                                {sale.amountPaid > 0 && sale.amountPaid < sale.totalAmount && (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "8px 0" }}>
                                            <span>Paid:</span>
                                            <span>₹{sale.amountPaid.toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "8px 0", color: "#dc2626" }}>
                                            <span>Balance:</span>
                                            <span>₹{(sale.totalAmount - sale.amountPaid).toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="invoice-footer" style={{ background: "#f8fafc", padding: "20px 30px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
                            <p>Thank you for your business!</p>
                            <p style={{ marginTop: "8px" }}>
                                Contact: {user?.phone || "N/A"} | {user?.email || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
