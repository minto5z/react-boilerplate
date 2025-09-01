import { apiClient } from '../lib/api-client';
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilterParams,
  RolesResponse,
} from '../types';

export class RoleService {
  /**
   * Get all roles with pagination and filtering
   */
  static async getRoles(params?: RoleFilterParams): Promise<RolesResponse> {
    const response = await apiClient.get<RolesResponse>('/roles', { params });
    return response.data;
  }

  /**
   * Get all roles without pagination (for dropdowns, etc.)
   */
  static async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>('/roles/all');
    return response.data;
  }

  /**
   * Get role by ID
   */
  static async getRoleById(id: number): Promise<Role> {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data;
  }

  /**
   * Create new role (admin only)
   */
  static async createRole(data: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<Role>('/roles', data);
    return response.data;
  }

  /**
   * Update role (admin only)
   */
  static async updateRole(id: number, data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    return response.data;
  }

  /**
   * Delete role (admin only)
   */
  static async deleteRole(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  }

  /**
   * Get available permissions
   */
  static async getPermissions(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/roles/permissions');
    return response.data;
  }
}