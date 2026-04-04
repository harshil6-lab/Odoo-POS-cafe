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
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import OrderStatus from "./pages/OrderStatus"
import TableEntry from "./pages/TableEntry"
import ThankYou from "./pages/ThankYou"
import TrackOrder from "./pages/TrackOrder"

// Admin Pages
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import Billing from "./pages/Billing"
import Kitchen from "./pages/Kitchen"
import Orders from "./pages/Orders"
import Reports from "./pages/Reports"
import Reservations from "./pages/Reservations"
import Tables from "./pages/Tables"
import CustomerDisplay from "./pages/CustomerDisplay"
import StaffManagement from "./pages/StaffManagement"
import MenuEditor from "./pages/MenuEditor"
import CashierRoute from "./components/CashierRoute"
import ChefRoute from "./components/ChefRoute"
import ManagerRoute from "./components/ManagerRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import WaiterRoute from "./components/WaiterRoute"

function App() {
  return (
    <div className="relative z-0">
    <Routes>
      <Route path="/table/:table_code" element={<TableEntry />} />

      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/order-status/:orderId" element={<OrderStatus />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/reserve-table" element={<ReserveTable />} />
        <Route path="/book-table" element={<Navigate to="/reserve-table" replace />} />
        <Route path="/floor-layout" element={<FloorLayout />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/admin/customer-display" element={<CustomerDisplay />} />
      <Route path="/admin/customer-display/:orderId" element={<CustomerDisplay />} />

      <Route path="/customer-ordering" element={<Navigate to="/menu" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ManagerRoute><Dashboard /></ManagerRoute>} />
          <Route path="/register" element={<WaiterRoute><Register /></WaiterRoute>} />
          <Route path="/billing" element={<CashierRoute><Billing /></CashierRoute>} />
          <Route path="/kitchen" element={<ChefRoute><Kitchen /></ChefRoute>} />
          <Route path="/tables" element={<ProtectedRoute allowedRoles={['manager', 'waiter', 'cashier']}><Tables /></ProtectedRoute>} />
          <Route path="/orders" element={<ManagerRoute><Orders /></ManagerRoute>} />
          <Route path="/reports" element={<ManagerRoute><Reports /></ManagerRoute>} />
          <Route path="/staff" element={<ManagerRoute><StaffManagement /></ManagerRoute>} />
          <Route path="/menu-editor" element={<ManagerRoute><MenuEditor /></ManagerRoute>} />
          <Route path="/reservations" element={<ManagerRoute><Reservations /></ManagerRoute>} />
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
    </div>
  )
}

export default App