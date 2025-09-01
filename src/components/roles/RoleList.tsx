import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  ShieldCheckIcon,
  UsersIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useRoles, useDeleteRole } from '../../hooks/api.hooks';
import { usePagination, useSearch } from '../../hooks/common.hooks';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Loading, ConfirmModal } from '../common';
import { HasPermission } from '../auth';
import { formatDate, cn } from '../../utils/helpers';
import { Role } from '../../types';
import { RoleCard } from './RoleCard';
import { PermissionMatrix } from './PermissionMatrix';
import { Menu, Transition } from '@headlessui/react';

export function RoleList() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'userCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const navigate = useNavigate();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch();
  const { page, limit, setPage } = usePagination(1, 12);
  
  const { data: rolesData, isLoading, error } = useRoles({
    search: debouncedSearchTerm,
    page,
    limit,
  });
  
  const deleteRoleMutation = useDeleteRole();

  const handleDelete = async () => {
    if (!selectedRole) return;
    
    try {
      await deleteRoleMutation.mutateAsync(selectedRole.id);
      setShowDeleteModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Delete role failed:', error);
    }
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const handleEdit = (role: Role) => {
    navigate(`/roles/${role.id}/edit`);
  };

  // Mock user count data - in real app this would come from the API
  const rolesWithUserCount = rolesData?.roles.map((role: any) => ({
    ...role,
    userCount: Math.floor(Math.random() * 50) + 1
  })) || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Roles</h3>
        <p className="text-red-600 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                Manage roles and permissions across your application
              </p>
            </div>
          </div>
        </div>
        
        <HasPermission permission="role:write">
          <Link to="/roles/new" className="w-full sm:w-auto">
            <Button 
              leftIcon={<PlusIcon className="h-4 w-4" />}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
            >
              Create Role
            </Button>
          </Link>
        </HasPermission>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Roles</p>
                <p className="text-2xl font-bold text-blue-900">{rolesData?.pagination?.total || 0}</p>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-900">
                  {rolesWithUserCount.reduce((sum: number, role: any) => sum + (role.userCount || 0), 0)}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Permissions</p>
                <p className="text-2xl font-bold text-orange-900">
                  {rolesWithUserCount.reduce((sum: number, role: any) => sum + (Array.isArray(role.permissions) ? role.permissions.length : 0), 0)}
                </p>
              </div>
              <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <KeyIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center space-x-1"
              >
                <Squares2X2Icon className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center space-x-1"
              >
                <ViewColumnsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12">
            <Loading className="text-center" />
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rolesWithUserCount.map((role: any) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Table view implementation here
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        loading={deleteRoleMutation.isPending}
      />
    </div>
  );
}