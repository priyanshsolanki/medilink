import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  User,
  Users,
  Clock,
  FileText,
  X,
} from "lucide-react";

const PatientDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Patient Directory
            </h1>
            <p className="text-gray-600">
              Manage your patient information and records
            </p>
          </div>
          <button
            onClick={() => setShowAddPatient(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Patients
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {patients.filter((p) => p.status === "active").length}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Appointments
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {patients.filter((p) => p.nextAppointment).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Visits
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {patients.reduce((sum, p) => sum + p.totalVisits, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Patients ({filteredPatients.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                          {patient.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Age {patient.age}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {patient.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {patient.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Age {patient.age}</span>
                          <span>{patient.email}</span>
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="text-gray-900">
                          Next: {formatDate(patient.nextAppointment)}
                        </p>
                        <p className="text-gray-600">
                          {patient.totalVisits} visits
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No patients found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Patient Modal */}
        {showAddPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Add New Patient
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter conditions (comma separated)"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={addPatient}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Details Modal */}
        {showPatientDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Patient Details
                  </h2>
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                    {selectedPatient.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedPatient.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-600">
                        Age: {selectedPatient.age}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedPatient.status
                        )}`}
                      >
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedPatient.phone}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-900">
                            {selectedPatient.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Appointment History
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Last Visit: {formatDate(selectedPatient.lastVisit)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Next Appointment:{" "}
                            {formatDate(selectedPatient.nextAppointment)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            Total Visits: {selectedPatient.totalVisits}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Medical History
                    </h4>
                    {selectedPatient.medicalHistory.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedPatient.medicalHistory.map(
                          (condition, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              <span className="text-gray-900">{condition}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No medical history recorded
                      </p>
                    )}

                    <h4 className="text-sm font-medium text-gray-500 mt-6 mb-2">
                      Patient Since
                    </h4>
                    <p className="text-gray-900">
                      {formatDate(selectedPatient.joinDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Patient Modal */}
        {isEditing && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Patient
                  </h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Appointment
                  </label>
                  <input
                    type="date"
                    name="nextAppointment"
                    value={editFormData.nextAppointment}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={editFormData.medicalHistory}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter conditions separated by commas"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePatient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
