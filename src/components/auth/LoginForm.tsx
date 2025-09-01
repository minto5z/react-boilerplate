import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/auth.context';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common';
import { LoginRequest } from '../../types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect URL from state, default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data as LoginRequest);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the auth context and toast
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to continue to your account
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    {...register('email')}
                    type="email"
                    label="Email address"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    disabled={isSubmitting || isLoading}
                    className="h-12 text-base"
                  />
                </div>

                <div>
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    disabled={isSubmitting || isLoading}
                    className="h-12 text-base"
                    rightIcon={
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:text-primary-600 transition-colors duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
                loading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full h-12 px-4 py-2 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  Create new account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials for development */}
        {import.meta.env.VITE_NODE_ENV === 'development' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</p>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">
                      <strong>Admin:</strong> admin@example.com / Admin123!
                    </div>
                    <div className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">
                      <strong>User:</strong> user@example.com / User123!
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}