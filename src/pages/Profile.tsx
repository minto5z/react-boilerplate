import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/auth.context';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../components/common';
import { formatDate } from '../utils/helpers';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function Profile() {
  const { user, updateProfile, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register('firstName')}
                    label="First Name"
                    placeholder="John"
                    error={errors.firstName?.message}
                    disabled={isSubmitting || isLoading}
                  />
                  
                  <Input
                    {...register('lastName')}
                    label="Last Name"
                    placeholder="Doe"
                    error={errors.lastName?.message}
                    disabled={isSubmitting || isLoading}
                  />
                </div>

                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  disabled={isSubmitting || isLoading}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={isSubmitting || isLoading}
                    disabled={isSubmitting || isLoading || !isDirty}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-600">
                    Last changed on {formatDate(user.updatedAt)}
                  </p>
                  <Button variant="outline" className="mt-2">
                    Change Password
                  </Button>
                </div>
                
                <hr />
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="mt-2" disabled>
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-sm text-gray-900">{user.role?.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.emailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.emailVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {user.role && (
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.role.permissions.length > 0 ? (
                    user.role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {permission}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No specific permissions assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}