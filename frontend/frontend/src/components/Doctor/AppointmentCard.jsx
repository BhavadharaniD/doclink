import { PencilSquareIcon, CheckCircleIcon, XCircleIcon, CalendarDaysIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

const AppointmentCard = ({ appointment, type, onApprove, onReject, onAddNotes }) => {
  const { userId, time, date, reason, status, _id } = appointment;

  return (
    <div className={`p-4 rounded-lg shadow-md transition ${status === "pending" ? "bg-yellow-100 hover:bg-yellow-200" : "bg-green-100 hover:bg-green-200"}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">{userId?.name}</p>
          <p className="text-sm text-gray-600 flex items-center"><CalendarDaysIcon className="h-4 w-4 mr-1" /> {new Date(date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Reason: {reason || "N/A"}</p>
          {type === "confirmed" && <p className="text-sm text-gray-600 flex items-center"><ClockIcon className="h-4 w-4 mr-1" /> {time}</p>}
        </div>

        {type === "pending" ? (
          <div className="flex gap-2">
            <button onClick={() => onApprove(_id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" /> Approve
            </button>
            <button onClick={() => onReject(_id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center">
              <XCircleIcon className="h-4 w-4 mr-1" /> Reject
            </button>
          </div>
        ) : (
          <button onClick={() => onAddNotes(_id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center">
            <PencilSquareIcon className="h-4 w-4 mr-1" /> Add Notes
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;