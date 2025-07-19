import React from "react";
import { Route, Routes } from "react-router-dom";
import DoctorAppointment from "../pages/DoctorAppointment";
import { Dashboard } from "../pages/Dashboard";
import Availability from "../pages/Availability";
import PatientDirectory from "../pages/Patientdirectory";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Patientdashboard from "../pages/Patientdashboard";
import { Sidebar } from "lucide-react";
import Patientsidebar from "../components/Patientsidebar";
import PharmacyLocator from "../pages/PharmacyLocator";
import MedicalHistory from "../pages/MedicalHistory";
import PatientProfile from "../pages/PatientProfile";


const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/doctor-appointment" element={<DoctorAppointment />} />
      <Route path="/availability" element={<Availability />} />
      <Route path="/patient-directory" element={<PatientDirectory />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/patient-dashboard" element={<Patientdashboard />} />
      <Route path="/sidebar" element={<Patientsidebar />} />
      <Route path="/pharmacy-locator" element={<PharmacyLocator />} />
      <Route path="/medical-history" element={<MedicalHistory />} />
      <Route path="/patient-profile" element={<PatientProfile />} />
      {/* Add more public routes here as needed */}
      {/* Example: <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};

export default PublicRoutes;
