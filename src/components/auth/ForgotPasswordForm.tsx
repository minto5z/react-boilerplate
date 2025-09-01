import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPassword } from '../../hooks/api.hooks';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common';
import { ForgotPasswordRequest } from '../../types';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data as ForgotPasswordRequest);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the hook and toast
      console.error('Forgot password failed:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600">
              We've sent a password reset link to
            </p>
            <p className="font-medium text-gray-900 mt-1">
              {getValues('email')}
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-6 sm:p-8 text-center space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-blue-800">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <span className="text-sm font-medium">Important</span>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  The reset link will expire in 15 minutes for security reasons.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or
                </p>
                
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-12 px-6 py-2 border-2 border-orange-300 rounded-lg text-base font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                  onClick={() => {
                    setIsSubmitted(false);
                    forgotPasswordMutation.reset();
                  }}
                >
                  Send another email
                </button>
                
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center h-12 px-6 py-2 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  >
                    ← Back to sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset your password
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Input
                  {...register('email')}
                  type="email"
                  label="Email address"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  disabled={forgotPasswordMutation.isPending}
                  className="h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
                loading={forgotPasswordMutation.isPending}
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? 'Sending reset link...' : 'Send reset link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center h-12 px-6 py-2 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
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