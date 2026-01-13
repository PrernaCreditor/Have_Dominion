import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const result = await login(email, password, 'user');
            if (result.success) {
                handleSuccess('Login successful!');
            } else {
                handleError(result.error || 'Login failed');
            }
        } catch (err) {
            handleError(err.message || 'Login failed');
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4'>
            <div className='max-w-md w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-blue-950 mb-2'>Welcome Back</h1>
                    <p className='text-gray-600'>Sign in to your account</p>
                </div>
                
                <form onSubmit={handleLogin} className='space-y-6'>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-blue-950 mb-2'>
                            Email Address
                        </label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={loginInfo.email}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none transition-all duration-200 text-black'
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-blue-950 mb-2'>
                            Password
                        </label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none transition-all duration-200 text-black'
                            required
                        />
                    </div>
                    
                    <button 
                        type='submit' 
                        className='w-full bg-blue-950 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-900 focus:ring-4 focus:ring-blue-950 focus:ring-opacity-25 transition-all duration-200 transform hover:scale-[1.02]'
                    >
                        Sign In
                    </button>
                </form>
                
                <div className='mt-6 text-center'>
                    <span className='text-gray-600'>Don't have an account? </span>
                    <Link 
                        to="/signup" 
                        className='text-blue-950 font-semibold hover:text-blue-900 transition-colors duration-200'
                    >
                        Sign Up
                    </Link>

                    <Link
                     to="/admin/login"
                     className="block font-semibold text-center  text-blue-950 mt-4"
                    >
                       Login as Admin
                    </Link>

                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login
