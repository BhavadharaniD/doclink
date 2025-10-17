// components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


const Sidebar = ({ patientName, patientId }) => {
      const { user } = useContext(UserContext);

  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
      <div className="font-bold text-xl mb-6 text-[#2D6CDF]">DocLink</div>
      <nav className="space-y-4 text-gray-700">
        <NavLink to="/dashboard" className="block hover:text-[#2D6CDF]">Dashboard</NavLink>
        <NavLink to="/doctors" className="block hover:text-[#2D6CDF]">Doctors</NavLink>
        <NavLink to="/appointments" className="block hover:text-[#2D6CDF]">Appointments</NavLink>
        <NavLink to="/prescriptions" className="block hover:text-[#2D6CDF]">Prescription & Records</NavLink>
        <NavLink to="/billing" className="block hover:text-[#2D6CDF]">Billing & Payments</NavLink>
      </nav>

      {/* Dynamic profile info */}
      <div className="mt-10 pt-6 border-t text-sm text-gray-500">
        Logged in as <span className="font-semibold text-[#2D6CDF]">{user.name}</span><br />
        ID: {user.userId}
      </div>
    </aside>
  );
};

export default Sidebar;