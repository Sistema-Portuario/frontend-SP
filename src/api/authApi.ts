import { postRequest } from './api';

export const login = async (userCredentials, dispatch) => {
  dispatch({ type: authTypes.LOGIN_REQUEST });

  try {
    const data = await postRequest('http://localhost:3000/login', userCredentials);

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
    dispatch({ type: authTypes.LOGIN_FAILURE, payload: { error: error.message } });
  }
};