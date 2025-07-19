import { Route, Routes } from "react-router-dom";
import { Roles } from "../constants/AccessConstants";
import PrivateRoute from "../components/PrivateRoute";
import { Dashboard } from "../pages/Dashboard";


const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[Roles.USER, Roles.DOCTOR]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
         
      </Route>
    </Routes>
  );
};

export default ProtectedRoutes;
