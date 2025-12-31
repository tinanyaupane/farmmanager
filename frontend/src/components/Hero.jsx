import { Link } from "react-router-dom";
import heroImage from "../assets/hero-farm.jpg";
import { HiOutlineArrowRight, HiOutlinePlay } from "react-icons/hi2";
import { GiChicken, GiNestEggs, GiWheat } from "react-icons/gi";
import { LuCarrot } from "react-icons/lu"; // or any veg icon you prefer
const subtitle =
  "Track birds, batches, sales, and field notes.";
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[85vh] flex items-center">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Terraced green hills and a river valley"
        className="absolute inset-0 h-full w-full object-cover brightness-110 contrast-[1.08] saturate-125 animate-hero-zoom"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl w-full px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge with Nepali text (no green dot) */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-hero-fade-slow">
            <span className="text-xs md:text-sm font-medium tracking-wide text-emerald-100">
              नमुना कृषि तथा पशुपालन फार्म
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 animate-hero-fade">
            Growing{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 animate-gradient">
                healthy birds
              </span>
            </span>
            , goats & greens
          </h1>

          {/* Bigger animated subtitle */}
   <p className="max-w-2xl text-xl md:text-2xl text-slate-100/90 leading-relaxed mb-9 font-medium">
  {subtitle.split("").map((ch, i) => (
    <span
      key={i}
      className="inline-block subtitle-type"
      style={{ animationDelay: `${i * 0.00}s` }}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ))}
</p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 animate-hero-stagger">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-400/40 hover:from-emerald-300 hover:to-emerald-400 transition-all duration-300 hover:scale-105"
            >
              Open Dashboard
              <HiOutlineArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/flocks"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium text-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              Manage Flocks
            </Link>

            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-3 text-white/80 hover:text-white text-sm font-medium transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <HiOutlinePlay className="h-4 w-4" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/10 animate-hero-stagger"
            style={{ animationDelay: "0.6s" }}
          >
            <div>
              <p className="text-3xl font-bold text-white">1,240+</p>
              <p className="text-sm text-slate-400">Birds Managed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">₹89K+</p>
              <p className="text-sm text-slate-400">Weekly Sales</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-slate-400">Flock Health</p>
            </div>
          </div>
        </div>

        {/* Bottom-right icon cluster */}
        <div className="absolute bottom-10 right-6 sm:bottom-12 sm:right-10 flex gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/12 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <GiChicken className="text-2xl sm:text-3xl text-emerald-300" />
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <GiNestEggs className="text-2xl sm:text-3xl text-amber-300" />
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <GiWheat className="text-2xl sm:text-3xl text-yellow-300" />
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <LuCarrot className="text-2xl sm:text-3xl text-orange-300" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
