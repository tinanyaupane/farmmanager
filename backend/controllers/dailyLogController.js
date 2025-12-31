import DailyLog from "../models/DailyLog.js";

// @desc    Get all daily logs
// @route   GET /api/daily-logs
export const getDailyLogs = async (req, res) => {
    try {
        const { flock, startDate, endDate } = req.query;
        let query = { user: req.user.id };

        if (flock) query.flock = flock;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const logs = await DailyLog.find(query)
            .populate("flock", "name type")
            .sort({ date: -1 })
            .limit(100);

        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daily log stats
// @route   GET /api/daily-logs/stats
export const getDailyLogStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);

        const [todayLogs, weeklyStats, eggProduction] = await Promise.all([
            DailyLog.find({ user: req.user.id, date: { $gte: today } }),
            DailyLog.aggregate([
                { $match: { user: req.user._id, date: { $gte: last7Days } } },
                {
                    $group: {
                        _id: null,
                        totalEggs: { $sum: "$eggsCollected" },
                        totalMortality: { $sum: "$mortality" },
                        totalFeed: { $sum: "$feedConsumed" },
                        avgHealth: { $avg: "$healthScore" },
                    },
                },
            ]),
            DailyLog.aggregate([
                { $match: { user: req.user._id, date: { $gte: last7Days } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        eggs: { $sum: "$eggsCollected" },
                        mortality: { $sum: "$mortality" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                todayEntries: todayLogs.length,
                todayEggs: todayLogs.reduce((sum, log) => sum + (log.eggsCollected || 0), 0),
                todayMortality: todayLogs.reduce((sum, log) => sum + (log.mortality || 0), 0),
                weeklyTotals: weeklyStats[0] || { totalEggs: 0, totalMortality: 0, totalFeed: 0, avgHealth: 0 },
                dailyProduction: eggProduction,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create daily log
// @route   POST /api/daily-logs
export const createDailyLog = async (req, res) => {
    try {
        const log = await DailyLog.create({ ...req.body, user: req.user.id });
        const populated = await log.populate("flock", "name type");
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update daily log
// @route   PUT /api/daily-logs/:id
export const updateDailyLog = async (req, res) => {
    try {
        const log = await DailyLog.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        ).populate("flock", "name type");

        if (!log) {
            return res.status(404).json({ success: false, message: "Log not found" });
        }
        res.status(200).json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete daily log
// @route   DELETE /api/daily-logs/:id
export const deleteDailyLog = async (req, res) => {
    try {
        const log = await DailyLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!log) {
            return res.status(404).json({ success: false, message: "Log not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
