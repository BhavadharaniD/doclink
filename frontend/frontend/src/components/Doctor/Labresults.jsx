import React from 'react';

const LabResultsSection = ({ labResults }) => {
  if (!labResults || labResults.length === 0)
    return <p className="text-gray-500 mt-2">No lab results found.</p>;

  return (
    <div className="mt-4 space-y-3">
      {labResults.map(lab => (
        <div key={lab._id} className="border p-3 rounded shadow hover:shadow-md flex justify-between items-center">
          <div>
            <p className="font-medium">{lab.fileName}</p>
            <p className="text-sm text-gray-600">Uploaded: {new Date(lab.uploadedAt).toLocaleDateString()}</p>
            {lab.remarks && <p className="text-sm text-gray-700 truncate">Remarks: {lab.remarks}</p>}
          </div>
          <a
            href={lab.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default LabResultsSection;
