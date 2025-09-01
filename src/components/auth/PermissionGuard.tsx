import React from 'react';
import { usePermission, useAnyPermission, useAllPermissions } from '../../contexts/auth.context';
import type { Permission } from '../../types';

interface PermissionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY permission
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  let hasPermission = false;

  if (permission) {
    hasPermission = usePermission(permission);
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasPermission = useAllPermissions(permissions);
    } else {
      hasPermission = useAnyPermission(permissions);
    }
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common permission checks
interface HasPermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasPermission({ permission, children, fallback = null }: HasPermissionProps) {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

interface HasAnyPermissionProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasAnyPermission({ permissions, children, fallback = null }: HasAnyPermissionProps) {
  return (
    <PermissionGuard permissions={permissions} requireAll={false} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

interface HasAllPermissionsProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasAllPermissions({ permissions, children, fallback = null }: HasAllPermissionsProps) {
  return (
    <PermissionGuard permissions={permissions} requireAll={true} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Higher-order component for wrapping entire components with permission checks
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <HasPermission permission={permission} fallback={fallback}>
        <Component {...props} />
      </HasPermission>
    );
  };
}

export function withAnyPermission<P extends object>(
  Component: React.ComponentType<P>,
  permissions: Permission[],
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <HasAnyPermission permissions={permissions} fallback={fallback}>
        <Component {...props} />
      </HasAnyPermission>
    );
  };
}

// Component for displaying unauthorized access message
export function UnauthorizedAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}