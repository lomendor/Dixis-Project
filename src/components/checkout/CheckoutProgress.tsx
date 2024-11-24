import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 'cart', name: 'Καλάθι' },
  { id: 'shipping', name: 'Αποστολή' },
  { id: 'payment', name: 'Πληρωμή' },
  { id: 'confirmation', name: 'Επιβεβαίωση' },
];

interface CheckoutProgressProps {
  currentStep: string;
  completedSteps: string[];
}

export function CheckoutProgress({ currentStep, completedSteps }: CheckoutProgressProps) {
  return (
    <nav aria-label="Βήματα Παραγγελίας">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <li
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'w-full' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted
                      ? 'bg-green-600'
                      : isCurrent
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  } transition-colors`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm ${
                      isCurrent ? 'text-white' : 'text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className={`mt-2 text-sm ${
                  isCurrent ? 'font-medium text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}