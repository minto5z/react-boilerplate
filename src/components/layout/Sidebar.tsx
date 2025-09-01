import React from 'react';
import { NavLink } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/auth.context';
import { HasPermission } from '../auth';
import { cn, getInitials } from '../../utils/helpers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<any>;
  permission?: string;
  description?: string;
}

const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    to: '/dashboard', 
    icon: HomeIcon,
    description: 'Overview and statistics'
  },
  { 
    name: 'Users', 
    to: '/users', 
    icon: UsersIcon, 
    permission: 'user:read',
    description: 'Manage system users'
  },
  { 
    name: 'Roles', 
    to: '/roles', 
    icon: ShieldCheckIcon, 
    permission: 'role:read',
    description: 'Manage user roles and permissions'
  },
  { 
    name: 'Profile', 
    to: '/profile', 
    icon: UserIcon,
    description: 'Your profile settings'
  },
  { 
    name: 'Analytics', 
    to: '/analytics', 
    icon: ChartBarIcon, 
    permission: 'analytics:read',
    description: 'View system analytics'
  },
  { 
    name: 'Reports', 
    to: '/reports', 
    icon: DocumentTextIcon, 
    permission: 'reports:read',
    description: 'Generate and view reports'
  },
  { 
    name: 'Settings', 
    to: '/settings', 
    icon: Cog6ToothIcon,
    description: 'Application settings'
  }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const NavItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const linkContent = (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          cn(
            'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
            isActive
              ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )
        }
        onClick={() => onClose()}
      >
        <item.icon
          className={cn(
            'mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200',
            'group-hover:scale-110'
          )}
        />
        <span className="truncate">{item.name}</span>
        {item.description && (
          <span className="sr-only">{item.description}</span>
        )}
      </NavLink>
    );

    if (item.permission) {
      return (
        <HasPermission permission={item.permission as any}>
          {linkContent}
        </HasPermission>
      );
    }

    return linkContent;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* User info */}
      <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-gray-200/50">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center text-lg font-semibold shadow-lg">
            {user?.firstName && user?.lastName ? (
              getInitials(user.firstName, user.lastName)
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
          </div>
        </div>
        <div className="ml-4 min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
          <p className="text-xs text-primary font-medium mt-1 truncate">
            {user?.role?.name}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* App info */}
      <div className="flex-shrink-0 border-t border-gray-200/50 p-4 bg-gray-50/50">
        <div className="text-xs text-gray-500">
          <div className="font-semibold text-gray-700">
            {import.meta.env.VITE_APP_NAME || 'React App'}
          </div>
          <div className="mt-1">
            Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200/50 shadow-lg">
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Transition show={isOpen}>
        <div className="fixed inset-0 flex z-50 lg:hidden">
          {/* Backdrop */}
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" 
              onClick={onClose}
            />
          </Transition.Child>
          
          {/* Sidebar panel */}
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
              {/* Close button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  onClick={onClose}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              {/* Sidebar content */}
              <div className="flex-1 h-0 overflow-y-auto">
                {sidebarContent}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
}