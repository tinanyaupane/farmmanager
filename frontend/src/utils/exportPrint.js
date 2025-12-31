/**
 * Export and Print Utilities for Farm Manager
 * Provides functions to export data as CSV/PDF and print functionality
 */

import { HiOutlineArrowDownTray, HiOutlinePrinter } from "react-icons/hi2";

// Export data to CSV
export function exportToCSV(data, filename = "data.csv") {
    if (!data || !data.length) {
        alert("No data to export");
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(","), // Header row
        ...data.map((row) =>
            headers.map((header) => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(",")
        ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Print current page
export function printPage() {
    window.print();
}

// Print specific element
export function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Element not found:", elementId);
        return;
    }

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print</title>");

    // Copy styles
    const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
            try {
                return Array.from(styleSheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("\n");
            } catch (e) {
                return "";
            }
        })
        .join("\n");

    printWindow.document.write(`<style>${styles}</style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write(element.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Export button component
export function ExportButton({ data, filename, label = "Export CSV", className = "" }) {
    return (
        <button
            onClick={() => exportToCSV(data, filename)}
            className={`btn-secondary flex items-center gap-2 ${className}`}
        >
            <HiOutlineArrowDownTray className="h-4 w-4" />
            <span>{label}</span>
        </button>
    );
}

// Print button component
export function PrintButton({ label = "Print", onClick, className = "" }) {
    const handlePrint = () => {
        if (onClick) {
            onClick();
        } else {
            printPage();
        }
    };

    return (
        <button
            onClick={handlePrint}
            className={`btn-secondary flex items-center gap-2 ${className}`}
        >
            <HiOutlinePrinter className="h-4 w-4" />
            <span>{label}</span>
        </button>
    );
}

// Format data for export (removes unwanted fields, formats dates, etc.)
export function formatDataForExport(data, fieldsMapping = {}) {
    return data.map((item) => {
        const formatted = {};

        // If fieldsMapping is provided, use it. Otherwise, use all fields
        const fields = Object.keys(fieldsMapping).length > 0
            ? fieldsMapping
            : Object.keys(item).reduce((acc, key) => {
                acc[key] = key;
                return acc;
            }, {});

        Object.entries(fields).forEach(([key, label]) => {
            let value = item[key];

            // Format dates
            if (value instanceof Date) {
                value = value.toLocaleDateString();
            }

            // Format booleans
            if (typeof value === "boolean") {
                value = value ? "Yes" : "No";
            }

            // Handle null/undefined
            if (value === null || value === undefined) {
                value = "";
            }

            formatted[label] = value;
        });

        return formatted;
    });
}

// Print styles for better printing
export const printStyles = `
  @media print {
    @page {
      margin: 1cm;
    }
    
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    .no-print {
      display: none !important;
    }
    
    .print-break-before {
      page-break-before: always;
    }
    
    .print-break-after {
      page-break-after: always;
    }
    
    .print-avoid-break {
      page-break-inside: avoid;
    }
    
    /* Hide navigation, sidebars, etc */
    header, nav, aside, footer, .sidebar {
      display: none !important;
    }
    
    /* Expand main content */
    main {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }
`;
