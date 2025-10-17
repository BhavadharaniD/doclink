import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPanel = ({ selectedDate, setSelectedDate }) => (
  <div className="bg-white rounded-xl shadow-md p-4 w-full md:w-1/2">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Date</h3>
    <Calendar onChange={setSelectedDate} value={selectedDate} className="rounded-lg" />
  </div>
);

export default CalendarPanel;