import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  UserIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useUsers, useDeleteUser, useActivateUser, useDeactivateUser, useBulkAssignRole, useBulkSendEmail, useBulkExport, useRoles } from '../../hooks/api.hooks';
import { usePagination, useSearch } from '../../hooks/common.hooks';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Loading, ConfirmModal } from '../common';
import { HasPermission } from '../auth';
import { cn } from '../../utils/helpers';
import { User } from '../../types';
import { UserFilters, UserFilterState } from './UserFilters';
import { BulkActions } from './BulkActions';
import { UserTable, SortConfig, SortField } from './UserTable';

export function UserList() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('activate');
  
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch();
  const { page, limit, setPage } = usePagination(1, 12);
  
  // Advanced filtering state
  const [filters, setFilters] = useState<UserFilterState>({
    status: 'all',
    verified: 'all',
    role: [],
    dateRange: {
      from: '',
      to: ''
    },
    search: ''
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc'
  });
  
  const { data: usersData, isLoading, error } = useUsers({
    search: debouncedSearchTerm,
    page,
    limit,
    sortBy: sortConfig.field === 'name' ? 'firstName' : 
           sortConfig.field === 'status' ? 'createdAt' :
           sortConfig.field === 'role' ? 'createdAt' :
           sortConfig.field === 'lastLoginAt' ? 'createdAt' :
           sortConfig.field as 'firstName' | 'lastName' | 'email' | 'createdAt' | 'updatedAt',
    sortOrder: sortConfig.direction.toUpperCase() as 'ASC' | 'DESC',
    isActive: filters.status !== 'all' ? filters.status === 'active' : undefined,
    emailVerified: filters.verified !== 'all' ? filters.verified === 'verified' : undefined,
    roleId: filters.role.length > 0 ? parseInt(filters.role[0]) : undefined,
  });
  
  const { data: rolesData } = useRoles();
  
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();
  const bulkAssignRoleMutation = useBulkAssignRole();
  const bulkSendEmailMutation = useBulkSendEmail();
  const bulkExportMutation = useBulkExport();
  
  // Filter and sort users
  const filteredUsers = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.filter((user: any) => {
      // Apply additional client-side filtering if needed
      return true;
    });
  }, [usersData]);
  
  // User selection handlers
  const handleUserSelect = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(selected => selected.id === user.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedUsers([]);
  };
  
  // Sorting handler
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // User action handlers

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Delete user failed:', error);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;
    
    try {
      if (statusAction === 'activate') {
        await activateUserMutation.mutateAsync(selectedUser.id);
      } else {
        await deactivateUserMutation.mutateAsync(selectedUser.id);
      }
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Status change failed:', error);
    }
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openStatusModal = (user: User, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setStatusAction(action);
    setShowStatusModal(true);
  };
  
  // Bulk action handlers
  const handleBulkActivate = async (userIds: string[]) => {
    for (const userId of userIds) {
      await activateUserMutation.mutateAsync(parseInt(userId));
    }
  };
  
  const handleBulkDeactivate = async (userIds: string[]) => {
    for (const userId of userIds) {
      await deactivateUserMutation.mutateAsync(parseInt(userId));
    }
  };
  
  const handleBulkDelete = async (userIds: string[]) => {
    for (const userId of userIds) {
      await deleteUserMutation.mutateAsync(parseInt(userId));
    }
  };
  
  const handleBulkAssignRole = async (userIds: string[], roleId: string) => {
    await bulkAssignRoleMutation.mutateAsync({
      userIds: userIds.map(id => parseInt(id)),
      roleId: parseInt(roleId)
    });
  };
  
  const handleBulkSendEmail = (userIds: string[]) => {
    bulkSendEmailMutation.mutate(userIds.map(id => parseInt(id)));
  };
  
  const handleBulkExport = (userIds: string[]) => {
    bulkExportMutation.mutate(userIds.map(id => parseInt(id)));
  };
  
  const handleFiltersReset = () => {
    setFilters({
      status: 'all',
      verified: 'all',
      role: [],
      dateRange: {
        from: '',
        to: ''
      },
      search: ''
    });
    setSearchTerm('');
  };
  
  // Update filters when search term changes
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        
        <HasPermission permission="user:write">
          <Link to="/users/new" className="w-full sm:w-auto">
            <Button 
              leftIcon={<PlusIcon className="h-4 w-4" />}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
            >
              Add User
            </Button>
          </Link>
        </HasPermission>
      </div>

      {/* Stats Cards - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{usersData?.pagination?.total || 0}</p>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {usersData?.users.filter((u: any) => u.isActive).length || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Inactive</p>
                <p className="text-2xl font-bold text-red-900">
                  {usersData?.users.filter((u: any) => !u.isActive).length || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Verified</p>
                <p className="text-2xl font-bold text-purple-900">
                  {usersData?.users.filter((u: any) => u.emailVerified).length || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search and Filters */}
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <CardTitle className="text-lg font-semibold">Search & Filter Users</CardTitle>
              <div className="relative w-full sm:w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <UserFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableRoles={rolesData?.roles || []}
              onReset={handleFiltersReset}
              totalResults={usersData?.pagination?.total || 0}
              filteredResults={filteredUsers.length}
            />
          </CardContent>
        </Card>
        
        {/* Bulk Actions */}
        <BulkActions
          selectedUsers={selectedUsers}
          onClearSelection={handleClearSelection}
          onBulkActivate={handleBulkActivate}
          onBulkDeactivate={handleBulkDeactivate}
          onBulkDelete={handleBulkDelete}
          onBulkAssignRole={handleBulkAssignRole}
          onBulkSendEmail={handleBulkSendEmail}
          onBulkExport={handleBulkExport}
          availableRoles={rolesData?.roles || []}
          isLoading={isLoading}
        />
        
        {/* Users Table/Cards */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelect}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={(user) => window.location.href = `/users/${user.id}/edit`}
              onDelete={openDeleteModal}
              onStatusChange={openStatusModal}
            />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Pagination */}
      {usersData?.pagination && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>Showing</span>
                <span className="font-semibold text-blue-600">
                  {((page - 1) * limit) + 1}
                </span>
                <span>to</span>
                <span className="font-semibold text-blue-600">
                  {Math.min(page * limit, usersData.pagination.total)}
                </span>
                <span>of</span>
                <span className="font-semibold text-blue-600">
                  {usersData.pagination.total}
                </span>
                <span>users</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, Math.ceil(usersData.pagination.total / limit)) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          "px-3 py-2 min-w-[40px]",
                          page === pageNum 
                            ? "bg-blue-600 text-white shadow-lg" 
                            : "border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(usersData.pagination.total / limit)}
                  className="px-4 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        loading={deleteUserMutation.isPending}
      />

      {/* Status change confirmation modal */}
      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusChange}
        title={`${statusAction === 'activate' ? 'Activate' : 'Deactivate'} User`}
        message={`Are you sure you want to ${statusAction} ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        confirmText={statusAction === 'activate' ? 'Activate' : 'Deactivate'}
        loading={activateUserMutation.isPending || deactivateUserMutation.isPending}
      />
    </div>
  );
}