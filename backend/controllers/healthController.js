import Health from "../models/Health.js";

// @desc    Get all health entries
// @route   GET /api/health
// @access  Private
export const getHealthEntries = async (req, res, next) => {
    try {
        const { flock, type, startDate, endDate } = req.query;

        let query = { user: req.user.id };

        if (flock) {
            query.flock = flock;
        }

        if (type) {
            query.type = type;
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const entries = await Health.find(query)
            .populate("flock", "name type")
            .sort("-date");

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single health entry
// @route   GET /api/health/:id
// @access  Private
export const getHealthEntry = async (req, res, next) => {
    try {
        const entry = await Health.findById(req.params.id).populate("flock", "name type");

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Health entry not found",
            });
        }

        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new health entry
// @route   POST /api/health
// @access  Private
export const createHealthEntry = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const entry = await Health.create(req.body);

        res.status(201).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update health entry
// @route   PUT /api/health/:id
// @access  Private
export const updateHealthEntry = async (req, res, next) => {
    try {
        let entry = await Health.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Health entry not found",
            });
        }

        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        entry = await Health.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete health entry
// @route   DELETE /api/health/:id
// @access  Private
export const deleteHealthEntry = async (req, res, next) => {
    try {
        const entry = await Health.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Health entry not found",
            });
        }

        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        await entry.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get health statistics
// @route   GET /api/health/stats
// @access  Private
export const getHealthStats = async (req, res, next) => {
    try {
        const entries = await Health.find({ user: req.user.id });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayEntries = entries.filter(
            (entry) => new Date(entry.date) >= today
        );

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekEntries = entries.filter(
            (entry) => new Date(entry.date) >= weekAgo
        );

        const stats = {
            totalEntries: entries.length,
            todayEntries: todayEntries.length,
            weekEntries: weekEntries.length,
            totalMortality: entries.reduce((acc, e) => acc + (e.mortality || 0), 0),
            criticalCases: entries.filter((e) => e.status === "critical").length,
            upcomingVaccinations: entries.filter(
                (e) => e.type === "vaccination" && new Date(e.nextDueDate) > new Date()
            ).length,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};
