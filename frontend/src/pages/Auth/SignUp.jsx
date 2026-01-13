import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../lib/utils';
import api from '../../api/axios';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        
        // Frontend validation matching backend requirements
        if (!name || name.length < 2 || name.length > 100) {
            return handleError('Name must be between 2 and 100 characters')
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            return handleError('Valid email is required')
        }
        if (!password || password.length < 6 || password.length > 100) {
            return handleError('Password must be between 6 and 100 characters')
        }
        
        try {
            // Use relative path so axios baseURL (/api/v1) is applied
            const response = await api.post("auth/user/signup", signupInfo);
            const result = response.data;
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else if (error) {
                const details = error?.details?.[0]?.message || error;
                handleError(details);
            } else if (!success) {
                handleError(message || 'Signup failed');
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4'>
            <div className='max-w-md w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-blue-950 mb-2'>Create Account</h1>
                    <p className='text-gray-600'>Join us today and get started</p>
                </div>
                
                <form onSubmit={handleSignup} className='space-y-6'>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium text-blue-950 mb-2'>
                            Full Name
                        </label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='name'
                            autoFocus
                            placeholder='Enter your full name...'
                            value={signupInfo.name}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none transition-all duration-200 text-black'
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-blue-950 mb-2'>
                            Email Address
                        </label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={signupInfo.email}
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
                            placeholder='Create a strong password...'
                            value={signupInfo.password}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none transition-all duration-200 text-black'
                            required
                        />
                    </div>
                    
                    <button 
                        type='submit' 
                        className='w-full bg-blue-950 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-900 focus:ring-4 focus:ring-blue-950 focus:ring-opacity-25 transition-all duration-200 transform hover:scale-[1.02]'
                    >
                        Create Account
                    </button>
                </form>
                
                <div className='mt-6 text-center'>
                    <span className='text-gray-600'>Already have an account? </span>
                    <Link 
                        to="/login" 
                        className='text-blue-950 font-semibold hover:text-blue-900 transition-colors duration-200'
                    >
                        Sign In
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup
