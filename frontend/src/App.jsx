import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { token, loading } = useAuth();

  if (loading) return null; // Or a spinner

  return (
    <Routes>
      <Route path="/" element={!token ? <Login /> : <Navigate to="/home" />} />
      <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;