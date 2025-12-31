import mongoose from "mongoose";

const dailyLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        flock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
            required: [true, "Flock is required"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        // Bird count
        openingCount: {
            type: Number,
            required: true,
        },
        mortality: {
            type: Number,
            default: 0,
        },
        culled: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        closingCount: {
            type: Number,
            required: true,
        },
        // Egg production (for layers)
        eggsCollected: {
            type: Number,
            default: 0,
        },
        eggsDamaged: {
            type: Number,
            default: 0,
        },
        eggsGradeA: {
            type: Number,
            default: 0,
        },
        eggsGradeB: {
            type: Number,
            default: 0,
        },
        // Feed
        feedConsumed: {
            type: Number,
            default: 0,
        },
        feedType: String,
        // Water
        waterConsumed: {
            type: Number,
            default: 0,
        },
        // Health
        healthScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 100,
        },
        symptoms: String,
        treatment: String,
        // Weight (for broilers)
        avgWeight: Number,
        sampleSize: Number,
        // Environment
        temperature: Number,
        humidity: Number,
        // Notes
        notes: String,
    },
    {
        timestamps: true,
    }
);

dailyLogSchema.index({ user: 1, flock: 1, date: -1 });

// Virtual for production rate
dailyLogSchema.virtual("productionRate").get(function () {
    if (this.openingCount > 0 && this.eggsCollected > 0) {
        return ((this.eggsCollected / this.openingCount) * 100).toFixed(1);
    }
    return 0;
});

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);
export default DailyLog;
