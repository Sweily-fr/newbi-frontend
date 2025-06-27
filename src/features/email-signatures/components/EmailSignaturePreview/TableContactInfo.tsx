import React from 'react';
import { useEmailSignature } from '../../context/useEmailSignature';

interface SignatureData {
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  // Autres propriétés possibles
  [key: string]: string | boolean | number | undefined;
}

export const TableContactInfo: React.FC = () => {
  // Utiliser le contexte au lieu des props
  const context = useEmailSignature();
  console.log('TableContactInfo context:', context);
  
  // Forcer l'affichage des éléments manquants pour le débogage
  const {
    signatureData = {},
    showEmailIcon = true,
    showPhoneIcon = true,
    showAddressIcon = true,
    showWebsiteIcon = true,
    primaryColor = '#000000',
    secondaryColor = '#666666',
    // textAlignment n'est pas utilisé dans ce composant
    // textAlignment = 'left',
    verticalSpacing = 10,
    iconTextSpacing = 5,
    fontSize = 12,
    textStyle = 'normal',
    fontFamily = 'Arial, sans-serif'
  } = context;
  
  // Utiliser des valeurs par défaut si les données sont manquantes
  // Convertir en SignatureData en toute sécurité
  const sigData: SignatureData = (signatureData as SignatureData) || {};
  const { 
    phone = '01 23 45 67 89',
    mobilePhone = '06 12 34 56 78',
    email = 'email@exemple.com',
    website = 'https://votresite.com',
    address = '123 Rue Exemple, 75000 Paris'
  } = sigData;
  // Conversion sécurisée des valeurs
  const safeVerticalSpacing = Math.max(0, Number(verticalSpacing) || 10);
  const safeIconTextSpacing = Math.max(0, Number(iconTextSpacing) || 5);
  const safeFontSize = Math.max(8, Number(fontSize) || 14);
  
  console.log('Rendering contact info with:', {
    email,
    phone,
    mobilePhone,
    website,
    address,
    showEmailIcon,
    showPhoneIcon,
    showWebsiteIcon,
    showAddressIcon
  });
  
  const baseTextStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${safeFontSize}px`,
    color: secondaryColor,
    margin: '0',
    padding: '0',
    lineHeight: '1.6'
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
    <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: 'collapse' }}>
      <tbody>
        {/* Email */}
        {email && (
          <tr>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              paddingRight: `${safeIconTextSpacing}px`,
              verticalAlign: 'top'
            }}>
              {showEmailIcon && (
                <span style={{ 
                  color: primaryColor,
                  fontSize: `${safeFontSize}px`,
                  fontFamily: fontFamily
                }}>✉</span>
              )}
            </td>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              verticalAlign: 'top'
            }}>
              <span style={{
                ...baseTextStyle,
                textDecoration: getTextDecoration(textStyle)
              }}>
                {email}
              </span>
            </td>
          </tr>
        )}

        {/* Téléphone */}
        {(phone || mobilePhone) && (
          <tr>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              paddingRight: `${safeIconTextSpacing}px`,
              verticalAlign: 'top'
            }}>
              {showPhoneIcon && (
                <span style={{ 
                  color: secondaryColor,
                  fontSize: `${safeFontSize}px`,
                  fontFamily: fontFamily
                }}>📞</span>
              )}
            </td>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              verticalAlign: 'top'
            }}>
              <span style={{
                ...baseTextStyle,
                textDecoration: getTextDecoration(textStyle)
              }}>
                {phone || mobilePhone}
              </span>
            </td>
          </tr>
        )}

        {/* Site web */}
        {website && (
          <tr>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              paddingRight: `${safeIconTextSpacing}px`,
              verticalAlign: 'top'
            }}>
              {showWebsiteIcon && (
                <span style={{ 
                  color: primaryColor,
                  fontSize: `${safeFontSize}px`,
                  fontFamily: fontFamily
                }}>🌐</span>
              )}
            </td>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              verticalAlign: 'top'
            }}>
              <span style={{
                ...baseTextStyle,
                textDecoration: getTextDecoration(textStyle)
              }}>
                {website}
              </span>
            </td>
          </tr>
        )}

        {/* Adresse */}
        {address && (
          <tr>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              paddingRight: `${safeIconTextSpacing}px`,
              verticalAlign: 'top'
            }}>
              {showAddressIcon && (
                <span style={{ 
                  color: '#ff4444',
                  fontSize: `${safeFontSize}px`,
                  fontFamily: fontFamily
                }}>📍</span>
              )}
            </td>
            <td style={{ 
              paddingBottom: `${safeVerticalSpacing}px`,
              verticalAlign: 'top'
            }}>
              <span style={{
                ...baseTextStyle,
                textDecoration: getTextDecoration(textStyle)
              }}>
                {address}
              </span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
