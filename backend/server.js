import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/database.js";
import { errorHandler, notFound } from "./middleware/error.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
}));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Routes
import authRoutes from "./routes/auth.js";
import flockRoutes from "./routes/flocks.js";
import saleRoutes from "./routes/sales.js";
import inventoryRoutes from "./routes/inventory.js";
import healthRoutes from "./routes/health.js";
import expenseRoutes from "./routes/expenses.js";
import customerRoutes from "./routes/customers.js";
import dailyLogRoutes from "./routes/dailyLogs.js";
import vaccinationRoutes from "./routes/vaccinations.js";
import productRoutes from "./routes/products.js";
import reportRoutes from "./routes/reports.js";
import workerRoutes from "./routes/workers.js";
import taskRoutes from "./routes/tasks.js";
import notificationRoutes from "./routes/notifications.js";
import calendarRoutes from "./routes/calendar.js";
import settingsRoutes from "./routes/settings.js";

app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/flocks", flockRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/daily-logs", dailyLogRoutes);
app.use("/api/vaccinations", vaccinationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/calendar", calendarRoutes);

// Health check
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Farm Manager API is running",
        version: "3.0.0",
        endpoints: [
            "/api/auth", "/api/flocks", "/api/sales", "/api/inventory",
            "/api/health", "/api/expenses", "/api/customers", "/api/daily-logs",
            "/api/vaccinations", "/api/products", "/api/reports", "/api/workers",
            "/api/tasks", "/api/notifications", "/api/calendar"
        ],
    });
});

// Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API: http://localhost:${PORT}/api\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`❌ Error: ${err.message}`);
    process.exit(1);
});
