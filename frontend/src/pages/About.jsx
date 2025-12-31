import flower from "../assets/flower.jpeg";
import worker1 from "../assets/worker1.jpeg";
import worker2 from "../assets/worker2.jpeg";
import nature1 from "../assets/nature1.jpeg";
import sky from "../assets/sky.jpeg";
import background from "../assets/background.jpeg";
import farmboard from "../assets/farmboard.jpeg";
import cute from "../assets/cute.jpg";
import poultry2 from "../assets/poultry2.jpeg";
import veggie from "../assets/veggie.jpeg";
import rainwaterstore from "../assets/rainwaterstore.jpeg";
import goat from "../assets/goat.jpeg";

const galleryImages = [farmboard,  poultry2,goat,nature1, veggie,background, worker1, worker2,  cute,rainwaterstore,sky];

export default function About() {
return (
    <main className="flex-1 bg-slate-50">
    {/* Hero / Intro with flower background */}
<section className="relative overflow-hidden text-white">
  {/* Background image */}
  <img
    src={flower}
    alt="Flower bed on the hillside at Arm Farm"
    className="absolute inset-0 h-full w-full object-cover brightness-110 saturate-120"
  />

  {/* Very light overlay only behind text side */}
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/65 via-emerald-900/65 to-transparent" />

  {/* Content */}
  <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-24">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100 mb-3">
      About our Farm
    </p>
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-md">
      A hillside poultry farm close to nature.
    </h1>
    <p className="max-w-2xl text-sm md:text-base text-emerald-50/95 leading-relaxed text-justify drop-shadow">
      Our farm is a small hillside farm in western Nepal where poultry,
      goats, and mixed crops are managed together. The goal is to raise
      healthy birds, keep soil and water clean, and support nearby
      families with fresh food.
    </p>
  </div>
</section>


      
{/* Scrollable card gallery: 3 images visible, buttons scroll one card */}
<div className="relative">
  <div className="relative rounded-3xl border border-emerald-400 bg-slate-900 px-4 py-4 overflow-hidden">
    <div
      id="about-gallery"
      className="flex gap-4 overflow-x-auto no-scrollbar"
    >
      {galleryImages.map((src, idx) => (
        <div
          key={idx}
          className="shrink-0 w-[260px] md:w-[280px] lg:w-[300px] h-56 md:h-64 lg:h-72
                     rounded-2xl overflow-hidden border border-emerald-300 bg-slate-700
                     shadow-[0_0_10px_rgba(16,185,129,0.35)]
                     transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(16,185,129,0.5)]"
        >
          <img
            src={src}
            alt="Scenes from Arm Farm hillside"
            className="w-full h-full object-cover brightness-115 contrast-115 saturate-115"
          />
        </div>
      ))}
    </div>

    {/* Left button */}
    <button
      type="button"
      onClick={() => {
        const scroller = document.getElementById("about-gallery");
        if (scroller) {
          const cardWidth = scroller.firstElementChild?.clientWidth || 280;
          scroller.scrollBy({ left: -cardWidth - 16, behavior: "smooth" }); // 16 ≈ gap
        }
      }}
      className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2
                 h-9 w-9 rounded-full bg-emerald-500 text-white text-sm shadow-lg
                 hover:bg-emerald-600 transition-colors"
      aria-label="Scroll gallery left"
    >
      ←
    </button>

    {/* Right button */}
    <button
      type="button"
      onClick={() => {
        const scroller = document.getElementById("about-gallery");
        if (scroller) {
          const cardWidth = scroller.firstElementChild?.clientWidth || 280;
          scroller.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
        }
      }}
      className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2
                 h-9 w-9 rounded-full bg-emerald-500 text-white text-sm shadow-lg
                 hover:bg-emerald-600 transition-colors"
      aria-label="Scroll gallery right"
    >
      →
    </button>
  </div>
</div>

{/* Values */}
<section className="py-16 px-6">
  <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
    <div className="p-6 rounded-3xl bg-emerald-50">
      <div className="text-4xl mb-4">🌱</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Organic Mindset
      </h3>
      <p className="text-sm text-slate-600">
        Seed, soil, and animal health come first, long before yields or
        numbers on a sheet.
      </p>
    </div>

    <div className="p-6 rounded-3xl bg-amber-50">
      <div className="text-4xl mb-4">🥕</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Fresh Harvest
      </h3>
      <p className="text-sm text-slate-600">
        Most vegetables and grains are picked or threshed at sunrise and
        eaten in the village the same day.
      </p>
    </div>

    <div className="p-6 rounded-3xl bg-lime-50">
      <div className="text-4xl mb-4">♻️</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Eco‑Friendly Farming
      </h3>
      <p className="text-sm text-slate-600">
        Chickens, goats, and crops support one another so the hillside
        needs fewer bought inputs and less plastic.
      </p>
    </div>
  </div>
</section>
    </main>
  );
}
