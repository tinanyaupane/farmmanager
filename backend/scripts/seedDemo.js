/**
 * Seed Script for Farm Manager Demo Data
 * 
 * Demo Account:
 *   Email: demo@farmmanager.com
 *   Password: demo1234
 * 
 * Usage: node scripts/seedDemo.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Models
import User from "../models/User.js";
import Flock from "../models/Flock.js";
import Sale from "../models/Sale.js";
import Inventory from "../models/Inventory.js";
import Health from "../models/Health.js";
import Expense from "../models/Expense.js";
import Customer from "../models/Customer.js";
import DailyLog from "../models/DailyLog.js";
import VaccinationSchedule from "../models/VaccinationSchedule.js";
import Product from "../models/Product.js";
import Worker from "../models/Worker.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import CalendarEvent from "../models/CalendarEvent.js";

const DEMO_USER = {
    name: "Sanjay Demo",
    email: "demo@farmmanager.com",
    password: "demo1234",
    farmName: "Green Valley Poultry Farm",
    phone: "+977 9876543210",
    location: "Kathmandu, Nepal",
};

const randomPastDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    return date;
};

const futureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

async function clearDemoData(userId) {
    console.log("🗑️  Clearing existing demo data...");
    await Promise.all([
        Flock.deleteMany({ user: userId }),
        Sale.deleteMany({ user: userId }),
        Inventory.deleteMany({ user: userId }),
        Health.deleteMany({ user: userId }),
        Expense.deleteMany({ user: userId }),
        Customer.deleteMany({ user: userId }),
        DailyLog.deleteMany({ user: userId }),
        VaccinationSchedule.deleteMany({ user: userId }),
        Product.deleteMany({ user: userId }),
        Worker.deleteMany({ owner: userId }),
        Task.deleteMany({ user: userId }),
        Notification.deleteMany({ user: userId }),
        CalendarEvent.deleteMany({ user: userId }),
    ]);
}

async function createFlocks(userId) {
    console.log("🐔 Creating flocks...");
    // Flock schema: user, name, type(broiler/layer/mixed), birdCount, batch, houseNumber, age, healthScore, status(active/completed/archived), startDate, notes
    const flocks = await Flock.insertMany([
        { user: userId, name: "Batch A - Layers", type: "layer", birdCount: 500, batch: "2024-A", houseNumber: "H1", age: 120, startDate: randomPastDate(120), status: "active", notes: "High performing layer batch", healthScore: 92 },
        { user: userId, name: "Batch B - Broilers", type: "broiler", birdCount: 1000, batch: "2024-B", houseNumber: "H2", age: 45, startDate: randomPastDate(45), status: "active", notes: "Fast growing broiler batch", healthScore: 88 },
        { user: userId, name: "Batch C - Layers", type: "layer", birdCount: 300, batch: "2024-C", houseNumber: "H3", age: 90, startDate: randomPastDate(90), status: "active", notes: "Premium white egg layers", healthScore: 95 },
        { user: userId, name: "Batch D - Completed", type: "broiler", birdCount: 800, batch: "2024-D", houseNumber: "H4", age: 180, startDate: randomPastDate(180), status: "completed", notes: "Batch completed and sold", healthScore: 0 },
    ]);
    console.log(`   ✓ Created ${flocks.length} flocks`);
    return flocks;
}

async function createCustomers(userId) {
    console.log("👥 Creating customers...");
    // Customer schema: user, name, phone, email, address, type(regular/wholesale/retail/dealer), creditLimit, currentCredit, totalPurchases, lastPurchaseDate, notes, isActive
    const customers = await Customer.insertMany([
        { user: userId, name: "Ram Grocery Store", phone: "+977 9801234567", email: "ram@grocery.com", type: "retail", address: "New Road, Kathmandu", creditLimit: 50000, currentCredit: 12500, totalPurchases: 125000 },
        { user: userId, name: "Shyam Restaurant", phone: "+977 9807654321", email: "shyam@restaurant.com", type: "regular", address: "Thamel, Kathmandu", creditLimit: 100000, currentCredit: 0, totalPurchases: 280000 },
        { user: userId, name: "Hari Traders", phone: "+977 9811234567", type: "wholesale", address: "Kalimati, Kathmandu", creditLimit: 200000, currentCredit: 45000, totalPurchases: 520000 },
        { user: userId, name: "Sita Poultry Shop", phone: "+977 9821234567", type: "retail", address: "Patan, Lalitpur", creditLimit: 30000, currentCredit: 0, totalPurchases: 85000 },
        { user: userId, name: "Krishna Hotel", phone: "+977 9841234567", email: "krishna@hotel.com", type: "dealer", address: "Bhaktapur", creditLimit: 75000, currentCredit: 18000, totalPurchases: 190000 },
    ]);
    console.log(`   ✓ Created ${customers.length} customers`);
    return customers;
}

async function createProducts(userId) {
    console.log("🏷️  Creating products...");
    // Product schema: user, name, category(eggs/birds/meat/manure/other), unit, basePrice, wholesalePrice, retailPrice, description, isActive, priceHistory
    const products = await Product.insertMany([
        { user: userId, name: "Fresh Eggs (1 Crate - 30pcs)", category: "eggs", unit: "crate", basePrice: 450, wholesalePrice: 420, retailPrice: 480, isActive: true },
        { user: userId, name: "Broiler Chicken (Live)", category: "birds", unit: "kg", basePrice: 280, wholesalePrice: 260, retailPrice: 295, isActive: true },
        { user: userId, name: "Dressed Chicken", category: "meat", unit: "kg", basePrice: 350, wholesalePrice: 330, retailPrice: 370, isActive: true },
        { user: userId, name: "Chicken Manure", category: "manure", unit: "kg", basePrice: 5, isActive: true },
        { user: userId, name: "Layer Hens (Culled)", category: "birds", unit: "piece", basePrice: 400, retailPrice: 450, isActive: true },
    ]);
    console.log(`   ✓ Created ${products.length} products`);
    return products;
}

async function createInventory(userId) {
    console.log("📦 Creating inventory...");
    // Inventory schema: user, name, category(feed/medicine/equipment/supplies/other), quantity, unit, minStock, pricePerUnit, supplier, lastRestocked, expiryDate, location, notes
    const inventory = await Inventory.insertMany([
        { user: userId, name: "Layer Mash Feed", category: "feed", quantity: 850, unit: "kg", minStock: 500, pricePerUnit: 55, supplier: "Nepal Feed Industries", lastRestocked: randomPastDate(7) },
        { user: userId, name: "Broiler Starter Feed", category: "feed", quantity: 1200, unit: "kg", minStock: 800, pricePerUnit: 65, supplier: "Shikhar Feed", lastRestocked: randomPastDate(5) },
        { user: userId, name: "Broiler Finisher Feed", category: "feed", quantity: 300, unit: "kg", minStock: 400, pricePerUnit: 60, supplier: "Shikhar Feed", lastRestocked: randomPastDate(14) },
        { user: userId, name: "Newcastle Vaccine", category: "medicine", quantity: 15, unit: "vials", minStock: 10, pricePerUnit: 250, supplier: "Vet Pharma Nepal", expiryDate: futureDate(180), lastRestocked: randomPastDate(30) },
        { user: userId, name: "Antibiotics (Amoxicillin)", category: "medicine", quantity: 8, unit: "bottles", minStock: 5, pricePerUnit: 450, supplier: "Vet Pharma Nepal", expiryDate: futureDate(365), lastRestocked: randomPastDate(15) },
        { user: userId, name: "Vitamins Supplement", category: "medicine", quantity: 3, unit: "kg", minStock: 5, pricePerUnit: 800, supplier: "AgriVet Supplies", lastRestocked: randomPastDate(45) },
        { user: userId, name: "Egg Trays (Plastic)", category: "supplies", quantity: 200, unit: "pieces", minStock: 100, pricePerUnit: 25, lastRestocked: randomPastDate(20) },
        { user: userId, name: "Disinfectant", category: "supplies", quantity: 20, unit: "liters", minStock: 10, pricePerUnit: 350, lastRestocked: randomPastDate(10) },
    ]);
    console.log(`   ✓ Created ${inventory.length} inventory items`);
    return inventory;
}

async function createSales(userId, customers) {
    console.log("🛒 Creating sales...");
    // Sale schema: user, invoiceNumber, customer, customerContact, items[{name,quantity,unit,price,total}], totalAmount, paymentMethod(cash/online/cheque/credit), paymentStatus(pending/completed/cancelled), saleDate, notes
    const products = [
        { name: "Fresh Eggs (1 Crate)", price: 480 },
        { name: "Broiler Chicken (Live)", price: 295 },
        { name: "Dressed Chicken", price: 370 },
    ];
    const sales = [];

    for (let i = 0; i < 25; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 20) + 5;
        const price = product.price;
        const total = quantity * price;

        sales.push({
            user: userId,
            invoiceNumber: `INV-${String(1000 + i).padStart(4, "0")}`,
            customer: customer.name,
            customerContact: customer.phone,
            items: [{ name: product.name, quantity, unit: "pcs", price, total }],
            totalAmount: total,
            paymentStatus: Math.random() > 0.3 ? "completed" : "pending",
            paymentMethod: ["cash", "online", "credit"][Math.floor(Math.random() * 3)],
            saleDate: randomPastDate(60),
        });
    }

    const created = await Sale.insertMany(sales);
    console.log(`   ✓ Created ${created.length} sales`);
    return created;
}

async function createExpenses(userId) {
    console.log("💰 Creating expenses...");
    // Expense schema: user, category(feed/medicine/labor/utilities/equipment/transport/maintenance/other), description, amount, date, vendor, paymentMethod(cash/bank/credit/upi), receipt, notes, flock
    const expenses = await Expense.insertMany([
        { user: userId, category: "feed", description: "Layer Mash - 1000kg", amount: 55000, date: randomPastDate(7), vendor: "Nepal Feed Industries", paymentMethod: "bank" },
        { user: userId, category: "feed", description: "Broiler Starter - 500kg", amount: 32500, date: randomPastDate(14), vendor: "Shikhar Feed", paymentMethod: "cash" },
        { user: userId, category: "medicine", description: "Vaccines and supplements", amount: 8500, date: randomPastDate(20), vendor: "Vet Pharma", paymentMethod: "cash" },
        { user: userId, category: "utilities", description: "Electricity bill - November", amount: 12000, date: randomPastDate(25), paymentMethod: "bank" },
        { user: userId, category: "utilities", description: "Water bill", amount: 3500, date: randomPastDate(28), paymentMethod: "cash" },
        { user: userId, category: "labor", description: "Worker salaries - November", amount: 45000, date: randomPastDate(5), paymentMethod: "bank" },
        { user: userId, category: "maintenance", description: "Shed repair", amount: 15000, date: randomPastDate(35), vendor: "Local Contractor", paymentMethod: "cash" },
        { user: userId, category: "transport", description: "Feed delivery charges", amount: 3000, date: randomPastDate(10), paymentMethod: "cash" },
        { user: userId, category: "equipment", description: "New feeders (10 pcs)", amount: 8000, date: randomPastDate(40), vendor: "Farm Equipment Store", paymentMethod: "cash" },
        { user: userId, category: "other", description: "Miscellaneous supplies", amount: 2500, date: randomPastDate(15), paymentMethod: "cash" },
    ]);
    console.log(`   ✓ Created ${expenses.length} expenses`);
    return expenses;
}

async function createDailyLogs(userId, flocks) {
    console.log("📝 Creating daily logs...");
    // DailyLog schema: user, flock, date, openingCount, mortality, culled, sold, closingCount, eggsCollected, eggsDamaged, eggsGradeA, eggsGradeB, feedConsumed, feedType, waterConsumed, healthScore, symptoms, treatment, avgWeight, sampleSize, temperature, humidity, notes
    const logs = [];
    const activeFlock = flocks.find(f => f.status === "active" && f.type === "layer");

    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const mortality = Math.random() > 0.85 ? 1 : 0;
        const openingCount = 490 - i;

        logs.push({
            user: userId,
            flock: activeFlock._id,
            date,
            openingCount,
            mortality,
            culled: 0,
            sold: 0,
            closingCount: openingCount - mortality,
            eggsCollected: Math.floor(420 + Math.random() * 40),
            eggsDamaged: Math.floor(Math.random() * 5),
            feedConsumed: Math.floor(50 + Math.random() * 10),
            waterConsumed: Math.floor(80 + Math.random() * 20),
            healthScore: 95 - Math.floor(Math.random() * 10),
            notes: i % 7 === 0 ? "Weekly health check completed" : undefined,
        });
    }

    const created = await DailyLog.insertMany(logs);
    console.log(`   ✓ Created ${created.length} daily logs`);
    return created;
}

async function createHealthRecords(userId, flocks) {
    console.log("💊 Creating health records...");
    // Health schema: user, flock, date, type(daily_entry/vaccination/health_case), mortality, eggProduction, avgWeight, feedConsumption, waterConsumption, temperature, humidity, vaccineName, vaccineDate, nextDueDate, status(healthy/attention/critical), symptoms, treatment, notes
    const records = await Health.insertMany([
        { user: userId, flock: flocks[0]._id, date: randomPastDate(5), type: "daily_entry", status: "healthy", mortality: 0, eggProduction: 420, feedConsumption: 55, waterConsumption: 80, temperature: 24, humidity: 65, notes: "Regular health check" },
        { user: userId, flock: flocks[1]._id, date: randomPastDate(10), type: "health_case", status: "attention", mortality: 2, symptoms: ["sneezing", "reduced appetite"], treatment: "Antibiotics course started", notes: "Mild respiratory infection" },
        { user: userId, flock: flocks[0]._id, date: randomPastDate(20), type: "vaccination", status: "healthy", vaccineName: "Newcastle Disease", vaccineDate: randomPastDate(20), nextDueDate: futureDate(60), notes: "All birds vaccinated" },
        { user: userId, flock: flocks[2]._id, date: randomPastDate(15), type: "daily_entry", status: "healthy", mortality: 0, eggProduction: 280, feedConsumption: 35, waterConsumption: 50, notes: "All birds healthy" },
    ]);
    console.log(`   ✓ Created ${records.length} health records`);
    return records;
}

async function createVaccinations(userId, flocks) {
    console.log("💉 Creating vaccination schedules...");
    // VaccinationSchedule schema: user, flock, vaccineName, scheduledDate, ageInDays, administrationRoute(drinking_water/spray/injection/eye_drop/wing_web), dosage, status(scheduled/completed/missed/postponed), completedDate, completedBy, batchNumber, manufacturer, cost, notes, reminderSent
    const vaccinations = await VaccinationSchedule.insertMany([
        { user: userId, flock: flocks[0]._id, vaccineName: "Newcastle Disease (ND)", scheduledDate: randomPastDate(30), ageInDays: 7, administrationRoute: "drinking_water", status: "completed", completedDate: randomPastDate(30), notes: "Completed successfully" },
        { user: userId, flock: flocks[0]._id, vaccineName: "Infectious Bronchitis (IB)", scheduledDate: futureDate(7), ageInDays: 127, administrationRoute: "spray", status: "scheduled", notes: "Due next week" },
        { user: userId, flock: flocks[1]._id, vaccineName: "Gumboro Disease", scheduledDate: randomPastDate(20), ageInDays: 14, administrationRoute: "drinking_water", status: "completed", completedDate: randomPastDate(20) },
        { user: userId, flock: flocks[1]._id, vaccineName: "Newcastle Disease (ND)", scheduledDate: futureDate(3), ageInDays: 48, administrationRoute: "injection", status: "scheduled", notes: "Prepare vaccines" },
        { user: userId, flock: flocks[2]._id, vaccineName: "Fowl Pox", scheduledDate: futureDate(14), ageInDays: 104, administrationRoute: "wing_web", status: "scheduled" },
        { user: userId, flock: flocks[0]._id, vaccineName: "Marek's Disease", scheduledDate: randomPastDate(90), ageInDays: 1, administrationRoute: "injection", status: "completed", completedDate: randomPastDate(90) },
    ]);
    console.log(`   ✓ Created ${vaccinations.length} vaccination schedules`);
    return vaccinations;
}

async function createWorkers(userId, flocks) {
    console.log("👷 Creating workers...");
    // Worker schema: owner, name, phone, email, role(manager/supervisor/worker/caretaker), permissions, salary, salaryType(monthly/weekly/daily), joinDate, assignedFlocks, shift(morning/evening/night/full), address, emergencyContact, notes, isActive
    const workers = await Worker.insertMany([
        { owner: userId, name: "Bikash Tamang", phone: "+977 9812345678", role: "supervisor", shift: "morning", salary: 25000, salaryType: "monthly", joinDate: randomPastDate(365), isActive: true, assignedFlocks: [flocks[0]._id, flocks[1]._id] },
        { owner: userId, name: "Sunita Rai", phone: "+977 9823456789", role: "worker", shift: "morning", salary: 15000, salaryType: "monthly", joinDate: randomPastDate(180), isActive: true, assignedFlocks: [flocks[0]._id] },
        { owner: userId, name: "Ramesh Gurung", phone: "+977 9834567890", role: "worker", shift: "evening", salary: 15000, salaryType: "monthly", joinDate: randomPastDate(120), isActive: true, assignedFlocks: [flocks[1]._id] },
        { owner: userId, name: "Kamala Thapa", phone: "+977 9845678901", role: "caretaker", shift: "night", salary: 18000, salaryType: "monthly", joinDate: randomPastDate(90), isActive: true, assignedFlocks: [flocks[2]._id] },
    ]);
    console.log(`   ✓ Created ${workers.length} workers`);
    return workers;
}

async function createTasks(userId, flocks, workers) {
    console.log("✅ Creating tasks...");
    // Task schema: user, title, description, category(feeding/cleaning/health/collection/maintenance/vaccination/other), priority(low/medium/high/urgent), status(pending/in_progress/completed/cancelled), assignedTo, flock, dueDate, dueTime, completedAt, completedBy, isRecurring, recurringPattern(daily/weekly/monthly), notes, attachments
    const tasks = await Task.insertMany([
        { user: userId, title: "Morning feeding - Batch A", category: "feeding", priority: "high", status: "completed", dueDate: randomPastDate(1), completedAt: randomPastDate(1), flock: flocks[0]._id, assignedTo: workers[1]._id },
        { user: userId, title: "Collect eggs - Batch A", category: "collection", priority: "high", status: "completed", dueDate: randomPastDate(1), completedAt: randomPastDate(1), flock: flocks[0]._id, assignedTo: workers[1]._id },
        { user: userId, title: "Clean water troughs", category: "cleaning", priority: "medium", status: "in_progress", dueDate: new Date(), flock: flocks[1]._id, assignedTo: workers[2]._id },
        { user: userId, title: "Check vaccine stock", category: "health", priority: "medium", status: "pending", dueDate: futureDate(2), notes: "Prepare for upcoming vaccinations" },
        { user: userId, title: "Order layer feed", category: "other", priority: "high", status: "pending", dueDate: futureDate(3), notes: "Stock running low" },
        { user: userId, title: "Repair feeder in Shed 2", category: "maintenance", priority: "low", status: "pending", dueDate: futureDate(7) },
        { user: userId, title: "Administer IB vaccine - Batch A", category: "vaccination", priority: "urgent", status: "pending", dueDate: futureDate(7), flock: flocks[0]._id, assignedTo: workers[0]._id },
        { user: userId, title: "Monthly shed disinfection", category: "cleaning", priority: "medium", status: "pending", dueDate: futureDate(10), isRecurring: true, recurringPattern: "monthly" },
    ]);
    console.log(`   ✓ Created ${tasks.length} tasks`);
    return tasks;
}

async function createNotifications(userId) {
    console.log("🔔 Creating notifications...");
    // Notification schema: user, type(low_stock/vaccination_due/vaccination_overdue/task_due/task_overdue/health_alert/payment_due/sale_completed/flock_alert/system), title, message, priority(low/medium/high/urgent), isRead, readAt, link, relatedModel, relatedId, expiresAt
    const notifications = await Notification.insertMany([
        { user: userId, type: "low_stock", title: "Low Stock Alert", message: "Broiler Finisher Feed is running low (300 kg remaining)", priority: "high", link: "/inventory" },
        { user: userId, type: "vaccination_due", title: "Vaccination Due Soon", message: "Newcastle Disease vaccine for Batch B is due in 3 days", priority: "medium", link: "/vaccinations" },
        { user: userId, type: "task_due", title: "Task Due Today", message: "Clean water troughs - assigned to Ramesh Gurung", priority: "medium", link: "/tasks" },
        { user: userId, type: "low_stock", title: "Low Stock Alert", message: "Vitamins Supplement is below minimum stock level", priority: "high", link: "/inventory", isRead: true, readAt: randomPastDate(1) },
        { user: userId, type: "sale_completed", title: "Sale Completed", message: "Sale of Rs. 14,400 to Ram Grocery Store completed", priority: "low", link: "/sales", isRead: true, readAt: randomPastDate(2) },
    ]);
    console.log(`   ✓ Created ${notifications.length} notifications`);
    return notifications;
}

async function createCalendarEvents(userId, flocks) {
    console.log("📅 Creating calendar events...");
    // CalendarEvent schema: user, title, description, eventType(vaccination/task/sale/reminder/meeting/other), startDate, endDate, allDay, color, flock, relatedModel, relatedId, isCompleted, reminders
    const events = await CalendarEvent.insertMany([
        { user: userId, title: "Vet Visit - Dr. Sharma", description: "Monthly health checkup for all flocks", startDate: futureDate(5), eventType: "meeting", color: "#10b981" },
        { user: userId, title: "Feed Delivery", description: "1 ton layer mash from Nepal Feed Industries", startDate: futureDate(8), eventType: "reminder", color: "#0ea5e9" },
        { user: userId, title: "Farm Inspection", description: "Government veterinary department inspection", startDate: futureDate(15), eventType: "meeting", color: "#f59e0b" },
        { user: userId, title: "Sell Broilers - Batch B", description: "Batch B ready for sale (45 days)", startDate: futureDate(12), eventType: "sale", color: "#8b5cf6", flock: flocks[1]._id },
    ]);
    console.log(`   ✓ Created ${events.length} calendar events`);
    return events;
}

async function seedDatabase() {
    try {
        console.log("\n🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("   ✓ Connected to MongoDB\n");

        let user = await User.findOne({ email: DEMO_USER.email });

        if (user) {
            console.log("👤 Demo user exists, clearing old data...");
            await clearDemoData(user._id);
        } else {
            console.log("👤 Creating demo user...");
            user = await User.create({
                name: DEMO_USER.name,
                email: DEMO_USER.email,
                password: DEMO_USER.password,
                farmName: DEMO_USER.farmName,
                phone: DEMO_USER.phone,
                location: DEMO_USER.location,
            });
            console.log(`   ✓ Created demo user: ${user.email}`);
        }

        console.log("\n📊 Populating demo data...\n");

        const flocks = await createFlocks(user._id);
        const customers = await createCustomers(user._id);
        const products = await createProducts(user._id);
        const inventory = await createInventory(user._id);
        const sales = await createSales(user._id, customers);
        const expenses = await createExpenses(user._id);
        const dailyLogs = await createDailyLogs(user._id, flocks);
        const healthRecords = await createHealthRecords(user._id, flocks);
        const vaccinations = await createVaccinations(user._id, flocks);
        const workers = await createWorkers(user._id, flocks);
        const tasks = await createTasks(user._id, flocks, workers);
        const notifications = await createNotifications(user._id);
        const calendarEvents = await createCalendarEvents(user._id, flocks);

        console.log("\n" + "═".repeat(60));
        console.log("✅ DEMO DATA SEEDED SUCCESSFULLY!");
        console.log("═".repeat(60));
        console.log("\n📋 Summary:");
        console.log(`   • Flocks: ${flocks.length}`);
        console.log(`   • Customers: ${customers.length}`);
        console.log(`   • Products: ${products.length}`);
        console.log(`   • Inventory Items: ${inventory.length}`);
        console.log(`   • Sales: ${sales.length}`);
        console.log(`   • Expenses: ${expenses.length}`);
        console.log(`   • Daily Logs: ${dailyLogs.length}`);
        console.log(`   • Health Records: ${healthRecords.length}`);
        console.log(`   • Vaccinations: ${vaccinations.length}`);
        console.log(`   • Workers: ${workers.length}`);
        console.log(`   • Tasks: ${tasks.length}`);
        console.log(`   • Notifications: ${notifications.length}`);
        console.log(`   • Calendar Events: ${calendarEvents.length}`);
        console.log("\n🔐 Demo Account Credentials:");
        console.log(`   Email: ${DEMO_USER.email}`);
        console.log(`   Password: ${DEMO_USER.password}`);
        console.log("\n🚀 You can now login and explore all features!\n");

    } catch (error) {
        console.error("\n❌ Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB\n");
        process.exit(0);
    }
}

seedDatabase();
