import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Sidebar = ({ patientName, patientId }) => {
  const { user } = useContext(UserContext);

  return (
    <aside className="w-64 h-screen bg-blue-700 shadow-lg p-6 hidden md:flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="font-bold text-2xl mb-8 text-white tracking-wide">  DocLink</div>

        {/* Navigation */}
        <nav className="space-y-3">
          {[
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Doctors', path: '/doctors' },
            { name: 'Appointments', path: '/appointments' },
            { name: 'Prescription & Records', path: '/prescriptions' },
            { name: 'Billing & Payments', path: '/billing' },
          ].map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-blue-700 font-semibold'
                    : 'text-white hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Profile Info */}
      <div className="mt-10 pt-6 border-t border-blue-500 text-sm text-blue-100">
        Logged in as{' '}
        <span className="font-semibold text-white">{user.name}</span>
        <br />
        ID: {user.userId}
      </div>
    </aside>
  );
};

export default Sidebar;