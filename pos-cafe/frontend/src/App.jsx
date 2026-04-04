import { Navigate, Outlet, Route, Routes } from "react-router-dom"

// Layouts
import LandingLayout from "./layouts/LandingLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Public Pages
import Landing from "./pages/Landing"
import Menu from "./pages/Menu"
import ReserveTable from "./pages/ReserveTable"
import FloorLayout from "./pages/FloorLayout"
import ContactPage from "./pages/ContactPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Checkout from "./pages/Checkout"
import TableEntry from "./pages/TableEntry"

// Admin Pages
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import Kitchen from "./pages/Kitchen"
import CustomerDisplay from "./pages/CustomerDisplay"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/table/:table_code" element={<TableEntry />} />

      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reserve-table" element={<ReserveTable />} />
        <Route path="/book-table" element={<Navigate to="/reserve-table" replace />} />
        <Route path="/floor-layout" element={<FloorLayout />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/admin/customer-display" element={<CustomerDisplay />} />

      <Route path="/customer-ordering" element={<Navigate to="/menu" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><Dashboard /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute allowedRoles={['waiter']}><Register /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles={['cashier']}><Register /></ProtectedRoute>} />
          <Route path="/kitchen" element={<ProtectedRoute allowedRoles={['manager', 'waiter']}><Kitchen /></ProtectedRoute>} />
          <Route path="/tables" element={<ProtectedRoute allowedRoles={['manager', 'waiter']}><FloorLayout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['manager', 'waiter', 'cashier']}><Dashboard /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['manager']}><Dashboard /></ProtectedRoute>} />
        </Route>
      </Route>

      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/pos" element={<Navigate to="/register" replace />} />
      <Route path="/admin/billing" element={<Navigate to="/billing" replace />} />
      <Route path="/admin/kitchen" element={<Navigate to="/kitchen" replace />} />
      <Route path="/admin/tables" element={<Navigate to="/tables" replace />} />
      <Route path="/admin/orders" element={<Navigate to="/orders" replace />} />
      <Route path="/admin/products" element={<Navigate to="/reports" replace />} />
      <Route path="/admin/categories" element={<Navigate to="/reports" replace />} />
      <Route path="/admin/customers" element={<Navigate to="/reports" replace />} />
      <Route path="/admin/reports" element={<Navigate to="/reports" replace />} />
      <Route path="/admin/settings" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App