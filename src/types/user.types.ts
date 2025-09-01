import { User, Role } from './auth.types';

// User management interfaces
export interface CreateUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserFilterParams {
  search?: string;
  roleId?: number;
  isActive?: boolean;
  emailVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Role management interfaces
export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleFilterParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface RolesResponse {
  roles: Role[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User session interfaces
export interface UserSession {
  id: number;
  userId: number;
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSessionsResponse {
  sessions: UserSession[];
}