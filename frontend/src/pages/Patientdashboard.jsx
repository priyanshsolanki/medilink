import React, { useState } from "react";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import Patientsidebar from "../components/Patientsidebar";

const PatientDashboard = () => {
  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2025-07-20",
      time: "10:00 AM",
      type: "Video Consultation",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2025-07-25",
      time: "2:30 PM",
      type: "In-Person",
    },
  ]);

  const [recentPrescriptions] = useState([
    {
      id: 1,
      medication: "Atorvastatin 20mg",
      dosage: "1 tablet daily",
      date: "2025-06-15",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      medication: "Lisinopril 10mg",
      dosage: "1 tablet daily",
      date: "2025-05-30",
      doctor: "Dr. Emily Rodriguez",
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Patientsidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Patient Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back to your health portal
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Upcoming Appointments
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {upcomingAppointments.length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Prescriptions
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {recentPrescriptions.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recent Test Results
                  </p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Upcoming Appointments
              </h2>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {appointment.doctor}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          {formatDate(appointment.date)} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.type}
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600">
                    Book an appointment with your doctor
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Prescriptions
              </h2>
            </div>
            <div className="p-6">
              {recentPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {recentPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {prescription.medication}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {prescription.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          {formatDate(prescription.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prescription.doctor}
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recent prescriptions
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
