import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services';
import { setTokens, clearTokens, getToken } from '../lib/api-client';
import type { 
  User, 
  AuthContextType, 
  LoginRequest, 
  RegisterRequest,
} from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated (has valid token)
  const isAuthenticated = !!user && !!getToken();

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = getToken();
    
    if (token) {
      try {
        // Verify token by getting user profile
        const userData = await AuthService.getProfile();
        setUser(userData);
      } catch (error) {
        // Token is invalid, clear it
        clearTokens();
        setUser(null);
      }
    }
    
    setIsLoading(false);
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);
      
      // Store tokens
      setTokens(response.accessToken, response.refreshToken);
      
      // Set user data
      setUser(response.user);
      
      toast.success(response.message || 'Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(data);
      
      // Store tokens
      setTokens(response.accessToken, response.refreshToken);
      
      // Set user data
      setUser(response.user);
      
      toast.success(response.message || 'Registration successful');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call logout API to invalidate session on server
      await AuthService.logout();
    } catch (error) {
      // Even if API call fails, we still want to clear local state
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local tokens and user data
      clearTokens();
      setUser(null);
      setIsLoading(false);
      
      toast.success('Logged out successfully');
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      // This will be handled automatically by the API client interceptor
      const userData = await AuthService.getProfile();
      setUser(userData);
    } catch (error) {
      // If refresh fails, log out the user
      clearTokens();
      setUser(null);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await AuthService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook to check if user has specific permission
export function usePermission(permission: string): boolean {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return false;
  }
  
  return user.role.permissions.includes(permission);
}

// Hook to check if user has any of the specified permissions
export function useAnyPermission(permissions: string[]): boolean {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return false;
  }
  
  return permissions.some(permission => user.role!.permissions.includes(permission));
}

// Hook to check if user has all specified permissions
export function useAllPermissions(permissions: string[]): boolean {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return false;
  }
  
  return permissions.every(permission => user.role!.permissions.includes(permission));
}