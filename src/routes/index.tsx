import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

export const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};
