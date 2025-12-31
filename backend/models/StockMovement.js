import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inventory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },
        type: {
            type: String,
            enum: ["in", "out", "adjustment", "transfer"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        previousQuantity: {
            type: Number,
            required: true,
        },
        newQuantity: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            enum: ["purchase", "sale", "usage", "damage", "expired", "return", "correction", "transfer"],
            required: true,
        },
        referenceType: {
            type: String,
            enum: ["sale", "purchase_order", "expense", "manual"],
        },
        referenceId: mongoose.Schema.Types.ObjectId,
        unitCost: Number,
        totalCost: Number,
        supplier: String,
        notes: String,
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

stockMovementSchema.index({ user: 1, inventory: 1, date: -1 });

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
export default StockMovement;
