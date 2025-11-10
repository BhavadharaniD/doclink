import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const LoginForm = ({ role = "user" }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === 'doctor'
          ? `${import.meta.env.VITE_API_BASE_URL}/api/doctors/login`
          : `${import.meta.env.VITE_API_BASE_URL}/api/users/login`;

      const { data } = await axios.post(endpoint, { email, password });
      console.log('Login response:', data);

      // ✅ Store in localStorage
      localStorage.setItem('doclinkToken', data.token);
localStorage.setItem('userName', data.name);
localStorage.setItem('role', role);

if (role === 'doctor') {
  localStorage.setItem('doctorId', data._id); // important!
} else {
  localStorage.setItem('userId', data._id);
}

      // ✅ Store in Context
      setUser({
        name: data.name,
        token: data.token,
        userId: data._id,
        role,
      });

      toast.success(`${role === 'doctor' ? 'Doctor' : 'User'} login successful!`);

      // ✅ Navigate based on role
      if (role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/dashboard');

    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-[#2D6CDF] text-center">
        {role === 'doctor' ? 'Doctor Login' : 'Login to DocLink'}
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        className="w-full bg-[#2D6CDF] text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {role === 'doctor' ? 'Login as Doctor' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
