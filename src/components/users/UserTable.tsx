import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, Loading } from '../common';
import { HasPermission } from '../auth';
import { formatDate, cn, getInitials } from '../../utils/helpers';
import { User } from '../../types';

export type SortField = 'name' | 'email' | 'role' | 'status' | 'createdAt' | 'lastLoginAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  selectedUsers: User[];
  onUserSelect: (user: User) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  sortConfig?: SortConfig;
  onSort: (field: SortField) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onStatusChange: (user: User, action: 'activate' | 'deactivate') => void;
}

const sortableColumns: Array<{
  field: SortField;
  label: string;
  className?: string;
}> = [
  { field: 'name', label: 'User', className: 'text-left' },
  { field: 'role', label: 'Role', className: 'text-left' },
  { field: 'status', label: 'Status', className: 'text-left' },
  { field: 'createdAt', label: 'Created', className: 'text-left' },
];

export function UserTable({
  users,
  isLoading = false,
  selectedUsers,
  onUserSelect,
  onSelectAll,
  onClearSelection,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onStatusChange
}: UserTableProps) {
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isPartiallySelected = selectedUsers.length > 0 && !isAllSelected;

  const getSortIcon = (field: SortField) => {
    if (!sortConfig || sortConfig.field !== field) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-primary" />
      : <ChevronDownIcon className="h-4 w-4 text-primary" />;
  };

  const isUserSelected = (user: User) => {
    return selectedUsers.some(selected => selected.id === user.id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Loading className="py-12" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Select All Checkbox */}
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isPartiallySelected;
                      }}
                      onChange={isAllSelected ? onClearSelection : onSelectAll}
                    />
                  </th>
                  
                  {/* Sortable Columns */}
                  {sortableColumns.map((column) => (
                    <th key={column.field} className={cn("px-6 py-4", column.className)}>
                      <button
                        onClick={() => onSort(column.field)}
                        className="group inline-flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        <span>{column.label}</span>
                        {getSortIcon(column.field)}
                      </button>
                    </th>
                  ))}
                  
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className={cn(
                      "hover:bg-gray-50 transition-colors duration-150",
                      isUserSelected(user) && "bg-blue-50"
                    )}
                  >
                    {/* Selection Checkbox */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                        checked={isUserSelected(user)}
                        onChange={() => onUserSelect(user)}
                      />
                    </td>
                    
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg">
                            {user.firstName && user.lastName ? (
                              getInitials(user.firstName, user.lastName)
                            ) : (
                              <UserIcon className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-48">
                            {user.email}
                          </div>
                          {(user as any).lastLoginAt && (
                            <div className="text-xs text-gray-400">
                              Last login: {formatDate((user as any).lastLoginAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role?.name}
                      </span>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        )}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.emailVerified && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Created Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{formatDate(user.createdAt)}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-primary hover:text-primary-600 p-2 rounded-lg hover:bg-primary/5 transition-all duration-200"
                          title="View user"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        
                        <HasPermission permission="user:write">
                          <button
                            onClick={() => onEdit(user)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            title="Edit user"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => onStatusChange(user, user.isActive ? 'deactivate' : 'activate')}
                            className={cn(
                              'p-2 rounded-lg transition-all duration-200',
                              user.isActive 
                                ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            )}
                            title={user.isActive ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.isActive ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => onDelete(user)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                            title="Delete user"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </HasPermission>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {/* Select All Header */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={isAllSelected ? onClearSelection : onSelectAll}
            />
            <span className="text-sm font-medium text-gray-700">
              {isAllSelected ? 'Deselect all' : 'Select all'}
              {selectedUsers.length > 0 && ` (${selectedUsers.length} selected)`}
            </span>
          </label>
        </div>

        {users.map((user) => (
          <Card 
            key={user.id} 
            className={cn(
              "hover:shadow-md transition-all duration-200",
              isUserSelected(user) && "ring-2 ring-primary/20 bg-blue-50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Selection Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                    checked={isUserSelected(user)}
                    onChange={() => onUserSelect(user)}
                  />
                </div>
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg">
                    {user.firstName && user.lastName ? (
                      getInitials(user.firstName, user.lastName)
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role?.name}
                        </span>
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        )}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.emailVerified && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-2">
                      <Link
                        to={`/users/${user.id}`}
                        className="text-primary hover:text-primary-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      
                      <HasPermission permission="user:write">
                        <button
                          onClick={() => onEdit(user)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => onStatusChange(user, user.isActive ? 'deactivate' : 'activate')}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            user.isActive 
                              ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          )}
                        >
                          {user.isActive ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => onDelete(user)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </HasPermission>
                    </div>
                  </div>
                  
                  {/* Created Date */}
                  <p className="mt-2 text-xs text-gray-400">
                    Created {formatDate(user.createdAt)}
                    {(user as any).lastLoginAt && (
                      <span className="ml-2">• Last login {formatDate((user as any).lastLoginAt)}</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}