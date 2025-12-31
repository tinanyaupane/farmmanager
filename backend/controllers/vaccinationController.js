import VaccinationSchedule from "../models/VaccinationSchedule.js";

// @desc    Get all vaccination schedules
// @route   GET /api/vaccinations
export const getVaccinations = async (req, res) => {
    try {
        const { status, flock } = req.query;
        let query = { user: req.user.id };

        if (status && status !== "all") query.status = status;
        if (flock) query.flock = flock;

        const vaccinations = await VaccinationSchedule.find(query)
            .populate("flock", "name type")
            .sort({ scheduledDate: 1 });

        res.status(200).json({ success: true, count: vaccinations.length, data: vaccinations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get vaccination stats
// @route   GET /api/vaccinations/stats
export const getVaccinationStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next7Days = new Date(today);
        next7Days.setDate(next7Days.getDate() + 7);

        const [upcoming, overdue, completed, total] = await Promise.all([
            VaccinationSchedule.countDocuments({
                user: req.user.id,
                status: "scheduled",
                scheduledDate: { $gte: today, $lte: next7Days },
            }),
            VaccinationSchedule.countDocuments({
                user: req.user.id,
                status: "scheduled",
                scheduledDate: { $lt: today },
            }),
            VaccinationSchedule.countDocuments({ user: req.user.id, status: "completed" }),
            VaccinationSchedule.countDocuments({ user: req.user.id }),
        ]);

        // Get next upcoming vaccination
        const nextVaccination = await VaccinationSchedule.findOne({
            user: req.user.id,
            status: "scheduled",
            scheduledDate: { $gte: today },
        })
            .populate("flock", "name")
            .sort({ scheduledDate: 1 });

        res.status(200).json({
            success: true,
            data: {
                upcoming,
                overdue,
                completed,
                total,
                nextVaccination,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get upcoming vaccinations for dashboard
// @route   GET /api/vaccinations/upcoming
export const getUpcomingVaccinations = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next14Days = new Date(today);
        next14Days.setDate(next14Days.getDate() + 14);

        const vaccinations = await VaccinationSchedule.find({
            user: req.user.id,
            status: "scheduled",
            scheduledDate: { $gte: today, $lte: next14Days },
        })
            .populate("flock", "name type")
            .sort({ scheduledDate: 1 })
            .limit(10);

        res.status(200).json({ success: true, data: vaccinations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create vaccination schedule
// @route   POST /api/vaccinations
export const createVaccination = async (req, res) => {
    try {
        const vaccination = await VaccinationSchedule.create({ ...req.body, user: req.user.id });
        const populated = await vaccination.populate("flock", "name type");
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update vaccination
// @route   PUT /api/vaccinations/:id
export const updateVaccination = async (req, res) => {
    try {
        const vaccination = await VaccinationSchedule.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        ).populate("flock", "name type");

        if (!vaccination) {
            return res.status(404).json({ success: false, message: "Vaccination not found" });
        }
        res.status(200).json({ success: true, data: vaccination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark vaccination as complete
// @route   PUT /api/vaccinations/:id/complete
export const completeVaccination = async (req, res) => {
    try {
        const vaccination = await VaccinationSchedule.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                status: "completed",
                completedDate: new Date(),
                completedBy: req.body.completedBy || req.user.name,
                ...req.body,
            },
            { new: true }
        ).populate("flock", "name type");

        if (!vaccination) {
            return res.status(404).json({ success: false, message: "Vaccination not found" });
        }
        res.status(200).json({ success: true, data: vaccination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete vaccination
// @route   DELETE /api/vaccinations/:id
export const deleteVaccination = async (req, res) => {
    try {
        const vaccination = await VaccinationSchedule.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });
        if (!vaccination) {
            return res.status(404).json({ success: false, message: "Vaccination not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
