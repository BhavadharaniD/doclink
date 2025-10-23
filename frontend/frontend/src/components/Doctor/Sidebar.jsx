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
    <div className="w-64 h-screen shadow-lg flex flex-col bg-blue-600 text-white">
      {/* Logo */}
      <div className="p-6 font-bold text-2xl border-b border-blue-700 flex items-center justify-center">
        DocLink
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-4 mx-3 mb-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[7002D6CDF] text-white shadow-md'
                    : 'text-gray-200 hover:bg-[7002D6CDF] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer or extra space */}
      <div className="p-4 border-t border-blue-700 text-gray-300 text-sm">
        &copy; 2025 DocLink
      </div>
    </div>
  );
};

export default Sidebar;
