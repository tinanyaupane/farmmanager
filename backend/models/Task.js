import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Task title is required"],
        },
        description: String,
        category: {
            type: String,
            enum: ["feeding", "cleaning", "health", "collection", "maintenance", "vaccination", "other"],
            default: "other",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worker",
        },
        flock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        dueTime: String,
        completedAt: Date,
        completedBy: String,
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurringPattern: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
        },
        notes: String,
        attachments: [String],
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ user: 1, status: 1, dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
