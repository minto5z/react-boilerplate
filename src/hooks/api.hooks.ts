import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
import { 
  AuthService, 
  UserService, 
  RoleService 
} from '../services';
import {
  User,
  Role,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilterParams,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilterParams,
} from '../types';
import toast from 'react-hot-toast';

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userProfile: ['users', 'profile'] as const,
  userSessions: (userId?: number) => ['users', userId || 'current', 'sessions'] as const,
  roles: ['roles'] as const,
  role: (id: number) => ['roles', id] as const,
  permissions: ['roles', 'permissions'] as const,
} as const;

// Auth Hooks
export function useLogin(options?: UseMutationOptions<any, Error, LoginRequest>) {
  return useMutation({
    mutationFn: AuthService.login,
    ...options,
  });
}

export function useRegister(options?: UseMutationOptions<any, Error, RegisterRequest>) {
  return useMutation({
    mutationFn: AuthService.register,
    ...options,
  });
}

export function useChangePassword(options?: UseMutationOptions<any, Error, ChangePasswordRequest>) {
  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    ...options,
  });
}

export function useForgotPassword(options?: UseMutationOptions<any, Error, ForgotPasswordRequest>) {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent');
    },
    ...options,
  });
}

export function useResetPassword(options?: UseMutationOptions<any, Error, ResetPasswordRequest>) {
  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    ...options,
  });
}

// User Hooks
export function useUsers(params?: UserFilterParams, options?: UseQueryOptions<any, Error>) {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => UserService.getUsers(params),
    ...options,
  });
}

export function useUser(id: number, options?: UseQueryOptions<User, Error>) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUserProfile(options?: UseQueryOptions<User, Error>) {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: UserService.getProfile,
    ...options,
  });
}

export function useUserSessions(userId?: number, options?: UseQueryOptions<any, Error>) {
  return useQuery({
    queryKey: queryKeys.userSessions(userId),
    queryFn: () => UserService.getUserSessions(userId),
    ...options,
  });
}

export function useCreateUser(options?: UseMutationOptions<User, Error, CreateUserRequest>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User created successfully');
    },
    ...options,
  });
}

export function useUpdateUser(options?: UseMutationOptions<User, Error, { id: number; data: UpdateUserRequest }>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => UserService.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
      toast.success('User updated successfully');
    },
    ...options,
  });
}

export function useDeleteUser(options?: UseMutationOptions<any, Error, number>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User deleted successfully');
    },
    ...options,
  });
}

export function useActivateUser(options?: UseMutationOptions<User, Error, number>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UserService.activateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
      toast.success('User activated successfully');
    },
    ...options,
  });
}

export function useDeactivateUser(options?: UseMutationOptions<User, Error, number>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UserService.deactivateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
      toast.success('User deactivated successfully');
    },
    ...options,
  });
}

// Bulk User Operations
export function useBulkAssignRole(options?: UseMutationOptions<any, Error, { userIds: number[]; roleId: number }>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userIds, roleId }) => 
      Promise.all(userIds.map(userId => 
        UserService.updateUser(userId, { roleId })
      )),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('Role assigned to selected users');
    },
    ...options,
  });
}

export function useBulkSendEmail(options?: UseMutationOptions<any, Error, number[]>) {
  return useMutation({
    mutationFn: async (userIds: number[]) => {
      // Simulated email sending - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, count: userIds.length };
    },
    onSuccess: (data) => {
      toast.success(`Email sent to ${data.count} users`);
    },
    ...options,
  });
}

export function useBulkExport(options?: UseMutationOptions<any, Error, number[]>) {
  return useMutation({
    mutationFn: async (userIds: number[]) => {
      // Simulated export - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const csvContent = "User ID,Name,Email\n" + 
        userIds.map(id => `${id},User ${id},user${id}@example.com`).join("\n");
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, count: userIds.length };
    },
    onSuccess: (data) => {
      toast.success(`Exported ${data.count} users`);
    },
    ...options,
  });
}

// Role Hooks
export function useRoles(params?: RoleFilterParams, options?: UseQueryOptions<any, Error>) {
  return useQuery({
    queryKey: [...queryKeys.roles, params],
    queryFn: () => RoleService.getRoles(params),
    ...options,
  });
}

export function useAllRoles(options?: UseQueryOptions<Role[], Error>) {
  return useQuery({
    queryKey: [...queryKeys.roles, 'all'],
    queryFn: RoleService.getAllRoles,
    ...options,
  });
}

export function useRole(id: number, options?: UseQueryOptions<Role, Error>) {
  return useQuery({
    queryKey: queryKeys.role(id),
    queryFn: () => RoleService.getRoleById(id),
    enabled: !!id,
    ...options,
  });
}

export function usePermissions(options?: UseQueryOptions<string[], Error>) {
  return useQuery({
    queryKey: queryKeys.permissions,
    queryFn: RoleService.getPermissions,
    ...options,
  });
}

export function useCreateRole(options?: UseMutationOptions<Role, Error, CreateRoleRequest>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: RoleService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles });
      toast.success('Role created successfully');
    },
    ...options,
  });
}

export function useUpdateRole(options?: UseMutationOptions<Role, Error, { id: number; data: UpdateRoleRequest }>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => RoleService.updateRole(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles });
      queryClient.invalidateQueries({ queryKey: queryKeys.role(data.id) });
      toast.success('Role updated successfully');
    },
    ...options,
  });
}

export function useDeleteRole(options?: UseMutationOptions<any, Error, number>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: RoleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles });
      toast.success('Role deleted successfully');
    },
    ...options,
  });
}