import * as authTypes from './authTypes';
import { authInitialState } from './authInitialState';

export type AuthState = typeof authInitialState;

type AuthAction =
  | { type: typeof authTypes.LOGIN_REQUEST }
  | { type: typeof authTypes.LOGIN_SUCCESS; payload: { token: string; user: AuthState['user'] } }
  | { type: typeof authTypes.LOGIN_FAILURE; payload: { error: string } };


export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    
    // login
    case authTypes.LOGIN_REQUEST:
      return {
        ...state,
        authenticating: true,
        error: '',
        message: '',
      };

    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        authenticate: true,
        authenticating: false,
      };

    case authTypes.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        authenticate: false,
        authenticating: false,
      };
    
    default:
      return state;
  }
};
