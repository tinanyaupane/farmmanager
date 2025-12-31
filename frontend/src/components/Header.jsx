import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { GiChicken } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
// Dark mode disabled for now - files preserved in project
// import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/flocks", label: "Flocks" },
    { to: "/inventory", label: "Inventory" },
    { to: "/health", label: "Health" },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-300 transition-all duration-300 group-hover:scale-105">
            <GiChicken className="text-xl text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-bold tracking-tight text-slate-900">
              Farm Manager
            </span>
            <span className="block text-[0.65rem] text-slate-500">
              Poultry Management System
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 underline underline-offset-8 decoration-2 decoration-emerald-500"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-emerald-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle - Disabled for now */}
          {/* <ThemeToggle /> */}

          {/* Notifications - using real NotificationDropdown component */}
          {isAuthenticated && <NotificationDropdown />}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden sm:flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.farmName || "Farm"}
                  </p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-scale-in z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {user?.farmName}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <HiOutlineCog className="h-5 w-5 text-slate-600" />
                      <span className="text-sm text-slate-700">Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors text-left text-rose-600"
                    >
                      <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex items-center gap-2 btn-primary text-sm"
            >
              <HiOutlineUser className="h-4 w-4" />
              <span>Login</span>
            </button>
          )}

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/sales")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
          >
            <HiOutlineShoppingCart className="h-4 w-4" />
            <span>Record Sale</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <HiOutlineXMark className="h-6 w-6 text-slate-600" />
            ) : (
              <HiOutlineBars3 className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white animate-slide-in-down">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/sales");
              }}
              className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
            >
              <HiOutlineShoppingCart className="h-4 w-4" />
              <span>Record Sale</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
