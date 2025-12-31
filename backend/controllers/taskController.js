import Task from "../models/Task.js";

// @desc    Get all tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.query;
        let query = { user: req.user.id };

        if (status && status !== "all") query.status = status;
        if (priority && priority !== "all") query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        const tasks = await Task.find(query)
            .populate("assignedTo", "name")
            .populate("flock", "name")
            .sort({ dueDate: 1, priority: -1 });

        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
export const getTaskStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [pending, inProgress, completed, overdue] = await Promise.all([
            Task.countDocuments({ user: req.user.id, status: "pending" }),
            Task.countDocuments({ user: req.user.id, status: "in_progress" }),
            Task.countDocuments({ user: req.user.id, status: "completed" }),
            Task.countDocuments({
                user: req.user.id,
                status: { $in: ["pending", "in_progress"] },
                dueDate: { $lt: today },
            }),
        ]);

        res.status(200).json({
            success: true,
            data: { pending, inProgress, completed, overdue, total: pending + inProgress + completed },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get today's tasks
// @route   GET /api/tasks/today
export const getTodayTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasks = await Task.find({
            user: req.user.id,
            dueDate: { $gte: today, $lt: tomorrow },
            status: { $ne: "cancelled" },
        })
            .populate("assignedTo", "name")
            .populate("flock", "name")
            .sort({ priority: -1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user.id });
        const populated = await task.populate([
            { path: "assignedTo", select: "name" },
            { path: "flock", select: "name" },
        ]);
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        ).populate([
            { path: "assignedTo", select: "name" },
            { path: "flock", select: "name" },
        ]);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Complete task
// @route   PUT /api/tasks/:id/complete
export const completeTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                status: "completed",
                completedAt: new Date(),
                completedBy: req.body.completedBy || req.user.name,
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
