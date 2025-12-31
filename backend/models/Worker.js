import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Worker name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        email: String,
        role: {
            type: String,
            enum: ["manager", "supervisor", "worker", "caretaker"],
            default: "worker",
        },
        permissions: {
            canViewFlocks: { type: Boolean, default: true },
            canEditFlocks: { type: Boolean, default: false },
            canViewSales: { type: Boolean, default: true },
            canEditSales: { type: Boolean, default: false },
            canViewInventory: { type: Boolean, default: true },
            canEditInventory: { type: Boolean, default: false },
            canViewHealth: { type: Boolean, default: true },
            canEditHealth: { type: Boolean, default: false },
            canViewReports: { type: Boolean, default: false },
            canManageWorkers: { type: Boolean, default: false },
        },
        salary: {
            type: Number,
            default: 0,
        },
        salaryType: {
            type: String,
            enum: ["monthly", "weekly", "daily"],
            default: "monthly",
        },
        joinDate: {
            type: Date,
            default: Date.now,
        },
        assignedFlocks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
        }],
        shift: {
            type: String,
            enum: ["morning", "evening", "night", "full"],
            default: "full",
        },
        address: String,
        emergencyContact: String,
        notes: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

workerSchema.index({ owner: 1, isActive: 1 });

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
