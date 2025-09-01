import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  ChevronDownIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ArchiveBoxIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { Button, ConfirmModal } from '../common';
import { cn } from '../../utils/helpers';
import { User } from '../../types';

interface BulkActionsProps {
  selectedUsers: User[];
  onClearSelection: () => void;
  onBulkActivate: (userIds: string[]) => Promise<void>;
  onBulkDeactivate: (userIds: string[]) => Promise<void>;
  onBulkDelete: (userIds: string[]) => Promise<void>;
  onBulkAssignRole: (userIds: string[], roleId: string) => Promise<void>;
  onBulkSendEmail: (userIds: string[]) => void;
  onBulkExport: (userIds: string[]) => void;
  availableRoles: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export function BulkActions({
  selectedUsers,
  onClearSelection,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onBulkAssignRole,
  onBulkSendEmail,
  onBulkExport,
  availableRoles,
  isLoading = false
}: BulkActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const selectedCount = selectedUsers.length;
  const selectedIds = selectedUsers.map(user => user.id.toString());
  const hasActiveUsers = selectedUsers.some(user => user.isActive);
  const hasInactiveUsers = selectedUsers.some(user => !user.isActive);

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkAction = async (action: () => Promise<void>, actionName: string) => {
    setActionLoading(actionName);
    try {
      await action();
      onClearSelection();
    } catch (error) {
      console.error(`Bulk ${actionName} failed:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    await handleBulkAction(() => onBulkDelete(selectedIds), 'delete');
    setShowDeleteModal(false);
  };

  const handleBulkDeactivate = async () => {
    await handleBulkAction(() => onBulkDeactivate(selectedIds), 'deactivate');
    setShowDeactivateModal(false);
  };

  const bulkActions = [
    {
      name: 'Activate Users',
      icon: CheckIcon,
      action: () => handleBulkAction(() => onBulkActivate(selectedIds), 'activate'),
      disabled: !hasInactiveUsers,
      variant: 'success' as const,
      description: 'Activate selected users'
    },
    {
      name: 'Deactivate Users',
      icon: XMarkIcon,
      action: () => setShowDeactivateModal(true),
      disabled: !hasActiveUsers,
      variant: 'warning' as const,
      description: 'Deactivate selected users'
    },
    {
      name: 'Send Email',
      icon: EnvelopeIcon,
      action: () => onBulkSendEmail(selectedIds),
      disabled: false,
      variant: 'default' as const,
      description: 'Send email to selected users'
    },
    {
      name: 'Export Data',
      icon: DocumentArrowDownIcon,
      action: () => onBulkExport(selectedIds),
      disabled: false,
      variant: 'default' as const,
      description: 'Export selected users data'
    },
    {
      name: 'Delete Users',
      icon: TrashIcon,
      action: () => setShowDeleteModal(true),
      disabled: false,
      variant: 'destructive' as const,
      description: 'Permanently delete selected users'
    }
  ];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-gray-500">
                  Choose an action to apply to all selected users
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            {hasInactiveUsers && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction(() => onBulkActivate(selectedIds), 'activate')}
                disabled={isLoading || actionLoading !== null}
                loading={actionLoading === 'activate'}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Activate
              </Button>
            )}

            {hasActiveUsers && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeactivateModal(true)}
                disabled={isLoading || actionLoading !== null}
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
            )}

            {/* More Actions Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button
                as={Button}
                size="sm"
                variant="outline"
                disabled={isLoading || actionLoading !== null}
                className="flex items-center space-x-1"
              >
                <span>More</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* Role Assignment */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Assign Role
                    </p>
                  </div>
                  {availableRoles.map((role) => (
                    <Menu.Item key={role.id}>
                      {({ active }) => (
                        <button
                          onClick={() => handleBulkAction(() => onBulkAssignRole(selectedIds, role.id), 'assign-role')}
                          disabled={actionLoading !== null}
                          className={cn(
                            'flex items-center w-full px-3 py-2 text-sm transition-colors duration-150',
                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                            actionLoading === 'assign-role' && 'opacity-50'
                          )}
                        >
                          <ShieldCheckIcon className="mr-3 h-4 w-4 text-gray-400" />
                          <div className="flex-1 text-left">
                            <span>Assign as {role.name}</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}

                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Other Actions */}
                  {bulkActions.map((action) => (
                    <Menu.Item key={action.name}>
                      {({ active }) => (
                        <button
                          onClick={action.action}
                          disabled={action.disabled || actionLoading !== null}
                          className={cn(
                            'flex items-center w-full px-3 py-2 text-sm transition-colors duration-150',
                            active && !action.disabled ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                            action.disabled && 'opacity-50 cursor-not-allowed',
                            action.variant === 'destructive' && active && !action.disabled && 'bg-red-50 text-red-700'
                          )}
                        >
                          <action.icon className={cn(
                            "mr-3 h-4 w-4",
                            action.variant === 'success' && 'text-green-500',
                            action.variant === 'warning' && 'text-orange-500',
                            action.variant === 'destructive' && 'text-red-500',
                            action.variant === 'default' && 'text-gray-400'
                          )} />
                          <div className="flex-1 text-left">
                            <span>{action.name}</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {action.description}
                            </p>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Clear Selection */}
            <Button
              size="sm"
              variant="outline"
              onClick={onClearSelection}
              disabled={isLoading || actionLoading !== null}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Users"
        message={`Are you sure you want to delete ${selectedCount} user${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        loading={actionLoading === 'delete'}
      />

      {/* Deactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleBulkDeactivate}
        title="Deactivate Selected Users"
        message={`Are you sure you want to deactivate ${selectedCount} user${selectedCount !== 1 ? 's' : ''}?`}
        confirmText="Deactivate All"
        loading={actionLoading === 'deactivate'}
      />
    </>
  );
}