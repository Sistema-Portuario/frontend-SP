import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login/login';
import PrivateRoute from '../components/HOC/PrivateRoute';

export const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={AdminDashboard}/>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
