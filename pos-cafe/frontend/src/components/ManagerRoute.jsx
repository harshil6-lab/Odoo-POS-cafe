import ProtectedRoute from './ProtectedRoute';

function ManagerRoute({ children }) {
  return <ProtectedRoute allowedRoles={['manager']}>{children}</ProtectedRoute>;
}

export default ManagerRoute;