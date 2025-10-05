import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';
import Employee from '../pages/Employee';
import PrivateRouteAdmin from '../components/HOC/PrivateRouteAdmin';
import PrivateRouteEmployee from '../components/HOC/PrivateRouteEmployee';
import Position from '../pages/Position';

export const RoutesApp = () => {
  return (
    <Routes>
      {/* <Route path="/admin" element={<PrivateRouteAdmin element={AdminDashboard}/>} />
      <Route path="/employee" element={<PrivateRouteEmployee element={EmployeePage}/>} />
      <Route path="/login" element={<Login />} /> */}
      
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/employee" element={<Employee/>} />
      <Route path="/positions" element={<Position/>} />
      <Route path="/login" element={<Login />} />
      
    </Routes>
  );
};
