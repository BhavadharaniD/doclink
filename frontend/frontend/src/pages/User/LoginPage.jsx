// pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../../components/LoginForm';
import assets from '../../../public/assets.js';

const LoginPage = () => (
  <div className="flex h-screen w-full">
    <div className="w-1/2 h-full">
      <img src={assets.register} alt="Login" className="w-full h-full object-cover" />
    </div>
    <div className="w-1/2 h-full flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[80%] max-w-md border border-gray-100">
        <LoginForm role="user" />
      </div>
    </div>
  </div>
);

export default LoginPage;
