import { Link } from "react-router-dom";
import { GiChicken } from "react-icons/gi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
              <GiChicken className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">FarmManager</p>
              <p className="text-xs text-slate-500">© {currentYear} All rights reserved</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/about" className="text-slate-500 hover:text-emerald-600 transition-colors">
              About
            </Link>
            <Link to="/help" className="text-slate-500 hover:text-emerald-600 transition-colors">
              Help
            </Link>
            <Link to="/privacy" className="text-slate-500 hover:text-emerald-600 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-emerald-600 transition-colors">
              Terms
            </Link>
          </nav>

          {/* Made with love */}
          <p className="text-xs text-slate-400">
            Made with <span className="text-rose-500">♥</span> in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
