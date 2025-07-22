import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const ScheduleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      time: "09:00",
      duration: "30 min",
      type: "Video Consultation",
      description: "Follow-up consultation",
      status: "Confirmed",
      initials: "SJ",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 28,
      time: "10:30",
      duration: "45 min",
      type: "Video Consultation",
      description: "Initial consultation",
      status: "Pending",
      isNewPatient: true,
      initials: "MC",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      age: 45,
      time: "14:00",
      duration: "30 min",
      type: "Phone Consultation",
      description: "Prescription renewal",
      status: "Confirmed",
      initials: "ER",
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
    },
    {
      id: 4,
      name: "David Wilson",
      age: 52,
      time: "15:30",
      duration: "60 min",
      type: "Video Consultation",
      description: "Comprehensive health review",
      status: "Confirmed",
      initials: "DW",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    time: "",
    duration: "30",
    type: "Video Consultation",
    description: "",
    status: "Pending",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      "bg-blue-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-red-100",
    ];
    return colors[index % colors.length];
  };

  const getTextColor = (index) => {
    const colors = [
      "text-blue-600",
      "text-purple-600",
      "text-pink-600",
      "text-green-600",
      "text-yellow-600",
      "text-red-600",
    ];
    return colors[index % colors.length];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    const newAppointment = {
      id: appointments.length + 1,
      name: formData.name,
      age: parseInt(formData.age),
      time: formData.time,
      duration: `${formData.duration} min`,
      type: formData.type,
      description: formData.description,
      status: formData.status,
      initials: getInitials(formData.name),
      bgColor: getBgColor(appointments.length),
      textColor: getTextColor(appointments.length),
    };

    setAppointments((prev) => [...prev, newAppointment]);
    setFormData({
      name: "",
      age: "",
      time: "",
      duration: "30",
      type: "Video Consultation",
      description: "",
      status: "Pending",
    });
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Consultation":
        return "📹";
      case "Phone Consultation":
        return "📞";
      case "In-Person":
        return "🏥";
      default:
        return "📋";
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAppointment = () => {
    setAppointments(
      appointments.filter((app) => app.id !== selectedAppointment.id)
    );
    setIsDeleteModalOpen(false);
    setSelectedAppointment(null);
  };

  // Format the current date for display
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transform transition-transform duration-200 ease-in-out fixed lg:static inset-y-0 left-0 w-64 lg:w-80 bg-white border-b lg:border-r border-gray-200 p-4 lg:p-6 z-40 overflow-y-auto`}
      >
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            Schedule Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your appointments and availability
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-blue-500 text-white p-3 lg:p-4 rounded-lg">
            <div className="text-xs lg:text-sm font-medium">
              Today's Appointments
            </div>
            <div className="text-2xl lg:text-3xl font-bold">
              {appointments.length}
            </div>
          </div>
          <div className="bg-green-500 text-white p-3 lg:p-4 rounded-lg">
            <div className="text-xs lg:text-sm font-medium">Completed</div>
            <div className="text-2xl lg:text-3xl font-bold">8</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 lg:mb-8">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2 lg:space-y-3">
            <Link to="/availability">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">📅</span>
                Set Availability
              </button>
            </Link>
            <Link to="/patient-directory">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">👥</span>
                Patient Directory
              </button>
            </Link>
            <Link to="/analytics">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">📊</span>
                Analytics
              </button>
            </Link>
            <Link to="/settings">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">⚙️</span>
                Settings
              </button>
            </Link>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
            Calendar
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h4 className="font-medium text-sm lg:text-base">
                {new Date(currentYear, currentMonth).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h4>
              <div className="flex space-x-1 lg:space-x-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    const prevMonth =
                      currentMonth === 0 ? 11 : currentMonth - 1;
                    const prevYear =
                      currentMonth === 0 ? currentYear - 1 : currentYear;
                    setCurrentMonth(prevMonth);
                    setCurrentYear(prevYear);
                  }}
                >
                  ←
                </button>
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    const nextMonth =
                      currentMonth === 11 ? 0 : currentMonth + 1;
                    const nextYear =
                      currentMonth === 11 ? currentYear + 1 : currentYear;
                    setCurrentMonth(nextMonth);
                    setCurrentYear(nextYear);
                  }}
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 lg:gap-1 text-center text-xs lg:text-sm">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="font-medium text-gray-500 py-1 lg:py-2"
                >
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day, i) => {
                const today = new Date();
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
                const isCurrentMonth = day !== null;

                return (
                  <div
                    key={i}
                    className={`py-1 lg:py-2 cursor-pointer rounded ${
                      isToday
                        ? "bg-blue-500 text-white"
                        : isCurrentMonth
                        ? "hover:bg-blue-50"
                        : "text-gray-400"
                    }`}
                  >
                    {day || ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {formattedDate}
            </h2>
            <div className="flex space-x-2 sm:space-x-4 mt-2">
              <button className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium">
                Day
              </button>
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm font-medium">
                Week
              </button>
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm font-medium">
                Month
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">3</span>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full sm:w-64 pl-8 sm:pl-10 pr-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute left-2 sm:left-3 top-2 sm:top-2.5 text-gray-400">
                🔍
              </div>
            </div>
            <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm">
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 sm:px-6 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs sm:text-sm"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 lg:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Today's Schedule
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {appointments.length} appointments
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div
                      className={`w-8 sm:w-10 h-8 sm:h-10 ${appointment.bgColor} rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`${appointment.textColor} font-medium text-sm sm:text-base`}
                      >
                        {appointment.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {appointment.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Age {appointment.age}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      <span>🕘</span>
                      <span>
                        {appointment.time} ({appointment.duration})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      <span>{getTypeIcon(appointment.type)}</span>
                      <span>{appointment.type}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      {appointment.description}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                      {appointment.isNewPatient && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          New Patient
                        </span>
                      )}
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                      >
                        View
                      </button>
                      <button className="text-green-500 hover:text-green-700 text-xs sm:text-sm">
                        Start Call
                      </button>
                      <button
                        onClick={() => handleDeleteClick(appointment)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Available Time Slots
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={`p-2 sm:p-3 text-center rounded-lg text-xs sm:text-sm font-medium ${
                    slot.available
                      ? "bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div>{slot.time}</div>
                  {!slot.available && <div className="text-xs">Booked</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Add New Appointment
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select time</option>
                    {timeSlots
                      .filter((slot) => slot.available)
                      .map((slot) => (
                        <option key={slot.time} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Consultation Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Video Consultation">
                      Video Consultation
                    </option>
                    <option value="Phone Consultation">
                      Phone Consultation
                    </option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter appointment description or notes"
                />
              </div>

              <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 sm:px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Appointment Modal */}
      {isViewModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div
                  className={`w-12 sm:w-16 h-12 sm:h-16 ${selectedAppointment.bgColor} rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`${selectedAppointment.textColor} text-xl sm:text-2xl font-medium`}
                  >
                    {selectedAppointment.initials}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                    {selectedAppointment.name}
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Age {selectedAppointment.age}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    Time
                  </label>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {selectedAppointment.time} ({selectedAppointment.duration})
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    Type
                  </label>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {getTypeIcon(selectedAppointment.type)}{" "}
                    {selectedAppointment.type}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <span
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${getStatusColor(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                {selectedAppointment.isNewPatient && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                      Patient Type
                    </label>
                    <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm rounded-full">
                      New Patient
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  Description
                </label>
                <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">
                  {selectedAppointment.description || "No description provided"}
                </p>
              </div>

              <div className="flex justify-end pt-3 sm:pt-4">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Are you sure you want to delete the appointment for{" "}
                <span className="font-semibold">
                  {selectedAppointment.name}
                </span>{" "}
                at {selectedAppointment.time}?
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 sm:px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointment}
                className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
