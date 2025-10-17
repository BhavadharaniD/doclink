import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../../components/Doctor/Sidebar';

const DoctorDashboard = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]); // Today's appointments
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [activePatients, setActivePatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billing, setBilling] = useState(null); // placeholder
  const [viewFilter, setViewFilter] = useState('day'); // day, month, year

  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');

  // Helper to compare only YYYY-MM-DD
  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/appointment/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('doclinkToken')}` } }
        );

        const today = new Date();
        const todaysAppointments = data.filter(app => isSameDay(app.date, today));
        const pending = data.filter(app => app.status === 'pending');

        setAppointments(todaysAppointments);
        setPendingAppointments(pending);
        setAllAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Fetch active patients
  useEffect(() => {
    const fetchActivePatients = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/doctor/${doctorId}/active`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('doclinkToken')}` } }
        );
        setActivePatients(data);
      } catch (error) {
        console.error('Error fetching active patients:', error);
      }
    };
    fetchActivePatients();
  }, [doctorId]);

  // Fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('doclinkToken')}` } }
        );
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };
    fetchPrescriptions();
  }, [doctorId]);

  // Appointments graph data
  const appointmentsGraphData = [
    { name: 'Confirmed', count: Number(allAppointments.filter(a => a.status === 'confirmed').length) },
    { name: 'Pending', count: Number(allAppointments.filter(a => a.status === 'pending').length) },
    { name: 'Rescheduled', count: Number(allAppointments.filter(a => a.status === 'rescheduled').length) },
  ];

  // Prescriptions graph data
  let prescriptionsGraphData = [];

  const today = new Date();
  if(viewFilter === 'day'){
    prescriptionsGraphData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayString = date.toISOString().split('T')[0];

      const count = prescriptions.filter(p => {
        const pDate = new Date(p.createdAt).toISOString().split('T')[0];
        return pDate === dayString;
      }).length;

      return { day: dayString, count };
    }).reverse();
  } else if(viewFilter === 'month'){
    // Last 6 months
    prescriptionsGraphData = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const monthString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;

      const count = prescriptions.filter(p => {
        const pDate = new Date(p.createdAt);
        return pDate.getFullYear() === date.getFullYear() && pDate.getMonth() === date.getMonth();
      }).length;

      return { day: monthString, count };
    }).reverse();
  } else if(viewFilter === 'year'){
    // Last 5 years
    prescriptionsGraphData = Array.from({ length: 5 }).map((_, i) => {
      const year = today.getFullYear() - i;
      const count = prescriptions.filter(p => {
        const pDate = new Date(p.createdAt);
        return pDate.getFullYear() === year;
      }).length;

      return { day: year.toString(), count };
    }).reverse();
  }

  return (
  <div className="p-6 space-y-8 flex bg-gray-50 min-h-screen">
    <Sidebar />
    <div className="flex-1 space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">🗓️ Today's Appointments</h3>
          <p className="text-3xl font-bold mt-2 text-blue-800">{appointments.length}</p>
          {appointments[0] && (
            <p className="text-sm text-gray-500 mt-1">Next at <span className="font-medium">{appointments[0].time}</span></p>
          )}
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">⏳ Pending Approvals</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingAppointments.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">👥 Active Patients</h3>
          <p className="text-3xl font-bold mt-2 text-green-700">{activePatients.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">💰 Billing Today</h3>
          <p className="text-2xl mt-2 text-gray-700">
            {billing ? `₹${billing.total}` : <span className="text-gray-400 italic">Coming Soon</span>}
          </p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">📊 Appointments Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentsGraphData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2D6CDF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">📦 Prescriptions Trend</h3>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={viewFilter}
              onChange={e => setViewFilter(e.target.value)}
            >
              <option value="day">Last 7 Days</option>
              <option value="month">Last 6 Months</option>
              <option value="year">Last 5 Years</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={prescriptionsGraphData}>
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/doctor/prescriptions/create')}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
        >
          📝 Create Prescription
        </button>
        <button
          onClick={() => navigate('/doctor/appointments')}
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105"
        >
          📅 View Calendar
        </button>
        <button
          onClick={() => navigate('/doctor/patients')}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition transform hover:scale-105"
        >
          🧪 Check Lab Reports
        </button>
      </div>
    </div>
  </div>
);}
export default DoctorDashboard;