import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmailSignatureFormLayout } from './EmailSignatureFormLayout';
import { useGetSignature, useSaveSignature } from '../hooks';
import { Notification } from '../../../components/common/Notification';

/**
 * Composant pour éditer une signature existante ou en créer une nouvelle
 * Ce composant préserve le visuel existant tout en ajoutant la logique d'enregistrement
 */
export const EmailSignatureEditForm: React.FC = () => {
  // Récupérer l'ID de la signature depuis l'URL si disponible
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // État pour la section active
  const [activeSection, setActiveSection] = useState<'info' | 'social' | 'appearance' | 'settings'>('info');
  
  // Récupérer les données de la signature si un ID est fourni
  const { signatureData, loading: loadingSignature } = useGetSignature(id);
  
  // Hook pour enregistrer la signature
  const { saveSignature, isLoading: savingSignature } = useSaveSignature();
  
  // Fonction pour gérer l'enregistrement de la signature
  const handleSave = async (data: any) => {
    if (savingSignature) return;
    
    try {
      // Enregistrer la signature
      const success = await saveSignature(data, id);
      
      if (success) {
        Notification.success(id ? 'Signature mise à jour avec succès' : 'Signature créée avec succès');
        // Rediriger vers la liste des signatures
        navigate('/email-signatures');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la signature:', error);
      Notification.error('Une erreur est survenue lors de l\'enregistrement de la signature');
    }
  };
  
  // Fonction pour gérer l'annulation
  const handleCancel = () => {
    // Rediriger vers la liste des signatures
    navigate('/email-signatures');
  };
  
  // Afficher un indicateur de chargement pendant la récupération des données
  if (id && loadingSignature) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Modifier la signature' : 'Créer une signature de mail'}
        </h1>
        
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
          <button
            className={`px-4 py-2 ${activeSection === 'settings' ? 'border-b-2 border-[#5b50ff] text-[#5b50ff]' : 'text-gray-500'}`}
            onClick={() => setActiveSection('settings')}
          >
            Paramètres
          </button>
        </div>
        
        {/* Formulaire de signature */}
        <div className="mt-6">
          <EmailSignatureFormLayout
            defaultNewbiLogoUrl="/images/logo_newbi/SVG/Logo_Texte_Purple.svg"
            activeSection={activeSection}
            onSave={handleSave}
            onCancel={handleCancel}
            // Passer les données initiales si disponibles
            initialData={signatureData || undefined}
          />
        </div>
      </div>
    </div>
  );
};
