import ProtectedRoute from './ProtectedRoute';

function WaiterRoute({ children }) {
  return <ProtectedRoute allowedRoles={['manager', 'waiter']}>{children}</ProtectedRoute>;
}

export default WaiterRoute;