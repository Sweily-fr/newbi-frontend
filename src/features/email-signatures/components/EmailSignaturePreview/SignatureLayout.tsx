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
  logoUrl,
  showLogo,
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
    if (!showLogo || !logoUrl) return null;
    
    return (
      <div style={{ width: '100%', marginTop: '15px' }}>
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
                        effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start',
          marginTop: '10px'
        }}>
          <div style={{ 
            width: `${photoSize * 0.8}px`, 
            height: `${photoSize * 0.5}px`, 
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
        displayMode={socialLinksDisplayMode}
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
    // Si la position des réseaux sociaux est sous les informations personnelles
    // Utilisation d'une comparaison de chaînes pour éviter les problèmes de typage
    if (socialPosition === 'below-personal' as any) {
      return (
        <div style={{ display: 'flex', width: '100%', gap: `${effectiveHorizontalSpacing}px` }}>
          {/* Partie gauche - Photo de profil et logo */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px'
          }}>
            {/* Photo de profil */}
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
            
            {/* Logo d'entreprise sous la photo de profil */}
            {showLogo && logoUrl && (
              <div style={{ marginTop: '10px', width: '100%' }}>
                {/* Trait séparateur */}
                <div style={{
                  height: '1px',
                  backgroundColor: '#e0e0e0',
                  width: '80%',
                  margin: '5px auto'
                }}></div>
                
                {/* Logo */}
                <div style={{ 
                  width: `${photoSize * 0.8}px`, 
                  height: `${photoSize * 0.5}px`, 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '5px auto'
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
            )}
          </div>
          
          {/* Partie centrale - Informations personnelles et réseaux sociaux */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '0 10px 0 0',
            textAlign: 'left',
            gap: `${effectiveVerticalSpacing}px`
          }}>
            {/* Informations personnelles */}
            {fullName && <h3 style={{...nameStyle, margin: '0'}}>{fullName}</h3>}
            {jobTitle && <p style={{...jobTitleStyle, margin: '0'}}>{jobTitle}</p>}
            {companyName && <p style={{...companyNameStyle, margin: '0'}}>{companyName}</p>}
            
            {/* Réseaux sociaux sous les informations personnelles */}
            <div style={{ marginTop: '5px' }}>
              {renderSocialLinks(false)}
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
              secondaryColor={secondaryColor || '#333333'}
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
    
    // Si la position des réseaux sociaux est à droite, les afficher à côté des informations de contact
    if (socialPosition === 'right') {
      return (
        <div style={{ display: 'flex', width: '100%', gap: `${effectiveHorizontalSpacing}px` }}>
          {/* Partie gauche - Photo de profil et logo */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px'
          }}>
            {/* Photo de profil */}
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
            
            {/* Logo d'entreprise sous la photo de profil */}
            {showLogo && logoUrl && (
              <div style={{ marginTop: '10px', width: '100%' }}>
                {/* Trait séparateur */}
                <div style={{
                  height: '1px',
                  backgroundColor: '#e0e0e0',
                  width: '80%',
                  margin: '5px auto'
                }}></div>
                
                {/* Logo */}
                <div style={{ 
                  width: `${photoSize * 0.8}px`, 
                  height: `${photoSize * 0.5}px`, 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '5px auto'
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
            )}
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
              secondaryColor={secondaryColor || '#333333'}
              fontSize={fontSize}
              textStyle={textStyle}
              fontFamily={fontFamily}
              textAlignment="left"
              isHorizontalLayout={true}
              verticalSpacing={effectiveVerticalSpacing}
              iconTextSpacing={iconTextSpacing}
            />
          </div>
          
          {/* Séparateur vertical */}
          <div style={{
            width: '1px',
            height: 'auto',
            backgroundColor: '#e0e0e0',
            alignSelf: 'stretch',
            margin: '0 0 0 10px'
          }}></div>
          
          {/* Réseaux sociaux à droite */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '0 0 0 20px',
            alignSelf: 'center',
            gap: `${effectiveVerticalSpacing}px`
          }}>
            {renderSocialLinks(true)}
          </div>
        </div>
      );
    }
    
    // Si la position des réseaux sociaux est en bas, les afficher sous les informations de contact (comportement par défaut)
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

  // Débogage des valeurs
  console.log('SignatureLayout Debug:', { 
    signatureLayout, 
    showLogo, 
    logoUrl, 
    isHorizontal: signatureLayout === 'horizontal',
    isVertical: signatureLayout === 'vertical',
    typeofSignatureLayout: typeof signatureLayout
  });
  
  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
        {/* Conteneur d'images */}
        <ImageContainer
          profilePhotoSource={profilePhotoSource}
          logoUrl={logoUrl}
          photoSize={photoSize}
          imagesLayout={imagesLayout}
          showLogo={false} /* Désactiver le logo dans ImageContainer */
          signatureLayout={signatureLayout}
        />
        
        {/* Logo d'entreprise en mode horizontal */}
        {/* Utiliser une approche différente pour éviter les erreurs TypeScript */}
        {String(signatureLayout) === 'horizontal' && logoUrl && (
          <div style={{
            width: `${photoSize * 0.8}px`,
            height: `${photoSize * 0.5}px`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10px',
            border: '1px solid #f0eeff',
            borderRadius: '4px',
            padding: '4px'
          }}>
            <img 
              src={logoUrl || "/images/logo_newbi/SVG/Logo_Texte_Purple.svg"} 
              alt="Logo" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain'
              }} 
            />
          </div>
        )}
      </div>
      
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
      {socialPosition === 'bottom' && renderSocialLinks()}
      
      {/* Logo d'entreprise en mode vertical (après les réseaux sociaux) */}
      {signatureLayout === 'vertical' && socialPosition === 'bottom' && renderCompanyLogoVertical()}
      
      {/* Afficher les liens sociaux à droite si nécessaire */}
      {socialPosition === 'right' && renderSocialLinks(signatureLayout === 'horizontal' as any)}
      
      {/* Afficher les liens sociaux sous les informations personnelles si nécessaire */}
      {(socialPosition as any) === 'below-personal' && (
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
