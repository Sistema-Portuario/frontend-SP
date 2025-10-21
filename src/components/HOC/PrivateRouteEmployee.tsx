import { useEffect, type ElementType, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authProvider';

interface PrivateRouteProps {
  element: ElementType;
}

export default function PrivateRouteEmployee({
  element: Component,
}: PrivateRouteProps): ReactElement | null {
  const token = window.localStorage.getItem('token');

  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;

  useEffect(() => {
    if (!token) navigate('/login', { replace: true });

    if (user.role !== 'employee') {
      navigate('/', { replace: true });
      return;
    }

  }, [token, user, navigate]);

  // evita renderizar enquanto redireciona
  if (!token || user.role !== 'employee') return null;

  return <Component />;
}