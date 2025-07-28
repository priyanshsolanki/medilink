import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Filter, Plus, Clock, Video, Phone, MapPin, Eye, Play, Trash2, Calendar, Users } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Sidebar from "../../components/Sidebar";
import appointmentService, { getAppointmentsByDoctor } from "../../api/appointmentService";
import { useAuth } from "../../context/AuthContext";

// Validation schema using Yup
const appointmentValidationSchema = Yup.object({
  name: Yup.string()
    .required("Patient name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  age: Yup.number()
    .required("Age is required")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120")
    .integer("Age must be a whole number"),
  time: Yup.string()
    .required("Time is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(15, "Duration must be at least 15 minutes")
    .max(180, "Duration cannot exceed 180 minutes"),
  type: Yup.string()
    .required("Consultation type is required")
    .oneOf(["Video Consultation", "Phone Consultation", "In-Person"], "Invalid consultation type"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Pending", "Confirmed", "Scheduled"], "Invalid status"),
  description: Yup.string()
    .max(500, "Description must be less than 500 characters")
});

const ScheduleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeView, setActiveView] = useState('Week');
  const [searchTerm, setSearchTerm] = useState('');
  const {authUser} = useAuth();
  const [appointments, setAppointments] = useState([]);

  const initialFormValues = {
    name: "",
    age: "",
    time: "",
    duration: 30,
    type: "Video Consultation",
    description: "",
    status: "Pending",
  };

  const timeSlots = [
    { time: "08:00", available: true },
    { time: "08:30", available: true },
    { time: "09:00", available: false },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: false },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
  ];

  // fetch existing appointments on mount
  useEffect(() => {
    appointmentService
      .getAppointmentsByDoctor(authUser?.id)
      .then((data) => setAppointments(data))
      .catch(() => {});
  }, []);

  // Helper functions for calendar
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getBgColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-red-400 to-red-600",
    ];
    return colors[index % colors.length];
  };

  const getTextColor = (index) => {
    return "text-white";
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        name: values.name,
        age: values.age,
        time: values.time,
        duration: values.duration,
        type: values.type,
        description: values.description,
        status: values.status,
      };
      const created = await appointmentService.bookAppointment(payload);
      // append new appointment
      setAppointments((prev) => [...prev, created]);
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      // error toast shown by service
    } finally {
      setSubmitting(false);
    }
  };

  // handle delete via API
  const handleDeleteAppointment = async () => {
    try {
      await appointmentService.cancelAppointment(selectedAppointment.id);
      setAppointments((prev) => prev.filter((app) => app.id !== selectedAppointment.id));
      setIsDeleteModalOpen(false);
      setSelectedAppointment(null);
    } catch {
      // error toast
    }
  };

  useEffect(() => {
    getAppointmentsByDoctor(authUser.id)
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err))
      .finally(() => {});
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Consultation":
        return <Video className="w-4 h-4 text-blue-500" />;
      case "Phone Consultation":
        return <Phone className="w-4 h-4 text-green-500" />;
      case "In-Person":
        return <MapPin className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const navigate = useNavigate();
  
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  // Custom Field Components for better styling
  const CustomField = ({ name, type = "text", placeholder, className, children, ...props }) => (
    <Field name={name}>
      {({ field, meta }) => (
        <div>
          {type === "select" ? (
            <select
              {...field}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 ${
                meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              {...props}
            >
              {children}
            </select>
          ) : type === "textarea" ? (
            <textarea
              {...field}
              placeholder={placeholder}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 resize-none ${
                meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              {...props}
            />
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 ${
                meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              {...props}
            />
          )}
          <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-2 ml-1" />
        </div>
      )}
    </Field>
  );

  // Format the current date for display
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appointment =>
    appointment?.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment?.patientId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 lg:flex-row">
      <Sidebar/>
      <main className="pt-20 lg:pt-0 flex-1">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Schedule Management
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  {formattedDate}
                </p>
                
                {/* View Toggle Buttons */}
                <div className="flex space-x-1 mt-4 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
                  {['Week', 'Month'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeView === view
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Stats */}
                <div className="flex items-center space-x-4 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
                  {/* <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">3 Urgent</span>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{appointments.length} Total</span>
                  </div>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    />
                  </div>
                  
                  <button className="p-3 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-all duration-200 border border-gray-300">
                    <Filter className="w-4 h-4" />
                  </button>
                  
                  {/* <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Appointment</span>
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Schedule Cards */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your appointments efficiently</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Appointments</div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'No appointments match your search criteria.' : 'You have no appointments scheduled for today.'}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Appointment</span>
                  </button>
                </div>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <div key={appointment.id || index} className="p-6 hover:bg-gray-50 transition-all duration-200 group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${getBgColor(index)} rounded-xl flex items-center justify-center shadow-md`}>
                          <span className={`${getTextColor(index)} font-bold text-lg`}>
                            {getInitials(appointment?.patientId?.name || 'Unknown')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">
                            {appointment?.patientId?.name || 'Unknown Patient'}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {appointment?.patientId?.email || 'No email provided'}
                          </p>
                          {appointment.description && (
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 max-w-md">
                              {appointment.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Appointment Details */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {appointment.time}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(appointment.type)}
                            <span className="text-sm text-gray-600">
                              {appointment.date}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                            {appointment.isNewPatient && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                New Patient
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewAppointment(appointment)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 tooltip"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => navigate(`/consult/${appointment._id}`)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Play className="w-4 h-4" />
                            <span className="text-sm font-medium">Start Call</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(appointment)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Appointment Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Schedule New Appointment</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Formik
                initialValues={initialFormValues}
                validationSchema={appointmentValidationSchema}
                onSubmit={handleFormSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Name
                        </label>
                        <CustomField
                          name="name"
                          placeholder="Enter patient name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <CustomField
                          name="age"
                          type="number"
                          placeholder="Enter age"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time
                        </label>
                        <CustomField name="time" type="select">
                          <option value="">Select time</option>
                          {timeSlots.map((slot) => (
                            <option
                              key={slot.time}
                              value={slot.time}
                              disabled={!slot.available}
                            >
                              {slot.time} {!slot.available && "(Unavailable)"}
                            </option>
                          ))}
                        </CustomField>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes)
                        </label>
                        <CustomField
                          name="duration"
                          type="number"
                          placeholder="30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consultation Type
                        </label>
                        <CustomField name="type" type="select">
                          <option value="Video Consultation">Video Consultation</option>
                          <option value="Phone Consultation">Phone Consultation</option>
                          <option value="In-Person">In-Person</option>
                        </CustomField>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <CustomField name="status" type="select">
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Scheduled">Scheduled</option>
                        </CustomField>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <CustomField
                        name="description"
                        type="textarea"
                        placeholder="Enter appointment description..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* View Appointment Modal */}
        {isViewModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 ${getBgColor(0)} rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-xl">
                      {getInitials(selectedAppointment?.patientId?.name || 'Unknown')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedAppointment?.patientId?.name || 'Unknown Patient'}
                    </h4>
                    <p className="text-gray-600">{selectedAppointment?.patientId?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="text-gray-900">{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="text-gray-900">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-900">{selectedAppointment.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  {selectedAppointment.description && (
                    <div>
                      <span className="font-medium text-gray-700 block mb-2">Description:</span>
                      <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                        {selectedAppointment.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    navigate(`/consult/${selectedAppointment._id}`);
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors duration-200"
                >
                  Start Consultation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Delete Appointment
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete the appointment with{' '}
                  <span className="font-medium text-gray-900">
                    {selectedAppointment?.patientId?.name || 'Unknown Patient'}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAppointment}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScheduleManagement;