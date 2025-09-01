import { apiClient } from '../lib/api-client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from '../types';

export class AuthService {
  /**
   * User registration
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  /**
   * User login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', data);
    return response.data;
  }

  /**
   * Logout user (current session)
   */
  static async logout(): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  /**
   * Logout from all sessions
   */
  static async logoutAll(): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/logout-all');
    return response.data;
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  }

  /**
   * Request password reset
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  }
}