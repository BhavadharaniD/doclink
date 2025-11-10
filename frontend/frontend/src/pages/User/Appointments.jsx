import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import BookAppointment from "../../components/BookAppointment"; // make sure the path is correct

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("doclinkToken");

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/appointment/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err.response?.data || err.message);
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, [userId, token]);

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`${API_BASE}/api/appointment/cancel/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Appointment canceled successfully!");
      setAppointments(prev => prev.filter(appt => appt._id !== appointmentId));
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
      toast.error("Failed to cancel appointment");
    }
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2D6CDF]">My Appointments</h1>
        </div>

        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="space-y-6">
            {appointments.map((appt) => (
              <div key={appt._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold text-[#2D6CDF]">
                  Dr. {appt.doctorId?.name || "N/A"}
                </h2>
                <p className="text-gray-700">{appt.doctorId?.speciality || "N/A"}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {formatDate(appt.date)} | Time: {appt.time}
                </p>
                <p className="text-sm text-green-600 mt-1">Status: {appt.status}</p>

                <div className="mt-4 flex gap-4">
                  {appt.status === "pending" && (
                    <button
                      onClick={() => setRescheduleAppt(appt)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Reschedule
                    </button>
                  )}
                  {appt.status !== "completed" && appt.status !== "canceled" && (
                    <button
                      onClick={() => cancelAppointment(appt._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {rescheduleAppt && (
          <BookAppointment
            doctor={rescheduleAppt.doctorId}
            appointmentToEdit={rescheduleAppt}
            onClose={() => setRescheduleAppt(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Appointments;
