import Notification from "../models/Notification.js";
import Inventory from "../models/Inventory.js";
import VaccinationSchedule from "../models/VaccinationSchedule.js";
import Task from "../models/Task.js";

// @desc    Get all notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        const { unreadOnly } = req.query;
        let query = { user: req.user.id };
        if (unreadOnly === "true") query.isRead = false;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
        res.status(200).json({ success: true, data: { count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { isRead: true, readAt: new Date() },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true, readAt: new Date() }
        );
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate notifications (call periodically)
// @route   POST /api/notifications/generate
export const generateNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next7Days = new Date(today);
        next7Days.setDate(next7Days.getDate() + 7);

        // Low stock alerts
        const lowStockItems = await Inventory.find({
            user: userId,
            $expr: { $lte: ["$quantity", "$minimumStock"] },
        });

        for (const item of lowStockItems) {
            const exists = await Notification.findOne({
                user: userId,
                type: "low_stock",
                relatedId: item._id,
                createdAt: { $gte: today },
            });

            if (!exists) {
                notifications.push({
                    user: userId,
                    type: "low_stock",
                    title: "Low Stock Alert",
                    message: `${item.name} is running low (${item.quantity} ${item.unit} remaining)`,
                    priority: "high",
                    link: "/inventory",
                    relatedModel: "Inventory",
                    relatedId: item._id,
                });
            }
        }

        // Vaccination due
        const dueSoonVaccinations = await VaccinationSchedule.find({
            user: userId,
            status: "scheduled",
            scheduledDate: { $gte: today, $lte: next7Days },
        }).populate("flock", "name");

        for (const vax of dueSoonVaccinations) {
            const exists = await Notification.findOne({
                user: userId,
                type: "vaccination_due",
                relatedId: vax._id,
                createdAt: { $gte: today },
            });

            if (!exists) {
                notifications.push({
                    user: userId,
                    type: "vaccination_due",
                    title: "Vaccination Due Soon",
                    message: `${vax.vaccineName} for ${vax.flock?.name} is due on ${new Date(vax.scheduledDate).toLocaleDateString()}`,
                    priority: "medium",
                    link: "/vaccinations",
                    relatedModel: "Vaccination",
                    relatedId: vax._id,
                });
            }
        }

        // Overdue vaccinations
        const overdueVaccinations = await VaccinationSchedule.find({
            user: userId,
            status: "scheduled",
            scheduledDate: { $lt: today },
        }).populate("flock", "name");

        for (const vax of overdueVaccinations) {
            const exists = await Notification.findOne({
                user: userId,
                type: "vaccination_overdue",
                relatedId: vax._id,
                createdAt: { $gte: today },
            });

            if (!exists) {
                notifications.push({
                    user: userId,
                    type: "vaccination_overdue",
                    title: "Overdue Vaccination!",
                    message: `${vax.vaccineName} for ${vax.flock?.name} was due on ${new Date(vax.scheduledDate).toLocaleDateString()}`,
                    priority: "urgent",
                    link: "/vaccinations",
                    relatedModel: "Vaccination",
                    relatedId: vax._id,
                });
            }
        }

        // Overdue tasks
        const overdueTasks = await Task.find({
            user: userId,
            status: { $in: ["pending", "in_progress"] },
            dueDate: { $lt: today },
        });

        for (const task of overdueTasks) {
            const exists = await Notification.findOne({
                user: userId,
                type: "task_overdue",
                relatedId: task._id,
                createdAt: { $gte: today },
            });

            if (!exists) {
                notifications.push({
                    user: userId,
                    type: "task_overdue",
                    title: "Overdue Task",
                    message: `Task "${task.title}" is overdue`,
                    priority: "high",
                    link: "/tasks",
                    relatedModel: "Task",
                    relatedId: task._id,
                });
            }
        }

        // Insert all new notifications
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(200).json({
            success: true,
            message: `Generated ${notifications.length} new notifications`,
            data: { count: notifications.length },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
