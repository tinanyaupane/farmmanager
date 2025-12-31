import { createContext, useContext, useState, useCallback } from "react";
import {
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineInformationCircle,
    HiOutlineXCircle,
    HiOutlineXMark,
} from "react-icons/hi2";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function Toast({ message, type, onClose }) {
    const config = {
        success: {
            icon: HiOutlineCheckCircle,
            bg: "bg-emerald-600",
            border: "border-emerald-700",
        },
        error: {
            icon: HiOutlineXCircle,
            bg: "bg-rose-600",
            border: "border-rose-700",
        },
        warning: {
            icon: HiOutlineExclamationTriangle,
            bg: "bg-amber-600",
            border: "border-amber-700",
        },
        info: {
            icon: HiOutlineInformationCircle,
            bg: "bg-sky-600",
            border: "border-sky-700",
        },
    };

    const { icon: Icon, bg, border } = config[type] || config.info;

    return (
        <div
            className={`${bg} ${border} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[320px] max-w-md border-2 pointer-events-auto animate-slide-in-right`}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium flex-1">{message}</span>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
                <HiOutlineXMark className="h-4 w-4" />
            </button>
        </div>
    );
}
