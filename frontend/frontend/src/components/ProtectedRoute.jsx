// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('doclinkToken');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;