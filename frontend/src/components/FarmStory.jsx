import farmTerrace from "../assets/farm-terrace.jpg";
import farmVegetables from "../assets/farm-vegetables.jpg";
import farmTeam from "../assets/farm-team.jpg";

export default function FarmStory() {
  const aboutHeading =
    "A hillside poultry farm with vegetables and goats";
  return (
    <section className="border-t border-slate-200 bg-gradient-to-b from-emerald-50/40 via-amber-50/30 to-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* About Our Farm + image */}
        <div className="grid gap-6 md:grid-cols-[1.4fr,1fr] items-center">
          <div className="space-y-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-emerald-700 animate-hero-fade-slow">
              About our farm
            </p>

            {/* Optional animated heading */}
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {aboutHeading}
            </h2>

            <p className="text-sm text-slate-600">
              Arm Farm is a hillside poultry farm supported by a few goats and
              mixed crops. Most of the work and income comes from broiler and
              layer flocks, while vegetables and grains help lower feed costs
              and keep the soil healthy.
            </p>
          </div>

          {/* Image card */}
          <div className="overflow-hidden rounded-2xl shadow-md shadow-emerald-200 animate-hero-stagger">
            <img
              src={farmTerrace}
              alt="Terraced poultry and crop farmland in Nepal"
              className="h-full w-full object-cover brightness-105 saturate-110 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* What We Grow + How We Farm */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* What we grow and raise */}
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-emerald-100">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full shadow-inner shadow-emerald-200">
                <img
                  src={farmVegetables}
                  alt="Fresh vegetables from the field"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 animate-title-glow">
                What we grow and raise
              </h3>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              Poultry sheds sit above strips of vegetables and grain. Birds get
              most of the attention, and field work is planned around flock
              cycles so there is fresh litter for compost and space for birds
              to graze after harvest.
            </p>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• Broiler and layer flocks as the main enterprise.</li>
              <li>• Seasonal vegetables and greens for home and local sales.</li>
              <li>• Maize and other grains to support birds and goats.</li>
              <li>• A small group of goats for extra income and manure.</li>
            </ul>
          </div>

          {/* How we farm */}
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-emerald-100">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full shadow-inner shadow-emerald-200">
                <img
                  src={farmTerrace}
                  alt="Hillside beds and animal shelters"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 animate-title-glow">
                How we farm
              </h3>
            </div>
            <p className="mb-3 text-sm text-slate-600">
              The farm runs as a poultry‑first mixed system: batch records,
              feed use, and health notes are tracked for every flock, while
              crops and goats are arranged around shed clean‑outs and market
              days. The dashboard keeps all flock and field data in one place so
              nothing is missed.
            </p>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• Careful batch records for mortality, weight, and sales.</li>
              <li>• Poultry litter and goat manure composted for crop beds.</li>
              <li>• Birds rotated onto harvested plots to clean and fertilize.</li>
              <li>• Simple rotations and mulching to protect hillside soil.</li>
            </ul>
          </div>
        </div>

        {/* Icons row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <InfoIconCard
            color="bg-emerald-100"
            title="Healthy flocks"
            body="Small batches of birds so each flock’s feed, health, and sales stay clear."
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white text-lg">
              🐔
            </span>
          </InfoIconCard>

          <InfoIconCard
            color="bg-amber-100"
            title="Fresh vegetables"
            body="Most vegetables and greens are cut at sunrise and reach plates the same day."
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-slate-900 text-lg">
              🥕
            </span>
          </InfoIconCard>

          <InfoIconCard
            color="bg-emerald-50"
            title="Mixed farming"
            body="Chickens, goats, and crops support each other so the farm needs fewer bought inputs."
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lime-500 text-slate-900 text-lg">
              🌾
            </span>
          </InfoIconCard>
        </div>

        {/* Meet the Farmers + Get in Touch */}
        <div className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-emerald-100">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full shadow-inner shadow-emerald-200">
                <img
                  src={farmTeam}
                  alt="Farmers working together on the hillside"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 animate-title-glow">
                Meet the farmers
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              The farm is run by a small family team that moves between poultry
              sheds, goat pens, and vegetable beds. The dashboard shows, at a
              glance, which flock is close to sale, which crop needs
              harvesting, and how much feed or seed is still in store.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-600 p-5 text-sm text-emerald-50 shadow-sm shadow-emerald-300">
            <h3 className="mb-2 text-sm font-bold text-white animate-title-glow">
              Get in touch
            </h3>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-200">
              Arm Farm • Nepal
            </p>
            <p className="mb-1 text-xs text-emerald-100">
              Location: Hillside mixed poultry farm, central Nepal
            </p>
            <p className="mb-3 text-xs text-emerald-100">
              Today&apos;s date: {new Date().toLocaleDateString("en-NP")}
            </p>
            <p className="mb-3">
              Curious about our poultry batches, veggie baskets, or goat meat
              orders? Reach out and say namaste from your own hillside.
            </p>
            <a
              href="mailto:hello@armfarm.nepal"
              className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm hover:bg-white transition-colors"
            >
              Email the farm team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoIconCard({ children, title, body, color }) {
  return (
    <div
      className={`rounded-2xl ${color} p-4 text-sm shadow-sm shadow-emerald-100 bg-opacity-80`}
    >
      <div className="mb-2">{children}</div>
      <h4 className="mb-1 text-sm font-semibold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-600">{body}</p>
    </div>
  );
}
