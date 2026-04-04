import ProtectedRoute from './ProtectedRoute';

function CashierRoute({ children }) {
  return <ProtectedRoute allowedRoles={['manager', 'cashier']}>{children}</ProtectedRoute>;
}

export default CashierRoute;