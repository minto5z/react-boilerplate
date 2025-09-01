import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  fullScreenOnMobile?: boolean;
}

const sizeClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md lg:max-w-lg',
  lg: 'max-w-lg lg:max-w-2xl',
  xl: 'max-w-xl lg:max-w-4xl',
  '2xl': 'max-w-2xl lg:max-w-6xl',
  full: 'max-w-full',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  fullScreenOnMobile = false,
}: ModalProps) {
  const isFullScreenMobile = fullScreenOnMobile;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeOnOverlayClick ? onClose : () => {}}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className={cn(
            "flex min-h-full items-center justify-center text-center",
            isFullScreenMobile ? "p-0 sm:p-4" : "p-4"
          )}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden bg-white text-left align-middle shadow-2xl transition-all',
                  isFullScreenMobile 
                    ? 'h-full sm:h-auto sm:rounded-2xl sm:max-h-[90vh]' 
                    : 'rounded-2xl max-h-[90vh]',
                  sizeClasses[size],
                  className
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className={cn(
                    "flex items-start justify-between p-6 border-b border-gray-200",
                    isFullScreenMobile && "sticky top-0 bg-white z-10"
                  )}>
                    <div className="flex-1 min-w-0">
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className="text-lg sm:text-xl font-semibold leading-6 text-gray-900 truncate pr-4"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {description}
                        </p>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        type="button"
                        className="flex-shrink-0 ml-4 inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className={cn(
                  "overflow-y-auto",
                  (title || showCloseButton) ? "" : "p-6",
                  isFullScreenMobile && "flex-1"
                )}>
                  {(title || showCloseButton) ? (
                    <div className="p-6">
                      {children}
                    </div>
                  ) : (
                    children
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'destructive';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnOverlayClick={!loading}>
      <div className="text-center p-6">
        {/* Icon */}
        <div className={cn(
          "mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4",
          variant === 'destructive' ? 'bg-red-100' : 'bg-blue-100'
        )}>
          {variant === 'destructive' ? (
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={cn(
              'w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
              variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-primary hover:bg-primary-600 focus:ring-primary',
              loading && 'opacity-50 cursor-not-allowed'
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}