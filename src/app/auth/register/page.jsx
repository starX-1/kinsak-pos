'use client'
import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Building2,
    Phone,
    ArrowLeft,
    Cloud,
    Check,
    AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [registerForm, setRegisterForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        restaurantName: '',
        phone: '',
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Password strength check
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }

        // Clear errors when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateRegister = () => {
        const newErrors = {};

        if (!registerForm.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!registerForm.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!registerForm.password) {
            newErrors.password = 'Password is required';
        } else if (registerForm.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (registerForm.password !== registerForm.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!registerForm.restaurantName.trim()) {
            newErrors.restaurantName = 'Restaurant name is required';
        }

        if (!registerForm.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!registerForm.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateRegister()) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log('Registration attempt:', registerForm);
            // Handle successful registration here
        }, 2000);
    };

    const handleLoginRedirect = () => {
        router.push('/auth/login');
    };

    const handleBackToHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl">
                            <Cloud className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join thousands of restaurants using TicoTaco POS</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={registerForm.fullName}
                                    onChange={handleRegisterChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.fullName
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                                        }`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.fullName && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.fullName}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={registerForm.email}
                                    onChange={handleRegisterChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                                        }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Restaurant Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Restaurant Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="restaurantName"
                                    value={registerForm.restaurantName}
                                    onChange={handleRegisterChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.restaurantName
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                                        }`}
                                    placeholder="Enter restaurant name"
                                />
                            </div>
                            {errors.restaurantName && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.restaurantName}
                                </div>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={registerForm.phone}
                                    onChange={handleRegisterChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.phone
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                                        }`}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {errors.phone && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.phone}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={registerForm.password}
                                    onChange={handleRegisterChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                                        }`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {registerForm.password && (
                                <div className="mt-2">
                                    <div className="flex space-x-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded ${i < passwordStrength
                                                    ? passwordStrength <= 2
                                                        ? 'bg-red-500'
                                                        : passwordStrength <= 3
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                    : 'bg-white/20'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Password strength: {
                                            passwordStrength <= 2 ? 'Weak' :
                                                passwordStrength <= 3 ? 'Medium' : 'Strong'
                                        }
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={registerForm.confirmPassword}
                                    onChange={handleRegisterChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                                        }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {registerForm.password && registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && (
                                    <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    checked={registerForm.agreeTerms}
                                    onChange={handleRegisterChange}
                                    className="w-4 h-4 text-yellow-400 bg-white/5 border-white/20 rounded focus:ring-yellow-400/50 focus:ring-2 mt-1"
                                />
                                <span className="ml-2 text-sm text-gray-300">
                                    I agree to the{' '}
                                    <button type="button" className="text-yellow-400 hover:text-yellow-300 underline">
                                        Terms of Service
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="text-yellow-400 hover:text-yellow-300 underline">
                                        Privacy Policy
                                    </button>
                                </span>
                            </label>
                            {errors.agreeTerms && (
                                <div className="flex items-center mt-1 text-red-400 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.agreeTerms}
                                </div>
                            )}
                        </div>

                        {/* Register Button */}
                        <button
                            onClick={handleRegister}
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${isLoading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-orange-500/25 transform hover:scale-[1.02]'
                                } text-white`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={handleLoginRedirect}
                                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleBackToHome}
                        className="flex items-center justify-center text-gray-400 hover:text-white transition-colors mx-auto"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        <span>Back to homepage</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;