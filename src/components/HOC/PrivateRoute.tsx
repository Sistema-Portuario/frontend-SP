import { useEffect, type ElementType, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: ElementType;
}

export default function PrivateRoute({ element: Component }: PrivateRouteProps): ReactElement | null {
  const navigate = useNavigate();
  const token = window.localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  if (!token) return null;

  return <Component />;
}