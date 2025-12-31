import mongoose from "mongoose";

const flockSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Flock name is required"],
        },
        type: {
            type: String,
            required: [true, "Flock type is required"],
            enum: ["broiler", "layer", "mixed"],
        },
        birdCount: {
            type: Number,
            required: [true, "Bird count is required"],
            min: [1, "Bird count must be at least 1"],
        },
        batch: String,
        houseNumber: String,
        age: {
            type: Number,
            default: 0,
        },
        healthScore: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ["active", "completed", "archived"],
            default: "active",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Flock = mongoose.model("Flock", flockSchema);
export default Flock;
