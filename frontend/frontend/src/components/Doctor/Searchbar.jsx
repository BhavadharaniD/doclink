import React, { useState } from 'react';

const PatientSearchBar = ({ patients = [], onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients by search query
  const filteredPatients = Array.isArray(patients)
    ? patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search active patients..."
        className="w-full p-2 border rounded shadow"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul className="mt-2">
        {filteredPatients.map((p) => (
          <li
            key={p._id}
            className="cursor-pointer p-2 hover:bg-gray-200 rounded"
            onClick={() => onSelect(p)}
          >
            {p.name} ({p.email})
          </li>
        ))}
        {filteredPatients.length === 0 && (
          <li className="text-gray-500 p-2">No patients found.</li>
        )}
      </ul>
    </div>
  );
};

export default PatientSearchBar;
