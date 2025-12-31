# 🐔 Farm Manager

A comprehensive poultry farm management platform built with **React** (Frontend) and **Node.js/Express** (Backend).

![Farm Manager](https://img.shields.io/badge/version-1.0.0-emerald) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Demo Account](#-demo-account)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### Core Features
- 📊 **Dashboard** - Real-time analytics with charts for sales, production, expenses
- 🐔 **Flock Management** - Track bird batches, health scores, and mortality
- 🛒 **Sales & Invoices** - Record transactions, generate invoices, export to CSV/PDF
- 📦 **Inventory** - Manage feed, medicine, supplies with low stock alerts
- 💊 **Health Logging** - Daily health entries, symptoms tracking, treatments

### Advanced Features
- 💰 **Expense Tracking** - Categorized expenses with reports
- 👥 **Customer CRM** - Manage customers, credit limits, purchase history
- 📝 **Daily Logs** - Bird counts, egg production, feed consumption
- 💉 **Vaccination Schedules** - Plan, track, receive reminders
- 🏷️ **Products & Pricing** - Manage products with price history
- 📈 **Reports & Analytics** - Financial, production, flock performance

### Team Features
- 👷 **Workers Management** - Add workers with roles & permissions
- ✅ **Task Assignment** - Create, assign, prioritize tasks
- 📅 **Calendar View** - Monthly view of events, vaccinations, tasks

### Smart Features
- 🔔 **Smart Notifications** - Low stock, vaccination due, task reminders
- 📱 **Mobile Responsive** - Fully optimized for all devices
- 📤 **Data Export** - Export to CSV for any data
- 🖨️ **Invoice Printing** - Professional PDF invoices
- ⚡ **PWA Support** - Install as app on mobile/desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router | Navigation |
| Chart.js | Data Visualization |
| React Icons | Icon Library |
| Tailwind CSS | Styling |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |

---

## 📁 Project Structure

```
farmmanager/
├── frontend/                 # React Frontend
│   ├── public/              # Static assets, PWA files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js Backend
│   ├── config/              # Database config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, validation
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── scripts/             # Seed scripts
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env                 # Environment variables
│
├── README.md                 # This file
└── HOW_TO_USE.md            # Detailed usage guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/farmmanager.git
cd farmmanager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm install chart.js react-chartjs-2  # Required for charts
```

Start frontend:
```bash
npm run dev
```

### 4. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔐 Demo Account

### Seed Demo Data
```bash
cd backend
npm run seed:demo
```

### Login Credentials
```
Email:    demo@farmmanager.com
Password: demo1234
```

This creates sample data including:
- 4 Flocks (Layers & Broilers)
- 5 Customers
- 5 Products
- 8 Inventory items
- 25 Sales records
- 10 Expenses
- 30 Daily logs
- And more...

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update` | Update profile |
| PUT | `/api/auth/password` | Change password |

### Resources
| Resource | Endpoints |
|----------|-----------|
| Flocks | `/api/flocks` |
| Sales | `/api/sales` |
| Inventory | `/api/inventory` |
| Health | `/api/health` |
| Customers | `/api/customers` |
| Expenses | `/api/expenses` |
| Products | `/api/products` |
| Daily Logs | `/api/daily-logs` |
| Vaccinations | `/api/vaccinations` |
| Workers | `/api/workers` |
| Tasks | `/api/tasks` |
| Notifications | `/api/notifications` |
| Calendar | `/api/calendar` |
| Reports | `/api/reports` |

All resource endpoints support:
- `GET /` - List all (with pagination)
- `GET /:id` - Get single item
- `POST /` - Create new
- `PUT /:id` - Update
- `DELETE /:id` - Delete
- `GET /stats` - Get statistics

---

## 📸 Screenshots

### Dashboard
Beautiful analytics dashboard with real-time charts and metrics.

### Flock Management
Track all your bird batches with health scores and status.

### Sales & Invoices
Record sales, generate invoices, and track payments.

### Mobile View
Fully responsive with bottom navigation for mobile devices.

---

## 📝 Scripts

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server
npm run seed     # Seed initial data
npm run seed:demo # Seed demo account with sample data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000                    # Server port
MONGODB_URI=                 # MongoDB connection string
JWT_SECRET=                  # JWT secret key
JWT_EXPIRE=7d                # Token expiration
NODE_ENV=development         # Environment
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Teena**
- GitHub: [@tinanyaupane](https://github.com/tinanyaupane)

---

## 🙏 Acknowledgments

- React Icons for the beautiful icons
- Chart.js for the amazing charts
- Tailwind CSS for the styling system
- MongoDB Atlas for the database hosting

---

<p align="center">
  Made with ❤️ for poultry farmers
</p>
