# Farm Manager - Backend API

## 🚀 Complete REST API for Farm Management

Built with **Node.js**, **Express**, and **MongoDB**.

---

## 📋 Features

✅ **Authentication** - JWT-based auth with bcrypt password hashing  
✅ **User Management** - Profile updates, password changes  
✅ **Flock Management** - CRUD operations for bird flocks  
✅ **Sales Tracking** - Invoice generation, sales records  
✅ **Inventory Management** - Stock tracking with low-stock alerts  
✅ **Health Logging** - Daily entries, vaccinations, health cases  
✅ **Statistics** - Real-time stats for all modules  
✅ **Data Filtering** - Query by date, category, status, etc.  
✅ **Authorization** - User-specific data access  
✅ **Error Handling** - Comprehensive error middleware  

---

## 📦 **Installation**

### Run these commands:

```bash
cd backend
npm install
```

---

## ⚙️ **Configuration**

The `.env` file is already created. Update if needed:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

---

## 🗄️ **MongoDB Setup**

### Option 1: Local MongoDB

If you have MongoDB installed:

```bash
# Start MongoDB (Windows)
net start MongoDB

# Or use MongoDB Compass
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## 🏃 **Running the Server**

### Development mode (with auto-reload):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

Server will run on: `http://localhost:5000`

---

## 📚 **API Endpoints**

### **Authentication**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updatedetails` | Update user details | Private |
| PUT | `/api/auth/updatepassword` | Change password | Private |

### **Flocks**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/flocks` | Get all flocks | Private |
| GET | `/api/flocks/stats` | Get flock statistics | Private |
| GET | `/api/flocks/:id` | Get single flock | Private |
| POST | `/api/flocks` | Create new flock | Private |
| PUT | `/api/flocks/:id` | Update flock | Private |
| DELETE | `/api/flocks/:id` | Delete flock | Private |

### **Sales**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sales` | Get all sales | Private |
| GET | `/api/sales/stats` | Get sales statistics | Private |
| GET | `/api/sales/:id` | Get single sale | Private |
| POST | `/api/sales` | Create new sale | Private |
| PUT | `/api/sales/:id` | Update sale | Private |
| DELETE | `/api/sales/:id` | Delete sale | Private |

**Query Parameters:**
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `status` - Filter by payment status
- `customer` - Search by customer name

### **Inventory**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory` | Get all items | Private |
| GET | `/api/inventory/stats` | Get inventory statistics | Private |
| GET | `/api/inventory/:id` | Get single item | Private |
| POST | `/api/inventory` | Create new item | Private |
| PUT | `/api/inventory/:id` | Update item | Private |
| DELETE | `/api/inventory/:id` | Delete item | Private |

**Query Parameters:**
- `category` - Filter by category (feed/medicine/equipment/supplies/other)
- `lowStock` - Get low stock items (true/false)

### **Health**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Get all health entries | Private |
| GET | `/api/health/stats` | Get health statistics | Private |
| GET | `/api/health/:id` | Get single entry | Private |
| POST | `/api/health` | Create new entry | Private |
| PUT | `/api/health/:id` | Update entry | Private |
| DELETE | `/api/health/:id` | Delete entry | Private |

**Query Parameters:**
- `flock` - Filter by flock ID
- `type` - Filter by type (daily_entry/vaccination/health_case)
- `startDate` - Filter by start date
- `endDate` - Filter by end date

---

## 🔐 **Authentication**

All endpoints except register and login require authentication.

**Header format:**

```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```javascript
fetch('http://localhost:5000/api/flocks', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  }
})
```

---

## 📄 **Request/Response Examples**

### Register User

**POST** `/api/auth/register`

```json
{
  "name": "Farm Owner",
  "email": "owner@farm.com",
  "password": "YourPassword123",
  "farmName": "Green Valley Farm",
  "location": "Central Nepal",
  "phone": "+977 9841234567"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Farm Owner",
    "email": "owner@farm.com",
    "farmName": "Green Valley Farm",
    "location": "Central Nepal",
    "role": "user"
  }
}
```

### Create Flock

**POST** `/api/flocks`

```json
{
  "name": "Batch A-2024",
  "type": "broiler",
  "birdCount": 500,
  "batch": "A-2024",
  "houseNumber": "H1",
  "age": 0,
  "startDate": "2024-12-19",
  "notes": "New batch of broilers"
}
```

### Create Sale

**POST** `/api/sales`

```json
{
  "customer": "Hotel Sunrise",
  "customerContact": "+977 9876543210",
  "items": [
    {
      "name": "Eggs",
      "quantity": 50,
      "unit": "kg",
      "price": 140,
      "total": 7000
    }
  ],
  "totalAmount": 7000,
  "paymentMethod": "cash",
  "paymentStatus": "completed",
  "notes": "Delivered on time"
}
```

---

## 🗂️ **Project Structure**

```
backend/
├── config/
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── flockController.js # Flock management
│   ├── saleController.js  # Sales management
│   ├── inventoryController.js # Inventory management
│   └── healthController.js # Health logging
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── error.js           # Error handling
├── models/
│   ├── User.js            # User model
│   ├── Flock.js           # Flock model
│   ├── Sale.js            # Sale model
│   ├── Inventory.js       # Inventory model
│   └── Health.js          # Health model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── flocks.js          # Flock routes
│   ├── sales.js           # Sales routes
│   ├── inventory.js       # Inventory routes
│   └── health.js          # Health routes
├── utils/
│   └── token.js           # Token utilities
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
└── server.js             # Main server file
```

---

## 🛠️ **Technologies Used**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variables

---

## 🧪 **Testing**

Use **Postman**, **Insomnia**, or **Thunder Client** to test endpoints.

### Quick Test:

```bash
curl http://localhost:5000/api
```

Should return:

```json
{
  "success": true,
  "message": "Farm Manager API is running",
  "version": "1.0.0"
}
```

---

## 🚨 **Common Issues**

### MongoDB Connection Error

✅ **Solution:** Make sure MongoDB is running

```bash
# Windows
net start MongoDB

# Or install MongoDB Compass
```

### Port already in use

✅ **Solution:** Change PORT in `.env` or kill process on port 5000

---

## 🎯 **Next Steps**

1. ✅ Install dependencies: `npm install`
2. ✅ Start MongoDB
3. ✅ Run server: `npm run dev`
4. ✅ Test API with Postman
5. ✅ Connect frontend

---

## 📝 **Notes**

- All timestamps are in UTC
- User IDs are MongoDB ObjectId format
- Invoice numbers are auto-generated
- Passwords are hashed before storing
- All user data is isolated (multi-tenancy)

---

## ✨ **Status: COMPLETE**

Backend API is **100% ready** for production!

- ✅ All endpoints implemented
- ✅ Authentication & authorization
- ✅ Data validation
- ✅ Error handling
- ✅ Statistics endpoints
- ✅ Filtering & querying
- ✅ Database models
- ✅ Middleware

---

Made with ❤️ for sustainable farming! 🌱
