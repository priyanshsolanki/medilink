import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  MapPin,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  User,
  Users,
  Clock,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    medicalHistory: "",
    status: "active",
    nextAppointment: "",
  });

  // Calendar state
  const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Halifax, NS",
      lastVisit: "2025-06-15",
      nextAppointment: "2025-07-02",
      status: "active",
      medicalHistory: ["Hypertension", "Diabetes Type 2"],
      avatar: "👩",
      totalVisits: 12,
      joinDate: "2023-03-15",
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 28,
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Ave, Halifax, NS",
      lastVisit: "2025-06-20",
      nextAppointment: "2025-06-28",
      status: "active",
      medicalHistory: ["Asthma"],
      avatar: "👨",
      totalVisits: 8,
      joinDate: "2023-08-22",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      age: 45,
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine St, Halifax, NS",
      lastVisit: "2025-05-30",
      nextAppointment: null,
      status: "inactive",
      medicalHistory: ["Arthritis", "High Cholesterol"],
      avatar: "👩",
      totalVisits: 15,
      joinDate: "2022-11-10",
    },
    {
      id: 4,
      name: "David Wilson",
      age: 52,
      email: "david.wilson@email.com",
      phone: "+1 (555) 456-7890",
      address: "321 Elm St, Halifax, NS",
      lastVisit: "2025-06-25",
      nextAppointment: "2025-07-01",
      status: "active",
      medicalHistory: ["Heart Disease"],
      avatar: "👨",
      totalVisits: 20,
      joinDate: "2022-01-05",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      age: 29,
      email: "lisa.thompson@email.com",
      phone: "+1 (555) 567-8901",
      address: "654 Maple Ave, Halifax, NS",
      lastVisit: "2025-06-18",
      nextAppointment: "2025-06-30",
      status: "active",
      medicalHistory: ["Anxiety", "Migraines"],
      avatar: "👩",
      totalVisits: 6,
      joinDate: "2024-02-14",
    },
  ]);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    medicalHistory: "",
  });

  // Calendar helper functions
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

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);

    const matchesFilter =
      selectedFilter === "all" || patient.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const addPatient = () => {
    if (newPatient.name && newPatient.email) {
      const id = Math.max(...patients.map((p) => p.id), 0) + 1;
      const patient = {
        ...newPatient,
        id,
        age: parseInt(newPatient.age) || 0,
        status: "active",
        lastVisit: null,
        nextAppointment: null,
        avatar: "👤",
        totalVisits: 0,
        joinDate: new Date().toISOString().split("T")[0],
        medicalHistory: newPatient.medicalHistory
          ? newPatient.medicalHistory.split(",").map((h) => h.trim())
          : [],
      };
      setPatients([...patients, patient]);
      setNewPatient({
        name: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        medicalHistory: "",
      });
      setShowAddPatient(false);
    }
  };

  const deletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      name: patient.name,
      age: patient.age,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      medicalHistory: patient.medicalHistory.join(", "),
      status: patient.status,
      nextAppointment: patient.nextAppointment || "",
    });
    setIsEditing(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const updatePatient = () => {
    if (editFormData.name && editFormData.email) {
      const updatedPatients = patients.map((patient) =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              name: editFormData.name,
              age: parseInt(editFormData.age) || 0,
              email: editFormData.email,
              phone: editFormData.phone,
              address: editFormData.address,
              medicalHistory: editFormData.medicalHistory
                ? editFormData.medicalHistory.split(",").map((h) => h.trim())
                : [],
              status: editFormData.status,
              nextAppointment: editFormData.nextAppointment || null,
            }
          : patient
      );
      setPatients(updatedPatients);
      setIsEditing(false);
      setSelectedPatient(null);
    }
  };

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
            Patient Directory
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your patient information and records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-blue-500 text-white p-3 lg:p-4 rounded-lg">
            <div className="text-xs lg:text-sm font-medium">Total Patients</div>
            <div className="text-2xl lg:text-3xl font-bold">
              {patients.length}
            </div>
          </div>
          <div className="bg-green-500 text-white p-3 lg:p-4 rounded-lg">
            <div className="text-xs lg:text-sm font-medium">
              Active Patients
            </div>
            <div className="text-2xl lg:text-3xl font-bold">
              {patients.filter((p) => p.status === "active").length}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 lg:mb-8">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2 lg:space-y-3">
            <button
              onClick={() => setShowAddPatient(true)}
              className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span className="mr-2 lg:mr-3">➕</span>
              Add Patient
            </button>
            <Link to="/doctor-appointment">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">📅</span>
                Schedule Appointment
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
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 gap-2 sm:gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {patients.filter((p) => p.nextAppointment).length}
              </span>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 sm:left-3 top-2 sm:top-2.5 w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-8 sm:pl-10 pr-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm">
              Filter
            </button>
            <button
              onClick={() => setShowAddPatient(true)}
              className="px-4 sm:px-6 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Patients ({filteredPatients.length})
              </h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 sm:p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-3 sm:w-4 h-3 sm:h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 sm:p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-3 sm:w-4 h-3 sm:h-4 flex flex-col gap-0.5">
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg sm:text-xl">
                          {patient.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                            {patient.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Age {patient.age}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Mail className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <CalendarIcon className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span>Next: {formatDate(patient.nextAppointment)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-base sm:text-lg">
                        {patient.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          {patient.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span>Age {patient.age}</span>
                          <span className="truncate">{patient.email}</span>
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-left sm:text-right text-xs sm:text-sm">
                        <p className="text-gray-900">
                          Next: {formatDate(patient.nextAppointment)}
                        </p>
                        <p className="text-gray-600">
                          {patient.totalVisits} visits
                        </p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            patient.status
                          )}`}
                        >
                          {patient.status}
                        </span>
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredPatients.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Users className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No patients found
                </h3>
                <p className="text-gray-600 text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Patient Modal */}
        {showAddPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Add New Patient
                </h2>
                <button
                  onClick={() => {
                    setShowAddPatient(false);
                    setNewPatient({
                      name: "",
                      age: "",
                      email: "",
                      phone: "",
                      address: "",
                      medicalHistory: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <input
                    type="text"
                    value={newPatient.medicalHistory}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        medicalHistory: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter conditions (comma separated)"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={addPatient}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Patient
                </button>
                <button
                  onClick={() => {
                    setShowAddPatient(false);
                    setNewPatient({
                      name: "",
                      age: "",
                      email: "",
                      phone: "",
                      address: "",
                      medicalHistory: "",
                    });
                  }}
                  className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Details Modal */}
        {showPatientDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Patient Details
                  </h2>
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 sm:w-6 h-5 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    {selectedPatient.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {selectedPatient.name}
                    </h3>
                    <div className="flex items-center gap-3 sm:gap-4 mt-2">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Age: {selectedPatient.age}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                          selectedPatient.status
                        )}`}
                      >
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                        Contact Information
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                          <Mail className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                          <Phone className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.phone}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 text-sm">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-900">
                            {selectedPatient.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                        Appointment History
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                          <CalendarIcon className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Last Visit: {formatDate(selectedPatient.lastVisit)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                          <CalendarIcon className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Next Appointment:{" "}
                            {formatDate(selectedPatient.nextAppointment)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                          <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Total Visits: {selectedPatient.totalVisits}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                      Medical History
                    </h4>
                    {selectedPatient.medicalHistory.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedPatient.medicalHistory.map(
                          (condition, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              <span className="text-gray-900">{condition}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No medical history recorded
                      </p>
                    )}

                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mt-4 sm:mt-6 mb-2">
                      Patient Since
                    </h4>
                    <p className="text-gray-900 text-sm">
                      {formatDate(selectedPatient.joinDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Patient Modal */}
        {isEditing && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Edit Patient
                  </h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 sm:w-6 h-5 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Next Appointment
                  </label>
                  <input
                    type="date"
                    name="nextAppointment"
                    value={editFormData.nextAppointment}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={editFormData.medicalHistory}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter conditions separated by commas"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 sm:px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePatient}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDirectory;
