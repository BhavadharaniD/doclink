import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar.jsx';
import BookAppointment from '../../components/BookAppointment.jsx'; 
import assets from '../../../public/assets.js';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null); 
  const token = localStorage.getItem('doclinkToken');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err.response?.data || err.message);
      }
    };

    fetchDoctors();
  }, [token]);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeciality = specialityFilter === 'All' || doc.speciality === specialityFilter;
    return matchesSearch && matchesSpeciality;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#2D6CDF] mb-6">Find Your Doctor</h1>

        {/* 🔍 Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by doctor or speciality"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="All">All Specialities</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            {/* Add more as needed */}
          </select>
        </div>

        {/* 🧑‍⚕️ Doctor Cards */}
        <div className="space-y-6">
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="flex items-center justify-between bg-white p-6 rounded-xl shadow hover:shadow-lg transition w-full">
              {/* 🖼️ Doctor Image */}
              <img
                src={assets.dummy}
                alt={doc.name}
                className="w-24 h-24 rounded-full object-cover border"
              />

              {/* 📋 Doctor Details */}
              <div className="flex-1 ml-6">
                <h2 className="text-xl font-semibold text-[#2D6CDF]">{doc.name}</h2>
                <p className="text-gray-700">{doc.speciality}</p>
                <p className="text-yellow-500 mt-1">★★★★★ ({doc.reviews || 0} reviews)</p>
                <p className="mt-2 text-sm text-gray-600">
                  Next available: {formatDateTime(doc.nextAvailable)}
                </p>
              </div>

              {/* 📅 Book Button aligned right */}
              <div>
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="bg-[#2D6CDF] text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 📋 Booking Form Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl relative">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <BookAppointment doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const formatDateTime = (isoDate) => {
  if (!isoDate) return 'N/A';
  return new Date(isoDate).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default Doctors;