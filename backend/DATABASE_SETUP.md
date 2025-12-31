# 🔍 Database Connection Check

## ✅ Database Configuration is CORRECT!

Your database setup is properly configured:

### **Files Checked:**
- ✅ `config/database.js` - MongoDB connection logic
- ✅ `server.js` - Calls connectDB() on startup
- ✅ `.env` - Contains MONGODB_URI (protected by gitignore)
/*mongodb://127.0.0.1:27017/farmmanager*/

---

## 🧪 **Test Your Database Connection**

### **Run this command:**

```bash
node test-db.js
```

This will:
- ✅ Test MongoDB connection
- ✅ Show database name
- ✅ List existing collections
- ✅ Provide detailed error messages if something fails

---

## 🗄️ **MongoDB Setup Options**

### **Option 1: MongoDB Atlas (Cloud - Recommended) ⭐**

**Pros:**
- ✅ Free forever (512MB storage)
- ✅ No local installation needed
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ 5-minute setup

**Steps:**

1. **Go to:** https://www.mongodb.com/cloud/atlas/register

2. **Create account** (free)

3. **Create Cluster:**
   - Choose FREE tier (M0)
   - Select region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

4. **Setup Database Access:**
   - Go to "Database Access" tab
   - Click "Add New Database User"
   - Username: `farmadmin`
   - Password: (generate strong password)
   - Database User Privileges: "Atlas Admin"
   - Click "Add User"

5. **Setup Network Access:**
   - Go to "Network Access" tab
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

6. **Get Connection String:**
   - Go to "Database" tab
   - Click "Connect" button
   - Choose "Connect your application"
   - Copy connection string
   - Example: `mongodb+srv://farmadmin:<password>@cluster0.xxxxx.mongodb.net/farmmanager?retryWrites=true&w=majority`

7. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://farmadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/farmmanager?retryWrites=true&w=majority
   ```
   
   **Replace:**
   - `YOUR_PASSWORD` with your actual password
   - `cluster0.xxxxx` with your actual cluster address

---

### **Option 2: Local MongoDB**

**Pros:**
- No internet needed
- Faster for development

**Cons:**
- Requires MongoDB installation
- Only accessible from local machine

**Steps:**

1. **Check if MongoDB is installed:**
   ```bash
   mongod --version
   ```

2. **If not installed, download from:**
   https://www.mongodb.com/try/download/community

3. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB
   
   # Or using MongoDB Compass (GUI)
   ```

4. **Your `.env` is already configured:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/farmmanager
   ```

---

## 🧪 **Testing Steps**

### **1. Test Database Connection**
```bash
node test-db.js
```

**Expected Output:**
```
✅ SUCCESS! MongoDB Connected to: cluster0.xxxxx.mongodb.net
📊 Database Name: farmmanager
🔌 Connection State: Connected
📁 Collections in database: 0
```

### **2. Start Server**
```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net

🚀 Server running on port 5000
📍 Environment: development
🌐 API: http://localhost:5000/api
```

### **3. Test API Health Check**
Visit in browser: `http://localhost:5000/api`

**Expected Response:**
```json
{
  "success": true,
  "message": "Farm Manager API is running",
  "version": "1.0.0"
}
```

---

## ⚠️ **Common Connection Errors**

### **Error: ECONNREFUSED**
```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- MongoDB is not running locally
- **Fix:** Start MongoDB service: `net start MongoDB`
- **OR:** Use MongoDB Atlas instead

---

### **Error: Authentication Failed**
```
❌ MongoDB Connection Error: Authentication failed
```

**Solution:**
- Wrong username/password in connection string
- **Fix:** Check credentials in MongoDB Atlas
- Update `.env` with correct password

---

### **Error: Network Error**
```
❌ MongoDB Connection Error: getaddrinfo ENOTFOUND
```

**Solution:**
- Internet connection issue (if using Atlas)
- Wrong connection string
- **Fix:** Check internet connection
- Verify connection string is correct

---

### **Error: IP Not Whitelisted**
```
❌ MongoDB Connection Error: IP address not whitelisted
```

**Solution:**
- Your IP is not allowed in MongoDB Atlas
- **Fix:** Go to Network Access → Add IP Address → Allow from Anywhere

---

## 📋 **Your Current .env Configuration**

Based on the default setup, your `.env` should have:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

**For MongoDB Atlas**, change `MONGODB_URI` to:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/farmmanager?retryWrites=true&w=majority
```

---

## ✅ **Verification Checklist**

- [ ] `.env` file exists in backend folder
- [ ] `MONGODB_URI` is set correctly
- [ ] MongoDB is running (local) OR Atlas cluster is active
- [ ] Run `node test-db.js` → Success ✅
- [ ] Run `npm run dev` → Server starts ✅
- [ ] Visit `http://localhost:5000/api` → Shows welcome message ✅

---

## 🎯 **Next Steps After Connection Works**

1. ✅ Test database connection
2. ✅ Start backend server
3. ✅ Start frontend server
4. ✅ Register a test user
5. ✅ Test all features

---

## 💡 **Recommendation**

**Use MongoDB Atlas** for easier setup:
- No local MongoDB installation needed
- Works immediately
- Free tier is sufficient
- Easier to share/deploy later

Just update your `.env` with the Atlas connection string and you're done!

---

**Need help? Just tell me which option you chose and if you see any errors!** 🚀
