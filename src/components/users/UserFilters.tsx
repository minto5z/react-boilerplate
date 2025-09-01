import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Card, CardContent } from '../common';
import { cn } from '../../utils/helpers';

export interface UserFilterState {
  status: 'all' | 'active' | 'inactive';
  verified: 'all' | 'verified' | 'unverified';
  role: string[];
  dateRange: {
    from: string;
    to: string;
  };
  search: string;
}

interface UserFiltersProps {
  filters: UserFilterState;
  onFiltersChange: (filters: UserFilterState) => void;
  availableRoles: Array<{ id: string; name: string }>;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
}

const statusOptions = [
  { value: 'all', label: 'All Users', icon: UserGroupIcon },
  { value: 'active', label: 'Active Only', icon: CheckIcon },
  { value: 'inactive', label: 'Inactive Only', icon: XMarkIcon },
];

const verificationOptions = [
  { value: 'all', label: 'All Verification Status' },
  { value: 'verified', label: 'Verified Only' },
  { value: 'unverified', label: 'Unverified Only' },
];

export function UserFilters({
  filters,
  onFiltersChange,
  availableRoles,
  onReset,
  totalResults,
  filteredResults
}: UserFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.verified !== 'all',
    filters.role.length > 0,
    filters.dateRange.from || filters.dateRange.to,
  ].filter(Boolean).length;

  const handleStatusChange = (status: UserFilterState['status']) => {
    onFiltersChange({ ...filters, status });
  };

  const handleVerificationChange = (verified: UserFilterState['verified']) => {
    onFiltersChange({ ...filters, verified });
  };

  const handleRoleToggle = (roleId: string) => {
    const newRoles = filters.role.includes(roleId)
      ? filters.role.filter(id => id !== roleId)
      : [...filters.role, roleId];
    onFiltersChange({ ...filters, role: newRoles });
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDownIcon 
              className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} 
            />
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredResults === totalResults ? (
            <span>{totalResults} users</span>
          ) : (
            <span className="font-medium">
              {filteredResults} of {totalResults} users
            </span>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <Transition
        show={isExpanded}
        enter="transition-all duration-200"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-96"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 max-h-96"
        leaveTo="opacity-0 max-h-0"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <UserGroupIcon className="h-4 w-4 text-gray-500" />
                  <span>Status</span>
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={filters.status === option.value}
                        onChange={() => handleStatusChange(option.value as UserFilterState['status'])}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary/20"
                      />
                      <div className="flex items-center space-x-2">
                        <option.icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verification Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
                  <span>Verification</span>
                </label>
                <div className="space-y-2">
                  {verificationOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="verification"
                        value={option.value}
                        checked={filters.verified === option.value}
                        onChange={() => handleVerificationChange(option.value as UserFilterState['verified'])}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary/20"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Roles</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableRoles.map((role) => (
                    <label key={role.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.role.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                      />
                      <span className="text-sm text-gray-700">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                  <span>Created Date</span>
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">From</label>
                    <Input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => handleDateRangeChange('from', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">To</label>
                    <Input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => handleDateRangeChange('to', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filter Tags */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Status: {statusOptions.find(o => o.value === filters.status)?.label}
                      <button
                        onClick={() => handleStatusChange('all')}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.verified !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verification: {verificationOptions.find(o => o.value === filters.verified)?.label}
                      <button
                        onClick={() => handleVerificationChange('all')}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 text-green-600 hover:text-green-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.role.map((roleId) => {
                    const role = availableRoles.find(r => r.id === roleId);
                    return role ? (
                      <span key={roleId} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Role: {role.name}
                        <button
                          onClick={() => handleRoleToggle(roleId)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 text-purple-600 hover:text-purple-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  
                  {(filters.dateRange.from || filters.dateRange.to) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Date Range
                      <button
                        onClick={() => handleDateRangeChange('from', '')}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 text-orange-600 hover:text-orange-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Transition>
    </div>
  );
}