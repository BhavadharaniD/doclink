import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  const [appointment, setAppointment] = useState(null);
  const [labResult, setLabResult] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('doclinkToken');
  const userId = localStorage.getItem('userId');
  const userName = 'Bhavadharani'; // You can fetch this dynamically later

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [appointmentRes, labRes, prescriptionRes, metricsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointment/user/${userId}`, config),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/labresults/patient/${userId}`, config),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/patient/${userId}`, config),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/healthmetrics/${userId}`, config),
        ]);

        if (!cancelled) {
          setAppointment(appointmentRes.data?.[0] ?? null);
          setLabResult(labRes.data?.[0] ?? null);
          setPrescription(prescriptionRes.data?.[0] ?? null);
          setMetrics(metricsRes.data ?? {});
        }
      } catch (error) {
        if (!cancelled) toast.error('Failed to load dashboard data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  const handleLogout = () => {
    localStorage.removeItem('doclinkToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#2D6CDF] text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2D6CDF]">
            Welcome back {userName}! DocLink: Your health review for {formatFullDate(new Date())}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card
            icon="📅"
            title="Upcoming Appointment"
            content={appointment?.date ? formatDateTime(appointment.date) : 'No upcoming appointments'}
          />
          <Card
            icon="🧪"
            title="Recent Lab Result"
            content={labResult?.summary || 'No recent results'}
            buttonLabel="View all values"
          />
          <Card
            icon="💊"
            title="Last Prescription"
            content={prescription?.medication ? `${prescription.medication} (${prescription.status})` : 'No prescriptions found'}
            buttonLabel="View"
          />
        </div>

        {/* Health Metrics */}
        {metrics && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#2D6CDF] mb-4">Health Metrics</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard label="Blood Pressure" value={`${metrics.bloodPressure ?? 'N/A'} mmHg`} />
              <MetricCard label="Blood Sugar" value={`${metrics.bloodSugar ?? 'N/A'} mg/dL`} />
              <MetricCard label="BMI" value={`${metrics.bmi ?? 'N/A'} kg/m²`} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Card with optional icon and button
const Card = ({ icon, title, content, buttonLabel }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
    <div>
      <div className="text-3xl mb-2">{icon || '📌'}</div>
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-gray-700">{content}</p>
    </div>
    {buttonLabel && (
      <button className="mt-4 text-[#2D6CDF] font-medium hover:underline">{buttonLabel}</button>
    )}
  </div>
);

// Metric card
const MetricCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="font-semibold text-lg mb-2">{label}</h3>
    <p className="text-gray-700 text-xl">{value}</p>
  </div>
);

// Format date
const formatDateTime = (isoDate) => {
  if (!isoDate) return null;
  return new Date(isoDate).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatFullDate = (date) => {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default Dashboard;