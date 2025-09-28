import React, { useState, type MouseEvent } from 'react';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/authContext/authProvider';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const userLogin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const userCredentials = {
      email,
      password,
    };

    login(userCredentials, dispatch);

    navigate('/');
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EDEDE9]">
      <div className="bg-[#21496D] p-8 rounded-lg shadow-md w-96 text-center">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="w-30 h-30 rounded-full bg-white p-2"
          />
        </div>

        <h2 className="text-white text-lg mb-6">Sistema Portuário</h2>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            className="w-full px-3 py-2 rounded-md border bg-[#EDEDE9] border-gray-300 focus:outline-none focus:ring focus:ring-yellow-400"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Senha"
            className="w-full px-3 py-2 rounded-md border bg-[#EDEDE9] border-gray-300 focus:outline-none focus:ring focus:ring-yellow-400"
          />
        </div>

        <button
          onClick={userLogin}
          className="mt-6 bg-[#F1D821] hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-md w-full cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
