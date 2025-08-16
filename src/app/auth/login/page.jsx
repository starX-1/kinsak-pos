'use client'
import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Chrome,
  Apple,
  Cloud,
  Shield,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!loginForm.username) {
      newErrors.username = 'Username is required';
    }
    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    const response = await signIn("credentials", {
      name: loginForm.username,
      password: loginForm.password,
      redirect: false,
    });

    console.log("SignIn response:", response);

    if (response?.error) {
      setErrors({ general: "Invalid username or password" });
      return;
    }

    setIsLoading(true);

    // Wait for NextAuth to store session before fetching it
    setTimeout(async () => {
      setIsLoading(false);

      const session = await getSession();
      // console.log("Session:", session);

      if (session?.user?.role === "ADMIN") {
        router.push("/dashboard");
      } else if (session?.user?.role === "WAITER") {
        router.push("/dashboard");
      } else {
        router.push("/"); // fallback page
      }
    }, 500); // short delay to ensure session is saved
  };


  const handleRegisterRedirect = () => {
    router.push('/auth/register')
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your TicoTaco POS dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="space-y-6">
            {errors.general && (
              <div className="flex items-center mt-1 text-red-400 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.general}
              </div>
            )}
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.username
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                    }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-white/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={loginForm.rememberMe}
                  onChange={handleLoginChange}
                  className="w-4 h-4 text-yellow-400 bg-white/5 border-white/20 rounded focus:ring-yellow-400/50 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <button type="button" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-orange-500/25 transform hover:scale-[1.02]'
                } text-white`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-3 px-4 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
              <Chrome size={20} className="mr-2" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center py-3 px-4 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
              <Apple size={20} className="mr-2" />
              <span>Apple</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Want to create your own Restaurant?{' '}
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center text-gray-400 text-sm">
          <Shield size={16} className="mr-2" />
          <span>Your data is protected with enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;