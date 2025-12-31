import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineBell,
    HiOutlineExclamationTriangle,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineXMark,
} from "react-icons/hi2";
import { GiSyringe } from "react-icons/gi";
import { notificationAPI } from "../services/api";

const TYPE_ICONS = {
    low_stock: HiOutlineExclamationTriangle,
    vaccination_due: GiSyringe,
    vaccination_overdue: GiSyringe,
    task_due: HiOutlineClock,
    task_overdue: HiOutlineExclamationTriangle,
    health_alert: HiOutlineExclamationTriangle,
    sale_completed: HiOutlineCheckCircle,
    system: HiOutlineBell,
};

const TYPE_COLORS = {
    low_stock: "text-amber-500",
    vaccination_due: "text-sky-500",
    vaccination_overdue: "text-rose-500",
    task_due: "text-amber-500",
    task_overdue: "text-rose-500",
    health_alert: "text-rose-500",
    sale_completed: "text-emerald-500",
    system: "text-slate-500",
};

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Check if user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        return !!token;
    };

    useEffect(() => {
        if (!isAuthenticated()) return;

        fetchUnreadCount();
        // Generate notifications on mount (silently fail if not ready)
        notificationAPI.generate().catch(() => { });

        // Check every 5 minutes
        const interval = setInterval(() => {
            if (isAuthenticated()) {
                notificationAPI.generate().catch(() => { });
                fetchUnreadCount();
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        if (!isAuthenticated()) return;
        try {
            const res = await notificationAPI.getUnreadCount();
            setUnreadCount(res.data?.count || 0);
        } catch (error) {
            // Silently fail - notifications are optional
        }
    };

    const fetchNotifications = async () => {
        if (!isAuthenticated()) return;
        try {
            setLoading(true);
            const res = await notificationAPI.getAll();
            setNotifications(res.data || []);
        } catch (error) {
            // Silently fail
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read");
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationAPI.delete(id);
            const n = notifications.find(n => n._id === id);
            setNotifications(notifications.filter(n => n._id !== id));
            if (!n?.isRead) setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            console.error("Failed to delete notification");
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
            >
                <HiOutlineBell className="h-6 w-6 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-scale-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-emerald-600 hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <HiOutlineBell className="mx-auto text-4xl text-slate-300 mb-2" />
                                <p className="text-slate-500 text-sm">No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const Icon = TYPE_ICONS[notification.type] || HiOutlineBell;
                                const colorClass = TYPE_COLORS[notification.type] || "text-slate-500";

                                return (
                                    <div
                                        key={notification._id}
                                        className={`flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors ${!notification.isRead ? "bg-emerald-50/50" : ""
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                            <Icon className="text-xl" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <p className="font-medium text-sm text-slate-900">{notification.title}</p>
                                                <button
                                                    onClick={() => handleDelete(notification._id)}
                                                    className="p-1 hover:bg-slate-200 rounded"
                                                >
                                                    <HiOutlineXMark className="h-4 w-4 text-slate-400" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-slate-400">
                                                    {getTimeAgo(notification.createdAt)}
                                                </span>
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="text-xs text-emerald-600 hover:underline"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                                {notification.link && (
                                                    <Link
                                                        to={notification.link}
                                                        className="text-xs text-sky-600 hover:underline"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        View
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
