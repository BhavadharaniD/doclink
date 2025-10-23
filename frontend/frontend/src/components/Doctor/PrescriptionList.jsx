import React from 'react';

const PrescriptionList = ({ prescriptions }) => {
  if (!prescriptions || prescriptions.length === 0)
    return <p className="text-gray-500">No prescriptions found.</p>;

  return (
    <div className="space-y-4">
      {prescriptions.map(pres => (
        <div key={pres._id} className="border rounded p-4 shadow hover:shadow-md">
          <h3 className="font-semibold">{pres.templateUsed || 'Prescription'}</h3>
          <p><strong>Date:</strong> {new Date(pres.createdAt).toLocaleDateString()}</p>
          <p><strong>Instructions:</strong> {pres.instructions}</p>
          <p><strong>Notes:</strong> {pres.notes}</p>
          <div>
            <strong>Medicines:</strong>
            <ul className="list-disc ml-6">
              {pres.medicines.map((m, i) => (
                <li key={i}>{m.name} - {m.dosage}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionList;
