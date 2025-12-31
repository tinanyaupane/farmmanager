import Flock from "../models/Flock.js";

// @desc    Get all flocks
// @route   GET /api/flocks
// @access  Private
export const getFlocks = async (req, res, next) => {
    try {
        const flocks = await Flock.find({ user: req.user.id }).sort("-createdAt");

        res.status(200).json({
            success: true,
            count: flocks.length,
            data: flocks,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single flock
// @route   GET /api/flocks/:id
// @access  Private
export const getFlock = async (req, res, next) => {
    try {
        const flock = await Flock.findById(req.params.id);

        if (!flock) {
            return res.status(404).json({
                success: false,
                message: "Flock not found",
            });
        }

        // Make sure user owns flock
        if (flock.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        res.status(200).json({
            success: true,
            data: flock,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new flock
// @route   POST /api/flocks
// @access  Private
export const createFlock = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const flock = await Flock.create(req.body);

        res.status(201).json({
            success: true,
            data: flock,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update flock
// @route   PUT /api/flocks/:id
// @access  Private
export const updateFlock = async (req, res, next) => {
    try {
        let flock = await Flock.findById(req.params.id);

        if (!flock) {
            return res.status(404).json({
                success: false,
                message: "Flock not found",
            });
        }

        // Make sure user owns flock
        if (flock.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        flock = await Flock.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: flock,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete flock
// @route   DELETE /api/flocks/:id
// @access  Private
export const deleteFlock = async (req, res, next) => {
    try {
        const flock = await Flock.findById(req.params.id);

        if (!flock) {
            return res.status(404).json({
                success: false,
                message: "Flock not found",
            });
        }

        // Make sure user owns flock
        if (flock.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        await flock.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get flock statistics
// @route   GET /api/flocks/stats
// @access  Private
export const getFlockStats = async (req, res, next) => {
    try {
        const flocks = await Flock.find({ user: req.user.id, status: "active" });

        const stats = {
            totalFlocks: flocks.length,
            totalBirds: flocks.reduce((acc, flock) => acc + flock.birdCount, 0),
            avgHealthScore: flocks.length > 0
                ? flocks.reduce((acc, flock) => acc + flock.healthScore, 0) / flocks.length
                : 0,
            byType: {
                broiler: flocks.filter(f => f.type === "broiler").length,
                layer: flocks.filter(f => f.type === "layer").length,
                mixed: flocks.filter(f => f.type === "mixed").length,
            },
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};
