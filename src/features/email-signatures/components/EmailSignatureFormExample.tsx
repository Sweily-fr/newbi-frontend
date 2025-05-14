import React, { useState } from 'react';
import { EmailSignatureFormLayout } from './EmailSignatureFormLayout';
import { useSaveSignature } from '../hooks';
import { useNavigate } from 'react-router-dom';

/**
 * Exemple simple d'utilisation du formulaire de signature avec sauvegarde
 */
export const EmailSignatureFormExample: React.FC = () => {
  // État pour la section active
  const [activeSection, setActiveSection] = useState<'info' | 'social' | 'appearance' | 'settings'>('info');
  
  // Hook de navigation
  const navigate = useNavigate();
  
  // Hook pour enregistrer la signature
  const { saveSignature, isLoading } = useSaveSignature();
  
  // Fonction pour gérer l'enregistrement de la signature
  const handleSave = async (data: any) => {
    if (isLoading) return;
    
    // Enregistrer la signature
    const success = await saveSignature(data);
    
    if (success) {
      // Rediriger vers la liste des signatures
      navigate('/email-signatures');
    }
  };
  
  // Fonction pour gérer l'annulation
  const handleCancel = () => {
    // Rediriger vers la liste des signatures
    navigate('/email-signatures');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer une signature de mail</h1>
        
        {/* Navigation entre les sections */}
        <div className="flex border-b border-gray-200 mt-6">
          <button
            className={`px-4 py-2 ${activeSection === 'info' ? 'border-b-2 border-[#5b50ff] text-[#5b50ff]' : 'text-gray-500'}`}
            onClick={() => setActiveSection('info')}
          >
            Informations
          </button>
          <button
            className={`px-4 py-2 ${activeSection === 'social' ? 'border-b-2 border-[#5b50ff] text-[#5b50ff]' : 'text-gray-500'}`}
            onClick={() => setActiveSection('social')}
          >
            Réseaux sociaux
          </button>
          <button
            className={`px-4 py-2 ${activeSection === 'appearance' ? 'border-b-2 border-[#5b50ff] text-[#5b50ff]' : 'text-gray-500'}`}
            onClick={() => setActiveSection('appearance')}
          >
            Apparence
          </button>
        </div>
        
        {/* Formulaire de signature */}
        <div className="mt-6">
          <EmailSignatureFormLayout
            defaultNewbiLogoUrl="/images/logo_newbi/SVG/Logo_Texte_Purple.svg"
            activeSection={activeSection}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};
