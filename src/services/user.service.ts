import { apiClient } from '../lib/api-client';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateProfileRequest,
  UserFilterParams,
  UsersResponse,
  UserSessionsResponse,
  PaginationParams,
} from '../types';

export class UserService {
  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(params?: UserFilterParams): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('/users', { params });
    return response.data;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  /**
   * Get current user profile (same as auth profile but through users endpoint)
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  }

  /**
   * Update current user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>('/users/profile', data);
    return response.data;
  }

  /**
   * Create new user (admin only)
   */
  static async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  }

  /**
   * Update user (admin only)
   */
  static async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }

  /**
   * Activate user (admin only)
   */
  static async activateUser(id: number): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/activate`);
    return response.data;
  }

  /**
   * Deactivate user (admin only)
   */
  static async deactivateUser(id: number): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/deactivate`);
    return response.data;
  }

  /**
   * Get user sessions (admin can see any user's sessions, users can see their own)
   */
  static async getUserSessions(userId?: number): Promise<UserSessionsResponse> {
    const endpoint = userId ? `/users/${userId}/sessions` : '/users/sessions';
    const response = await apiClient.get<UserSessionsResponse>(endpoint);
    return response.data;
  }

  /**
   * Revoke user session
   */
  static async revokeSession(sessionId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * Revoke all user sessions
   */
  static async revokeAllSessions(userId?: number): Promise<{ message: string }> {
    const endpoint = userId ? `/users/${userId}/sessions` : '/users/sessions';
    const response = await apiClient.delete(endpoint);
    return response.data;
  }
}