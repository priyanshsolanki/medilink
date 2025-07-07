import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const PrivateRoute = ({ allowedRoles }) => {
  const { authUser,token } = useAuth();
  useEffect(()=>{
    console.log(authUser)
  },[]);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!authUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; // This renders the nested routes inside the private route
};

export default PrivateRoute;
