import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Activity,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("appointments");

  // Sample data for analytics
  const appointmentData = [
    {
      date: "Mon",
      appointments: 12,
      completed: 10,
      cancelled: 2,
      revenue: 1200,
    },
    {
      date: "Tue",
      appointments: 15,
      completed: 13,
      cancelled: 2,
      revenue: 1550,
    },
    {
      date: "Wed",
      appointments: 18,
      completed: 16,
      cancelled: 2,
      revenue: 1800,
    },
    {
      date: "Thu",
      appointments: 14,
      completed: 12,
      cancelled: 2,
      revenue: 1400,
    },
    {
      date: "Fri",
      appointments: 20,
      completed: 18,
      cancelled: 2,
      revenue: 2000,
    },
    { date: "Sat", appointments: 8, completed: 7, cancelled: 1, revenue: 800 },
    { date: "Sun", appointments: 5, completed: 4, cancelled: 1, revenue: 500 },
  ];

  const monthlyData = [
    { month: "Jan", patients: 120, appointments: 340, revenue: 34000 },
    { month: "Feb", patients: 135, appointments: 380, revenue: 38000 },
    { month: "Mar", patients: 150, appointments: 420, revenue: 42000 },
    { month: "Apr", patients: 165, appointments: 460, revenue: 46000 },
    { month: "May", patients: 180, appointments: 500, revenue: 50000 },
    { month: "Jun", patients: 195, appointments: 540, revenue: 54000 },
  ];

  const appointmentTypeData = [
    { name: "Consultation", value: 45, color: "#3B82F6" },
    { name: "Follow-up", value: 30, color: "#10B981" },
    { name: "Emergency", value: 15, color: "#F59E0B" },
    { name: "Procedure", value: 10, color: "#EF4444" },
  ];

  const patientAgeData = [
    { ageGroup: "0-18", count: 25 },
    { ageGroup: "19-35", count: 45 },
    { ageGroup: "36-50", count: 60 },
    { ageGroup: "51-65", count: 40 },
    { ageGroup: "65+", count: 30 },
  ];

  const topConditions = [
    { condition: "Hypertension", count: 45, percentage: 22.5 },
    { condition: "Diabetes", count: 38, percentage: 19.0 },
    { condition: "Anxiety", count: 32, percentage: 16.0 },
    { condition: "Arthritis", count: 28, percentage: 14.0 },
    { condition: "Asthma", count: 25, percentage: 12.5 },
  ];

  const keyMetrics = [
    {
      title: "Total Appointments",
      value: "1,847",
      change: "+12.5%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Patients",
      value: "524",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "green",
    },
    {
      title: "Average Wait Time",
      value: "12 min",
      change: "-5.3%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Monthly Revenue",
      value: "$54,000",
      change: "+15.8%",
      trend: "up",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Activity,
      color: "emerald",
    },
    {
      title: "No-Show Rate",
      value: "5.8%",
      change: "-1.2%",
      trend: "down",
      icon: TrendingUp,
      color: "red",
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
      purple: "text-purple-600",
      emerald: "text-emerald-600",
      red: "text-red-600",
    };
    return colors[color] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Track your practice performance and patient insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent
                    className={`w-6 h-6 ${getIconColor(metric.color)}`}
                  />
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p
                    className={`text-sm font-medium ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    {metric.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Daily Appointments
              </h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="appointments">Total Appointments</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Monthly Growth
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New Patients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Appointment Types */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Appointment Types
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Patient Age Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Patient Age Groups
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={patientAgeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Conditions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Top Medical Conditions
            </h2>
            <div className="space-y-4">
              {topConditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {condition.condition}
                      </span>
                      <span className="text-sm text-gray-600">
                        {condition.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${condition.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New patient registered
                  </p>
                  <p className="text-xs text-gray-600">
                    Sarah Johnson - 2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Appointment completed
                  </p>
                  <p className="text-xs text-gray-600">
                    Michael Chen - 15 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Appointment rescheduled
                  </p>
                  <p className="text-xs text-gray-600">
                    Emily Rodriguez - 1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Payment received
                  </p>
                  <p className="text-xs text-gray-600">
                    $150 from David Wilson - 2 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Performance Summary
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Patient Satisfaction
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    4.8/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "96%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Appointment Efficiency
                  </span>
                  <span className="text-sm font-bold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Revenue Target
                  </span>
                  <span className="text-sm font-bold text-purple-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "87%" }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">98.5%</p>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">2.3s</p>
                    <p className="text-xs text-gray-600">Avg Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
