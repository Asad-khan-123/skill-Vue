import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Attendance from './pages/Attendance';
import Student from './pages/Student';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Results from './pages/Results';
import Settings from './pages/Settings';

const App = () => {
  const { token, loading } = useAuth();

  if (loading) return null; // Or a spinner

  const role = localStorage.getItem("role") || "ADMIN";

  return (
    <Routes>
      <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes mapped inside Sidebar Layout */}
      <Route element={token ? <Sidebar /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={role === "ADMIN" ? <AdminDashboard /> : <StudentDashboard />} />
        <Route path="/students" element={role === "ADMIN" ? <Student /> : <Navigate to="/dashboard" />} />
        <Route path="/attendance" element={ <Attendance /> } />
        <Route path="/fees" element={<Fees />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/results" element={<Results />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;