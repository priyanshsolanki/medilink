import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AlarmClock, BellDot, Mail, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const [date, setDate] = useState(new Date());
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    push: true,
    reminder: true,
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const appointments = [
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "Michael Chen" },
  ];

  const toggleNotification = (type) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Sidebar - Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
        <div className="relative flex flex-col w-80 max-w-xs h-full bg-white">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Manage your Profile Settings and Preferences
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-500 text-white p-4 rounded-lg">
                <div className="text-sm">Today's Appointments</div>
                <div className="text-2xl font-bold">{appointments.length}</div>
              </div>
              <div className="bg-green-500 text-white p-4 rounded-lg">
                <div className="text-sm">Completed</div>
                <div className="text-2xl font-bold">8</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <Link
                    to="/availability"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="mr-2">📅</span> Set Availability
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patient-directory"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="mr-2">👥</span> Patient Directory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analytics"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="mr-2">📊</span> Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="mr-2">⚙️</span> Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Calendar - Now visible in mobile sidebar */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">
                {date.toLocaleString("default", { month: "long" })}{" "}
                {date.getFullYear()}
              </h3>
              <Calendar
                value={date}
                onChange={setDate}
                className="!border-none !shadow-none !bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-shrink-0 w-80 bg-white border-r border-gray-200 p-6 flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-gray-600 text-sm">
              Manage your Profile Settings and Preferences
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <div className="text-sm">Today's Appointments</div>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <div className="text-sm">Completed</div>
              <div className="text-2xl font-bold">8</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <Link
                  to="/availability"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <span className="mr-2">📅</span> Set Availability
                </Link>
              </li>
              <li>
                <Link
                  to="/patient-directory"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <span className="mr-2">👥</span> Patient Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <span className="mr-2">📊</span> Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <span className="mr-2">⚙️</span> Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {date.toLocaleString("default", { month: "long" })}{" "}
            {date.getFullYear()}
          </h3>
          <Calendar
            value={date}
            onChange={setDate}
            className="!border-none !shadow-none !bg-transparent"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600 mb-6">
          Manage your account and application preferences
        </p>

        {/* Profile Section */}
        <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-xl font-semibold mb-1">Profile Settings</h3>
          <p className="text-gray-600 mb-4">
            Manage your personal information and account preferences
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Dr. Sarah Johnson"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="sarah.johnson@clinic.com"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Specialty
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>General Medicine</option>
                <option>Cardiology</option>
                <option>Neurology</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { key: "email", label: "Email Notifications", icon: Mail },
              { key: "sms", label: "SMS Notifications", icon: Phone },
              { key: "push", label: "Push Notifications", icon: BellDot },
              {
                key: "reminder",
                label: "Appointment Reminders",
                icon: AlarmClock,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs[item.key]}
                    onChange={() => toggleNotification(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
