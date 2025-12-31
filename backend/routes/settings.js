import express from "express";
import { protect } from "../middleware/auth.js";
import {
    updateProfile,
    changePassword,
    updateNotifications,
    updatePreferences,
} from "../controllers/settingsController.js"; // You'll create this

const router = express.Router();

router.use(protect); // All settings require auth

// Profile updates
router.put("/profile", updateProfile);

// Password change
router.put("/password", changePassword);

// Notification preferences
router.put("/notifications", updateNotifications);

// General preferences (language, currency, etc.)
router.put("/preferences", updatePreferences);

// Get current user settings (profile + preferences)
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch combined user settings from User model
        const userSettings = await User.findById(userId).select(
            "name email phone farmName location preferences notifications"
        );

        res.json({
            success: true,
            data: userSettings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: error.message,
        });
    }
});

export default router;
