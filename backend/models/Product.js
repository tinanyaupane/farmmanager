import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
        },
        category: {
            type: String,
            enum: ["eggs", "birds", "meat", "manure", "other"],
            required: true,
        },
        unit: {
            type: String,
            required: true,
        },
        basePrice: {
            type: Number,
            required: [true, "Base price is required"],
            min: 0,
        },
        wholesalePrice: {
            type: Number,
            min: 0,
        },
        retailPrice: {
            type: Number,
            min: 0,
        },
        description: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        // Price history
        priceHistory: [{
            price: Number,
            date: { type: Date, default: Date.now },
            reason: String,
        }],
    },
    {
        timestamps: true,
    }
);

productSchema.index({ user: 1, category: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
