import React from 'react';
import { ImageContainer } from './ImageContainer';
import { ContactInfo } from './ContactInfo';
import { SocialLinksComponent } from './SocialLinks';
import { SignatureData } from '../../types';
// Import des constantes pour les images par défaut
import { DEFAULT_PROFILE_IMAGE, DEFAULT_PROFILE_PHOTO_SIZE } from '../../constants/images';

type SocialLinks = NonNullable<SignatureData['socialLinks']>;

interface SignatureLayoutProps {
  signatureLayout: 'horizontal' | 'vertical';
  fullName?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  logoUrl?: string;
  showLogo?: boolean;
  website?: string;
  address?: string;
  profilePhotoSource?: string | null;
  profilePhotoSize?: number;
  profilePhotoToDelete?: boolean; // Ajout de cette propriété pour détecter explicitement la suppression
  imagesLayout?: 'stacked' | 'side-by-side';
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  socialLinks?: SocialLinks;
  socialLinksDisplayMode?: 'icons' | 'text';
  socialLinksIconStyle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  socialLinksIconColor?: string;
  effectiveTextAlignment?: 'left' | 'center' | 'right';
  effectiveHorizontalSpacing?: number;
  effectiveVerticalSpacing?: number;
  iconTextSpacing?: number;
  fontSize?: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  fontFamily?: string;
  effectiveVerticalSpacing: number;
  iconTextSpacing: number; // Valeur par défaut fournie dans le composant
  fontSize: number; // Valeur par défaut fournie dans le composant
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough'; // Valeur par défaut fournie dans le composant
  fontFamily: string; // Valeur par défaut fournie dans le composant
}

export const SignatureLayout: React.FC<SignatureLayoutProps> = ({
  signatureLayout,
  fullName,
  jobTitle,
  companyName,
  phone,
  mobilePhone,
  email,
  logoUrl,
  showLogo = false,
  website,
  address,
  profilePhotoSource,
  profilePhotoSize, // Nous gérons la valeur par défaut dans le corps de la fonction
  profilePhotoToDelete, // Nouvelle propriété ajoutée
  imagesLayout,
  showEmailIcon = true,
  showPhoneIcon = true,
  showAddressIcon = true,
  showWebsiteIcon = true,
  socialLinks,
  socialLinksDisplayMode,
  socialLinksIconStyle,
  primaryColor = '#5b50ff', // Couleur principale Newbi
  secondaryColor,
  socialLinksIconColor = '#ffffff', // Couleur par défaut blanche pour les icônes de réseaux sociaux
  effectiveTextAlignment,
  effectiveHorizontalSpacing,
  effectiveVerticalSpacing,
  iconTextSpacing = 5, 
  fontSize = 14,
  textStyle = 'normal',
  fontFamily = 'Arial, sans-serif'
}) => {
  // Définir les valeurs par défaut pour les propriétés optionnelles
  // pour éviter que les valeurs par défaut n'écrasent les valeurs transmises
  const effectivePhotoSize = profilePhotoSize !== undefined ? profilePhotoSize : 80;
  
  // Définir une valeur par défaut pour socialLinksDisplayMode
  const effectiveSocialLinksDisplayMode = socialLinksDisplayMode || 'icons' as const;
  
  // Log pour déboguer la taille effective de la photo
  console.log('[DEBUG] SignatureLayout - Taille effective:', {
    profilePhotoSizeOriginal: profilePhotoSize,
    effectivePhotoSize
  });
  
  // Fonction pour obtenir les styles de texte appropriés
  const getTextStyleProps = (style: 'normal' | 'overline' | 'underline' | 'strikethrough'): React.CSSProperties => {
    switch (style) {
      case 'underline':
        return { textDecoration: 'underline' };
      case 'overline':
        return { textDecoration: 'overline' };
      case 'strikethrough':
        return { textDecoration: 'line-through' };
      default:
        return { textDecoration: 'none' };
    }
  };

  // Styles pour le nom
  const nameStyle: React.CSSProperties = {
    fontSize: `${fontSize + 2}px`, // Nom un peu plus grand que le texte normal
    fontWeight: 'bold',
    color: '#333333',
    margin: '0',
    ...getTextStyleProps(textStyle),
    fontFamily
  };

  // Styles pour le poste
  const jobTitleStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: 'normal',
    color: '#666666',
    margin: '0',
    ...getTextStyleProps(textStyle),
    fontFamily
  };

  // Style pour le nom de l'entreprise
  const companyNameStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: 'normal',
    // Couleur fixe pour le nom de l'entreprise, indépendamment de la couleur secondaire
    color: '#333333',
    margin: '0',
    ...getTextStyleProps(textStyle),
    fontFamily
  };

  // Style du conteneur principal
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: signatureLayout === 'horizontal' ? 'row' : 'column',
    // En mode horizontal, toujours aligné à gauche, en mode vertical, l'alignement dépend des préférences
    alignItems: signatureLayout === 'horizontal' ? 'flex-start' : 
              effectiveTextAlignment === 'center' ? 'center' : 
              effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start',
    gap: signatureLayout === 'horizontal' ? `${effectiveHorizontalSpacing}px` : `${effectiveVerticalSpacing}px`,
    fontFamily,
    color: '#333333',
    width: '100%',
    maxWidth: '600px'
  };

  // Rendu du logo d'entreprise en mode vertical
  const renderCompanyLogoVertical = () => {
    // Afficher ou masquer le logo selon la configuration
    if (!showLogo || !logoUrl) return null;
    
    return (
      <div style={{ width: '100%' }}>
        {/* Trait séparateur */}
        <div style={{
          height: '1px',
          backgroundColor: '#e0e0e0',
          width: effectiveTextAlignment === 'center' ? '40%' : '60%',
          margin: '10px 0',
          alignSelf: effectiveTextAlignment === 'center' ? 'center' : 
                   effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start'
        }}></div>
        
        {/* Logo d'entreprise */}
        <div style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: effectiveTextAlignment === 'center' ? 'center' : 
                        effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Rendu des réseaux sociaux
  const renderSocialLinks = (applyVerticalSpacing = false) => {
    return (
      <SocialLinksComponent 
        socialLinks={socialLinks}
        displayMode={effectiveSocialLinksDisplayMode}
        socialLinksIconStyle={socialLinksIconStyle}
        primaryColor={primaryColor}
        backgroundColor={primaryColor} // Couleur de fond pour les icônes (carrés arrondis et cercles)
        iconColor={socialLinksIconColor} // Couleur spécifique pour les icônes SVG
        textColor={secondaryColor} // Couleur pour le texte des liens sociaux
        verticalSpacing={applyVerticalSpacing ? effectiveVerticalSpacing : undefined} // Transmettre l'espacement vertical uniquement si demandé
      />
    );
  };

  if (signatureLayout === 'horizontal') {
    // Si la position des réseaux sociaux est en bas, les afficher sous les informations de contact (comportement par défaut)
    return (
      <div style={{ display: 'flex', width: '100%', gap: `${effectiveHorizontalSpacing}px` }}>
        {/* Partie gauche - Photo de profil */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0',
          width: 'auto'
        }}>
          {/* Photo de profil avec ImageContainer pour uniformiser */}
          <div style={{ marginBottom: '20px' }}>
            {/* Ajouter une clé unique basée sur la taille pour forcer un re-rendu complet */}
            <ImageContainer
              key={`profile-photo-${effectivePhotoSize}`}
              profilePhotoSource={profilePhotoSource === '' ? null : profilePhotoSource}
              photoSize={effectivePhotoSize * 1.2} // Utiliser effectivePhotoSize pour éviter les erreurs TypeScript
              imagesLayout="stacked"
              profilePhotoToDelete={profilePhotoToDelete}
            />
          </div>
          {/* Ajouter ce log en dehors du JSX pour éviter l'erreur */}
          {/* Emplacement pour la photo de profil */}
          
          {/* Informations personnelles sous la photo */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-start',
            textAlign: 'left',
            gap: `${Math.max(4, effectiveVerticalSpacing / 2)}px`,
            minWidth: `${effectivePhotoSize * 1.2}px`
          }}>
            {fullName && <h3 style={{...nameStyle, margin: '0', whiteSpace: 'nowrap'}}>{fullName}</h3>}
            {jobTitle && <p style={{...jobTitleStyle, margin: '0', whiteSpace: 'nowrap'}}>{jobTitle}</p>}
            {companyName && <p style={{...companyNameStyle, margin: '0', whiteSpace: 'nowrap'}}>{companyName}</p>}
          </div>
        </div>
        
        {/* Séparateur vertical */}
        <div style={{
          width: '1px',
          height: 'auto',
          backgroundColor: '#e0e0e0',
          alignSelf: 'stretch',
          margin: '0 0 0 10px'
        }}></div>
        
        {/* Partie droite - Informations de contact et réseaux sociaux */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '0 0 0 20px',
          gap: `${effectiveVerticalSpacing}px`
        }}>
          {/* Informations de contact */}
          <ContactInfo
            phone={phone}
            mobilePhone={mobilePhone}
            email={email}
            website={website}
            address={address}
            showEmailIcon={showEmailIcon}
            showPhoneIcon={showPhoneIcon}
            showAddressIcon={showAddressIcon}
            showWebsiteIcon={showWebsiteIcon}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor || '#333333'}
            fontSize={fontSize}
            textStyle={textStyle}
            fontFamily={fontFamily}
            textAlignment="left"
            isHorizontalLayout={true}
            verticalSpacing={effectiveVerticalSpacing}
            iconTextSpacing={iconTextSpacing}
          />
          
          {/* Réseaux sociaux en dessous des informations de contact */}
          {renderSocialLinks(false)}
        </div>
      </div>
    );
  }

  
  // Mode vertical pour les autres cas
  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
        {/* Conteneur d'images */}
        <ImageContainer
          key={`profile-photo-${effectivePhotoSize}`}
          profilePhotoSource={profilePhotoSource}
          photoSize={effectivePhotoSize}
          imagesLayout={imagesLayout || 'stacked'}
          profilePhotoToDelete={profilePhotoToDelete}
        />
        {/* Logo d'entreprise supprimé */}
      </div>
      
      {/* Informations personnelles en mode vertical */}
      <div style={{ textAlign: effectiveTextAlignment }}>
        {fullName && <h3 style={nameStyle}>{fullName}</h3>}
        {jobTitle && <p style={jobTitleStyle}>{jobTitle}</p>}
        {companyName && <p style={{ ...companyNameStyle, margin: '5px 0' }}>{companyName}</p>}
      </div>
      
      {/* Séparateur horizontal */}
      <div style={{
        height: '1px',
        backgroundColor: '#e0e0e0',
        width: signatureLayout === 'vertical' && effectiveTextAlignment === 'center' ? '40%' : '60%',
        margin: '5px 0',
        alignSelf: signatureLayout === 'vertical' ? (
          effectiveTextAlignment === 'center' ? 'center' : 
          effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start'
        ) : 'flex-start'
      }}></div>
      
      {/* Informations de contact */}
      <ContactInfo
        phone={phone}
        mobilePhone={mobilePhone}
        email={email}
        website={website}
        address={address}
        companyName={undefined} // Déjà affiché au-dessus
        showEmailIcon={showEmailIcon}
        showPhoneIcon={showPhoneIcon}
        showAddressIcon={showAddressIcon}
        showWebsiteIcon={showWebsiteIcon}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor || '#333333'}
        textAlignment={effectiveTextAlignment}
        isHorizontalLayout={false}
        fontSize={fontSize}
        textStyle={textStyle}
        fontFamily={fontFamily}
        verticalSpacing={effectiveVerticalSpacing}
        iconTextSpacing={iconTextSpacing}
      />
      
      {/* Liens sociaux en bas si nécessaire */}
      {/* Réseaux sociaux en bas */}
      {renderSocialLinks()}
      
      {/* Logo d'entreprise en bas en mode vertical */}
      {signatureLayout === 'vertical' && renderCompanyLogoVertical()}
      
      {/* Cas non utilisés dans la version simplifiée */}
      {false && (
        <div style={{ 
          marginTop: '5px',
          textAlign: effectiveTextAlignment,
          alignSelf: effectiveTextAlignment === 'center' ? 'center' : 
                   effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start'
        }}>
          {renderSocialLinks(false)}
        </div>
      )}
    </div>
  );
};
