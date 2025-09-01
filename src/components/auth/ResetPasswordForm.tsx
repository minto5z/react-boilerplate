import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useResetPassword } from '../../hooks/api.hooks';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common';
import { ResetPasswordRequest } from '../../types';

const resetPasswordSchema = z.object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Error Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600">
              This password reset link is invalid or has expired
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-6 sm:p-8 text-center space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-red-800">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span className="text-sm font-medium">Link Expired</span>
                </div>
                <p className="text-sm text-red-700 mt-2">
                  Reset links expire after 15 minutes for security reasons.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center w-full h-12 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
                >
                  Request a new reset link
                </Link>
                
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full h-12 px-6 py-2 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                >
                  ← Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      } as ResetPasswordRequest);
      
      navigate('/login', { 
        replace: true,
        state: { message: 'Password reset successfully. Please log in with your new password.' }
      });
    } catch (error) {
      // Error is handled by the hook and toast
      console.error('Reset password failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Set new password
          </h2>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="New Password"
                  placeholder="Enter your new password"
                  error={errors.password?.message}
                  disabled={resetPasswordMutation.isPending}
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
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                  error={errors.confirmPassword?.message}
                  disabled={resetPasswordMutation.isPending}
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
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
                loading={resetPasswordMutation.isPending}
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? 'Resetting password...' : 'Reset password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full h-12 px-6 py-2 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              >
                ← Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}