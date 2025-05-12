import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
}

interface ProgressProps {
  steps: ProgressStep[];
  currentStepId?: string;
}

export const Progress: React.FC<ProgressProps> = ({ steps, currentStepId }) => {
  return (
    <div className="w-full">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Ligne de connexion entre les étapes */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute left-5 top-8 w-0.5 h-full -ml-px ${
                  step.completed ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
            )}
            
            <div className="relative flex items-start group">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.completed ? (
                    <CheckCircleIcon className="h-8 w-8" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="ml-4 min-w-0 flex-1">
                <div className="flex items-center">
                  <h3 className={`text-lg font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  {currentStepId === step.id && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      En cours
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{step.description}</p>
                
                {!step.completed && (
                  <a
                    href={step.href}
                    className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Compléter cette étape
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
