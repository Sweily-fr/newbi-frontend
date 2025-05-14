import React, { useState, useEffect } from 'react';
import { useEmailSignatureForm } from '../hooks';
import { EmailSignature } from '../types';
import { EmailSignaturePreview } from './EmailSignaturePreview/EmailSignaturePreviewNew';
import { EmailSignatureFormActions } from './EmailSignatureFormActions';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { CompanyInfoSection } from './sections/CompanyInfoSection';
import { SocialLinksSection } from './sections/SocialLinksSection';
import { AppearanceSection } from './sections/AppearanceSection';

interface EmailSignatureEditorProps {
  initialData?: Partial<EmailSignature>;
  onCancel?: () => void;
  onSuccess?: () => void;
}

/**
 * Composant principal pour l'édition d'une signature de mail
 * Ce composant combine le formulaire et la prévisualisation
 */
export const EmailSignatureEditor: React.FC<EmailSignatureEditorProps> = ({
  initialData,
  onCancel,
  onSuccess
}) => {
  // Sections disponibles dans l'éditeur
  const sections = ['info', 'company', 'social', 'appearance'] as const;
  type SectionType = typeof sections[number];
  
  // État pour la section active
  const [activeSection, setActiveSection] = useState<SectionType>('info');
  
  // Utiliser le hook de formulaire
  const formProps = useEmailSignatureForm({
    initialData,
    onSubmit: () => {} // Cette fonction sera remplacée par notre bouton de sauvegarde
  });
  
  // Construire l'objet signature à partir des données du formulaire
  const signature: Partial<EmailSignature> = {
    id: formProps.id,
    name: formProps.name,
    fullName: formProps.fullName,
    jobTitle: formProps.jobTitle,
    email: formProps.email,
    phone: formProps.phone,
    mobilePhone: formProps.mobilePhone,
    website: formProps.website,
    address: formProps.address,
    companyName: formProps.companyName,
    socialLinks: formProps.socialLinks,
    templateId: formProps.template,
    primaryColor: formProps.primaryColor,
    secondaryColor: formProps.secondaryColor,
    logoUrl: formProps.logoUrl,
    showLogo: formProps.showLogo,
    isDefault: formProps.isDefault,
    profilePhotoUrl: formProps.profilePhotoUrl,
    profilePhotoBase64: formProps.profilePhotoBase64,
    profilePhotoSize: formProps.profilePhotoSize,
    layout: formProps.layout,
    horizontalSpacing: formProps.horizontalSpacing,
    verticalSpacing: formProps.verticalSpacing,
    verticalAlignment: formProps.verticalAlignment,
    imagesLayout: formProps.imagesLayout,
    fontFamily: formProps.fontFamily,
    fontSize: formProps.fontSize,
    socialLinksDisplayMode: formProps.socialLinksDisplayMode,
    socialLinksPosition: formProps.socialLinksPosition,
    socialLinksIconStyle: formProps.socialLinksIconStyle
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Panneau de formulaire */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Navigation entre les sections */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setActiveSection('info')}
              className={`px-4 py-2 ${activeSection === 'info' ? 'text-[#5b50ff] border-b-2 border-[#5b50ff]' : 'text-gray-600'}`}
            >
              Informations personnelles
            </button>
            <button
              onClick={() => setActiveSection('company')}
              className={`px-4 py-2 ${activeSection === 'company' ? 'text-[#5b50ff] border-b-2 border-[#5b50ff]' : 'text-gray-600'}`}
            >
              Entreprise
            </button>
            <button
              onClick={() => setActiveSection('social')}
              className={`px-4 py-2 ${activeSection === 'social' ? 'text-[#5b50ff] border-b-2 border-[#5b50ff]' : 'text-gray-600'}`}
            >
              Réseaux sociaux
            </button>
            <button
              onClick={() => setActiveSection('appearance')}
              className={`px-4 py-2 ${activeSection === 'appearance' ? 'text-[#5b50ff] border-b-2 border-[#5b50ff]' : 'text-gray-600'}`}
            >
              Apparence
            </button>
          </div>
          
          {/* Contenu de la section active */}
          <div>
            {activeSection === 'info' && (
              <PersonalInfoSection
                name={formProps.name}
                setName={formProps.setName}
                fullName={formProps.fullName}
                setFullName={formProps.setFullName}
                jobTitle={formProps.jobTitle}
                setJobTitle={formProps.setJobTitle}
                email={formProps.email}
                setEmail={formProps.setEmail}
                phone={formProps.phone}
                setPhone={formProps.setPhone}
                mobilePhone={formProps.mobilePhone}
                setMobilePhone={formProps.setMobilePhone}
                errors={formProps.errors}
              />
            )}
            
            {activeSection === 'company' && (
              <CompanyInfoSection
                companyName={formProps.companyName}
                setCompanyName={formProps.setCompanyName}
                website={formProps.website}
                setWebsite={formProps.setWebsite}
                address={formProps.address}
                setAddress={formProps.setAddress}
                errors={formProps.errors}
                importCompanyInfo={formProps.importCompanyInfo}
              />
            )}
            
            {activeSection === 'social' && (
              <SocialLinksSection
                socialLinks={formProps.socialLinks}
                updateSocialLink={formProps.updateSocialLink}
                socialLinksDisplayMode={formProps.socialLinksDisplayMode}
                setSocialLinksDisplayMode={formProps.setSocialLinksDisplayMode}
                socialLinksIconStyle={formProps.socialLinksIconStyle}
                setSocialLinksIconStyle={formProps.setSocialLinksIconStyle}
                socialLinksPosition={formProps.socialLinksPosition}
                setSocialLinksPosition={formProps.setSocialLinksPosition}
              />
            )}
            
            {activeSection === 'appearance' && (
              <AppearanceSection
                primaryColor={formProps.primaryColor}
                setPrimaryColor={formProps.setPrimaryColor}
                secondaryColor={formProps.secondaryColor}
                setSecondaryColor={formProps.setSecondaryColor}
                logoUrl={formProps.logoUrl}
                setLogoUrl={formProps.setLogoUrl}
                showLogo={formProps.showLogo}
                setShowLogo={formProps.setShowLogo}
                profilePhotoUrl={formProps.profilePhotoUrl}
                setProfilePhotoUrl={formProps.setProfilePhotoUrl}
                profilePhotoBase64={formProps.profilePhotoBase64}
                setProfilePhotoBase64={formProps.setProfilePhotoBase64}
                previewProfilePhoto={formProps.previewProfilePhoto}
                setPreviewProfilePhoto={formProps.setPreviewProfilePhoto}
                profilePhotoToDelete={formProps.profilePhotoToDelete}
                setProfilePhotoToDelete={formProps.setProfilePhotoToDelete}
                profilePhotoSize={formProps.profilePhotoSize}
                setProfilePhotoSize={formProps.setProfilePhotoSize}
                layout={formProps.layout}
                setLayout={formProps.setLayout}
                horizontalSpacing={formProps.horizontalSpacing}
                setHorizontalSpacing={formProps.setHorizontalSpacing}
                verticalSpacing={formProps.verticalSpacing}
                setVerticalSpacing={formProps.setVerticalSpacing}
                verticalAlignment={formProps.verticalAlignment}
                setVerticalAlignment={formProps.setVerticalAlignment}
                imagesLayout={formProps.imagesLayout}
                setImagesLayout={formProps.setImagesLayout}
                fontFamily={formProps.fontFamily}
                setFontFamily={formProps.setFontFamily}
                fontSize={formProps.fontSize}
                setFontSize={formProps.setFontSize}
                getFullLogoUrl={formProps.getFullLogoUrl}
                handleProfilePhotoSelect={formProps.handleProfilePhotoSelect}
                handleProfilePhotoDelete={formProps.handleProfilePhotoDelete}
              />
            )}
          </div>
          
          {/* Actions du formulaire */}
          <EmailSignatureFormActions
            signature={signature}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </div>
      
      {/* Panneau de prévisualisation */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Aperçu de la signature</h2>
          <div className="border p-4 rounded-md bg-gray-50">
            <EmailSignaturePreview
              name={formProps.name}
              fullName={formProps.fullName}
              jobTitle={formProps.jobTitle}
              email={formProps.email}
              phone={formProps.phone}
              mobilePhone={formProps.mobilePhone}
              website={formProps.website}
              address={formProps.address}
              companyName={formProps.companyName}
              socialLinks={formProps.socialLinks}
              primaryColor={formProps.primaryColor}
              secondaryColor={formProps.secondaryColor}
              logoUrl={formProps.logoUrl}
              showLogo={formProps.showLogo}
              profilePhotoUrl={formProps.profilePhotoUrl || formProps.previewProfilePhoto}
              profilePhotoSize={formProps.profilePhotoSize}
              layout={formProps.layout}
              horizontalSpacing={formProps.horizontalSpacing}
              verticalSpacing={formProps.verticalSpacing}
              verticalAlignment={formProps.verticalAlignment}
              imagesLayout={formProps.imagesLayout}
              fontFamily={formProps.fontFamily}
              fontSize={formProps.fontSize}
              socialLinksDisplayMode={formProps.socialLinksDisplayMode}
              socialLinksPosition={formProps.socialLinksPosition}
              socialLinksIconStyle={formProps.socialLinksIconStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
