import ProtectedRoute from './ProtectedRoute';

function ChefRoute({ children }) {
  return <ProtectedRoute allowedRoles={['manager', 'chef']}>{children}</ProtectedRoute>;
}

export default ChefRoute;