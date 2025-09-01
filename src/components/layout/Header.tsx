import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/auth.context';
import { Button } from '../common';
import { cn, getInitials } from '../../utils/helpers';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left section - Mobile menu + Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              {isSidebarOpen ? (
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center group"
            >
              <div className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl font-bold text-primary group-hover:text-primary-600 transition-colors duration-200">
                  {import.meta.env.VITE_APP_NAME || 'React App'}
                </h1>
              </div>
            </Link>

            {/* Desktop Search - Hidden on mobile */}
            <div className="hidden md:block ml-4 lg:ml-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 lg:w-80 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Right section - Actions + Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                  <span className="sr-only">Open user menu</span>
                  {user?.firstName && user?.lastName ? (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium shadow-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  ) : (
                    <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
                  )}
                  {/* User name on larger screens */}
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-28 truncate">
                    {user?.firstName}
                  </span>
                </Menu.Button>
              </div>
              
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-primary font-medium mt-1">
                      {user?.role?.name}
                    </p>
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={cn(
                            'flex items-center px-4 py-2.5 text-sm transition-colors duration-150',
                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          <UserCircleIcon className="mr-3 h-4 w-4 text-gray-400" />
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={cn(
                            'flex items-center px-4 py-2.5 text-sm transition-colors duration-150',
                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                          )}
                        >
                          <Cog6ToothIcon className="mr-3 h-4 w-4 text-gray-400" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className={cn(
                            'flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-150 disabled:opacity-50',
                            active ? 'bg-gray-50 text-red-600' : 'text-gray-700'
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-gray-400" />
                          {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}