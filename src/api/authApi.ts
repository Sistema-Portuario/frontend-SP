import type { AuthAction } from '../context/authContext/authProvider';
import type { AuthState } from '../context/authContext/authReducer';
import * as authTypes from '../context/authContext/authTypes';
import { postRequest } from './api';

interface UserCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthState['user'];
}

export const login = async (
  userCredentials: UserCredentials,
  dispatch: (action: AuthAction) => void
) => {
  dispatch({ type: authTypes.LOGIN_REQUEST });

  try {
    const data = await postRequest<LoginResponse, UserCredentials>(
      'http://localhost:3000/login',
      userCredentials
    );

    if (!data || !data.token || !data.user) {
      throw new Error('Invalid response from server');
    }

    const { token, user } = data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: authTypes.LOGIN_SUCCESS,
      payload: {
        token,
        user,
      },
    });
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
