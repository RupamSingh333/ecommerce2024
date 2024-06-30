import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../store/auth';

const PrivateRoute = ({ roles }) => {
  const { isLoggedIn, authData } = useContext(AuthContext);

  const hasRequiredRole = roles ? roles.includes(authData.role) : true;

  return isLoggedIn && hasRequiredRole ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
