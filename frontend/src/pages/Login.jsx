
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import './Login.css'; // Import the CSS file for styling
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import Footer from './Footer'

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendUrl = 'https://p2p-final-backend.onrender.com'; // Replace with your backend URL
const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  
  const navigate = useNavigate();
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword); // Toggle showPassword state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/login`, { // Ensure correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'), // send from localStorage
        },
        credentials: 'include',
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('username', data.username);
  
      toast.success('Login successful!');

      // Handle role-based redirection or state updates here

      if(data.username){
       navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
 <div className='loginpage'>
 <Header />
 <div className='login'>
    <div className='pname'>
      <h1>P2P</h1>
    </div>
    <div className="container-login">
      <h2 className="header-login">Login</h2>
      <form onSubmit={handleSubmit} className="form-login">
        <div className='input-box'>
        <input
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
          className="input-login"
          placeholder=''
        />
        <label htmlFor="username" className="labelBx">Username</label>
        <FaUser className='icon' />
        </div>

       <div className='input-box'>
        <input
           type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          className="input-login"
          placeholder=''
        />
        <label htmlFor="password" className="labelBx">Password</label>
        <FaLock className='icon' />
       </div>

       <div className="show-forgot">
            <label>
              <input
                type="checkbox"
                checked={showPassword} // Reflects the state
                onChange={handlePasswordToggle}
              /> Show Password
            </label>

            <p className="forgot-password-link">
    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
  </p>
          </div>

        <button type="submit" className="button-login">
          Login
        </button>
      </form>


      <p className="register-text-login">
        Don't have an account? <a href="/register" className="register-link-login">Register</a>
      </p>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  </div>
  <Footer />
 </div>
  );
};

export default Login;
