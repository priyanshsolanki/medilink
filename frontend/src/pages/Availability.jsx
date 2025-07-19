import React, { useState } from "react";
import { Calendar, Clock, Plus, X, Save, ArrowLeft } from "lucide-react";

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

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
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

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const addTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      const id = Math.max(...timeSlots.map((slot) => slot.id), 0) + 1;
      setTimeSlots([...timeSlots, { ...newSlot, id }]);
      setNewSlot({ startTime: "", endTime: "", isRecurring: false });
      setShowAddSlot(false);
    }
  };

  const removeTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return `${daysOfWeek[date.getDay()]}, ${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Set Availability
              </h1>
              <p className="text-gray-600">Manage your available time slots</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
              </div>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <span className="text-gray-600">‹</span>
                </button>
                <span className="font-medium text-gray-900">
                  {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <span className="text-gray-600">›</span>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div
                    key={day}
                    className="text-xs font-medium text-gray-500 text-center py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
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
                    className={`
                      h-8 text-sm rounded flex items-center justify-center
                      ${day ? "hover:bg-blue-50" : ""}
                      ${
                        day === selectedDate.getDate() &&
                        selectedDate.getMonth() === new Date().getMonth() &&
                        selectedDate.getFullYear() === new Date().getFullYear()
                          ? "bg-blue-600 text-white"
                          : ""
                      }
                      ${day ? "text-gray-900" : "text-gray-300"}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {timeSlots.length}
                </div>
                <div className="text-sm text-blue-600">Time Slots</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {timeSlots.filter((slot) => slot.isRecurring).length}
                </div>
                <div className="text-sm text-green-600">Recurring</div>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Availability for {formatDate(selectedDate)}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Set your available time slots for appointments
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddSlot(true)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Time Slots */}
                <div className="space-y-4">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
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
                      <div className="flex items-center gap-2">
                        {slot.isRecurring && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Recurring
                          </span>
                        )}
                        <button
                          onClick={() => removeTimeSlot(slot.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {timeSlots.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No time slots set for this day</p>
                      <p className="text-sm">Click "Add Slot" to get started</p>
                    </div>
                  )}
                </div>

                {/* Add New Slot Form */}
                {showAddSlot && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Add New Time Slot
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newSlot.isRecurring}
                            onChange={(e) =>
                              setNewSlot({
                                ...newSlot,
                                isRecurring: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Recurring weekly
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={addTimeSlot}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add Slot
                      </button>
                      <button
                        onClick={() => {
                          setShowAddSlot(false);
                          setNewSlot({
                            startTime: "",
                            endTime: "",
                            isRecurring: false,
                          });
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Templates */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Quick Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    const template = [
                      {
                        id: Date.now() + 1,
                        startTime: "09:00",
                        endTime: "12:00",
                        isRecurring: true,
                      },
                      {
                        id: Date.now() + 2,
                        startTime: "13:00",
                        endTime: "17:00",
                        isRecurring: true,
                      },
                    ];
                    setTimeSlots(template);
                  }}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-sm text-gray-900">
                    Standard Day
                  </div>
                  <div className="text-xs text-gray-500">
                    9:00-12:00, 13:00-17:00
                  </div>
                </button>
                <button
                  onClick={() => {
                    const template = [
                      {
                        id: Date.now() + 1,
                        startTime: "09:00",
                        endTime: "13:00",
                        isRecurring: true,
                      },
                    ];
                    setTimeSlots(template);
                  }}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-sm text-gray-900">
                    Half Day
                  </div>
                  <div className="text-xs text-gray-500">9:00-13:00</div>
                </button>
                <button
                  onClick={() => setTimeSlots([])}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-sm text-gray-900">
                    Clear All
                  </div>
                  <div className="text-xs text-gray-500">Remove all slots</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetAvailability;
