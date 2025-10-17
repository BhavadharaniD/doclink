// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/doctor/dashboard' },
    { name: 'Appointments', icon: CalendarIcon, path: '/doctor/appointments' },
    { name: 'Patients & Records', icon: UserGroupIcon, path: '/doctor/patients' },
    { name: 'Prescriptions', icon: DocumentTextIcon, path: '/doctor/prescriptions' },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <div className="p-6 font-bold text-xl border-b">Doctor Panel</div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-4 text-gray-700 hover:bg-gray-100 ${
                  isActive ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
