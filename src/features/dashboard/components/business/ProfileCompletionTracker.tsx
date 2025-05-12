import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../../../../graphql/profile';
import { GET_CLIENTS } from '../../../clients/graphql';
import { Progress, ProgressStep } from '../../../../components';
import { ROUTES } from '../../../../routes/constants';
import { Card } from '../../../../components';

export const ProfileCompletionTracker: React.FC = () => {
  const { data: profileData, loading: profileLoading } = useQuery(GET_PROFILE);
  const { data: clientsData, loading: clientsLoading } = useQuery(GET_CLIENTS);
  
  if (profileLoading || clientsLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }
  
  const user = profileData?.me;
  const clients = clientsData?.clients || [];
  
  // Vérifier si le profil est complet
  const isProfileComplete = user?.profile?.firstName && 
                           user?.profile?.lastName && 
                           user?.profile?.phone;
  
  // Vérifier si les informations de l'entreprise sont complètes
  const isCompanyComplete = user?.company?.name && 
                           user?.company?.email && 
                           user?.company?.phone && 
                           user?.company?.siret && 
                           user?.company?.address?.street && 
                           user?.company?.address?.city && 
                           user?.company?.address?.postalCode && 
                           user?.company?.address?.country;
  
  // Vérifier si les coordonnées bancaires sont complètes
  const isBankDetailsComplete = user?.company?.bankDetails?.iban && 
                               user?.company?.bankDetails?.bic && 
                               user?.company?.bankDetails?.bankName;
  
  // Vérifier si l'utilisateur a au moins un client
  const hasClients = clients.length > 0;
  
  // Calculer le pourcentage de complétion
  const completedSteps = [isProfileComplete, isCompanyComplete, isBankDetailsComplete, hasClients].filter(Boolean).length;
  const totalSteps = 4;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  // Définir les étapes
  const steps: ProgressStep[] = [
    {
      id: 'profile',
      title: 'Informations personnelles',
      description: 'Complétez vos informations de profil pour personnaliser votre expérience.',
      completed: isProfileComplete,
      href: ROUTES.PROFILE,
    },
    {
      id: 'company',
      title: 'Informations de l\'entreprise',
      description: 'Ajoutez les détails de votre entreprise qui apparaîtront sur vos documents.',
      completed: isCompanyComplete,
      href: ROUTES.PROFILE,
    },
    {
      id: 'bank',
      title: 'Coordonnées bancaires',
      description: 'Ajoutez vos coordonnées bancaires pour les inclure sur vos factures.',
      completed: isBankDetailsComplete,
      href: ROUTES.PROFILE,
    },
    {
      id: 'clients',
      title: 'Clients',
      description: 'Ajoutez vos premiers clients pour commencer à créer des devis et factures.',
      completed: hasClients,
      href: ROUTES.NEW_CLIENT,
    },
  ];
  
  // Trouver la première étape non complétée
  const nextStep = steps.find(step => !step.completed);
  
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Complétez votre profil</h2>
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <div className="text-xl font-bold text-blue-600">{completionPercentage}%</div>
          </div>
        </div>
      </div>
      
      {completionPercentage < 100 ? (
        <>
          <p className="text-gray-600 mb-6">
            Complétez les informations ci-dessous pour tirer le meilleur parti de Newbi.
          </p>
          
          <Progress steps={steps} currentStepId={nextStep?.id} />
          
          {nextStep && (
            <div className="mt-6 text-center">
              <a 
                href={nextStep.href}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Compléter l'étape suivante
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Profil complet !</h3>
          <p className="mt-2 text-sm text-gray-500">
            Félicitations ! Vous avez complété toutes les étapes nécessaires pour utiliser pleinement Newbi.
          </p>
        </div>
      )}
    </Card>
  );
};

// Icône de vérification
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
