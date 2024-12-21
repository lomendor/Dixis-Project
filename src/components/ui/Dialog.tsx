import React, { Fragment } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

interface DialogPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className = '' }: DialogProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessDialog as="div" className={`relative z-50 ${className}`} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel 
                className={cn(
                  "relative transform overflow-hidden rounded-xl bg-white",
                  "p-6 text-left shadow-xl transition-all",
                  "w-full max-w-6xl mx-auto",
                  "ring-1 ring-gray-900/5",
                  className
                )}
              >
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
}

Dialog.Title = function DialogTitle({ 
  children, 
  className = '', 
  showCloseButton = true,
  onClose 
}: DialogTitleProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
      <HeadlessDialog.Title 
        className={`text-xl font-semibold text-gray-900 ${className}`}
      >
        {children}
      </HeadlessDialog.Title>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

Dialog.Panel = function DialogPanel({ children, className = '' }: DialogPanelProps) {
  return (
    <div className={cn(
      "relative transform overflow-hidden rounded-xl bg-white",
      "p-6 text-left shadow-xl transition-all",
      "w-full max-w-6xl mx-auto",
      "ring-1 ring-gray-900/5",
      className
    )}>
      {children}
    </div>
  );
}; 