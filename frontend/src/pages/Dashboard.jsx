import React, { useState, useEffect } from 'react';
import { getAppointmentsByDoctor } from '../api/appointmentService';
import { getDoctorAvailability } from '../api/availabilityService';
import userService from './../api/userService';
import Sidebar from '../components/Sidebar';
import {
  Calendar,
  Users,
  Clock,
  Settings,
  Activity,
  Bell,
  Plus,
  UserCheck,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const {authUser} = useAuth();
  const [stats, setStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patients, appointments, availability] = await Promise.all([
          userService.getAllPatients(),
          getAppointmentsByDoctor(authUser.id),
          getDoctorAvailability(authUser.id)
        ]);

        setUpcomingAppointments(appointments)
  
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointments.filter(appt => appt.date === today);
  
        const totalAvailableSlots = Object.values(availability.availability || {}).flat().length;
  
        setStats([
          {
            title: "Today's Appointments",
            value: todaysAppointments.length,
            icon: Calendar,
            color: 'bg-blue-500'
          },
          {
            title: "Total Patients",
            value: patients.length,
            icon: Users,
            color: 'bg-green-500'
          },
          {
            title: "Available Hours",
            value: totalAvailableSlots / 2, // if 30-min slots = 0.5h
            icon: Clock,
            color: 'bg-purple-500'
          },
          {
            title: "Pending Reviews",
            value: 0, // update once you implement a reviews model
            icon: AlertCircle,
            color: 'bg-orange-500'
          }
        ]);
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [authUser.id]);
  
  const quickActions = [
    { title: 'Schedule Appointment', icon: Calendar, path: '/doctor/appointment' },
    { title: 'View Patients', icon: Users, path: '/patient-directory' },
    { title: 'Set Availability', icon: Clock, path: '/availability' },
    { title: 'Settings', icon: Settings, path: '/settings' }
  ];


  const StatCard = ({ stat }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value || '0'}</p>
          <p className="text-sm text-gray-500 mt-1">{stat.change || 'No data'}</p>
        </div>
        <div className={`${stat.color || 'bg-gray-500'} p-3 rounded-lg`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment }) => (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <span className="text-blue-600 font-semibold text-sm">
            {appointment.patient_name ? appointment.patient_name.split(' ').map(n => n[0]).join('') : 'P'}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{appointment?.patientId?.name || 'Unknown Patient'}</p>
          <p className="text-sm text-gray-500">{appointment.type || 'Consultation'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">{appointment.time || 'TBD'}</p>
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {appointment.status || 'pending'}
        </span>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{activity.action || 'No activity'}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time || 'Unknown time'}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar/>
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {authUser.name || 'Doctor'}!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your practice today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              /> */}
            </div>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.length > 0 ? (
            stats.map((stat, index) => <StatCard key={index} stat={stat} />)
          ) : (
            [
              { title: "Today's Appointments", icon: Calendar, color: 'bg-blue-500' },
              { title: 'Total Patients', icon: Users, color: 'bg-green-500' },
              { title: 'Available Hours', icon: Clock, color: 'bg-purple-500' },
              { title: 'Pending Reviews', icon: AlertCircle, color: 'bg-orange-500' }
            ].map((stat, index) => <StatCard key={index} stat={stat} />)
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-700">{action.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate('/doctor/appointment')}>View all</button>
              </div>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <AppointmentCard key={appointment.id || index} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate('/doctor/appointment')}>Schedule an appointment</button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem key={activity.id || index} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
          onClick={() => navigate('/patient-directory?add=true')}
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
