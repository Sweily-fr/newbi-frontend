import React, { useState } from 'react';
// Import du nouveau composant avec la disposition sur deux colonnes
import { EmailSignatureFormLayout } from '../features/email-signatures/components/EmailSignatureFormLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { SEOHead } from '../components/SEO/SEOHead';
import { Personalcard, Instagram, Paintbucket, Grid5, AddCircle, Sms, ArrowLeft } from 'iconsax-react';
import { CircularProgressBar } from '../features/email-signatures/components/CircularProgressBar';
import { useSignatureProgress } from '../features/email-signatures/hooks/useSignatureProgress';
import { SignatureData } from '../features/email-signatures/types';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_EMAIL_SIGNATURE, SET_DEFAULT_EMAIL_SIGNATURE, GET_EMAIL_SIGNATURES } from '../graphql/emailSignatures';
import { EmailSignaturesTable, EmailSignature } from '../components/business/EmailSignature/components/EmailSignaturesTable';
import { Notification } from '../components/feedback/Notification';
import { ConfirmationModal } from '../components/feedback/ConfirmationModal';
import { Button } from '../components/ui';
import { SearchInput } from '../components/ui';
import { Footer } from '../components/layout/Footer';

const EmailSignaturesPage: React.FC = () => {
  // État pour contrôler la section active dans la sidebar
  const [activeSection, setActiveSection] = useState<'info' | 'social' | 'appearance' | 'settings'>('info');
  
  // État pour stocker les données de signature
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  
  // État pour contrôler l'affichage du formulaire ou de la liste
  const [showForm, setShowForm] = useState(false);
  
  // État pour stocker la signature sélectionnée pour édition
  const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);
  
  // État pour la modale de confirmation
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  // État pour stocker la signature à supprimer
  const [signatureToDelete, setSignatureToDelete] = useState<EmailSignature | null>(null);
  
  // Requête pour récupérer les signatures
  const { data: signaturesData, loading } = useQuery(GET_EMAIL_SIGNATURES, {
    variables: { page: 1, limit: 10, search: '' },
    fetchPolicy: 'network-only'
  });
  
  // Vérifier si des signatures existent
  const hasSignatures = signaturesData?.emailSignatures?.items?.length > 0;
  
  // Calculer la progression de la signature
  const progress = useSignatureProgress(signatureData || {} as SignatureData);
  
  // Mutation pour supprimer une signature
  const [deleteEmailSignature] = useMutation(DELETE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success(`La signature "${signatureToDelete?.name}" a été supprimée avec succès.`);
      setSignatureToDelete(null);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la suppression de la signature: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Mutation pour définir une signature comme signature par défaut
  const [setDefaultEmailSignature] = useMutation(SET_DEFAULT_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success('La signature par défaut a été mise à jour avec succès.');
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la définition de la signature par défaut: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });
  
  // Fonction pour ouvrir le formulaire de création
  const handleAddSignature = () => {
    setSelectedSignature(null);
    setShowForm(true);
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEditSignature = (signature: EmailSignature) => {
    setSelectedSignature(signature);
    setShowForm(true);
  };

  // Fonction pour retourner à la liste des signatures
  const handleBackToList = () => {
    setShowForm(false);
    setSelectedSignature(null);
  };
  
  // Fonction pour gérer la suppression d'une signature
  const handleDeleteSignature = (signature: EmailSignature) => {
    setSignatureToDelete(signature);
    setConfirmModal({
      isOpen: true,
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer la signature "${signature.name}" ? Cette action est irréversible.`,
      onConfirm: () => {
        deleteEmailSignature({ variables: { id: signature.id } });
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  // Fonction pour définir une signature comme signature par défaut
  const handleSetDefault = (signature: EmailSignature) => {
    setDefaultEmailSignature({ variables: { id: signature.id } });
  };

  return (
    <div className="relative">
      <SEOHead 
        title="Créateur de Signatures Email Professionnelles | Newbi"
        description="Créez des signatures email professionnelles et personnalisées pour votre entreprise. Outil facile à utiliser et hautement personnalisable."
        keywords="signatures email, signature professionnelle, créateur de signature, email marketing, branding, signature d'entreprise"
        schemaType="WebApplication"
        schemaName="Créateur de Signatures Email Professionnelles"
        schemaPrice="14.99"
        ogImage="https://newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://newbi.fr/signatures-email"
        isPremium={true}
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
      />

      
      {/* Structure principale avec sidebar à l'extrême gauche */}
      <div className="flex w-full relative">
        {/* Espace réservé pour la sidebar */}
        <div className="w-20 flex-shrink-0"></div>
        
        {/* Contenu principal */}
        <main className="flex-1 container mx-auto pl-0 pr-4 py-8 mt-6" role="main" aria-label="Éditeur de signatures email">
          {showForm ? (
            <>
              {/* En-tête pour le formulaire avec bouton de retour */}
              <div className="flex items-center justify-between mb-6">
                <PageHeader
                  title="Signatures Email"
                  description="Créez et gérez vos signatures email professionnelles"
                />
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center justify-center rounded-lg font-medium focus:outline-none text-[#5b50ff] hover:bg-[#f0eeff] py-2 px-4 text-sm font-medium"
                >
                  <ArrowLeft size="20" color="#5b50ff" variant="Linear" className="mr-2" />
                  Retour au tableau
                </button>
              </div>
            </>
          ) : (
            <>
              {/* En-tête pour la liste des signatures */}
              <PageHeader
                title="Signatures Email"
                description="Créez et gérez vos signatures email professionnelles"
              />
              
              <div className="mt-6 mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Signatures Email</h2>
                
                {/* Barre de recherche et bouton alignés */}
                <div className="flex items-center justify-between">
                  <SearchInput 
                    placeholder="Rechercher une signature..." 
                    onChange={() => {}} 
                    className="w-full max-w-xs"
                  />
                  <button 
                    onClick={handleAddSignature}
                    className="inline-flex items-center justify-center rounded-lg font-medium focus:outline-none border border-transparent bg-[#5b50ff] text-white hover:bg-[#4a41d0] py-2 px-4 text-sm font-medium"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="#fff"/>
                      <path d="M16 12H8" stroke="#5b50ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16V8" stroke="#5b50ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Créer une signature
                  </button>
                </div>
              </div>
            </>
          )}
          
          {showForm ? (
            <>
              {/* Sidebar de navigation - positionnée à l'extrême gauche, fixée pour rester visible au scroll */}
              <div className="w-20 bg-white flex flex-col items-center py-8 fixed left-0 top-[80px] bottom-0 shadow-[2px_0px_5px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center space-y-8">
                  {/* Logo Newbi en haut */}
                  <div className="mb-8 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-[#b19aff]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#5b50ff]"></div>
                    </div>
                  </div>
                  
                  {/* Icône Informations */}
                  <button 
                    onClick={() => setActiveSection('info')} 
                    className={`p-2 rounded-xl transition-all ${activeSection === 'info' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
                  >
                    <Personalcard size="24" color={activeSection === 'info' ? '#5b50ff' : '#222'} variant={activeSection === 'info' ? 'Bold' : 'Linear'} />
                  </button>
                  
                  {/* Icône Réseaux sociaux */}
                  <button 
                    onClick={() => setActiveSection('social')} 
                    className={`p-2 rounded-xl transition-all ${activeSection === 'social' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
                  >
                    <Instagram size="24" color={activeSection === 'social' ? '#5b50ff' : '#222'} variant={activeSection === 'social' ? 'Bold' : 'Linear'} />
                  </button>
                  
                  {/* Icône Apparence */}
                  <button 
                    onClick={() => setActiveSection('appearance')} 
                    className={`p-2 rounded-xl transition-all ${activeSection === 'appearance' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
                  >
                    <Paintbucket size="24" color={activeSection === 'appearance' ? '#5b50ff' : '#222'} variant={activeSection === 'appearance' ? 'Bold' : 'Linear'} />
                  </button>
                  
                  {/* Icône Paramètres */}
                  <button 
                    onClick={() => setActiveSection('settings')} 
                    className={`p-2 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
                  >
                    <Grid5 size="24" color={activeSection === 'settings' ? '#5b50ff' : '#222'} variant={activeSection === 'settings' ? 'Bold' : 'Linear'} />
                  </button>
                </div>
                
                {/* Barre de progression circulaire en bas de la sidebar */}
                <div className="mt-auto mb-2 relative group">
                  <CircularProgressBar 
                    progress={progress} 
                    size={40} 
                    strokeWidth={2.5}
                    circleColor="#E3E2E5"
                    progressColor="#5b50ff"
                  />
                  <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Progression: {progress}%
                  </div>
                </div>
              </div>
              
              {/* Formulaire de signature */}
              <EmailSignatureFormLayout 
                defaultNewbiLogoUrl="/images/logo_newbi/SVG/Logo_Texte_Purple.svg"
                activeSection={activeSection}
                onSignatureDataChange={setSignatureData}
              />
            </>
          ) : (
            /* Tableau des signatures ou état vide */
            <div className="bg-white rounded-xl shadow-sm p-6">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5b50ff]"></div>
                </div>
              ) : hasSignatures ? (
                <EmailSignaturesTable
                  onAddSignature={handleAddSignature}
                  onEditSignature={handleEditSignature}
                  onDeleteSignature={handleDeleteSignature}
                  onSetDefault={handleSetDefault}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-[#f0eeff] p-4 rounded-full mb-4">
                    <Sms size="32" color="#5b50ff" variant="Bold" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune signature email</h3>
                  <p className="text-gray-500 max-w-md mb-6">Commencez par créer votre première signature email professionnelle.</p>
                  <button 
                    onClick={handleAddSignature}
                    className="inline-flex items-center justify-center rounded-lg font-medium focus:outline-none border border-transparent bg-[#5b50ff] text-white hover:bg-[#4a41d0] py-3 px-6 text-sm font-medium"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="#fff"/>
                      <path d="M16 12H8" stroke="#5b50ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16V8" stroke="#5b50ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Créer une signature
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Footer - affiché uniquement sur la vue tableau */}
      {!showForm && <Footer />}
      
      {/* Modale de confirmation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default EmailSignaturesPage;
