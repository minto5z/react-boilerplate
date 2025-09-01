import React, { useState } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../common';
import { cn } from '../../utils/helpers';

export interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
  description?: string;
  category: string;
  level: 'read' | 'write' | 'delete' | 'admin';
}

export interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

interface PermissionMatrixProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onSelectAll: (category: string) => void;
  onClearAll: (category: string) => void;
  readonly?: boolean;
  showCategories?: boolean;
}

const actionIcons = {
  read: EyeIcon,
  write: PencilIcon,
  delete: TrashIcon,
  admin: ShieldCheckIcon,
  create: PlusIcon,
};

const levelColors = {
  read: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-500'
  },
  write: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-500'
  },
  delete: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: 'text-red-500'
  },
  admin: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-500'
  }
};

export function PermissionMatrix({
  permissions,
  selectedPermissions,
  onPermissionToggle,
  onSelectAll,
  onClearAll,
  readonly = false,
  showCategories = true
}: PermissionMatrixProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Group permissions by category
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const category = permission.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isPermissionSelected = (permissionId: string) => {
    return selectedPermissions.includes(permissionId);
  };

  const getCategoryStats = (categoryPermissions: Permission[]) => {
    const total = categoryPermissions.length;
    const selected = categoryPermissions.filter(p => isPermissionSelected(p.id)).length;
    return { total, selected };
  };

  const getActionIcon = (permission: Permission) => {
    const action = permission.action.toLowerCase();
    const Icon = actionIcons[action as keyof typeof actionIcons] || LockClosedIcon;
    return Icon;
  };

  const getLevelStyles = (level: Permission['level']) => {
    return levelColors[level] || levelColors.read;
  };

  if (!showCategories) {
    // Simple grid view without categories
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {permissions.map((permission) => {
          const Icon = getActionIcon(permission);
          const levelStyles = getLevelStyles(permission.level);
          const isSelected = isPermissionSelected(permission.id);

          return (
            <div
              key={permission.id}
              className={cn(
                "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : `${levelStyles.border} ${levelStyles.bg} hover:shadow-md`,
                readonly && "cursor-default"
              )}
              onClick={() => !readonly && onPermissionToggle(permission.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-primary text-white" : `${levelStyles.bg} ${levelStyles.icon}`
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "text-sm font-semibold truncate",
                      isSelected ? "text-primary" : levelStyles.text
                    )}>
                      {permission.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {permission.resource} • {permission.action}
                    </p>
                    {permission.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {!readonly && (
                  <div className={cn(
                    "flex-shrink-0 ml-2 h-5 w-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "border-gray-300 hover:border-primary"
                  )}>
                    {isSelected && <CheckIcon className="h-3 w-3" />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
        const isExpanded = expandedCategories.includes(category);
        const { total, selected } = getCategoryStats(categoryPermissions);
        const isAllSelected = selected === total;
        const isPartiallySelected = selected > 0 && selected < total;

        return (
          <Card key={category} className="overflow-hidden">
            <CardHeader
              className={cn(
                "cursor-pointer hover:bg-gray-50 transition-colors duration-200",
                readonly && "cursor-default hover:bg-white"
              )}
              onClick={() => !readonly && toggleCategory(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {!readonly && (
                    <div className="transition-transform duration-200">
                      {isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {category}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {selected} of {total} permissions selected
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Progress indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          isAllSelected ? "bg-green-500" : 
                          isPartiallySelected ? "bg-yellow-500" : "bg-gray-300"
                        )}
                        style={{ width: `${(selected / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round((selected / total) * 100)}%
                    </span>
                  </div>

                  {!readonly && (
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAll(category);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearAll(category);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            {(isExpanded || readonly) && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryPermissions.map((permission) => {
                    const Icon = getActionIcon(permission);
                    const levelStyles = getLevelStyles(permission.level);
                    const isSelected = isPermissionSelected(permission.id);

                    return (
                      <div
                        key={permission.id}
                        className={cn(
                          "relative p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : `${levelStyles.border} ${levelStyles.bg} hover:shadow-sm`,
                          readonly && "cursor-default"
                        )}
                        onClick={() => !readonly && onPermissionToggle(permission.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "flex-shrink-0 h-6 w-6 rounded flex items-center justify-center",
                            isSelected ? "bg-primary text-white" : `${levelStyles.bg} ${levelStyles.icon}`
                          )}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className={cn(
                              "text-sm font-medium truncate",
                              isSelected ? "text-primary" : levelStyles.text
                            )}>
                              {permission.name}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {permission.action}
                            </p>
                          </div>
                          
                          {!readonly && (
                            <div className={cn(
                              "flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-all duration-200",
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-gray-300"
                            )}>
                              {isSelected && <CheckIcon className="h-2.5 w-2.5" />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}