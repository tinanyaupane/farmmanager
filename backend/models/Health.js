import mongoose from "mongoose";

const healthSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        flock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        type: {
            type: String,
            enum: ["daily_entry", "vaccination", "health_case"],
            default: "daily_entry",
        },
        mortality: {
            type: Number,
            default: 0,
            min: 0,
        },
        eggProduction: Number,
        avgWeight: Number,
        feedConsumption: Number,
        waterConsumption: Number,
        temperature: Number,
        humidity: Number,
        vaccineName: String,
        vaccineDate: Date,
        nextDueDate: Date,
        status: {
            type: String,
            enum: ["healthy", "attention", "critical"],
            default: "healthy",
        },
        symptoms: [String],
        treatment: String,
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Health = mongoose.model("Health", healthSchema);
export default Health;
