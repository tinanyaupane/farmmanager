import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "low_stock",
                "vaccination_due",
                "vaccination_overdue",
                "task_due",
                "task_overdue",
                "health_alert",
                "payment_due",
                "sale_completed",
                "flock_alert",
                "system",
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: Date,
        link: String,
        relatedModel: {
            type: String,
            enum: ["Flock", "Sale", "Inventory", "Health", "Vaccination", "Task", "Worker"],
        },
        relatedId: mongoose.Schema.Types.ObjectId,
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
