// Data Export Utilities for Farm Manager

/**
 * Convert array of objects to CSV string
 */
export const arrayToCSV = (data, columns) => {
    if (!data || data.length === 0) return "";

    // Get headers from columns or first object keys
    const headers = columns || Object.keys(data[0]);

    // Create CSV rows
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
        const values = headers.map((header) => {
            let value = row[header];

            // Handle nested objects (e.g., flock.name)
            if (header.includes(".")) {
                const keys = header.split(".");
                value = keys.reduce((obj, key) => obj?.[key], row);
            }

            // Handle special types
            if (value === null || value === undefined) {
                value = "";
            } else if (typeof value === "object") {
                if (value instanceof Date) {
                    value = value.toISOString().split("T")[0];
                } else if (Array.isArray(value)) {
                    value = value.join("; ");
                } else {
                    value = JSON.stringify(value);
                }
            }

            // Escape quotes and wrap in quotes if needed
            const stringValue = String(value);
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

/**
 * Export data to CSV and download
 */
export const exportToCSV = (data, filename, columns) => {
    const csvContent = arrayToCSV(data, columns);
    downloadCSV(csvContent, filename);
};

// Predefined export configurations
export const exportConfigs = {
    sales: {
        columns: ["invoiceNumber", "customerName", "totalAmount", "paymentStatus", "createdAt"],
        filename: "sales_export.csv",
        transform: (sale) => ({
            invoiceNumber: sale.invoiceNumber || "N/A",
            customerName: sale.customerName || sale.customer?.name || "N/A",
            totalAmount: sale.totalAmount || 0,
            paymentStatus: sale.paymentStatus || "pending",
            createdAt: new Date(sale.createdAt).toLocaleDateString(),
        }),
    },
    inventory: {
        columns: ["name", "category", "quantity", "unit", "minimumStock", "status"],
        filename: "inventory_export.csv",
        transform: (item) => ({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            minimumStock: item.minimumStock,
            status: item.quantity <= item.minimumStock ? "Low Stock" : "In Stock",
        }),
    },
    flocks: {
        columns: ["name", "type", "birdCount", "status", "startDate", "healthScore"],
        filename: "flocks_export.csv",
        transform: (flock) => ({
            name: flock.name,
            type: flock.type,
            birdCount: flock.currentBirdCount || flock.birdCount || 0,
            status: flock.status,
            startDate: new Date(flock.startDate).toLocaleDateString(),
            healthScore: flock.healthScore || "N/A",
        }),
    },
    expenses: {
        columns: ["date", "category", "description", "amount", "vendor"],
        filename: "expenses_export.csv",
        transform: (expense) => ({
            date: new Date(expense.date).toLocaleDateString(),
            category: expense.category,
            description: expense.description || "",
            amount: expense.amount,
            vendor: expense.vendor || "N/A",
        }),
    },
    customers: {
        columns: ["name", "phone", "email", "type", "totalPurchases", "balance"],
        filename: "customers_export.csv",
        transform: (customer) => ({
            name: customer.name,
            phone: customer.phone,
            email: customer.email || "",
            type: customer.type,
            totalPurchases: customer.totalPurchases || 0,
            balance: customer.balance || 0,
        }),
    },
    workers: {
        columns: ["name", "phone", "role", "shift", "salary", "joinDate"],
        filename: "workers_export.csv",
        transform: (worker) => ({
            name: worker.name,
            phone: worker.phone,
            role: worker.role,
            shift: worker.shift,
            salary: worker.salary,
            joinDate: new Date(worker.joinDate).toLocaleDateString(),
        }),
    },
    dailyLogs: {
        columns: ["date", "flock", "openBirds", "closeBirds", "eggsCollected", "feedUsed", "mortality"],
        filename: "daily_logs_export.csv",
        transform: (log) => ({
            date: new Date(log.date).toLocaleDateString(),
            flock: log.flock?.name || "N/A",
            openBirds: log.openingBirdCount || 0,
            closeBirds: log.closingBirdCount || 0,
            eggsCollected: log.eggsCollected || 0,
            feedUsed: log.feedConsumed || 0,
            mortality: log.mortality || 0,
        }),
    },
};

/**
 * Export a specific data type with predefined configuration
 */
export const exportData = (dataType, data) => {
    const config = exportConfigs[dataType];
    if (!config) {
        console.error(`Unknown export type: ${dataType}`);
        return;
    }

    const transformedData = data.map(config.transform);
    exportToCSV(transformedData, config.filename, config.columns);
};

/**
 * Print content utility
 */
export const printContent = (elementId, title = "Print") => {
    const content = document.getElementById(elementId);
    if (!content) {
        console.error("Element not found:", elementId);
        return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    margin: 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f4f4f4;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${content.innerHTML}
            <div class="footer">
                Generated by FarmManager on ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
};
