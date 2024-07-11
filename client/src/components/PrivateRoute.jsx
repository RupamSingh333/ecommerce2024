import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../store/auth';
import { RotatingLines } from 'react-loader-spinner';

const PrivateRoute = ({ roles }) => {
  const { isLoggedIn, authData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Simulate fetching authData with delay
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after fetching authData
    }, 1000); // Replace with actual fetch logic or adjust delay as needed
  }, []);

  // If still loading authData, show loading indicator
  if (loading) {
    return (
      <div className="loader">
        <RotatingLines
          color="grey"
          height="60"
          width="60"
          strokeWidth="3"
          animationDuration="0.75s"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{ margin: 'auto' }} // Center loader
          wrapperClass="" // Additional wrapper class if needed
        />
      </div>
    );
  }

  // Check if user is logged in and has required role
  const hasRequiredRole = roles ? roles.includes(authData.role) : true;

  // Render based on authentication status and role
  return isLoggedIn && hasRequiredRole ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
