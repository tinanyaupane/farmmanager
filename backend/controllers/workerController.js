import Worker from "../models/Worker.js";

// @desc    Get all workers
// @route   GET /api/workers
export const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find({ owner: req.user.id })
            .populate("assignedFlocks", "name")
            .sort({ name: 1 });
        res.status(200).json({ success: true, count: workers.length, data: workers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get worker stats
// @route   GET /api/workers/stats
export const getWorkerStats = async (req, res) => {
    try {
        const [total, active, byRole] = await Promise.all([
            Worker.countDocuments({ owner: req.user.id }),
            Worker.countDocuments({ owner: req.user.id, isActive: true }),
            Worker.aggregate([
                { $match: { owner: req.user._id } },
                { $group: { _id: "$role", count: { $sum: 1 } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                active,
                byRole: byRole.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
export const getWorker = async (req, res) => {
    try {
        const worker = await Worker.findOne({ _id: req.params.id, owner: req.user.id })
            .populate("assignedFlocks", "name type birdCount");
        if (!worker) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }
        res.status(200).json({ success: true, data: worker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create worker
// @route   POST /api/workers
export const createWorker = async (req, res) => {
    try {
        const worker = await Worker.create({ ...req.body, owner: req.user.id });
        res.status(201).json({ success: true, data: worker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update worker
// @route   PUT /api/workers/:id
export const updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!worker) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }
        res.status(200).json({ success: true, data: worker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete worker
// @route   DELETE /api/workers/:id
export const deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!worker) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
