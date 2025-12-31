import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            enum: ["feed", "medicine", "labor", "utilities", "equipment", "transport", "maintenance", "other"],
            required: [true, "Category is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        vendor: String,
        paymentMethod: {
            type: String,
            enum: ["cash", "bank", "credit", "upi"],
            default: "cash",
        },
        receipt: String,
        notes: String,
        flock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
        },
    },
    {
        timestamps: true,
    }
);

expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
