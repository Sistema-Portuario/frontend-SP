import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';
import Employee from '../pages/Employee';
import PrivateRouteAdmin from '../components/HOC/PrivateRouteAdmin';
import PrivateRouteEmployee from '../components/HOC/PrivateRouteEmployee';
import Position from '../pages/Position';
import Operators from '../pages/Operators';

export const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRouteAdmin element={AdminDashboard}/>} />
      <Route path="/operators" element={<PrivateRouteAdmin element={Operators}/>} />
      <Route path="/employee" element={<PrivateRouteEmployee element={Employee}/>} />
      <Route path="/positions" element={<PrivateRouteEmployee element={Position}/>} />
      <Route path="/login" element={<Login />} /> 
    </Routes>
  );
};