import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  KeyIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '../common';
import { HasPermission } from '../auth';
import { formatDate, cn } from '../../utils/helpers';
import { Role } from '../../types';

interface RoleCardProps {
  role: Role & { userCount?: number };
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  className?: string;
}

const roleColorSchemes = {
  admin: {
    bg: 'from-red-500 to-red-600',
    icon: 'text-red-600',
    border: 'border-red-200',
    cardBg: 'from-red-50 to-red-100'
  },
  manager: {
    bg: 'from-purple-500 to-purple-600',
    icon: 'text-purple-600',
    border: 'border-purple-200',
    cardBg: 'from-purple-50 to-purple-100'
  },
  user: {
    bg: 'from-blue-500 to-blue-600',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    cardBg: 'from-blue-50 to-blue-100'
  },
  editor: {
    bg: 'from-green-500 to-green-600',
    icon: 'text-green-600',
    border: 'border-green-200',
    cardBg: 'from-green-50 to-green-100'
  },
  viewer: {
    bg: 'from-gray-500 to-gray-600',
    icon: 'text-gray-600',
    border: 'border-gray-200',
    cardBg: 'from-gray-50 to-gray-100'
  }
};

const getColorScheme = (roleName: string) => {
  const normalized = roleName.toLowerCase();
  return roleColorSchemes[normalized as keyof typeof roleColorSchemes] || roleColorSchemes.user;
};

export function RoleCard({ role, onEdit, onDelete, className }: RoleCardProps) {
  const colorScheme = getColorScheme(role.name);
  const permissions = Array.isArray(role.permissions) ? role.permissions : [];

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200 overflow-hidden", className)}>
      {/* Header with gradient */}
      <div className={cn("bg-gradient-to-br p-6 text-white", colorScheme.bg)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold truncate">{role.name}</h3>
              <p className="text-white/80 text-sm">
                {role.userCount !== undefined ? `${role.userCount} users` : 'Role permissions'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              to={`/roles/${role.id}`}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
              title="View role"
            >
              <EyeIcon className="h-4 w-4" />
            </Link>
            
            <HasPermission permission="role:write">
              <button
                onClick={() => onEdit(role)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                title="Edit role"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </HasPermission>
            
            <HasPermission permission="role:delete">
              <button
                onClick={() => onDelete(role)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                title="Delete role"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </HasPermission>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Description */}
        {role.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {role.description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {role.userCount !== undefined && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <UsersIcon className="h-4 w-4" />
                <span>{role.userCount} users</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <KeyIcon className="h-4 w-4" />
              <span>{permissions.length} permissions</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <CalendarIcon className="h-3 w-3" />
            <span>{formatDate(role.createdAt)}</span>
          </div>
        </div>

        {/* Permissions Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Permissions</h4>
            {permissions.length > 4 && (
              <span className="text-xs text-gray-500">
                +{permissions.length - 4} more
              </span>
            )}
          </div>
          
          {permissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {permissions.slice(0, 4).map((permission, index) => (
                <span
                  key={index}
                  className={cn(
                    "inline-flex px-3 py-1 text-xs font-medium rounded-full",
                    colorScheme.cardBg,
                    colorScheme.icon
                  )}
                >
                  {typeof permission === 'string' ? permission : (permission as any).name || (permission as any).action || permission}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <KeyIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No permissions assigned</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <Link
            to={`/roles/${role.id}`}
            className={cn(
              "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              "text-gray-700 bg-gray-100 hover:bg-gray-200 hover:scale-105"
            )}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </Link>
          
          <HasPermission permission="role:write">
            <button
              onClick={() => onEdit(role)}
              className={cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                colorScheme.icon,
                colorScheme.cardBg,
                "hover:scale-105"
              )}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
          </HasPermission>
        </div>
      </CardContent>
    </Card>
  );
}