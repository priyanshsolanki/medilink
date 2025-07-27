import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Roles } from "../constants/AccessConstants";
import PrivateRoute from "../components/PrivateRoute";
import { Dashboard } from "../pages/Dashboard";

// Lazy-loaded feature components
const DoctorAppointment = lazy(() => import("../pages/Doctor/DoctorAppointment"));
const Availability = lazy(() => import("../pages/Doctor/Availability"));
const PatientDirectory = lazy(() => import("../pages/Doctor/Patientdirectory"));
const Settings = lazy(() => import("../pages/Doctor/Settings"));
const PharmacyLocator = lazy(() => import("../pages/Patient/PharmacyLocator"));
const MedicalHistory = lazy(() => import("../pages/Patient/MedicalHistory"));
const PatientProfile = lazy(() => import("../pages/Patient/PatientProfile"));
const PatientDashboard = lazy(() => import("../pages/Patient/Patientdashboard"));
const MyAppointments = lazy(() => import("../pages/Patient/BookAppointments"));
const DoctorChatPage = lazy(() => import("../pages/Doctor/doctorchatpage"));
const PatientChatPage = lazy(() => import("../pages/Patient/patientchatpage"));

const ProtectedRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/doctor/chat/:patientId" element={<DoctorChatPage />} />
        <Route path="/patient/chat" element={<PatientChatPage />} />
        <Route path="/patient-directory" element={<PatientDirectory />} />
        <Route path="/pharmacy-locator" element={<PharmacyLocator />} />

        <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR, Roles.USER]} />}>
          {/* Add routes that both users have access */}
        </Route>
        <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR]} />}>
          {/* Add routes that only doctors have access */}
          <Route path="/doctor/dashboard" element={<Dashboard />} />
          <Route path="/doctor/appointment" element={<DoctorAppointment />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/patient-directory" element={<PatientDirectory />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={[Roles.USER]} />}>
          {/* Add routes that only patients have access */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/book-appointment" element={<MyAppointments />} />
          <Route path="/pharmacy-locator" element={<PharmacyLocator />} />
          <Route path="/patient/medical-history" element={<MedicalHistory />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ProtectedRoutes;
