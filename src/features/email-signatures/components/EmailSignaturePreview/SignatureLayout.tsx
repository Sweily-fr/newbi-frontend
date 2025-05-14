import React from 'react';
import { ImageContainer } from './ImageContainer';
import { ContactInfo } from './ContactInfo';
import { SocialLinksComponent } from './SocialLinks';
import { SignatureData } from '../../types';

type SocialLinks = NonNullable<SignatureData['socialLinks']>;

interface SignatureLayoutProps {
  signatureLayout: 'horizontal' | 'vertical';
  fullName?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  logoUrl?: string;
  profilePhotoSource: string | null;
  photoSize: number;
  imagesLayout: 'stacked' | 'side-by-side';
  showLogo?: boolean;
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
  socialLinks?: SocialLinks;
  socialPosition: 'bottom' | 'right';
  socialLinksDisplayMode: 'icons' | 'text';
  socialLinksIconStyle: string;
  primaryColor: string;
  secondaryColor?: string; // Couleur secondaire pour les textes d'informations de contact
  socialLinksIconColor?: string; // Couleur spécifique pour les icônes SVG des réseaux sociaux
  effectiveTextAlignment: 'left' | 'center' | 'right';
  effectiveHorizontalSpacing: number;
  effectiveVerticalSpacing: number;
  iconTextSpacing?: number; // Espacement entre icônes et texte
  fontSize?: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  fontFamily?: string;
}

export const SignatureLayout: React.FC<SignatureLayoutProps> = ({
  signatureLayout,
  fullName,
  jobTitle,
  companyName,
  phone,
  mobilePhone,
  email,
  website,
  address,
  profilePhotoSource,
  photoSize,
  imagesLayout,
  showEmailIcon,
  showPhoneIcon,
  showAddressIcon,
  showWebsiteIcon,
  socialLinks,
  socialPosition,
  socialLinksDisplayMode,
  socialLinksIconStyle,
  primaryColor,
  secondaryColor,
  socialLinksIconColor,
  effectiveTextAlignment,
  effectiveHorizontalSpacing,
  effectiveVerticalSpacing,
  iconTextSpacing = 5, // Valeur par défaut pour l'espacement entre icônes et texte
  fontSize = 14,
  textStyle = 'normal',
  fontFamily = 'Arial, sans-serif'
}) => {
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

  // Rendu des réseaux sociaux
  const renderSocialLinks = () => {
    return (
      <SocialLinksComponent 
        socialLinks={socialLinks}
        displayMode={socialLinksDisplayMode}
        socialLinksIconStyle={socialLinksIconStyle}
        primaryColor={primaryColor}
        backgroundColor={primaryColor} // Couleur de fond pour les icônes (carrés arrondis et cercles)
        iconColor={socialLinksIconColor} // Couleur spécifique pour les icônes SVG
        textColor={secondaryColor} // Couleur pour le texte des liens sociaux
      />
    );
  };

  if (signatureLayout === 'horizontal') {
    return (
      <div style={{ display: 'flex', width: '100%', gap: `${effectiveHorizontalSpacing}px` }}>
        {/* Partie gauche - Photo de profil */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '10px'
        }}>
          <div style={{ 
            width: `${photoSize}px`, 
            height: `${photoSize}px`, 
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#f0eeff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {profilePhotoSource ? (
              <img 
                src={profilePhotoSource} 
                alt="Profile" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <img 
                src="/images/logo_newbi/SVG/Logo_Texte_Purple.svg" 
                alt="Newbi" 
                style={{ 
                  width: '80%', 
                  height: '80%', 
                  objectFit: 'contain'
                }} 
              />
            )}
          </div>
        </div>
        
        {/* Partie centrale - Informations personnelles */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '0 10px 0 0',
          textAlign: 'left',
          gap: `${effectiveVerticalSpacing}px`
        }}>
          {fullName && <h3 style={{...nameStyle, margin: '0'}}>{fullName}</h3>}
          {jobTitle && <p style={{...jobTitleStyle, margin: '0'}}>{jobTitle}</p>}
          {companyName && <p style={{...companyNameStyle, margin: '0'}}>{companyName}</p>}
        </div>
        
        {/* Séparateur vertical */}
        <div style={{
          width: '1px',
          height: 'auto',
          backgroundColor: '#e0e0e0',
          alignSelf: 'stretch',
          margin: '0 0 0 10px'
        }}></div>
        
        {/* Partie droite - Informations de contact */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '0 0 0 20px',
          gap: `${effectiveVerticalSpacing}px`
        }}>
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
            secondaryColor={secondaryColor}
            fontSize={fontSize}
            textStyle={textStyle}
            fontFamily={fontFamily}
            textAlignment="left"
            isHorizontalLayout={true}
            verticalSpacing={effectiveVerticalSpacing}
            iconTextSpacing={iconTextSpacing}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Conteneur d'images */}
      <ImageContainer
        profilePhotoSource={profilePhotoSource}
        photoSize={photoSize}
        imagesLayout={imagesLayout}
      />
      
      {/* Informations personnelles */}
      <div style={{ textAlign: signatureLayout === 'vertical' ? effectiveTextAlignment : 'left' }}>
        {fullName && <h3 style={nameStyle}>{fullName}</h3>}
        {jobTitle && <p style={jobTitleStyle}>{jobTitle}</p>}
        {companyName && <p style={{ ...companyNameStyle, margin: '5px 0' }}>{companyName}</p>}
      </div>
      
      {/* Séparateur horizontal */}
      <div style={{
        height: '1px',
        backgroundColor: '#e0e0e0',
        width: signatureLayout === 'vertical' && effectiveTextAlignment === 'center' ? '40%' : '60%',
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
        secondaryColor={secondaryColor}
        textAlignment={effectiveTextAlignment}
        isHorizontalLayout={false}
        fontSize={fontSize}
        textStyle={textStyle}
        fontFamily={fontFamily}
        verticalSpacing={effectiveVerticalSpacing}
        iconTextSpacing={iconTextSpacing}
      />
      
      {/* Liens sociaux en bas si nécessaire */}
      {socialPosition === 'bottom' && renderSocialLinks()}
      
      {/* Afficher les liens sociaux à droite si nécessaire */}
      {socialPosition === 'right' && renderSocialLinks()}
    </div>
  );
};
