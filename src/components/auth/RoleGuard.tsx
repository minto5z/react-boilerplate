import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.context';
import { Permission } from '../../types';
import { LoadingPage, UnauthorizedAccess } from '../common';

interface RoleGuardProps {
  requiredPermissions?: Permission[];
  requiredRole?: string;
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY permission
  fallbackComponent?: React.ComponentType;
  redirectTo?: string;
  children: React.ReactNode;
}

export function RoleGuard({
  requiredPermissions = [],
  requiredRole,
  requireAll = false,
  fallbackComponent: FallbackComponent = UnauthorizedAccess,
  redirectTo,
  children,
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !user.role) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <FallbackComponent />;
  }

  // Check role-based access
  if (requiredRole && user.role.name !== requiredRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <FallbackComponent />;
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const userPermissions = user.role.permissions || [];
    
    let hasRequiredPermissions = false;
    
    if (requireAll) {
      // User must have ALL required permissions
      hasRequiredPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );
    } else {
      // User must have ANY of the required permissions
      hasRequiredPermissions = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
    }

    if (!hasRequiredPermissions) {
      if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
      }
      return <FallbackComponent />;
    }
  }

  return <>{children}</>;
}

// Higher-order component version
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<RoleGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <RoleGuard {...guardProps}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

// Convenience components for common role checks
interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  return (
    <RoleGuard 
      requiredPermissions={['admin']}
      fallbackComponent={fallback ? () => <>{fallback}</> : undefined}
    >
      {children}
    </RoleGuard>
  );
}

interface UserManagementGuardProps {
  children: React.ReactNode;
  action?: 'read' | 'write' | 'delete';
  fallback?: React.ReactNode;
}

export function UserManagementGuard({ 
  children, 
  action = 'read',
  fallback 
}: UserManagementGuardProps) {
  const permissions: Permission[] = [];
  
  switch (action) {
    case 'read':
      permissions.push('user:read');
      break;
    case 'write':
      permissions.push('user:write');
      break;
    case 'delete':
      permissions.push('user:delete');
      break;
  }

  return (
    <RoleGuard 
      requiredPermissions={permissions}
      fallbackComponent={fallback ? () => <>{fallback}</> : undefined}
    >
      {children}
    </RoleGuard>
  );
}

interface RoleManagementGuardProps {
  children: React.ReactNode;
  action?: 'read' | 'write' | 'delete';
  fallback?: React.ReactNode;
}

export function RoleManagementGuard({ 
  children, 
  action = 'read',
  fallback 
}: RoleManagementGuardProps) {
  const permissions: Permission[] = [];
  
  switch (action) {
    case 'read':
      permissions.push('role:read');
      break;
    case 'write':
      permissions.push('role:write');
      break;
    case 'delete':
      permissions.push('role:delete');
      break;
  }

  return (
    <RoleGuard 
      requiredPermissions={permissions}
      fallbackComponent={fallback ? () => <>{fallback}</> : undefined}
    >
      {children}
    </RoleGuard>
  );
}