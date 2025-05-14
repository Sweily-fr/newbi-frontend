import React from 'react';
import { log } from 'console';

interface ContactInfoProps {
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  companyName?: string;
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
  primaryColor: string;
  secondaryColor?: string; // Ajout de la couleur secondaire pour les textes
  textAlignment?: 'left' | 'center' | 'right';
  isHorizontalLayout?: boolean;
  verticalSpacing?: number;
  iconTextSpacing?: number;
  fontSize?: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  fontFamily?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  phone,
  mobilePhone,
  email,
  website,
  address,
  companyName,
  showEmailIcon,
  showPhoneIcon,
  showAddressIcon,
  showWebsiteIcon,
  primaryColor,
  secondaryColor,
  textAlignment = 'left',
  isHorizontalLayout = false,
  verticalSpacing = 10,
  iconTextSpacing = 5,
  fontSize = 14,
  textStyle = 'normal',
  fontFamily = 'Arial, sans-serif'
}) => {
  // Utiliser la couleur secondaire si elle est définie et n'est pas la couleur de fond légère #f0eeff,
  // sinon utiliser #333333 comme couleur par défaut pour le texte et les icônes
  const textColor = secondaryColor && secondaryColor !== '#f0eeff' ? secondaryColor : '#333333';
  // Style de base pour les éléments de contact
  const contactItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${iconTextSpacing}px`, // Utiliser l'espacement configurable entre icône et texte
    margin: '0',
    // Appliquer l'alignement horizontal en fonction de textAlignment
    justifyContent: isHorizontalLayout ? 'flex-start' : 
                   textAlignment === 'center' ? 'center' : 
                   textAlignment === 'right' ? 'flex-end' : 'flex-start'
  };

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
  
  
  // Style pour les liens
  const linkStyle = {
    color: textColor,
    textDecoration: 'none',
    fontSize: `${fontSize}px`,
    ...getTextStyleProps(textStyle),
    fontFamily,
    opacity: 1 // Assurer une opacité complète
  };

  console.log(linkStyle, "linkStyle");
  console.log(getTextStyleProps(textStyle), "getTextStyleProps(textStyle)")
  // Style pour le conteneur principal des informations de contact
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${verticalSpacing}px`, // Utiliser l'espacement vertical configurable
    textAlign: isHorizontalLayout ? 'left' : textAlignment,
    // Aligner les éléments en fonction de l'alignement du texte
    alignItems: isHorizontalLayout ? 'flex-start' : 
               textAlignment === 'center' ? 'center' : 
               textAlignment === 'right' ? 'flex-end' : 'flex-start'
  };

  return (
    <div style={containerStyle}>
      {phone && (
        <div style={contactItemStyle}>
          {showPhoneIcon && (
            <span style={{ color: textColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <span style={{ fontSize: `${fontSize}px`, ...getTextStyleProps(textStyle), fontFamily, color: textColor, opacity: 1, fontWeight: 'normal' }}>{phone}</span>
        </div>
      )}
      
      {mobilePhone && (
        <div style={contactItemStyle}>
          {showPhoneIcon && (
            <span style={{ color: textColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M18 1.5c.829 0 1.5.67 1.5 1.5v18c0 .83-.671 1.5-1.5 1.5H6c-.829 0-1.5-.67-1.5-1.5V3c0-.83.671-1.5 1.5-1.5h12zm-6 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                <path d="M16.5 5.25a.75.75 0 00-.75-.75h-7.5a.75.75 0 00-.75.75v9a.75.75 0 00.75.75h7.5a.75.75 0 00.75-.75v-9z" />
              </svg>
            </span>
          )}
          <span style={{ fontSize: `${fontSize}px`, ...getTextStyleProps(textStyle), fontFamily, color: textColor, opacity: 1, fontWeight: 'normal' }}>{mobilePhone}</span>
        </div>
      )}
      
      {email && (
        <div style={contactItemStyle}>
          {showEmailIcon && (
            <span style={{ color: textColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </span>
          )}
          <a href={`mailto:${email}`} style={{fontSize: `${fontSize}px`,...getTextStyleProps(textStyle),color: textColor, opacity: 1}}>{email}</a>
        </div>
      )}
      
      {website && (
        <div style={contactItemStyle}>
          {showWebsiteIcon && (
            <span style={{ color: textColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <a href={website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            {website.replace(/^https?:\/\//i, '')}
          </a>
        </div>
      )}
      
      {address && (
        <div style={{...contactItemStyle, alignItems: 'flex-start'}}>
          {showAddressIcon && (
            <span style={{ color: textColor, marginTop: '3px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <span style={{ fontSize: `${fontSize}px`, ...getTextStyleProps(textStyle), fontFamily, whiteSpace: 'pre-line', color: textColor, opacity: 1, fontWeight: 'normal' }}>{address}</span>
        </div>
      )}
      
      {companyName && (
        <div style={contactItemStyle}>
          <strong style={{ fontSize: `${fontSize}px`, ...getTextStyleProps(textStyle), fontFamily, color: textColor, opacity: 1 }}>{companyName}</strong>
        </div>
      )}
    </div>
  );
};
