import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// Dark mode disabled for now - files preserved
// import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Flocks from "./pages/Flocks.jsx";
import Sales from "./pages/Sales.jsx";
import Inventory from "./pages/Inventory.jsx";
import Health from "./pages/Health.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";
import About from "./pages/About.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

// New Feature Pages
import Expenses from "./pages/Expenses.jsx";
import Customers from "./pages/Customers.jsx";
import DailyLogs from "./pages/DailyLogs.jsx";
import Vaccinations from "./pages/Vaccinations.jsx";
import Products from "./pages/Products.jsx";
import Reports from "./pages/Reports.jsx";
import Workers from "./pages/Workers.jsx";
import Tasks from "./pages/Tasks.jsx";
import Calendar from "./pages/Calendar.jsx";


// Dashboard Layout: Has Sidebar + Header + Mobile Nav (no Footer)
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main
          id="page"
          className="flex-1 min-w-0 px-4 py-4 pb-20 lg:px-10 lg:py-8 lg:pb-8 bg-slate-50"
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

// Main Layout: Has Header + Footer (no Sidebar) - for info/legal pages
function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-6 py-8 lg:px-10 lg:py-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    // ThemeProvider disabled - dark mode off
    <>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Standalone Pages (Full custom layout) */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main Layout Pages (Header + Footer) */}
              <Route
                path="/about"
                element={
                  <MainLayout>
                    <About />
                  </MainLayout>
                }
              />
              <Route
                path="/help"
                element={
                  <MainLayout>
                    <Help />
                  </MainLayout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <MainLayout>
                    <Privacy />
                  </MainLayout>
                }
              />
              <Route
                path="/terms"
                element={
                  <MainLayout>
                    <Terms />
                  </MainLayout>
                }
              />

              {/* Dashboard Layout Pages (Sidebar + Header) - PROTECTED */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flocks"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Flocks />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Sales />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Inventory />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/health"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Health />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* NEW FEATURE ROUTES */}
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Expenses />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Customers />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/daily-logs"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DailyLogs />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vaccinations"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Vaccinations />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Products />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Reports />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workers"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Workers />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Tasks />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Calendar />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </>
    // </ThemeProvider>
  );
}
