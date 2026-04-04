import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden bg-background text-white">
      <Navbar isDashboard />
      <main className="h-[calc(100vh-4rem)] w-full overflow-hidden p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
