import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';
import EmployeePage from '../pages/EmployeePage';
import PrivateRouteAdmin from '../components/HOC/PrivateRouteAdmin';
import PrivateRouteEmployee from '../components/HOC/PrivateRouteEmployee';

export const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/admin" element={<PrivateRouteAdmin element={AdminDashboard}/>} />
      <Route path="/employee" element={<PrivateRouteEmployee element={EmployeePage}/>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
