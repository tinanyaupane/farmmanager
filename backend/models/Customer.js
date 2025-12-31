import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        email: String,
        address: String,
        type: {
            type: String,
            enum: ["regular", "wholesale", "retail", "dealer"],
            default: "regular",
        },
        creditLimit: {
            type: Number,
            default: 0,
        },
        currentCredit: {
            type: Number,
            default: 0,
        },
        totalPurchases: {
            type: Number,
            default: 0,
        },
        lastPurchaseDate: Date,
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

customerSchema.index({ user: 1, name: 1 });

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
