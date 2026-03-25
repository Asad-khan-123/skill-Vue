import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && location.pathname === '/') {
        navigate('/home', { replace: true });
      } else if (!isSignedIn && location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;