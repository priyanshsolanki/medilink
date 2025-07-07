import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/HomePage/Home";
import LoginPage from "../pages/Auth/LoginPage";
import PatientRegister from "../pages/Auth/PatientRegister";
import DoctorRegister from "../pages/Auth/DoctorRegister";
import GoogleAuthSuccess from "../pages/Auth/GoogleAuthSuccess";

const PublicRoutes = () => {
  return (
    <Routes>
       <Route exact path="/" element={<Home />} /> 
       <Route exact path="/login" element={<LoginPage />} /> 
       <Route exact path="/patientRegister" element={<PatientRegister />} /> 
       <Route exact path="/doctorRegister" element={<DoctorRegister />} /> 
       <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

      
    </Routes>
  );
};

export default PublicRoutes;
