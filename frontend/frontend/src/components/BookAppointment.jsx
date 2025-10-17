import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BookAppointment = ({ doctor, onClose, appointmentToEdit }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("doclinkToken");

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    phone: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    if (user) setUserDetails({ name: user.name || "", email: user.email || "" });
  }, [user]);

  useEffect(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const label = nextDay.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
      const value = nextDay.toISOString().split("T")[0];
      days.push({ label, value });
    }
    setDaysOfWeek(days);
  }, []);

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        date: appointmentToEdit.date,
        time: appointmentToEdit.time,
        reason: appointmentToEdit.reason || "",
        phone: appointmentToEdit.phone || "",
        age: appointmentToEdit.age || "",
        gender: appointmentToEdit.gender || "",
      });
    }
  }, [appointmentToEdit]);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, time, reason } = formData;

    if (!date || !time || !reason) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      if (appointmentToEdit) {
        // Reschedule
        const res = await axios.put(`${API_BASE}/api/appointment/reschedule/${appointmentToEdit._id}`,
          { date, time, reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Appointment rescheduled!");
      } else {
        // New booking
        await axios.post(`${API_BASE}/api/appointment/book`,
          { doctorId: doctor._id, date, time, reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Appointment booked successfully!");
      }
      onClose();
      navigate("/appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 font-sans">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">✕</button>

        <h2 className="text-2xl font-bold text-center text-[#2D6CDF] mb-4">
          {appointmentToEdit ? "Reschedule Appointment" : "Book Appointment"}
        </h2>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
          <p className="text-lg font-semibold text-blue-800">{doctor?.name}</p>
          <p className="text-sm text-blue-600">{doctor?.speciality}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={userDetails.name} readOnly className="border rounded-lg p-2 bg-gray-100 text-gray-700" />
            <input type="email" value={userDetails.email} readOnly className="border rounded-lg p-2 bg-gray-100 text-gray-700" />
          </div>

          <textarea
            name="reason"
            placeholder="Describe your symptoms or reason for visit"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 resize-none"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="date" value={formData.date} onChange={handleChange} className="border rounded-lg p-2">
              <option value="">Select Appointment Date</option>
              {daysOfWeek.map((day, i) => <option key={i} value={day.value}>{day.label}</option>)}
            </select>

            <select name="time" value={formData.time} onChange={handleChange} className="border rounded-lg p-2">
              <option value="">Select Time Slot</option>
              {timeSlots.map((slot, i) => <option key={i} value={slot}>{slot}</option>)}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="bg-[#2D6CDF] text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              {loading ? "Processing..." : appointmentToEdit ? "Reschedule" : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
