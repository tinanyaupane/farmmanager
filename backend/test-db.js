import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("\n🔍 Testing MongoDB Connection...\n");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("---\n");

const testConnection = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");

        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ SUCCESS! MongoDB Connected to: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
        console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);

        // List all collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`📁 Collections in database: ${collections.length}`);
        if (collections.length > 0) {
            collections.forEach(col => console.log(`   - ${col.name}`));
        }

        console.log("\n✨ Connection test completed successfully!\n");

        await mongoose.connection.close();
        console.log("🔒 Connection closed.");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ CONNECTION FAILED!");
        console.error("Error:", error.message);
        console.error("\n💡 Troubleshooting:");

        if (error.message.includes("ECONNREFUSED")) {
            console.error("   → MongoDB is not running locally");
            console.error("   → Start MongoDB: net start MongoDB");
            console.error("   → OR use MongoDB Atlas (cloud)");
        } else if (error.message.includes("authentication")) {
            console.error("   → Check username/password in connection string");
        } else if (error.message.includes("network")) {
            console.error("   → Check internet connection");
            console.error("   → Verify connection string is correct");
        } else {
            console.error("   → Check MONGODB_URI in .env file");
        }

        console.error("\n");
        process.exit(1);
    }
};

testConnection();
