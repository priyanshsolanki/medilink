import React, { useState, useMemo, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Star,
  X,
  Check,
  Search,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import userService from "../../api/userService";
import availabilityService from "../../api/availabilityService";
import { useAuth } from "../../context/AuthContext";
import appointmentService from "../../api/appointmentService";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.8,
    experience: "15 years",
    location: "Heart Care Center",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    availability: {
      "2025-07-23": ["09:00", "10:30", "14:00", "15:30"],
      "2025-07-24": ["09:00", "11:00", "16:00"],
      "2025-07-25": ["10:00", "13:30", "15:00"],
    },
    fee: 150,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    rating: 4.9,
    experience: "12 years",
    location: "Skin Health Clinic",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    availability: {
      "2025-07-23": ["08:30", "10:00", "13:00", "16:30"],
      "2025-07-24": ["09:30", "11:30", "14:30"],
      "2025-07-25": ["08:00", "12:00", "17:00"],
    },
    fee: 120,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.7,
    experience: "10 years",
    location: "Children's Medical Center",
    image:
      "https://images.unsplash.com/photo-1594824475867-7fb7f8fc0e0b?w=150&h=150&fit=crop&crop=face",
    availability: {
      "2025-07-23": ["09:00", "11:00", "14:30", "16:00"],
      "2025-07-24": ["08:00", "10:30", "15:00"],
      "2025-07-25": ["09:30", "13:00", "16:30"],
    },
    fee: 100,
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    rating: 4.6,
    experience: "18 years",
    location: "Bone & Joint Institute",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    availability: {
      "2025-07-23": ["10:00", "13:30", "15:00"],
      "2025-07-24": ["09:00", "11:30", "16:30"],
      "2025-07-25": ["08:30", "14:00", "17:30"],
    },
    fee: 180,
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    specialty: "Neurology",
    rating: 4.9,
    experience: "20 years",
    location: "Brain & Spine Center",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    availability: {
      "2025-07-23": ["08:00", "12:00", "16:00"],
      "2025-07-24": ["10:00", "14:00", "17:00"],
      "2025-07-25": ["09:00", "13:30", "15:30"],
    },
    fee: 200,
  },
];

const specialties = [
  "All",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
];

const BookingSchema = Yup.object().shape({
  patientName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Patient name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  reason: Yup.string()
    .min(10, "Please provide more details (minimum 10 characters)")
    .required("Reason for visit is required"),
});

export default function DoctorAppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    availabilityService.getAllAvailability()
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingDoctors(false));
  }, []);

  const {authUser} = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter fetched doctors
  const filteredDoctors = useMemo(() => {
    let list = selectedSpecialty === "All"
      ? doctors
      : doctors.filter((doc) => doc.specialty === selectedSpecialty);
      
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [doctors, selectedSpecialty, searchQuery]);

  const specialties = useMemo(() => {
    const set = new Set(doctors.map(d => d.specialty));
    return ["All", ...Array.from(set)];
  }, [doctors]);

  const formik = useFormik({
    initialValues: { patientName: "", email: "", phone: "", reason: "" },
    validationSchema: BookingSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        patientId: authUser.id,
      };
      try {
        // call the backend
        await appointmentService.bookAppointment(payload);
      
        // update local state / UI
        setShowSuccessModal(true);
        setShowBookingForm(false);
        setSelectedDoctor(null);
        setSelectedDate("");
        setSelectedTime("");
        resetForm();
      } catch (err) {
        console.error("Booking error:", err);
        // toast is already shown by the service
      }
    },
  });

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleTimeSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const isSlotBooked = (doctorId, date, time) => {
    return bookedAppointments.some(
      (apt) =>
        apt.doctorId === doctorId && apt.date === date && apt.time === time
    );
  };

  const getAvailableDates = () => {
    if (!selectedDoctor) return [];
    return Object.keys(selectedDoctor.availability).sort();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="pt-20 lg:pt-0 flex-1 ">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Book Your Appointment
              </h1>
              <p className="text-gray-600">
                Find and book appointments with our experienced doctors
              </p>
            </div>

            <div className="mb-8 space-y-6">
              <div className="max-w-md mx">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search doctors by name, specialty, or location..."
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text">
                  Filter by Specialty
                </h3>
                <div className="flex flex-wrap justify gap-2">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedSpecialty === specialty
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!selectedDoctor && (
              <div>
                {filteredDoctors.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No doctors found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery
                        ? `No doctors match your search "${searchQuery}".`
                        : "No doctors available for the selected specialty."}
                    </p>
                    {(searchQuery || selectedSpecialty !== "All") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedSpecialty("All");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <img
                              src={doctor.image || "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {doctor.name}
                              </h3>
                              <p className="text-blue-600 flex items-center">
                                <Stethoscope className="w-4 h-4 mr-1" />
                                {doctor.specialty}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                              <Star className="w-4 h-4 mr-2 text-yellow-500" />
                              <span>{doctor.rating || 4.8} rating</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span>{doctor.experience} experience</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{doctor.location}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            
                            <button
                              onClick={() => handleDoctorSelect(doctor)}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View Availability
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedDoctor && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img
                      src={selectedDoctor.image || "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"}
                      alt={selectedDoctor.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedDoctor.name}
                      </h2>
                      <p className="text-blue-600">
                        {selectedDoctor.specialty}
                      </p>
                      <p className="text-gray-600">
                        ${selectedDoctor.fee} consultation fee
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Time Slots
                </h3>

                <div className="space-y-4">
                  {getAvailableDates().map((date) => (
                    <div
                      key={date}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center mb-3">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {selectedDoctor.availability[date].map((time) => {
                          const isBooked = isSlotBooked(
                            selectedDoctor.id,
                            date,
                            time
                          );
                          return (
                            <button
                              key={time}
                              onClick={() =>
                                !isBooked && handleTimeSlotSelect(date, time)
                              }
                              disabled={isBooked}
                              className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isBooked
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                              }`}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              {time}
                              {isBooked && (
                                <span className="ml-1">(Booked)</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showBookingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Book Appointment
                      </h2>
                      <button
                        onClick={() => setShowBookingForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Doctor:</strong> {selectedDoctor.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Date:</strong>{" "}
                        {new Date(selectedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Time:</strong> {selectedTime}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Fee:</strong> ${selectedDoctor.fee}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          name="patientName"
                          value={formik.values.patientName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.patientName &&
                            formik.errors.patientName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter patient name"
                        />
                        {formik.touched.patientName &&
                          formik.errors.patientName && (
                            <p className="text-red-500 text-sm mt-1">
                              {formik.errors.patientName}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.email && formik.errors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter email address"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.phone && formik.errors.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter 10-digit phone number"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Visit *
                        </label>
                        <textarea
                          name="reason"
                          value={formik.values.reason}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formik.touched.reason && formik.errors.reason
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Describe your symptoms or reason for visit"
                        />
                        {formik.touched.reason && formik.errors.reason && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.reason}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowBookingForm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={formik.handleSubmit}
                          disabled={!formik.isValid}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showSuccessModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Appointment Booked Successfully!
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      You will receive a confirmation email shortly with all the
                      details.
                    </p>
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Great!
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
