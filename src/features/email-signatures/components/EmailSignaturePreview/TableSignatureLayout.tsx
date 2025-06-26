import React from 'react';
import { TableContactInfo } from './TableContactInfo';

interface SignatureData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  companyLogo?: string;
  profilePhoto?: string;
  socialLinks?: Record<string, string>;
}

interface TableSignatureLayoutProps {
  data?: SignatureData;
  showCompanyName?: boolean;
  showSocialLinks?: boolean;
  showJobTitle?: boolean;
  showLogo?: boolean;
  showProfilePhoto?: boolean;
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  logoSize?: number;
  profilePhotoSize?: number;
  primaryColor?: string;
  secondaryColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  verticalSpacing?: number;
  horizontalSpacing?: number;
  iconTextSpacing?: number;
  fontSize?: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  fontFamily?: string;
}

export const TableSignatureLayout: React.FC<TableSignatureLayoutProps> = ({
  data = {},
  showCompanyName = true,
  showSocialLinks = true,
  showJobTitle = true,
  showLogo = true,
  showProfilePhoto = true,
  showEmailIcon = true,
  showPhoneIcon = true,
  showAddressIcon = true,
  showWebsiteIcon = true,
  logoSize = 100,
  profilePhotoSize = 80,
  primaryColor = '#5b50ff',
  secondaryColor = '#333333',
  textAlignment = 'left',
  verticalSpacing = 10,
  horizontalSpacing = 15,
  iconTextSpacing = 5,
  fontSize = 14,
  textStyle = 'normal',
  fontFamily = 'Arial, sans-serif'
}) => {
  // Extraction sécurisée des données
  const {
    firstName = '',
    lastName = '',
    jobTitle = '',
    companyName = '',
    phone = '',
    mobilePhone = '',
    email = '',
    website = '',
    address = '',
    companyLogo = '',
    profilePhoto = '',
    socialLinks = {}
  } = data;

  // Validation et conversion sécurisée des valeurs numériques
  const safeLogoSize = Math.max(20, Number(logoSize) || 100);
  const safeProfilePhotoSize = Math.max(20, Number(profilePhotoSize) || 80);
  const safeVerticalSpacing = Math.max(0, Number(verticalSpacing) || 10);
  const safeHorizontalSpacing = Math.max(0, Number(horizontalSpacing) || 15);
  const safeIconTextSpacing = Math.max(0, Number(iconTextSpacing) || 5);
  const safeFontSize = Math.max(8, Number(fontSize) || 14);

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
        {/* Première ligne : Photo de profil sur toute la largeur */}
        {showProfilePhoto && profilePhoto && (
          <tr>
            <td colSpan={3} style={{
              paddingBottom: `${safeVerticalSpacing}px`,
              textAlign: textAlignment
            }}>
              <img 
                src={profilePhoto}
                alt="Photo de profil"
                style={{
                  width: `${safeProfilePhotoSize}px`,
                  height: `${safeProfilePhotoSize}px`,
                  borderRadius: '50%',
                  display: 'block',
                  border: '0'
                }}
              />
            </td>
          </tr>
        )}

        {/* Deuxième ligne : Infos personnelles | Trait | Contacts */}
        <tr>
          {/* Colonne 1 : Informations personnelles */}
          <td style={{ 
            verticalAlign: 'top',
            width: '200px',
            paddingRight: `${safeHorizontalSpacing}px`
          }}>
            {/* Nom complet */}
            {fullName && (
              <div style={{
                ...baseTextStyle,
                color: primaryColor,
                fontWeight: 'bold',
                fontSize: `${safeFontSize + 4}px`,
                textDecoration: getTextDecoration(textStyle),
                marginBottom: `${Math.floor(safeVerticalSpacing / 2)}px`
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
                marginBottom: `${Math.floor(safeVerticalSpacing / 2)}px`
              }}>
                {jobTitle}
              </div>
            )}
            
            {/* Nom de l'entreprise */}
            {showCompanyName && companyName && (
              <div style={{
                ...baseTextStyle,
                color: secondaryColor,
                textDecoration: getTextDecoration(textStyle)
              }}>
                {companyName}
              </div>
            )}
          </td>
          
          {/* Colonne 2 : Trait vertical */}
          <td style={{ 
            verticalAlign: 'top',
            width: '3px',
            paddingLeft: `${Math.floor(safeHorizontalSpacing / 2)}px`,
            paddingRight: `${Math.floor(safeHorizontalSpacing / 2)}px`,
            borderLeft: '3px solid #000000'
          }}>
            {/* Cellule vide pour le trait */}
            <div style={{ width: '1px', height: '120px' }}></div>
          </td>
          
          {/* Colonne 3 : Informations de contact */}
          <td style={{ 
            verticalAlign: 'top',
            paddingLeft: `${safeHorizontalSpacing}px`
          }}>
            <TableContactInfo
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
              textAlignment={textAlignment}
              verticalSpacing={safeVerticalSpacing}
              iconTextSpacing={safeIconTextSpacing}
              fontSize={safeFontSize}
              textStyle={textStyle}
              fontFamily={fontFamily}
              socialLinks={socialLinks}
              showSocialLinks={showSocialLinks}
            />
          </td>
        </tr>

        {/* Troisième ligne : Logo d'entreprise */}
        {showLogo && companyLogo && (
          <tr>
            <td colSpan={3} style={{ 
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
                  border: '0'
                }}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
