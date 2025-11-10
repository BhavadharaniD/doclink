import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/Doctor/Sidebar";
import CalendarPanel from "../../components/CalendarPanel"; // fixed typo
import AppointmentCard from "../../components/AppointmentCard";
import Tabs from "../../components/Tabs";

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("pending");
  const doctorId = localStorage.getItem("userId");
  const token = localStorage.getItem("doclinkToken");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/appointment/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, [doctorId, token, API_BASE]);

  const filterByDate = (date) => {
    return appointments.filter((app) => {
      const appDate = new Date(app.date);
      return (
        appDate.getFullYear() === date.getFullYear() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getDate() === date.getDate()
      );
    });
  };

  const todaysAppointments = filterByDate(selectedDate);
  const pending = todaysAppointments.filter((a) => a.status === "pending");
  const confirmed = todaysAppointments.filter((a) => a.status === "confirmed");

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/appointment/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Appointment approved!");
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: "confirmed" } : a));
    } catch {
      toast.error("Failed to approve appointment");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/appointment/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info("Appointment rejected");
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch {
      toast.error("Failed to reject appointment");
    }
  };

  const handleAddNotes = async (id) => {
    const notes = prompt("Enter notes for this appointment:");
    if (!notes) return;

    try {
      await axios.put(`${API_BASE}/api/appointment/${id}/notes`, { notes }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notes added successfully!");
    } catch {
      toast.error("Failed to add notes");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800">Appointments Dashboard</h2>

        {/* Calendar + Upcoming */}
        <div className="flex flex-col md:flex-row gap-6">
          <CalendarPanel selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <div className="bg-white rounded-xl shadow-md p-4 w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Upcoming Confirmed Appointments</h3>
            {confirmed.length > 0 ? (
              confirmed.map(a => (
                <AppointmentCard
                  key={a._id}
                  appointment={a}
                  type="confirmed"
                  onAddNotes={handleAddNotes}
                />
              ))
            ) : (
              <p className="text-gray-500">No confirmed appointments today</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="space-y-4 mt-4">
            {(activeTab === "pending" ? pending : confirmed).map(a => (
              <AppointmentCard
                key={a._id}
                appointment={a}
                type={activeTab}
                onApprove={handleApprove}
                onReject={handleReject}
                onAddNotes={handleAddNotes}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentsDashboard;
