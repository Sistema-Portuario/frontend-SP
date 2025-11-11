import type { AuthAction } from '../context/authContext/authProvider';
import type { AuthState } from '../context/authContext/authReducer';
import * as authTypes from '../context/authContext/authTypes';

interface UserCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string; // O backend retorna 'access_token'
  token_type: string;
}

// Interface do perfil do usuário da rota /me
interface UserProfile {
  id: string;
  nome: string;
  role: 'admin' | 'employee';
}


export const login = async (
  userCredentials: UserCredentials,
  dispatch: (action: AuthAction) => void
) => {
  dispatch({ type: authTypes.LOGIN_REQUEST });

  try {
    const formData = new URLSearchParams();
    formData.append('username', userCredentials.username);
    formData.append('password', userCredentials.password);

    const response = await fetch('http://127.0.0.1:8000/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Credenciais inválidas');
    }

    const data: LoginResponse = await response.json();
    const token = data.access_token;

    localStorage.setItem('token', token);

    const profileResponse = await fetch('http://127.0.0.1:8000/usuarios/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Falha ao buscar perfil do usuário.');
    }

    const userProfile: UserProfile = await profileResponse.json();

    const user: AuthState['user'] = {
      name: userProfile.nome,
      role: userProfile.nome.toLowerCase() === 'admin' ? 'admin' : 'employee', // Simulação
      email: '',
      password: '',
      position: ''
    };

    localStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: authTypes.LOGIN_SUCCESS,
      payload: {
        token,
        user,
      },
    });

    return user;

  } catch (error) {
    if (error instanceof Error) {
      dispatch({
        type: authTypes.LOGIN_FAILURE,
        payload: { error: error.message },
      });
    } else {
      dispatch({
        type: authTypes.LOGIN_FAILURE,
        payload: { error: 'Erro desconhecido' },
      });
    }
  }
};