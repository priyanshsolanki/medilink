import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/HomePage/Home";
import LoginPage from "../pages/Auth/LoginPage";
import PatientRegister from "../pages/Auth/PatientRegister";
import DoctorRegister from "../pages/Auth/DoctorRegister";

const PublicRoutes = () => {
  return (
    <Routes>
       <Route exact path="/" element={<Home />} /> 
       <Route exact path="/login" element={<LoginPage />} /> 
       <Route exact path="/patientRegister" element={<PatientRegister />} /> 
       <Route exact path="/doctorRegister" element={<DoctorRegister />} /> 

      
    </Routes>
  );
};

export default PublicRoutes;
