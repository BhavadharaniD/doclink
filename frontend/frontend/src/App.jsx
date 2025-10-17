import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ User pages
import LoginPage from './pages/User/LoginPage';
import Dashboard from './pages/User/Dashboard';
import Doctors from './pages/User/Doctors';
import Appointments from './pages/User/Appointments';

// ✅ Doctor pages
import DoctorLoginPage from './pages/Doctor/LoginPage';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AppointmentsDashboard from './pages/Doctor/AppointmentsDashboard';
import PatientPage from './pages/Doctor/PatientPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>

          {/* ---------- USER SIDE ---------- */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />

          {/* ---------- DOCTOR SIDE ---------- */}
          <Route path="/doctor/login" element={<DoctorLoginPage />} />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/doctor/appointments" element={<AppointmentsDashboard />} />
          <Route path="/doctor/patients" element={<PatientPage/>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
