import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import Categories from './pages/Categories';
import CustomerDisplay from './pages/CustomerDisplay';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import KitchenDisplay from './pages/KitchenDisplay';
import Login from './pages/Login';
import Orders from './pages/Orders';
import POS from './pages/POS';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Signup from './pages/Signup';
import Tables from './pages/Tables';

const navigationItems = [
  { path: '/', label: 'Dashboard', shortcut: '01' },
  { path: '/tables', label: 'Tables', shortcut: '02' },
  { path: '/pos', label: 'POS Terminal', shortcut: '03' },
  { path: '/kitchen', label: 'Kitchen Display', shortcut: '04' },
  { path: '/orders', label: 'Orders', shortcut: '05' },
  { path: '/products', label: 'Products', shortcut: '06' },
  { path: '/categories', label: 'Categories', shortcut: '07' },
  { path: '/customers', label: 'Customers', shortcut: '08' },
  { path: '/reports', label: 'Reports', shortcut: '09' },
];

const routeTitles = {
  '/': 'Dashboard',
  '/tables': 'Tables & Floor Plan',
  '/pos': 'POS Terminal',
  '/kitchen': 'Kitchen Display',
  '/orders': 'Orders Management',
  '/products': 'Products Management',
  '/categories': 'Categories Management',
  '/customers': 'Customers',
  '/reports': 'Reports Dashboard',
};

function FullScreenState({ label }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-center text-slate-600">
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function ProtectedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <FullScreenState label="Loading POS Cafe..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px,1fr]">
        <Sidebar items={navigationItems} />

        <div className="space-y-6">
          <Navbar title={routeTitles[location.pathname] || 'POS Cafe'} user={user} onSignOut={handleSignOut} />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <FullScreenState label="Starting application..." />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/customer-display" element={<CustomerDisplay />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;