import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './routes/ProtectedRoute';
import Signup from './pages/Signup';
import './style.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<div className="center">Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
