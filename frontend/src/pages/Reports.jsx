import { useState, useEffect } from "react";
import {
    HiOutlineDocumentChartBar,
    HiOutlineCurrencyRupee,
    HiOutlineArrowTrendingUp,
    HiOutlineArrowTrendingDown,
    HiOutlineCalendarDays,
} from "react-icons/hi2";
import { GiChicken, GiNestEggs } from "react-icons/gi";
import { reportAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

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

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function Reports() {
    const [activeTab, setActiveTab] = useState("financial");
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    });
    const [financialData, setFinancialData] = useState({});
    const [salesTrends, setSalesTrends] = useState([]);
    const [expenseBreakdown, setExpenseBreakdown] = useState({ breakdown: [], total: 0 });
    const [flockPerformance, setFlockPerformance] = useState([]);
    const [eggProduction, setEggProduction] = useState({ dailyData: [], totals: {}, avgDaily: 0 });
    const [mortality, setMortality] = useState({ byFlock: [], trend: [], totalMortality: 0 });
    const { addToast } = useToast();

    useEffect(() => {
        fetchReportData();
    }, [activeTab, dateRange]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case "financial":
                    const [finRes, salesRes, expRes] = await Promise.all([
                        reportAPI.getFinancial(dateRange),
                        reportAPI.getSalesTrends({ days: 30 }),
                        reportAPI.getExpenseBreakdown({ days: 30 }),
                    ]);
                    setFinancialData(finRes.data || {});
                    setSalesTrends(salesRes.data || []);
                    setExpenseBreakdown(expRes.data || { breakdown: [], total: 0 });
                    break;
                case "production":
                    const [eggRes, mortRes] = await Promise.all([
                        reportAPI.getEggProduction({ days: 30 }),
                        reportAPI.getMortality({ days: 30 }),
                    ]);
                    setEggProduction(eggRes.data || { dailyData: [], totals: {}, avgDaily: 0 });
                    setMortality(mortRes.data || { byFlock: [], trend: [], totalMortality: 0 });
                    break;
                case "flock":
                    const flockRes = await reportAPI.getFlockPerformance();
                    setFlockPerformance(flockRes.data || []);
                    break;
            }
        } catch (error) {
            console.error("Report error:", error);
            addToast("Failed to load report data", "error");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "financial", label: "Financial", icon: HiOutlineCurrencyRupee },
        { id: "production", label: "Production", icon: GiNestEggs },
        { id: "flock", label: "Flock Performance", icon: GiChicken },
    ];

    // Chart data
    const salesChartData = {
        labels: salesTrends.map((d) => new Date(d._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" })),
        datasets: [{
            label: "Revenue",
            data: salesTrends.map((d) => d.revenue),
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
        }],
    };

    const expenseChartData = {
        labels: expenseBreakdown.breakdown?.map((e) => e._id) || [],
        datasets: [{
            data: expenseBreakdown.breakdown?.map((e) => e.total) || [],
            backgroundColor: [
                "rgba(251, 191, 36, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(168, 85, 247, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(107, 114, 128, 0.8)",
            ],
        }],
    };

    const eggChartData = {
        labels: eggProduction.dailyData?.map((d) => new Date(d._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" })) || [],
        datasets: [{
            label: "Eggs",
            data: eggProduction.dailyData?.map((d) => d.totalEggs) || [],
            backgroundColor: "rgba(251, 191, 36, 0.8)",
            borderRadius: 8,
        }],
    };

    const mortalityChartData = {
        labels: mortality.trend?.map((d) => new Date(d._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" })) || [],
        datasets: [{
            label: "Mortality",
            data: mortality.trend?.map((d) => d.mortality) || [],
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: true },
        },
    };

    return (
        <section className="space-y-6">
            {/* Header */}
            <header className="animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
                    Analytics & Reports
                </p>
                <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
                <p className="text-sm text-slate-500 mt-1">Comprehensive farm analytics and insights</p>
            </header>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "bg-emerald-100 text-emerald-700"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="xl" />
                </div>
            ) : (
                <>
                    {/* Financial Tab */}
                    {activeTab === "financial" && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid gap-4 sm:grid-cols-4">
                                <SummaryCard
                                    title="Revenue"
                                    value={`₹${financialData.revenue?.toLocaleString() || 0}`}
                                    icon={HiOutlineCurrencyRupee}
                                    color="emerald"
                                />
                                <SummaryCard
                                    title="Expenses"
                                    value={`₹${financialData.expenses?.toLocaleString() || 0}`}
                                    icon={HiOutlineArrowTrendingDown}
                                    color="rose"
                                />
                                <SummaryCard
                                    title="Profit"
                                    value={`₹${financialData.profit?.toLocaleString() || 0}`}
                                    icon={HiOutlineArrowTrendingUp}
                                    color={financialData.profit >= 0 ? "emerald" : "rose"}
                                />
                                <SummaryCard
                                    title="Margin"
                                    value={`${financialData.profitMargin || 0}%`}
                                    icon={HiOutlineDocumentChartBar}
                                    color="sky"
                                />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Sales Trend */}
                                <div className="card-organic p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Revenue Trend (30 days)</h3>
                                    <div className="h-64">
                                        {salesTrends.length > 0 ? (
                                            <Line data={salesChartData} options={chartOptions} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                No sales data
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expense Breakdown */}
                                <div className="card-organic p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
                                    <div className="h-64 flex items-center justify-center">
                                        {expenseBreakdown.breakdown?.length > 0 ? (
                                            <Doughnut
                                                data={expenseChartData}
                                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" } } }}
                                            />
                                        ) : (
                                            <div className="text-slate-400">No expense data</div>
                                        )}
                                    </div>
                                    <p className="text-center text-sm text-slate-500 mt-4">
                                        Total: ₹{expenseBreakdown.total?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Expense Table */}
                            {expenseBreakdown.breakdown?.length > 0 && (
                                <div className="card-organic p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Expense Categories</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">%</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {expenseBreakdown.breakdown.map((cat) => (
                                                    <tr key={cat._id} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 capitalize text-slate-900">{cat._id}</td>
                                                        <td className="px-4 py-3 text-right font-medium">₹{cat.total?.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-right text-slate-600">{cat.percentage}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Production Tab */}
                    {activeTab === "production" && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid gap-4 sm:grid-cols-4">
                                <SummaryCard
                                    title="Total Eggs (30 days)"
                                    value={eggProduction.totals?.totalEggs?.toLocaleString() || 0}
                                    icon={GiNestEggs}
                                    color="amber"
                                />
                                <SummaryCard
                                    title="Avg Daily"
                                    value={eggProduction.avgDaily || 0}
                                    icon={HiOutlineCalendarDays}
                                    color="sky"
                                />
                                <SummaryCard
                                    title="Damaged"
                                    value={eggProduction.totals?.damaged || 0}
                                    icon={HiOutlineArrowTrendingDown}
                                    color="rose"
                                />
                                <SummaryCard
                                    title="Total Mortality"
                                    value={mortality.totalMortality || 0}
                                    icon={GiChicken}
                                    color="rose"
                                />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Egg Production Chart */}
                                <div className="card-organic p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Egg Production (30 days)</h3>
                                    <div className="h-64">
                                        {eggProduction.dailyData?.length > 0 ? (
                                            <Bar data={eggChartData} options={chartOptions} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                No egg data. Log daily entries!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mortality Trend */}
                                <div className="card-organic p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Mortality Trend (30 days)</h3>
                                    <div className="h-64">
                                        {mortality.trend?.length > 0 ? (
                                            <Line data={mortalityChartData} options={chartOptions} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                No mortality data
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mortality by Flock */}
                            {mortality.byFlock?.length > 0 && (
                                <div className="card-organic p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Mortality by Flock</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Flock</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Mortality</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Rate</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {mortality.byFlock.map((flock) => (
                                                    <tr key={flock._id} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-slate-900">{flock.flockName}</td>
                                                        <td className="px-4 py-3 text-right font-medium text-rose-600">{flock.totalMortality}</td>
                                                        <td className="px-4 py-3 text-right text-slate-600">{flock.mortalityRate}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Flock Tab */}
                    {activeTab === "flock" && (
                        <div className="space-y-6">
                            {flockPerformance.length === 0 ? (
                                <div className="card-organic p-12 text-center">
                                    <GiChicken className="mx-auto text-6xl text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">No flock data</h3>
                                    <p className="text-sm text-slate-500 mt-2">Add flocks and log daily entries to see performance.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {flockPerformance.map((flock) => (
                                        <div key={flock.flockId} className="card-organic p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                                    <GiChicken className="text-2xl text-amber-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{flock.name}</h3>
                                                    <p className="text-sm text-slate-500 capitalize">{flock.type} • {flock.birdCount} birds</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Monthly Eggs</p>
                                                    <p className="text-lg font-bold text-amber-600">{flock.monthlyEggs?.toLocaleString()}</p>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Production Rate</p>
                                                    <p className="text-lg font-bold text-emerald-600">{flock.productionRate}%</p>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Mortality</p>
                                                    <p className="text-lg font-bold text-rose-600">{flock.monthlyMortality}</p>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Feed (kg)</p>
                                                    <p className="text-lg font-bold text-sky-600">{flock.monthlyFeed?.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600">Health Score</span>
                                                    <span className={`font-bold ${flock.avgHealthScore >= 90 ? "text-emerald-600" :
                                                            flock.avgHealthScore >= 75 ? "text-amber-600" : "text-rose-600"
                                                        }`}>
                                                        {flock.avgHealthScore}%
                                                    </span>
                                                </div>
                                                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${flock.avgHealthScore >= 90 ? "bg-emerald-500" :
                                                                flock.avgHealthScore >= 75 ? "bg-amber-500" : "bg-rose-500"
                                                            }`}
                                                        style={{ width: `${flock.avgHealthScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

function SummaryCard({ title, value, icon: Icon, color }) {
    const colors = {
        emerald: "from-emerald-50 to-white bg-emerald-100 text-emerald-600",
        rose: "from-rose-50 to-white bg-rose-100 text-rose-600",
        amber: "from-amber-50 to-white bg-amber-100 text-amber-600",
        sky: "from-sky-50 to-white bg-sky-100 text-sky-600",
    };
    const [gradient, iconBg] = colors[color]?.split(" ") || ["from-slate-50 to-white", "bg-slate-100 text-slate-600"];

    return (
        <div className={`card-organic p-5 bg-gradient-to-br ${colors[color]?.split(" ")[0]} to-white`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${colors[color]?.split(" ").slice(1).join(" ")} flex items-center justify-center`}>
                    <Icon className="text-2xl" />
                </div>
                <div>
                    <p className="text-sm text-slate-600">{title}</p>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
