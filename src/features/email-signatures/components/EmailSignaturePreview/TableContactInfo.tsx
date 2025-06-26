import React from 'react';

interface TableContactInfoProps {
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  verticalSpacing?: number;
  iconTextSpacing?: number;
  fontSize?: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  fontFamily?: string;
  socialLinks?: Record<string, string>;
  showSocialLinks?: boolean;
}

export const TableContactInfo: React.FC<TableContactInfoProps> = ({
  phone,
  mobilePhone,
  email,
  website,
  address,
  showEmailIcon,
  showPhoneIcon,
  showAddressIcon,
  showWebsiteIcon,
  primaryColor = '#5b50ff',
  secondaryColor = '#333333',
  textAlignment = 'left',
  verticalSpacing = 10,
  iconTextSpacing = 5,
  fontSize = 14,
  textStyle = 'normal',
  fontFamily = 'Arial, sans-serif',
  socialLinks = {},
  showSocialLinks = true
}) => {
  // Conversion sécurisée des valeurs
  const safeVerticalSpacing = Math.max(0, Number(verticalSpacing) || 10);
  const safeIconTextSpacing = Math.max(0, Number(iconTextSpacing) || 5);
  const safeFontSize = Math.max(8, Number(fontSize) || 14);
  
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
