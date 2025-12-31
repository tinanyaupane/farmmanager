import { useState, useEffect } from "react";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationTriangle,
  HiOutlineShoppingCart,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import { GiChicken, GiNestEggs, GiSyringe } from "react-icons/gi";
import { Link } from "react-router-dom";
import { flockAPI, salesAPI, inventoryAPI, reportAPI, vaccinationAPI, dailyLogAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";
import WeatherWidget from "../components/WeatherWidget";


// Chart.js imports - install with: npm install chart.js react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBirds: 0,
    activeFlocks: 0,
    todaySales: 0,
    lowStockItems: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    eggsToday: 0,
  });
  const [analytics, setAnalytics] = useState({
    salesTrend: [],
    expenseTrend: [],
    eggTrend: [],
    topProducts: [],
  });
  const [recentSales, setRecentSales] = useState([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);
  const [flockHealth, setFlockHealth] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        flockStats,
        salesStats,
        inventoryStats,
        salesData,
        analyticsData,
        vaccinationsData,
        flocksData,
        dailyLogStats,
      ] = await Promise.all([
        flockAPI.getStats(),
        salesAPI.getStats(),
        inventoryAPI.getStats(),
        salesAPI.getAll(),
        reportAPI.getDashboardAnalytics().catch(() => ({ data: {} })),
        vaccinationAPI.getUpcoming().catch(() => ({ data: [] })),
        flockAPI.getAll(),
        dailyLogAPI.getStats().catch(() => ({ data: {} })),
      ]);

      setStats({
        totalBirds: flockStats.data?.totalBirds || 0,
        activeFlocks: flockStats.data?.totalFlocks || 0,
        todaySales: salesStats.data?.todaySales || 0,
        lowStockItems: inventoryStats.data?.lowStockItems || 0,
        totalRevenue: salesStats.data?.totalRevenue || 0,
        eggsToday: dailyLogStats.data?.todayEggs || 0,
      });

      setAnalytics({
        salesTrend: analyticsData.data?.salesTrend || [],
        expenseTrend: analyticsData.data?.expenseTrend || [],
        eggTrend: analyticsData.data?.eggTrend || [],
        topProducts: analyticsData.data?.topProducts || [],
      });

      setRecentSales((salesData.data || []).slice(0, 5));
      setUpcomingVaccinations(vaccinationsData.data || []);
      setFlockHealth((flocksData.data || []).slice(0, 4));
    } catch (error) {
      console.error("Dashboard error:", error);
      addToast("Failed to load some dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const salesChartData = {
    labels: analytics.salesTrend.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }),
    datasets: [
      {
        label: "Revenue",
        data: analytics.salesTrend.map((d) => d.revenue),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const eggChartData = {
    labels: analytics.eggTrend.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }),
    datasets: [
      {
        label: "Eggs Collected",
        data: analytics.eggTrend.map((d) => d.eggs),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  const expenseChartData = {
    labels: ["Feed", "Medicine", "Labor", "Utilities", "Other"],
    datasets: [
      {
        data: [40, 20, 25, 10, 5],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0,0,0,0.05)" } },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header with Weather */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header className="animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Dashboard Overview
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Farm Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time insights into your farm operations
          </p>
        </header>
        <WeatherWidget className="w-full sm:max-w-xs" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Birds"
          value={stats.totalBirds.toLocaleString()}
          icon={GiChicken}
          color="emerald"
          subtitle={`${stats.activeFlocks} active flocks`}
        />
        <StatCard
          title="Today's Sales"
          value={`₹${stats.todaySales.toLocaleString()}`}
          icon={HiOutlineCurrencyRupee}
          color="sky"
          subtitle="Revenue today"
        />
        <StatCard
          title="Eggs Collected"
          value={stats.eggsToday.toLocaleString()}
          icon={GiNestEggs}
          color="amber"
          subtitle="Today's collection"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={HiOutlineExclamationTriangle}
          color={stats.lowStockItems > 0 ? "rose" : "slate"}
          subtitle={stats.lowStockItems > 0 ? "Needs attention" : "Stock OK"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend Chart */}
        <div className="card-organic p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Sales Trend</h3>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="h-64">
            {analytics.salesTrend.length > 0 ? (
              <Line data={salesChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>No sales data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Egg Production Chart */}
        <div className="card-organic p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Egg Production</h3>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="h-64">
            {analytics.eggTrend.length > 0 ? (
              <Bar data={eggChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>No egg data yet. Log daily entries!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row - Financial & Health */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expense Breakdown */}
        <div className="card-organic p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
          <div className="h-48 flex items-center justify-center">
            <Doughnut
              data={expenseChartData}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" } } }}
            />
          </div>
          <Link to="/expenses" className="block text-center text-sm text-emerald-600 hover:underline mt-4">
            View all expenses →
          </Link>
        </div>

        {/* Recent Sales */}
        <div className="card-organic p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Sales</h3>
            <Link to="/sales" className="text-xs text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No sales yet</p>
            ) : (
              recentSales.map((sale) => (
                <div key={sale._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{sale.customer}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(sale.saleDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="font-bold text-emerald-600">₹{sale.totalAmount?.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Vaccinations */}
        <div className="card-organic p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Upcoming Vaccinations</h3>
            <Link to="/vaccinations" className="text-xs text-emerald-600 hover:underline">Schedule</Link>
          </div>
          <div className="space-y-3">
            {upcomingVaccinations.length === 0 ? (
              <div className="text-center py-4">
                <GiSyringe className="mx-auto text-3xl text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No upcoming vaccinations</p>
                <Link to="/vaccinations" className="text-sm text-emerald-600 hover:underline">
                  Schedule one →
                </Link>
              </div>
            ) : (
              upcomingVaccinations.slice(0, 4).map((vax) => (
                <div key={vax._id} className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <GiSyringe className="text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{vax.vaccineName}</p>
                    <p className="text-xs text-slate-500">{vax.flock?.name}</p>
                  </div>
                  <span className="text-xs text-sky-600 font-medium">
                    {new Date(vax.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Flock Health Overview */}
      <div className="card-organic p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Flock Health Overview</h3>
          <Link to="/flocks" className="text-xs text-emerald-600 hover:underline">Manage flocks</Link>
        </div>
        {flockHealth.length === 0 ? (
          <div className="text-center py-8">
            <GiChicken className="mx-auto text-5xl text-slate-300 mb-3" />
            <p className="text-slate-500">No flocks yet</p>
            <Link to="/flocks" className="text-emerald-600 hover:underline">Add your first flock →</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flockHealth.map((flock) => (
              <div key={flock._id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <GiChicken className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{flock.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{flock.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{flock.birdCount?.toLocaleString()} birds</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${flock.healthScore >= 90 ? "bg-emerald-100 text-emerald-700" :
                    flock.healthScore >= 75 ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>
                    {flock.healthScore}% health
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction to="/daily-logs" icon={HiOutlineClipboardDocumentCheck} title="Log Daily Entry" color="emerald" />
        <QuickAction to="/sales" icon={HiOutlineShoppingCart} title="Record Sale" color="sky" />
        <QuickAction to="/vaccinations" icon={GiSyringe} title="Schedule Vaccination" color="violet" />
        <QuickAction to="/reports" icon={HiOutlineArrowTrendingUp} title="View Reports" color="amber" />
      </div>
    </section>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const colors = {
    emerald: "from-emerald-50 to-white border-emerald-100",
    sky: "from-sky-50 to-white border-sky-100",
    amber: "from-amber-50 to-white border-amber-100",
    rose: "from-rose-50 to-white border-rose-100",
    slate: "from-slate-50 to-white border-slate-100",
  };

  const iconColors = {
    emerald: "bg-emerald-100 text-emerald-600",
    sky: "bg-sky-100 text-sky-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className={`card-organic p-5 bg-gradient-to-br ${colors[color]} animate-fade-in`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconColors[color]} flex items-center justify-center`}>
          <Icon className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, color }) {
  const colors = {
    emerald: "hover:bg-emerald-50 hover:border-emerald-200",
    sky: "hover:bg-sky-50 hover:border-sky-200",
    violet: "hover:bg-violet-50 hover:border-violet-200",
    amber: "hover:bg-amber-50 hover:border-amber-200",
  };

  return (
    <Link
      to={to}
      className={`card-organic p-4 flex items-center gap-3 transition-all ${colors[color]}`}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon className="text-xl text-slate-600" />
      </div>
      <span className="font-medium text-slate-700">{title}</span>
    </Link>
  );
}
