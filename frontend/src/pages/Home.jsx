import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { HiOutlineArrowRight, HiOutlineCheckCircle } from "react-icons/hi2";
import { GiChicken, GiNestEggs, GiWheat, GiMedicines } from "react-icons/gi";

import farmTerrace from "../assets/farm-terrace-placeholder.jpg";
import farmVegetables from "../assets/farm-vegetables-placeholder.jpg";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <Hero />

      {/* Quick Actions */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-slide-in-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
              Quick Access
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to manage your farm
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <QuickCard
              icon={<GiChicken className="text-3xl" />}
              title="Flocks"
              body="See all flocks, batches, and counts in one place."
              link="/flocks"
              color="amber"
              delay={0}
            />
            <QuickCard
              icon={<HiOutlineArrowRight className="text-3xl" />}
              title="Sales"
              body="Record today's farm-gate sales or invoices quickly."
              link="/sales"
              color="emerald"
              delay={1}
            />
            <QuickCard
              icon={<GiWheat className="text-3xl" />}
              title="Inventory"
              body="Track feed, medicine, and supplies with alerts."
              link="/inventory"
              color="sky"
              delay={2}
            />
            <QuickCard
              icon={<GiMedicines className="text-3xl" />}
              title="Health Log"
              body="Log daily entries and health cases for each flock."
              link="/health"
              color="rose"
              delay={3}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-50/50 via-white to-amber-50/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="animate-slide-in-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-3">
                About Our Farm
              </p>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">
                          A hillside poultry farm close to the nature.
                  </h2>

              <p className="text-slate-600 mb-6 leading-relaxed text-justify">
                नमुना कृषि तथा पशुपालन फार्म is a hillside poultry farm where broiler and layer flocks
                are the main work and income, supported by goats and mixed crops
                that keep feed costs lower and the land healthy.
              </p>

              <div className="space-y-3 mb-8 text-justify">
                <FeatureItem text="Broiler and layer flocks managed in clear batches." />
                <FeatureItem text="Seasonal vegetables and greens mainly to support the farm and village." />
                <FeatureItem text="Maize and other grains grown to cut purchased feed." />
                <FeatureItem text="Poultry litter and goat manure composted instead of synthetic fertilizers" />
              </div>

              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center gap-2"
              >
                Explore Dashboard
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200/50">
                <img
                  src={farmTerrace}
                  alt="Terraced poultry and crop farmland in Nepal"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 animate-float-slow">
                <img
                  src={farmVegetables}
                  alt="Fresh vegetables from the farm"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Green background circle removed */}
              <div
                className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-20 animate-breathe"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Practices Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
              Our Approach
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Farming practices that matter
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <PracticeCard
              icon="🌱"
              title="Organic Mindset"
              description="Seed, soil, and animal health come first, long before yields."
              color="emerald"
            />
            <PracticeCard
              icon="🥕"
              title="Fresh Harvest"
              description="Most produce is harvested at sunrise and eaten within a day."
              color="amber"
            />
            <PracticeCard
              icon="♻️"
              title="Eco-Friendly"
              description="Soft footprints: minimal plastic, careful water use, and trees on every edge."
              color="lime"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 p-12 text-center shadow-2xl shadow-emerald-300/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgNWMtNSAxMC0xNSAxNS0yNSAxNSA1IDEwIDE1IDIwIDI1IDM1IDEwLTE1IDIwLTI1IDI1LTM1LTEwIDAtMjAtNS0yNS0xNXoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to streamline your farm?
              </h2>
              <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                Start tracking your flocks, sales, and inventory today. No credit
                card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-700 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                  <HiOutlineArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/50 text-white font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                Get In Touch
              </p>
              <h2 className="text-3xl font-bold mb-6">
                Questions about our farm?
              </h2>
              <p className="text-slate-400 mb-6">
                Have questions about our practices, want to visit the farm, or
                interested in a regular veggie basket? We'd love to hear from you.
              </p>
              <div className="space-y-3 text-sm">
                <p className="text-slate-300">
                  <span className="text-emerald-400 font-medium">Location:</span>{" "}
                  Hillside village, westernNepal
                </p>
                <p className="text-slate-300">
                  <span className="text-emerald-400 font-medium">Email:</span>{" "}
                  <a href="mailto:hello@armfarm.nepal">
                    namunakrishifarm@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none resize-none"
                ></textarea>
                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function QuickCard({ icon, title, body, link, color, delay }) {
  const colorClasses = {
    amber: "bg-amber-100 text-amber-600 group-hover:bg-amber-200",
    emerald: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200",
    sky: "bg-sky-100 text-sky-600 group-hover:bg-sky-200",
    rose: "bg-rose-100 text-rose-600 group-hover:bg-rose-200",
  };

  return (
    <Link
      to={link}
      className="group card-organic p-6 text-center hover:border-emerald-300 animate-slide-in-up"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div
        className={`w-16 h-16 rounded-2xl ${colorClasses[color]} flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{body}</p>
    </Link>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <HiOutlineCheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
      <span className="text-slate-700">{text}</span>
    </div>
  );
}

function PracticeCard({ icon, title, description, color }) {
  const bgClasses = {
    emerald: "bg-emerald-50 hover:bg-emerald-100",
    amber: "bg-amber-50 hover:bg-amber-100",
    lime: "bg-lime-50 hover:bg-lime-100",
  };

  return (
    <div
      className={`p-8 rounded-3xl ${bgClasses[color]} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
