import React from 'react';
import { SignatureData } from '../../types';

interface TemplatesSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
  onSelectTemplate: (templateId: number) => void;
}

/**
 * Section pour choisir un modèle de signature email
 */
export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  signatureData,
  updateSignatureData,
  onSelectTemplate
}) => {
  // Définition des modèles de signature
  const templates = [
    { id: 1, name: 'Modèle 1', image: '/images/templates/template1.png' },
    { id: 2, name: 'Modèle 2', image: '/images/templates/template2.png' },
    { id: 3, name: 'Modèle 3', image: '/images/templates/template3.png' },
    { id: 4, name: 'Modèle 4', image: '/images/templates/template4.png' },
    { id: 5, name: 'Modèle 5', image: '/images/templates/template5.png' },
    { id: 6, name: 'Modèle 6', image: '/images/templates/template6.png' },
    { id: 7, name: 'Modèle 7', image: '/images/templates/template7.png' },
    { id: 8, name: 'Modèle 8', image: '/images/templates/template8.png' },
    { id: 9, name: 'Modèle 9', image: '/images/templates/template9.png' },
    { id: 10, name: 'Modèle 10', image: '/images/templates/template10.png' },
    { id: 11, name: 'Modèle 11', image: '/images/templates/template11.png' },
    { id: 12, name: 'Modèle 12', image: '/images/templates/template12.png' },
  ];

  // Fonction pour générer un placeholder pour les modèles sans image
  const generateTemplatePlaceholder = (templateId: number) => {
    // Différentes dispositions de placeholder selon le modèle
    switch (templateId) {
      case 1:
        return (
          <div className="flex items-start p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-3 bg-gray-100 w-1/3 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4"></div>
              <div className="flex mt-2">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 mb-2"></div>
            <div className="h-3 bg-gray-100 w-1/3 mb-2"></div>
            <div className="h-2 bg-gray-100 w-full mb-1"></div>
            <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
            <div className="flex">
              <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
              <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
              <div className="w-2 h-2 rounded-full bg-gray-100"></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-1/2 mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex justify-between p-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 ml-4 flex-shrink-0"></div>
          </div>
        );
      case 5:
        return (
          <div className="flex justify-between p-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 w-1/3 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-1"></div>
              <div className="h-2 bg-gray-100 w-1/2 mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 ml-4 flex-shrink-0"></div>
          </div>
        );
      case 6:
        return (
          <div className="flex p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-2 bg-gray-100 w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-1"></div>
              <div className="h-2 bg-gray-100 w-full mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="flex p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-2 bg-gray-100 w-1/3 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-col p-4">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
              <div className="ml-4 h-2 bg-gray-100 w-1/3"></div>
            </div>
            <div className="h-2 bg-gray-100 w-full mb-1"></div>
            <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 w-16 rounded-md mb-2"></div>
            <div className="flex">
              <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
              <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
              <div className="w-2 h-2 rounded-full bg-gray-100"></div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="flex justify-between p-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 w-1/3 mb-2"></div>
              <div className="h-2 bg-gray-100 w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="flex mb-2">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 ml-4 flex-shrink-0"></div>
          </div>
        );
      case 10:
        return (
          <div className="flex p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-2 bg-gray-100 w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="flex justify-between p-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 w-1/3 mb-2"></div>
              <div className="h-2 bg-gray-100 w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md mb-2"></div>
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 ml-4 flex-shrink-0"></div>
          </div>
        );
      case 12:
        return (
          <div className="flex p-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"></div>
            <div className="ml-4 flex-1">
              <div className="h-2 bg-gray-100 w-full mb-1"></div>
              <div className="h-2 bg-gray-100 w-3/4 mb-2"></div>
              <div className="flex mb-2">
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100 mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-gray-100"></div>
          </div>
        );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-8">Choisissez un modèle</h3>
      <p className="text-sm text-gray-600 mb-6">
        Sélectionnez un modèle de signature qui correspond à votre style professionnel. Vous pourrez personnaliser tous les détails par la suite.
      </p>
      
      {/* Conteneur avec position relative pour pouvoir positionner l'overlay */}
      <div className="relative">
        {/* Grille des modèles avec flou appliqué */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 blur-sm pointer-events-none">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`
                border rounded-lg overflow-hidden transition-all
                ${signatureData.templateId === template.id ? 'border-[#5b50ff] ring-2 ring-[#5b50ff]' : 'border-gray-200'}
              `}
            >
              <div className="bg-white rounded-lg overflow-hidden h-32">
                {generateTemplatePlaceholder(template.id)}
              </div>
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <p className="text-sm font-medium text-center">{template.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Overlay avec message "Fonctionnalité à venir" */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#5b50ff] bg-opacity-80 text-white py-3 px-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Fonctionnalité à venir</p>
            <p className="text-sm mt-1">Cette option sera disponible prochainement</p>
          </div>
        </div>
      </div>
    </div>
  );
};
