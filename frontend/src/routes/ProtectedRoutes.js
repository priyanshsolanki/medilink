import { Route, Routes } from "react-router-dom";
import { Roles } from "../constants/AccessConstants";
import PrivateRoute from "../components/PrivateRoute";
import { Dashboard } from "../pages/Dashboard";


const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR,Roles.USER]} />}>
       {/* Add routes that both users have access */}
      </Route>
      <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR]} />}>
       {/* Add routes that only doctors have access */}
       <Route path="/doctor/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<PrivateRoute allowedRoles={[Roles.USER]} />}>
       {/* Add routes that only patients have access */}
       <Route path="/patient/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default ProtectedRoutes;
