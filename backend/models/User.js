import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        farmName: {
            type: String,
            required: [true, "Farm name is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        phone: String,
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // ✅ ADD THESE INSIDE THE SCHEMA OBJECT
        notifications: {
            emailNotifications: { type: Boolean, default: true },
            salesAlerts: { type: Boolean, default: true },
            lowStockAlerts: { type: Boolean, default: true },
            healthAlerts: { type: Boolean, default: true },
        },
        preferences: {
            language: { type: String, default: "en" },
            currency: { type: String, default: "NPR" },
            dateFormat: { type: String, default: "YYYY-MM-DD" },
            theme: { type: String, default: "light" },
        },
    },
    {
        timestamps: true, // ✅ Options go here only
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
