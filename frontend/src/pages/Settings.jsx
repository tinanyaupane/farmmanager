import { useState, useEffect } from "react";
import {
    HiOutlineUser,
    HiOutlineBell,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlinePaintBrush,
    HiOutlineCheckCircle,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineComputerDesktop,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
// Dark mode disabled for now
// import { useTheme } from "../context/ThemeContext";
import { authAPI } from "../services/api";
import { useToast } from "../components/Toast";

export default function Settings() {
    const { user, updateUser } = useAuth();
    // Dark mode disabled
    // const { theme, setLightMode, setDarkMode, toggleTheme } = useTheme();
    const theme = "light"; // Default to light
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        // Profile - Will load from user
        name: "",
        email: "",
        phone: "",
        farmName: "",
        location: "",

        // Password change
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",

        // Notifications (local state for now)
        emailNotifications: true,
        salesAlerts: true,
        lowStockAlerts: true,
        healthAlerts: true,

        // Preferences
        language: "en",
        currency: "NPR",
        dateFormat: "YYYY-MM-DD",
        theme: "light",
    });

    // Load user data on mount
    useEffect(() => {
        if (user) {
            setSettings(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                farmName: user.farmName || "",
                location: user.location || "",
            }));
        }
    }, [user]);

    // Get user initials
    const getUserInitials = () => {
        if (!user?.name) return "U";
        const names = user.name.split(" ");
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return user.name.substring(0, 2).toUpperCase();
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authAPI.updateDetails({
                name: settings.name,
                email: settings.email,
                phone: settings.phone,
                farmName: settings.farmName,
                location: settings.location,
            });

            // Update the user in context
            if (response.data) {
                updateUser(response.data);
            }

            addToast("Profile updated successfully!", "success");
        } catch (error) {
            addToast(error.message || "Failed to update profile", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (settings.newPassword !== settings.confirmPassword) {
            addToast("New passwords do not match!", "error");
            return;
        }

        if (settings.newPassword.length < 8) {
            addToast("Password must be at least 8 characters", "error");
            return;
        }

        setIsLoading(true);

        try {
            await authAPI.updatePassword({
                currentPassword: settings.currentPassword,
                newPassword: settings.newPassword,
            });

            // Clear password fields
            setSettings(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));

            addToast("Password changed successfully!", "success");
        } catch (error) {
            addToast(error.message || "Failed to change password", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: HiOutlineUser },
        { id: "notifications", label: "Notifications", icon: HiOutlineBell },
        { id: "preferences", label: "Preferences", icon: HiOutlineGlobeAlt },
        { id: "security", label: "Security", icon: HiOutlineShieldCheck },
        { id: "appearance", label: "Appearance", icon: HiOutlinePaintBrush },
    ];

    return (
        <section className="space-y-6">
            {/* Header */}
            <header className="animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
                    Account Settings
                </p>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your account preferences and configurations
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="card-organic p-4 sticky top-4">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span className="font-medium text-sm">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="card-organic p-6">
                        {activeTab === "profile" && (
                            <form onSubmit={handleProfileSave} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h2>

                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            {getUserInitials()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{user?.name}</p>
                                            <p className="text-sm text-slate-500">{user?.email}</p>
                                            <p className="text-xs text-emerald-600 mt-1">{user?.farmName}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={settings.name}
                                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                                className="input-organic"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={settings.email}
                                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                                className="input-organic"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={settings.phone}
                                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                                className="input-organic"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Farm Name</label>
                                            <input
                                                type="text"
                                                value={settings.farmName}
                                                onChange={(e) => setSettings({ ...settings, farmName: e.target.value })}
                                                className="input-organic"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={settings.location}
                                                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                                className="input-organic"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="pt-6 border-t border-slate-200">
                                    <div className="flex justify-end gap-3">
                                        <button type="submit" disabled={isLoading} className="btn-primary">
                                            {isLoading ? "Saving..." : "Save Profile"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>

                                <div className="space-y-4">
                                    <NotificationToggle
                                        label="Email Notifications"
                                        description="Receive email updates about your farm"
                                        checked={settings.emailNotifications}
                                        onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                                    />
                                    <NotificationToggle
                                        label="Sales Alerts"
                                        description="Get notified when a sale is completed"
                                        checked={settings.salesAlerts}
                                        onChange={(checked) => setSettings({ ...settings, salesAlerts: checked })}
                                    />
                                    <NotificationToggle
                                        label="Low Stock Alerts"
                                        description="Alert when inventory items are running low"
                                        checked={settings.lowStockAlerts}
                                        onChange={(checked) => setSettings({ ...settings, lowStockAlerts: checked })}
                                    />
                                    <NotificationToggle
                                        label="Health Alerts"
                                        description="Critical health updates for your flocks"
                                        checked={settings.healthAlerts}
                                        onChange={(checked) => setSettings({ ...settings, healthAlerts: checked })}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "preferences" && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-slate-900">Regional Preferences</h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                                        <select
                                            value={settings.language}
                                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                            className="input-organic"
                                        >
                                            <option value="en">English</option>
                                            <option value="ne">नेपाली (Nepali)</option>
                                            <option value="hi">हिन्दी (Hindi)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                            className="input-organic"
                                        >
                                            <option value="NPR">NPR - Nepali Rupee</option>
                                            <option value="INR">INR - Indian Rupee</option>
                                            <option value="USD">USD - US Dollar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                                        <select
                                            value={settings.dateFormat}
                                            onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                                            className="input-organic"
                                        >
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <h2 className="text-lg font-bold text-slate-900">Change Password</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={settings.currentPassword}
                                            onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                                            className="input-organic"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={settings.newPassword}
                                            onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                                            className="input-organic"
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={settings.confirmPassword}
                                            onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                                            className="input-organic"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200">
                                    <button type="submit" disabled={isLoading} className="btn-primary">
                                        {isLoading ? "Changing..." : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === "appearance" && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-bold text-slate-900">Appearance Settings</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            className="p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 border-emerald-500 bg-emerald-50"
                                        >
                                            <HiOutlineSun className="h-8 w-8 text-amber-500" />
                                            <span className="font-medium">Light</span>
                                            <span className="text-xs text-emerald-600">Active</span>
                                        </button>
                                        <button
                                            type="button"
                                            disabled
                                            className="p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 border-slate-200 opacity-50 cursor-not-allowed"
                                        >
                                            <HiOutlineMoon className="h-8 w-8 text-violet-500" />
                                            <span className="font-medium">Dark</span>
                                            <span className="text-xs text-slate-500">Coming Soon</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <p className="text-sm text-amber-800">
                                        <strong>🌙 Dark mode coming soon!</strong> We're working on a beautiful dark theme for better nighttime viewing.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function NotificationToggle({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div>
                <p className="font-medium text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-slate-300"
                    }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : ""
                        }`}
                />
            </button>
        </div>
    );
}
