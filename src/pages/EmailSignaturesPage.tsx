import React, { useState } from 'react';
import { EmailSignatureFormLayout } from '../features/email-signatures/components/EmailSignatureFormLayout';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { Personalcard, Instagram, Paintbucket, Grid5, AddCircle, Sms, ArrowLeft } from 'iconsax-react';
import { NavigationSidebar } from '../components/common/NavigationSidebar/NavigationSidebar';
import { useSignatureProgress } from '../features/email-signatures/hooks/useSignatureProgress';
import { useSaveSignature } from '../features/email-signatures/hooks';
import { SignatureData } from '../features/email-signatures/types';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_EMAIL_SIGNATURE, SET_DEFAULT_EMAIL_SIGNATURE, GET_EMAIL_SIGNATURES } from '../graphql/emailSignatures';
import { EmailSignaturesTable, EmailSignature } from '../features/email-signatures/components/EmailSignaturesTable';
import { Notification } from '../components/common/Notification';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Button } from '../components/';
import { SearchInput } from '../components/';
import { Footer } from '../components/layout/Footer';

const EmailSignaturesPage: React.FC = () => {
  // État pour contrôler la section active dans la sidebar
  const [activeSection, setActiveSection] = useState<'info' | 'social' | 'appearance' | 'settings'>('info');
  
  // État pour stocker les données de signature
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // État pour contrôler l'affichage du formulaire ou de la liste
  const [showForm, setShowForm] = useState(false);
  
  // État pour stocker la signature sélectionnée pour édition
  const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);
  
  // Hook pour sauvegarder la signature
  const { saveSignature, isLoading: saveLoading, validationErrors } = useSaveSignature();
  
  // Fonction pour gérer l'enregistrement de la signature
  const handleSave = async (data: SignatureData) => {
    
    // Si une signature est sélectionnée pour édition, transmettre son ID
    const success = await saveSignature(data, selectedSignature?.id);
    
    if (success) {
      // Réinitialiser le formulaire et afficher la liste des signatures
      setShowForm(false);
      setSelectedSignature(null); // Réinitialiser la signature sélectionnée
      
      // Rafraîchir la liste des signatures
      refetch();
      
      // Faire défiler la page vers le haut avec une animation fluide
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setShowForm(false);
    setSelectedSignature(null);
    
    // Faire défiler la page vers le haut avec une animation fluide
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Fonction pour retourner à la liste des signatures
  const handleBackToList = () => {
    setShowForm(false);
    setSelectedSignature(null);
    
    // Faire défiler la page vers le haut avec une animation fluide
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Fonction pour ajouter une nouvelle signature
  const handleAddSignature = () => {
    setShowForm(true);
    setSelectedSignature(null);
  };
  
  // Fonction pour éditer une signature existante
  const handleEditSignature = (signature: EmailSignature) => {
    setSelectedSignature(signature);
    setShowForm(true);
  };
  
  // Fonction pour supprimer une signature
  const handleDeleteSignature = (signature: EmailSignature) => {
    setSignatureToDelete(signature);
    setConfirmModal({
      isOpen: true,
      title: "Supprimer la signature",
      message: `Êtes-vous sûr de vouloir supprimer la signature "${signature.name}" ?`,
      onConfirm: () => {
        deleteEmailSignature({ variables: { id: signature.id } });
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };
  
  // Fonction pour convertir une signature en données de formulaire
  const convertSignatureToFormData = (signature: EmailSignature | null): SignatureData | null => {
    if (!signature) return null;
    
    return {
      name: signature.name,
      isDefault: signature.isDefault || false,
      templateId: signature.templateId || 'simple',
      
      // Informations personnelles
      primaryColor: signature.primaryColor || '#5b50ff',
      secondaryColor: signature.secondaryColor || '#f0eeff',
      fullName: signature.fullName || '',
      jobTitle: signature.jobTitle || '',
      email: signature.email || '',
      phone: signature.phone || '',
      mobilePhone: signature.mobilePhone || '',
      profilePhotoUrl: signature.profilePhotoUrl || '',
      profilePhotoBase64: signature.profilePhotoBase64 || '',
      profilePhotoSize: signature.profilePhotoSize || 80,
      
      // Informations entreprise
      companyName: signature.companyName || '',
      companyWebsite: signature.website || '',
      companyAddress: signature.address || '',
      
      // Options d'affichage des icônes
      showEmailIcon: signature.showEmailIcon || false,
      showPhoneIcon: signature.showPhoneIcon || false,
      showAddressIcon: signature.showAddressIcon || false,
      showWebsiteIcon: signature.showWebsiteIcon || false,
      
      // Réseaux sociaux
      socialLinks: {
        linkedin: signature.linkedin || signature.socialLinks?.linkedin || '',
        twitter: signature.twitter || signature.socialLinks?.twitter || '',
        facebook: signature.facebook || signature.socialLinks?.facebook || '',
        instagram: signature.instagram || signature.socialLinks?.instagram || '',
      },
      socialLinksDisplayMode: signature.socialLinksDisplayMode || signature.displayMode || 'icons',
      socialLinksIconStyle: signature.socialLinksIconStyle || signature.iconStyle || 'rounded',
      socialLinksPosition: signature.socialLinksPosition || 'bottom',
      socialLinksIconColor: signature.primaryColor || '#5b50ff',
      
      // Apparence
      useNewbiLogo: signature.useNewbiLogo || signature.hasLogo || false,
      customLogoUrl: signature.customLogoUrl || signature.logoUrl || '',
      showLogo: signature.showLogo || false,
      fontFamily: signature.fontFamily || 'Arial',
      fontSize: signature.fontSize || 14,
      textStyle: signature.textStyle || signature.style || 'normal',
      layout: signature.layout || 'vertical',
      textAlignment: signature.textAlignment || 'left',
      verticalSpacing: signature.verticalSpacing || 5,
      iconTextSpacing: signature.iconTextSpacing || 5
    };
  };
  
  // Fonction pour convertir le nom du template en ID
  const getTemplateIdFromName = (templateName: string): number => {
    const templateMap: Record<string, number> = {
      'simple': 1,
      'professional': 2,
      'modern': 3,
      'creative': 4
    };
    
    return templateMap[templateName] || 1; // Par défaut, retourner 1 (simple)
  };
  
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
  const { data: signaturesData, loading, refetch } = useQuery(GET_EMAIL_SIGNATURES, {
    variables: { page: 1, limit: 10, search: searchTerm },
    fetchPolicy: 'network-only'
  });
  
  // Vérifier si des signatures existent
  const hasSignatures = signaturesData?.emailSignatures?.signatures?.length > 0;
  
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
    update: (cache) => {
      // Mettre à jour le cache Apollo après la suppression
      refetch();
    }
  });
  
  // Mutation pour définir une signature comme signature par défaut
  const [setDefaultEmailSignature] = useMutation(SET_DEFAULT_EMAIL_SIGNATURE, {
    onCompleted: (data) => {
      Notification.success(`La signature "${data.setDefaultEmailSignature.name}" a été définie comme signature par défaut.`);
      refetch();
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la définition de la signature par défaut: ${error.message}`);
    }
  });
  
  // Fonction pour définir une signature comme signature par défaut
  const handleSetDefault = (signature: EmailSignature) => {
    setDefaultEmailSignature({ variables: { id: signature.id } });
  };

  return (
    <>
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
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* En-tête unique qui change dynamiquement */}
          <div className="px-4 sm:px-0 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Gestion des Signatures Email</h1>
              {showForm ? (
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                  className="hover:bg-[#f0eeff] text-[#5b50ff]"
                >
                  <ArrowLeft size="20" color="#5b50ff" variant="Linear" className="mr-2" />
                  Retour au tableau
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddSignature}
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Nouvelle Signature
                </Button>
              )}
            </div>
          </div>
          
          {showForm ? (
            <>
              {/* Sidebar de navigation réutilisable */}
              <NavigationSidebar
                items={[
                  {
                    id: 'info',
                    icon: <Personalcard size="24" color={activeSection === 'info' ? '#5b50ff' : '#222'} variant={activeSection === 'info' ? 'Bold' : 'Linear'} />,
                    tooltip: 'Informations personnelles'
                  },
                  {
                    id: 'social',
                    icon: <Instagram size="24" color={activeSection === 'social' ? '#5b50ff' : '#222'} variant={activeSection === 'social' ? 'Bold' : 'Linear'} />,
                    tooltip: 'Réseaux sociaux'
                  },
                  {
                    id: 'appearance',
                    icon: <Paintbucket size="24" color={activeSection === 'appearance' ? '#5b50ff' : '#222'} variant={activeSection === 'appearance' ? 'Bold' : 'Linear'} />,
                    tooltip: 'Apparence'
                  },
                  {
                    id: 'settings',
                    icon: <Grid5 size="24" color={activeSection === 'settings' ? '#5b50ff' : '#222'} variant={activeSection === 'settings' ? 'Bold' : 'Linear'} />,
                    tooltip: 'Paramètres'
                  }
                ]}
                activeItemId={activeSection}
                onItemClick={(itemId) => setActiveSection(itemId as 'info' | 'social' | 'appearance' | 'settings')}
                progress={progress}
                progressTooltip="Progression"
                primaryColor={signatureData?.primaryColor || '#5b50ff'} // Utiliser la couleur primaire sélectionnée uniquement pour les cercles
                fixed={true}
                topOffset="80px"
                showColorCircles={true} // Afficher les cercles de couleurs uniquement pour la signature de mail
              />
              
              {/* Formulaire de signature */}
              <EmailSignatureFormLayout 
                defaultNewbiLogoUrl="/images/logo_newbi/SVG/Logo_Texte_Purple.svg"
                activeSection={activeSection}
                onSignatureDataChange={setSignatureData}
                onSave={handleSave}
                onCancel={handleCancel}
                initialData={convertSignatureToFormData(selectedSignature)}
                selectedSignature={selectedSignature}
              />
            </>
          ) : (
            <>
              {/* Barre de recherche */}
              <div className="mb-6 px-4 sm:px-0">
                <div className="flex justify-end items-center">
                  <SearchInput
                    placeholder="Rechercher une signature..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      refetch({ page: 1, limit: 10, search: e.target.value });
                    }}
                    onClear={() => {
                      setSearchTerm('');
                      refetch({ page: 1, limit: 10, search: '' });
                    }}
                    width="w-72"
                  />
                </div>
              </div>
              
              {/* Contenu principal - Tableau ou état vide */}
              <div className="px-4 sm:px-0">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5b50ff]"></div>
                  </div>
                ) : hasSignatures ? (
                  <EmailSignaturesTable
                    signatures={signaturesData?.emailSignatures?.signatures || []}
                    totalCount={signaturesData?.emailSignatures?.totalCount || 0}
                    loading={loading}
                    onEditSignature={handleEditSignature}
                    onDeleteSignature={handleDeleteSignature}
                    onSetDefault={handleSetDefault}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm p-6">
                    <div className="bg-[#f0eeff] p-4 rounded-full mb-4">
                      <Sms size="32" color="#5b50ff" variant="Bold" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune signature email</h3>
                    <p className="text-gray-500 max-w-md mb-6">Commencez par créer votre première signature email professionnelle.</p>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleAddSignature}
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Nouvelle Signature
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
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
    </>
  );
};

export default EmailSignaturesPage;