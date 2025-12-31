import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            type: String,
            required: [true, "Customer name is required"],
        },
        customerContact: String,
        items: [
            {
                name: String,
                quantity: Number,
                unit: String,
                price: Number,
                total: Number,
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "online", "cheque", "credit"],
            default: "cash",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "completed",
        },
        saleDate: {
            type: Date,
            default: Date.now,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
