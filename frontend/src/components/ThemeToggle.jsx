import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {isDark ? (
                <HiOutlineSun className="h-5 w-5 text-amber-500" />
            ) : (
                <HiOutlineMoon className="h-5 w-5 text-slate-600" />
            )}
        </button>
    );
}
