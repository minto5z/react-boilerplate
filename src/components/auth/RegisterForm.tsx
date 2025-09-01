import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/auth.context';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common';
import { RegisterRequest } from '../../types';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data as RegisterRequest);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Error is handled by the auth context and toast
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join us today and get started
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register('firstName')}
                    type="text"
                    label="First Name"
                    placeholder="John"
                    error={errors.firstName?.message}
                    disabled={isSubmitting || isLoading}
                    className="h-12 text-base"
                  />
                  
                  <Input
                    {...register('lastName')}
                    type="text"
                    label="Last Name"
                    placeholder="Doe"
                    error={errors.lastName?.message}
                    disabled={isSubmitting || isLoading}
                    className="h-12 text-base"
                  />
                </div>

                <Input
                  {...register('email')}
                  type="email"
                  label="Email address"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  disabled={isSubmitting || isLoading}
                  className="h-12 text-base"
                />

                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a strong password"
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

                <Input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  disabled={isSubmitting || isLoading}
                  className="h-12 text-base"
                  rightIcon={
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>One uppercase and lowercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>One number and special character</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
                loading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full h-12 px-4 py-2 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                >
                  Sign in to existing account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}