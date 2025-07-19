import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ allowedRoles }) => {
  const { authUser,token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const {role} = jwtDecode(token); // Decode token

  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />; // This renders the nested routes inside the private route
};

export default PrivateRoute;
