import Sale from "../models/Sale.js";
import Expense from "../models/Expense.js";
import Flock from "../models/Flock.js";
import DailyLog from "../models/DailyLog.js";
import Inventory from "../models/Inventory.js";

// @desc    Get financial summary
// @route   GET /api/reports/financial
export const getFinancialReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const end = endDate ? new Date(endDate) : new Date();

        const [salesData, expenseData] = await Promise.all([
            Sale.aggregate([
                { $match: { user: req.user._id, saleDate: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" },
                        salesCount: { $sum: 1 },
                        avgSaleValue: { $avg: "$totalAmount" },
                    },
                },
            ]),
            Expense.aggregate([
                { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: null,
                        totalExpenses: { $sum: "$amount" },
                        expenseCount: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const revenue = salesData[0]?.totalRevenue || 0;
        const expenses = expenseData[0]?.totalExpenses || 0;
        const profit = revenue - expenses;

        res.status(200).json({
            success: true,
            data: {
                period: { start, end },
                revenue,
                expenses,
                profit,
                profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0,
                salesCount: salesData[0]?.salesCount || 0,
                avgSaleValue: salesData[0]?.avgSaleValue || 0,
                expenseCount: expenseData[0]?.expenseCount || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daily/weekly/monthly sales trends
// @route   GET /api/reports/sales-trends
export const getSalesTrends = async (req, res) => {
    try {
        const { period = "daily", days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        let dateFormat = "%Y-%m-%d";
        if (period === "weekly") dateFormat = "%Y-W%V";
        if (period === "monthly") dateFormat = "%Y-%m";

        const trends = await Sale.aggregate([
            { $match: { user: req.user._id, saleDate: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$saleDate" } },
                    revenue: { $sum: "$totalAmount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json({ success: true, data: trends });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get expense breakdown by category
// @route   GET /api/reports/expense-breakdown
export const getExpenseBreakdown = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const breakdown = await Expense.aggregate([
            { $match: { user: req.user._id, date: { $gte: startDate } } },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
        ]);

        const total = breakdown.reduce((sum, item) => sum + item.total, 0);
        const withPercentage = breakdown.map((item) => ({
            ...item,
            percentage: total > 0 ? ((item.total / total) * 100).toFixed(1) : 0,
        }));

        res.status(200).json({ success: true, data: { breakdown: withPercentage, total } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get flock performance report
// @route   GET /api/reports/flock-performance
export const getFlockPerformance = async (req, res) => {
    try {
        const flocks = await Flock.find({ user: req.user.id, status: "active" });

        const performanceData = await Promise.all(
            flocks.map(async (flock) => {
                const last30Days = new Date();
                last30Days.setDate(last30Days.getDate() - 30);

                const logs = await DailyLog.aggregate([
                    { $match: { flock: flock._id, date: { $gte: last30Days } } },
                    {
                        $group: {
                            _id: null,
                            totalEggs: { $sum: "$eggsCollected" },
                            totalMortality: { $sum: "$mortality" },
                            totalFeed: { $sum: "$feedConsumed" },
                            avgHealth: { $avg: "$healthScore" },
                            entries: { $sum: 1 },
                        },
                    },
                ]);

                const stats = logs[0] || { totalEggs: 0, totalMortality: 0, totalFeed: 0, avgHealth: 0, entries: 0 };

                return {
                    flockId: flock._id,
                    name: flock.name,
                    type: flock.type,
                    birdCount: flock.birdCount,
                    healthScore: flock.healthScore,
                    monthlyEggs: stats.totalEggs,
                    monthlyMortality: stats.totalMortality,
                    monthlyFeed: stats.totalFeed,
                    avgHealthScore: stats.avgHealth ? stats.avgHealth.toFixed(1) : flock.healthScore,
                    productionRate: flock.birdCount > 0 && stats.entries > 0
                        ? ((stats.totalEggs / (flock.birdCount * stats.entries)) * 100).toFixed(1)
                        : 0,
                    feedConversionRatio: stats.totalEggs > 0 ? (stats.totalFeed / stats.totalEggs).toFixed(2) : 0,
                };
            })
        );

        res.status(200).json({ success: true, data: performanceData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get egg production trends
// @route   GET /api/reports/egg-production
export const getEggProductionReport = async (req, res) => {
    try {
        const { days = 30, flock } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        let matchQuery = { user: req.user._id, date: { $gte: startDate } };
        if (flock) matchQuery.flock = mongoose.Types.ObjectId(flock);

        const production = await DailyLog.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalEggs: { $sum: "$eggsCollected" },
                    damaged: { $sum: "$eggsDamaged" },
                    gradeA: { $sum: "$eggsGradeA" },
                    gradeB: { $sum: "$eggsGradeB" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const totals = production.reduce(
            (acc, day) => ({
                totalEggs: acc.totalEggs + day.totalEggs,
                damaged: acc.damaged + day.damaged,
                gradeA: acc.gradeA + day.gradeA,
                gradeB: acc.gradeB + day.gradeB,
            }),
            { totalEggs: 0, damaged: 0, gradeA: 0, gradeB: 0 }
        );

        res.status(200).json({
            success: true,
            data: {
                dailyData: production,
                totals,
                avgDaily: production.length > 0 ? (totals.totalEggs / production.length).toFixed(0) : 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get mortality report
// @route   GET /api/reports/mortality
export const getMortalityReport = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const [byFlock, trend] = await Promise.all([
            DailyLog.aggregate([
                { $match: { user: req.user._id, date: { $gte: startDate } } },
                { $lookup: { from: "flocks", localField: "flock", foreignField: "_id", as: "flockInfo" } },
                { $unwind: "$flockInfo" },
                {
                    $group: {
                        _id: "$flock",
                        flockName: { $first: "$flockInfo.name" },
                        totalMortality: { $sum: "$mortality" },
                        openingCount: { $first: "$openingCount" },
                    },
                },
            ]),
            DailyLog.aggregate([
                { $match: { user: req.user._id, date: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        mortality: { $sum: "$mortality" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

        const totalMortality = byFlock.reduce((sum, f) => sum + f.totalMortality, 0);

        res.status(200).json({
            success: true,
            data: {
                byFlock: byFlock.map((f) => ({
                    ...f,
                    mortalityRate: f.openingCount > 0 ? ((f.totalMortality / f.openingCount) * 100).toFixed(2) : 0,
                })),
                trend,
                totalMortality,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard analytics (charts data)
// @route   GET /api/reports/dashboard-analytics
export const getDashboardAnalytics = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const [
            salesTrend,
            expenseTrend,
            eggTrend,
            topProducts,
            lowStockItems,
        ] = await Promise.all([
            // Sales last 7 days
            Sale.aggregate([
                { $match: { user: req.user._id, saleDate: { $gte: last7Days } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            // Expenses last 7 days
            Expense.aggregate([
                { $match: { user: req.user._id, date: { $gte: last7Days } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        amount: { $sum: "$amount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            // Egg production last 7 days
            DailyLog.aggregate([
                { $match: { user: req.user._id, date: { $gte: last7Days } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        eggs: { $sum: "$eggsCollected" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            // Top selling products
            Sale.aggregate([
                { $match: { user: req.user._id, saleDate: { $gte: last30Days } } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.name",
                        quantity: { $sum: "$items.quantity" },
                        revenue: { $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] } },
                    },
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 },
            ]),
            // Low stock items
            Inventory.find({
                user: req.user.id,
                $expr: { $lte: ["$quantity", "$minimumStock"] },
            }).limit(5),
        ]);

        res.status(200).json({
            success: true,
            data: {
                salesTrend,
                expenseTrend,
                eggTrend,
                topProducts,
                lowStockItems,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
