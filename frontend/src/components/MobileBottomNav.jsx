import { NavLink, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import {
    HiOutlineShoppingCart,
    HiOutlineClipboardDocumentCheck,
    HiOutlineCalendarDays,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { GiChicken } from "react-icons/gi";

const navItems = [
    { to: "/dashboard", icon: RxDashboard, label: "Home" },
    { to: "/flocks", icon: GiChicken, label: "Flocks" },
    { to: "/tasks", icon: HiOutlineClipboardDocumentCheck, label: "Tasks" },
    { to: "/sales", icon: HiOutlineShoppingCart, label: "Sales" },
    { to: "/settings", icon: HiOutlineCog6Tooth, label: "Settings" },
];

export default function MobileBottomNav() {
    const location = useLocation();

    // Don't show on non-dashboard pages
    const hiddenPaths = ["/", "/login", "/register", "/about", "/privacy", "/terms", "/help"];
    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1 lg:hidden">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${isActive
                                ? "text-emerald-600"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? "scale-110" : ""} transition-transform`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <span className="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full" />
                            )}
                        </NavLink>
                    );
                })}
            </div>
            {/* Safe area for iPhone notch */}
            <div className="h-safe-bottom bg-white" />
        </nav>
    );
}
