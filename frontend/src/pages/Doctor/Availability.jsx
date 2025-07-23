import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  X,
  Save,
  ArrowLeft,
  Check,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const SetAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, startTime: "09:00", endTime: "12:00", isRecurring: false },
    { id: 2, startTime: "14:00", endTime: "17:00", isRecurring: true },
  ]);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    isRecurring: false,
  });
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    return days;
  };

  const addTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      const id = Math.max(...timeSlots.map((s) => s.id), 0) + 1;
      setTimeSlots([...timeSlots, { ...newSlot, id }]);
      setNewSlot({ startTime: "", endTime: "", isRecurring: false });
      setShowAddSlot(false);
    }
  };

  const removeTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const navigateMonth = (dir) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedDate(newDate);
  };

  const formatDate = (date) =>
    `${dayNames[date.getDay()]}, ${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
     <Sidebar/>
      {/* Main Content */}
      <main className="pt-20 lg:pt-0 flex-1 ">
      {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Set Availability
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your available time slots
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Calendar + Stats */}
            <div className="order-1 lg:order-none">
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Calendar
                </h2>
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ‹
                  </button>
                  <span className="font-semibold">
                    {monthNames[selectedDate.getMonth()]}{" "}
                    {selectedDate.getFullYear()}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        day &&
                        setSelectedDate(
                          new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            day
                          )
                        )
                      }
                      className={`h-8 rounded text-sm flex items-center justify-center 
                        ${day ? "hover:bg-blue-100" : ""} 
                        ${
                          day === selectedDate.getDate()
                            ? "bg-blue-600 text-white"
                            : "text-gray-700"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {timeSlots.length}
                  </div>
                  <div className="text-sm text-blue-600">Time Slots</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {timeSlots.filter((s) => s.isRecurring).length}
                  </div>
                  <div className="text-sm text-green-600">Recurring</div>
                </div>
              </div>
            </div>

            {/* Right Side: Slot List + Templates */}
            <div className="lg:col-span-2 order-0 lg:order-none">
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-lg font-medium text-gray-900">
                      Availability for {formatDate(selectedDate)}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Set your available time slots for appointments
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddSlot(true)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm justify-center sm:justify-start"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No time slots added for this day
                  </div>
                ) : (
                  timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-lg mb-3"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            {slot.isRecurring
                              ? "Recurring weekly"
                              : "One-time slot"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {slot.isRecurring && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Recurring
                          </span>
                        )}
                        <button
                          onClick={() => removeTimeSlot(slot.id)}
                          className="hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {showAddSlot && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Add New Time Slot</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={newSlot.startTime}
                          onChange={(e) =>
                            setNewSlot({
                              ...newSlot,
                              startTime: e.target.value,
                            })
                          }
                          className="border px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={newSlot.endTime}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, endTime: e.target.value })
                          }
                          className="border px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2 sm:pt-6">
                        <input
                          type="checkbox"
                          checked={newSlot.isRecurring}
                          onChange={(e) =>
                            setNewSlot({
                              ...newSlot,
                              isRecurring: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Recurring weekly
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={addTimeSlot}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Add Slot
                      </button>
                      <button
                        onClick={() => setShowAddSlot(false)}
                        className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Quick Templates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() =>
                      setTimeSlots([
                        {
                          id: 1,
                          startTime: "09:00",
                          endTime: "12:00",
                          isRecurring: true,
                        },
                        {
                          id: 2,
                          startTime: "13:00",
                          endTime: "17:00",
                          isRecurring: true,
                        },
                      ])
                    }
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Standard Day
                  </button>
                  <button
                    onClick={() =>
                      setTimeSlots([
                        {
                          id: 1,
                          startTime: "09:00",
                          endTime: "13:00",
                          isRecurring: true,
                        },
                      ])
                    }
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Half Day
                  </button>
                  <button
                    onClick={() => setTimeSlots([])}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
      </main>
    </div>
  );
};

export default SetAvailability;
