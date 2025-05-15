import React from 'react';
import { Link } from 'react-router-dom';
import { PricingPlan } from '../../../constants/pricing';

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div className={`relative p-8 ${plan.bgColor} ${plan.recommended ? 'rounded-2xl shadow-lg' : 'border border-gray-200 rounded-2xl shadow-sm'} flex flex-col`}>
      {plan.recommended && (
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden rounded-2xl">
          <svg className="flex-shrink-0 h-64 w-64 text-blue-800 opacity-20" viewBox="0 0 184 184" xmlns="http://www.w3.org/2000/svg">
            <path d="M182 184a2 2 0 110-4 2 2 0 010 4zm-20-20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm-20 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 60a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-40a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-40a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
          </svg>
        </div>
      )}
      
      <div className="flex-1 relative">
        {plan.recommended && (
          <div className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-white text-blue-600">
            Recommandé
          </div>
        )}
        
        <h3 className={`${plan.recommended ? 'mt-4' : ''} text-xl font-semibold ${plan.textColor}`}>{plan.name}</h3>
        
        <p className={`mt-4 flex items-baseline ${plan.textColor}`}>
          <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
          <span className="ml-1 text-xl font-semibold">{plan.period}</span>
        </p>
        
        <p className={`mt-6 ${plan.recommended ? 'text-blue-100' : 'text-gray-500'}`}>
          {plan.description}
        </p>

        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex">
              <svg 
                className={`flex-shrink-0 h-6 w-6 ${plan.recommended ? 'text-white' : 'text-green-500'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className={`ml-3 ${plan.recommended ? 'text-blue-100' : 'text-gray-500'}`}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`mt-8 ${plan.recommended ? 'relative' : ''}`}>
        <Link
          to={plan.ctaLink}
          className={`w-full ${plan.buttonStyle} rounded-md py-3 px-5 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 text-center`}
        >
          {plan.ctaText}
        </Link>
      </div>
    </div>
  );
};
