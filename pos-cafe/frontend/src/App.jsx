import { Navigate, Outlet, Route, Routes } from "react-router-dom"

// Layouts
import LandingLayout from "./layouts/LandingLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Public Pages
import Landing from "./pages/Landing"
import Menu from "./pages/Menu"
import BookTable from "./pages/BookTable"
import About from "./pages/About"
import Contact from "./pages/Contact"

// Admin Pages
import Dashboard from "./pages/Dashboard"
import Tables from "./pages/Tables"
import POS from "./pages/POS"
import KitchenDisplay from "./pages/KitchenDisplay"
import CustomerDisplay from "./pages/CustomerDisplay"
import Orders from "./pages/Orders"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import Customers from "./pages/Customers"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

function App() {
  return (
    <Routes>
      {/* Public Landing Site */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Fullscreen Views */}
      <Route path="/admin/customer-display" element={<CustomerDisplay />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tables" element={<Tables />} />
        <Route path="pos" element={<POS />} />
        <Route path="kitchen" element={<KitchenDisplay />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App