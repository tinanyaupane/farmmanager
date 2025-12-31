import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { GiChicken, GiMedicines, GiSyringe, GiNestEggs } from "react-icons/gi";
import {
  HiOutlineShoppingCart,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineQuestionMarkCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { flockAPI, salesAPI } from "../services/api";

const mainNavItems = [
  { to: "/dashboard", icon: RxDashboard, label: "Overview", color: "emerald" },
  { to: "/calendar", icon: HiOutlineCalendarDays, label: "Calendar", color: "purple" },
  { to: "/flocks", icon: GiChicken, label: "Flocks", color: "amber" },
  { to: "/daily-logs", icon: GiNestEggs, label: "Daily Logs", color: "orange" },
  { to: "/tasks", icon: HiOutlineClipboardDocumentCheck, label: "Tasks", color: "blue" },
  { to: "/sales", icon: HiOutlineShoppingCart, label: "Sales", color: "sky" },
  { to: "/customers", icon: HiOutlineUsers, label: "Customers", color: "indigo" },
  { to: "/inventory", icon: HiOutlineClipboardDocumentList, label: "Inventory", color: "violet" },
  { to: "/expenses", icon: HiOutlineCurrencyRupee, label: "Expenses", color: "rose" },
  { to: "/products", icon: HiOutlineTag, label: "Products", color: "teal" },
  { to: "/health", icon: GiMedicines, label: "Health Log", color: "pink" },
  { to: "/vaccinations", icon: GiSyringe, label: "Vaccinations", color: "cyan" },
  { to: "/workers", icon: HiOutlineUserGroup, label: "Workers", color: "fuchsia" },
  { to: "/reports", icon: HiOutlineChartBar, label: "Reports", color: "lime" },
];

const bottomNavItems = [
  { to: "/settings", icon: HiOutlineCog6Tooth, label: "Settings" },
  { to: "/help", icon: HiOutlineQuestionMarkCircle, label: "Help" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBirds: 0,
    eggsCollected: 0,
    todaySales: 0,
  });

  // Fetch user-specific stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flockData, salesData] = await Promise.all([
          flockAPI.getStats(),
          salesAPI.getStats(),
        ]);

        setStats({
          totalBirds: flockData.data?.totalBirds || 0,
          eggsCollected: flockData.data?.eggsToday || 0,
          todaySales: salesData.data?.todaySales || 0,
        });
      } catch (error) {
        console.error("Error fetching sidebar stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 px-4 py-6 h-screen sticky top-0 overflow-hidden">
      
      {/* Main Navigation - Scrollable with fixed height */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300/50 pr-2 -mr-2">
        <h2 className="mb-4 px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400 sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10 border-b border-slate-100">
          Farm Console
        </h2>
        <nav className="space-y-1 pb-8" role="navigation" aria-label="Main navigation">
          {mainNavItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>

      {/* Quick Stats - User Specific - Fixed position */}
      <div className="my-6 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100/50 shadow-sm sticky bottom-32 z-20">
        <h3 className="text-xs font-semibold text-emerald-800 mb-3 tracking-wide">Today's Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Total Birds</span>
            <span className="font-bold text-slate-900">{stats.totalBirds.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Eggs Collected</span>
            <span className="font-bold text-slate-900">{stats.eggsCollected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Sales</span>
            <span className="font-bold text-emerald-600">₹{stats.todaySales.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed bottom */}
      <div className="border-t border-slate-200/50 pt-4 pb-2 sticky bottom-0 bg-white/80 backdrop-blur-sm">
        <nav className="space-y-1 mb-4" role="navigation" aria-label="Settings navigation">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile - Real User Data */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all duration-200 cursor-pointer group border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogout()}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/50 group-hover:scale-105 transition-transform">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-slate-950">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || "user@example.com"}</p>
          </div>
          <HiOutlineArrowRightOnRectangle className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-all duration-200 group-hover:rotate-3" />
        </div>
      </div>
    </aside>
  );
}

function NavItem({ to, icon: Icon, label, color }) {
  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    sky: "bg-sky-100 text-sky-600",
    indigo: "bg-indigo-100 text-indigo-600",
    violet: "bg-violet-100 text-violet-600",
    rose: "bg-rose-100 text-rose-600",
    teal: "bg-teal-100 text-teal-600",
    pink: "bg-pink-100 text-pink-600",
    cyan: "bg-cyan-100 text-cyan-600",
    fuchsia: "bg-fuchsia-100 text-fuchsia-600",
    lime: "bg-lime-100 text-lime-600",
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent border border-transparent hover:border-slate-200 ${
          isActive
            ? "bg-emerald-50 border-emerald-200 shadow-sm translate-x-1"
            : "hover:bg-slate-50 hover:shadow-sm hover:translate-x-1"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${
              isActive
                ? colorClasses[color] || "bg-emerald-100 text-emerald-600"
                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 group-hover:shadow-md"
            }`}
          >
            <Icon className="text-lg flex-shrink-0" />
          </span>
          <span
            className={`text-sm font-medium transition-all duration-200 flex-1 min-w-0 ${
              isActive ? "text-emerald-800 font-semibold" : "text-slate-700 group-hover:text-slate-900"
            }`}
          >
            {label}
          </span>
          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
          )}
        </>
      )}
    </NavLink>
  );
}
