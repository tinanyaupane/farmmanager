import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, farmName, location } = req.body;
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email, phone, farmName, location },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update profile",
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to change password",
        });
    }
};

export const updateNotifications = async (req, res) => {
    try {
        const notifications = req.body;
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, {
            notifications: { ...notifications },
        });

        res.json({
            success: true,
            message: "Notification preferences updated",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update notifications",
        });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const preferences = req.body;
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, {
            preferences: { ...preferences },
        });

        res.json({
            success: true,
            message: "Preferences updated",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update preferences",
        });
    }
};
