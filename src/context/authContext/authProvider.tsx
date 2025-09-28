import { createContext, useContext, useReducer } from 'react';
import type { ReactNode, Dispatch } from 'react';
import { authReducer } from './authReducer';
import { authInitialState } from './authInitialState';

export type AuthState = typeof authInitialState;
export type AuthAction = Parameters<typeof authReducer>[1];

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const authGlobalContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  return (
    <authGlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </authGlobalContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(authGlobalContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};