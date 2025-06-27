import React from 'react';
import { TableContactInfo } from './TableContactInfo';
import { useEmailSignature } from '../../context/useEmailSignature';

export const TableSignatureLayout: React.FC = () => {
  // Utiliser le contexte au lieu des props
  const context = useEmailSignature();
  
  // Forcer l'affichage des éléments manquants pour le débogage
  const {
    signatureData,
    showCompanyName = true,
    showJobTitle = true,
    showLogo = true,
    showProfilePhoto = true,
    logoSize = 100,
    profilePhotoSize = 80,
    primaryColor = '#000000',
    secondaryColor = '#666666',
    textAlignment = 'left',
    verticalSpacing = 10,
    horizontalSpacing = 15,
    fontSize = 12,
    textStyle = 'normal',
    fontFamily = 'Arial, sans-serif'
  } = context;

  console.log('TableSignatureLayout context:', context);
  
  // Extraction des données du contexte avec valeurs par défaut
  const sigData = signatureData || {};
  const {
    firstName = 'Prénom',
    lastName = 'Nom',
    jobTitle = 'Votre poste',
    companyName = 'Votre entreprise',
    customLogoUrl,
    logoUrl,
    profilePhotoUrl,
    profilePhotoBase64,
    website = 'https://votresite.com',
    address = '123 Rue Exemple, 75000 Paris'
  } = sigData;
  
  // Déterminer les sources d'images réelles à utiliser
  const companyLogo = customLogoUrl || logoUrl || '';
  const profilePhoto = profilePhotoBase64 ? 
    (profilePhotoBase64.startsWith('data:') ? profilePhotoBase64 : `data:image/jpeg;base64,${profilePhotoBase64}`) : 
    profilePhotoUrl || '';

  // Validation et conversion sécurisée des valeurs numériques
  const safeLogoSize = Math.max(20, Number(logoSize) || 100);
  const safeProfilePhotoSize = Math.max(20, Number(profilePhotoSize) || 80);
  const safeVerticalSpacing = Math.max(0, Number(verticalSpacing) || 10);
  const safeHorizontalSpacing = Math.max(0, Number(horizontalSpacing) || 15);
  const safeFontSize = Math.max(8, Number(fontSize) || 14);
  
  console.log('Rendering with:', {
    showLogo,
    showProfilePhoto,
    companyLogo,
    profilePhoto,
    website,
    address
  });

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName;

  // Styles de base sécurisés
  const baseTextStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${safeFontSize}px`,
    margin: '0',
    padding: '0',
    lineHeight: '1.4'
  };

  const getTextDecoration = (style: string): string => {
    switch (style) {
      case 'underline': return 'underline';
      case 'overline': return 'overline';
      case 'strikethrough': return 'line-through';
      default: return 'none';
    }
  };

  return (
    <table 
      cellPadding="0" 
      cellSpacing="0" 
      border={0}
      style={{ 
        fontFamily: fontFamily, 
        maxWidth: '600px',
        borderCollapse: 'collapse'
      }}
    >
      <tbody>
        <tr>
          {/* Colonne 1 : Photo et informations personnelles */}
          <td style={{ 
            verticalAlign: 'top',
            paddingRight: `${safeHorizontalSpacing * 2}px`,
            whiteSpace: 'nowrap',
            width: 'auto',
            minWidth: '150px' // Largeur minimale pour éviter le chevauchement
          }}>
            <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ paddingBottom: '10px' }}>
                    {/* Photo de profil alignée à gauche */}
                    {showProfilePhoto && profilePhoto && !sigData.profilePhotoToDelete && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <img 
                          src={profilePhoto}
                          alt="Photo de profil"
                          className="profile-photo"
                          style={{
                            width: `${safeProfilePhotoSize}px`,
                            height: `${safeProfilePhotoSize}px`,
                            borderRadius: '50%',
                            display: 'block',
                            border: '0',
                            objectFit: 'cover',
                            marginLeft: '0' // S'assurer qu'il n'y a pas de marge à gauche
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.error('Erreur de chargement de la photo de profil:', target.src);
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    {/* Nom complet */}
                    {fullName && (
                      <div style={{
                        ...baseTextStyle,
                        color: primaryColor,
                        fontWeight: 'bold',
                        fontSize: `${safeFontSize + 2}px`,
                        textDecoration: getTextDecoration(textStyle),
                        textAlign: 'left',
                        marginBottom: '4px'
                      }}>
                        {fullName}
                      </div>
                    )}
                    
                    {/* Titre du poste */}
                    {showJobTitle && jobTitle && (
                      <div style={{
                        ...baseTextStyle,
                        color: secondaryColor,
                        textDecoration: getTextDecoration(textStyle),
                        textAlign: 'left',
                        marginBottom: '2px',
                        fontSize: `${safeFontSize}px`
                      }}>
                        {jobTitle}
                      </div>
                    )}
                    
                    {/* Nom de l'entreprise */}
                    {showCompanyName && companyName && (
                      <div style={{
                        ...baseTextStyle,
                        color: secondaryColor,
                        textDecoration: getTextDecoration(textStyle),
                        textAlign: 'left',
                        fontSize: `${safeFontSize}px`,
                        marginBottom: '5px'
                      }}>
                        {companyName}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          
          {/* Colonne 2 : Trait vertical */}
          <td style={{ 
            verticalAlign: 'top',
            width: '3px',
            padding: '0 20px',
            borderLeft: '3px solid #000000',
            height: '100%',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '0',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '1px'
            }}></div>
          </td>
          
          {/* Colonne 3 : Informations de contact */}
          <td style={{ 
            verticalAlign: 'top',
            paddingLeft: `${safeHorizontalSpacing}px`,
            paddingTop: `${safeProfilePhotoSize * 0.2}px`
          }}>
            <TableContactInfo />
          </td>
        </tr>

        {/* Ligne pour le logo d'entreprise */}
        {showLogo && companyLogo && (
          <tr>
            <td colSpan={4} style={{ 
              paddingTop: `${safeVerticalSpacing * 2}px`,
              textAlign: textAlignment
            }}>
              <img 
                src={companyLogo}
                alt="Logo entreprise"
                style={{
                  maxWidth: `${safeLogoSize}px`,
                  maxHeight: `${safeLogoSize}px`,
                  display: 'block',
                  border: '0',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('Erreur de chargement du logo:', target.src);
                }}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
