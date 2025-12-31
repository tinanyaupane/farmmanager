import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Item name is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["feed", "medicine", "equipment", "supplies", "other"],
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        unit: {
            type: String,
            required: true,
        },
        minStock: {
            type: Number,
            default: 10,
        },
        pricePerUnit: Number,
        supplier: String,
        lastRestocked: Date,
        expiryDate: Date,
        location: String,
        notes: String,
    },
    {
        timestamps: true,
    }
);

// Virtual to check if low stock
inventorySchema.virtual("isLowStock").get(function () {
    return this.quantity <= this.minStock;
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
