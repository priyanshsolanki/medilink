import React, { useState } from "react";
import {
  Bell,
  Calendar,
  Clock,
  User,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  Lock,
  Check,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    reminders: true,
  });

  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account and application preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                1
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Active Sessions
                    </p>
                    <p className="text-2xl font-bold text-blue-900">3</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Data Backup
                    </p>
                    <p className="text-2xl font-bold text-green-900">✓</p>
                  </div>
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Calendar Preview */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                June 2025
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  <div className="font-medium text-gray-500 p-1">S</div>
                  <div className="font-medium text-gray-500 p-1">M</div>
                  <div className="font-medium text-gray-500 p-1">T</div>
                  <div className="font-medium text-gray-500 p-1">W</div>
                  <div className="font-medium text-gray-500 p-1">T</div>
                  <div className="font-medium text-gray-500 p-1">F</div>
                  <div className="font-medium text-gray-500 p-1">S</div>

                  {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                  ].map((day) => (
                    <div
                      key={day}
                      className={`p-1 rounded ${
                        day === 27
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Profile Settings
              </h2>
              <p className="text-gray-600">
                Manage your personal information and account preferences
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="Dr. Sarah Johnson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="sarah.johnson@clinic.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>General Medicine</option>
                      <option>Cardiology</option>
                      <option>Dermatology</option>
                      <option>Pediatrics</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive appointment updates via email
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={notifications.email}
                      onChange={() => handleNotificationChange("email")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Get text message reminders
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={notifications.sms}
                      onChange={() => handleNotificationChange("sms")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Push Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Browser notifications for urgent updates
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={notifications.push}
                      onChange={() => handleNotificationChange("push")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Appointment Reminders
                        </p>
                        <p className="text-sm text-gray-500">
                          Automatic reminders 24 hours before appointments
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={notifications.reminders}
                      onChange={() => handleNotificationChange("reminders")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Working Hours */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Working Hours
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={workingHours.start}
                        onChange={(e) =>
                          setWorkingHours((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={workingHours.end}
                        onChange={(e) =>
                          setWorkingHours((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="grid grid-cols-7 gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <button
                            key={day}
                            className={`px-2 py-2 rounded-lg text-xs font-medium ${
                              ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {day}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Auto-sync Calendar
                        </p>
                        <p className="text-sm text-gray-500">
                          Sync with external calendars
                        </p>
                      </div>
                      <ToggleSwitch checked={true} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Show Availability
                        </p>
                        <p className="text-sm text-gray-500">
                          Display your status to patients
                        </p>
                      </div>
                      <ToggleSwitch checked={false} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Auto-confirm
                        </p>
                        <p className="text-sm text-gray-500">
                          Automatically confirm appointments
                        </p>
                      </div>
                      <ToggleSwitch checked={true} onChange={() => {}} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Security
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          Change Password
                        </p>
                        <p className="text-sm text-gray-500">
                          Update your account password
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Enabled
                    </span>
                  </button>
                </div>
              </div>

              {/* Privacy & Data */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Privacy & Data
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <p className="font-medium text-gray-900">
                        Data Encryption
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      All data is encrypted at rest and in transit
                    </p>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <p className="font-medium text-gray-900">Data Location</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Your data is stored in North America
                    </p>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Compliant
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Lock className="w-5 h-5 text-purple-600" />
                      <p className="font-medium text-gray-900">Access Logs</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Track who accessed your account
                    </p>
                    <div className="mt-2">
                      <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                        View Logs
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
