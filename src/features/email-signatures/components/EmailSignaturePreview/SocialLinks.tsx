import React, { useState } from 'react';
import { SignatureData } from '../../types';
import { hasSocialLinksEnabled } from './utils';

// Définir le type pour les liens sociaux
type SocialLinksType = NonNullable<SignatureData['socialLinks']>;

interface SocialLinksProps {
  socialLinks?: SocialLinksType;
  displayMode: 'icons' | 'text';
  socialLinksIconStyle: string;
  primaryColor: string; // Pour compatibilité avec l'ancien code
  iconColor?: string; // Couleur pour le SVG (l'icône elle-même) en mode "plain" ou pour le texte
  backgroundColor?: string; // Couleur de fond pour les styles "carré arrondi" et "cercle"
  textColor?: string; // Couleur pour le texte des liens sociaux en mode texte
  verticalSpacing?: number; // Espacement vertical entre les icônes
}

// Interface pour le style des liens sociaux
interface SocialLinkStyle {
  display: string;
  alignItems: string;
  justifyContent: string;
  margin: string;
  textDecoration: string;
  transition: string;
  padding?: string;
  color: string;
  iconStyle?: React.CSSProperties; // Utiliser React.CSSProperties pour éviter les erreurs TypeScript
}

export const SocialLinksComponent: React.FC<SocialLinksProps> = ({
  socialLinks,
  displayMode,
  socialLinksIconStyle,
  primaryColor,
  iconColor: propIconColor,
  backgroundColor: propBackgroundColor,
  verticalSpacing
}) => {
  // États pour gérer les effets de survol - déclaré en premier pour éviter l'erreur d'utilisation conditionnelle
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  // Vérifier si des liens sociaux sont activés
  if (!hasSocialLinksEnabled(socialLinks)) return null;
  
  // Couleur de fond pour les styles "carré arrondi" et "cercle"
  // Utiliser la couleur de fond fournie ou la couleur primaire par défaut
  const backgroundIconColor = propBackgroundColor || primaryColor;
  
  // Déterminer la couleur des icônes SVG en fonction du style et de la couleur fournie
  // Si une couleur spécifique est fournie via propIconColor, l'utiliser
  // Sinon, utiliser une couleur par défaut en fonction du style
  
  // Pour le style 'plain', utiliser la couleur fournie ou une couleur foncée par défaut
  // Pour les styles avec fond (rounded, circle), utiliser la couleur fournie ou blanc par défaut
  let iconColor: string;
  
  // Toujours utiliser la couleur spécifique fournie si elle existe
  if (propIconColor) {
    iconColor = propIconColor;
  } else {
    // Sinon, utiliser une couleur par défaut en fonction du style
    if (socialLinksIconStyle === 'plain') {
      iconColor = '#333333'; // Couleur foncée par défaut pour le style plain
    } else {
      iconColor = '#ffffff'; // Blanc par défaut pour les styles avec fond
    }
  }
  
  // Nous n'utilisons plus de style dynamique pour les icônes SVG
  // car nous forçons la couleur blanche (#ffffff) directement dans les balises SVG
  // Cela garantit que les icônes sont toujours blanches dans la prévisualisation

  // Appliquer le style approprié en fonction du mode d'affichage et du style d'icône
  const socialLinksContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: verticalSpacing ? `${verticalSpacing}px` : (displayMode === 'text' ? '12px' : '10px'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '20px'
  };
  
  // Obtenir le style approprié pour chaque lien social en fonction du mode d'affichage et de l'état de survol
  const getLinkStyle = (linkType: string): SocialLinkStyle => {
    const isHovered = hoveredLink === linkType;
    
    // Si le mode d'affichage est 'text', ajuster le style pour le texte
    if (displayMode === 'text') {
      return {
        display: 'inline-block',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0',
        padding: '4px 8px',
        color: isHovered ? '#4a41e0' : iconColor, // Utiliser la couleur d'icône spécifiée ou blanc par défaut
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out'
      };
    }
    
    // Pour le mode icônes, appliquer des styles spécifiques en fonction du style d'icône
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 5px',
      textDecoration: 'none',
      transition: 'all 0.2s ease-in-out'
    };
    
    // Définir des dimensions fixes pour garantir la cohérence lors de la copie
    const iconSize = '28px';
    const iconPadding = '6px';
    
    // Styles communs pour les icônes
    const commonIconStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: iconPadding,
      boxSizing: 'border-box',
      textAlign: 'center'
    };
    
    switch (socialLinksIconStyle) {
      case 'rounded':
        return {
          ...baseStyle,
          padding: '0', // Pas de padding sur le lien lui-même
          color: iconColor, // Utiliser la couleur d'icône spécifiée ou blanc par défaut
          // La couleur de fond sera appliquée uniquement à l'icône, pas au lien entier
          iconStyle: {
            ...commonIconStyle,
            borderRadius: '5px',
            backgroundColor: isHovered ? '#4a41e0' : backgroundIconColor,
            minWidth: iconSize,
            minHeight: iconSize,
            width: iconSize,  // Dimension fixe pour garantir la cohérence
            height: iconSize // Dimension fixe pour garantir la cohérence
          }
        };
      case 'circle':
        return {
          ...baseStyle,
          padding: '0', // Pas de padding sur le lien lui-même
          color: iconColor, // Utiliser la couleur d'icône spécifiée ou blanc par défaut
          // La couleur de fond sera appliquée uniquement à l'icône, pas au lien entier
          iconStyle: {
            ...commonIconStyle,
            borderRadius: '50%',
            backgroundColor: isHovered ? '#4a41e0' : backgroundIconColor,
            width: iconSize,
            height: iconSize
          }
        };
      case 'plain':
      default:
        return {
          ...baseStyle,
          color: isHovered ? '#4a41e0' : iconColor, // Utiliser la couleur d'icône spécifiée ou blanc par défaut
          iconStyle: {
            ...commonIconStyle,
            padding: '0',
            borderRadius: '0',
            backgroundColor: 'transparent',
            width: '14px',  // Dimension fixe pour le style plain
            height: '14px' // Dimension fixe pour le style plain
          } // Style minimal pour l'icône en mode plain
        };
    }
  };

  return (
    <div style={socialLinksContainerStyle}>
      {socialLinks?.linkedin && (
        <a 
          href={socialLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={getLinkStyle('linkedin')}
          onMouseEnter={() => setHoveredLink('linkedin')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {displayMode === 'icons' ? (
            <div style={getLinkStyle('linkedin').iconStyle}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" style={{
                fill: socialLinksIconStyle === 'plain' ? iconColor : (propIconColor || '#ffffff'),
                display: 'block',
                maxWidth: '100%',
                maxHeight: '100%',
                boxSizing: 'border-box'
              }}>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
          ) : <p style={{ color: propIconColor || '#fff' }}>Linkedin</p>}
        </a>
      )}
      {socialLinks?.twitter && (
        <a 
          href={socialLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={getLinkStyle('twitter')}
          onMouseEnter={() => setHoveredLink('twitter')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {displayMode === 'icons' ? (
            <div style={getLinkStyle('twitter').iconStyle || {}}>
              <svg width="14" height="14" viewBox="0 0 24 24" style={{fill: socialLinksIconStyle === 'plain' ? iconColor : (propIconColor || '#ffffff')}}>
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </div>
          ) : <p style={{ color: propIconColor || '#333333' }}>Twitter</p>}
        </a>
      )}
      {socialLinks?.facebook && (
        <a 
          href={socialLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={getLinkStyle('facebook')}
          onMouseEnter={() => setHoveredLink('facebook')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {displayMode === 'icons' ? (
            <div style={getLinkStyle('facebook').iconStyle || {}}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" style={{
                fill: socialLinksIconStyle === 'plain' ? iconColor : (propIconColor || '#ffffff'),
                width: socialLinksIconStyle === 'plain' ? '14px' : '14px',
                height: socialLinksIconStyle === 'plain' ? '14px' : '14px',
                minWidth: socialLinksIconStyle === 'plain' ? '14px' : '14px',
                minHeight: socialLinksIconStyle === 'plain' ? '14px' : '14px',
                display: 'block'
              }}>
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </div>
          ) : <p style={{ color: propIconColor || '#333333' }}>Facebook</p>}
        </a>
      )}
      {socialLinks?.instagram && (
        <a 
          href={socialLinks.instagram} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={getLinkStyle('instagram')}
          onMouseEnter={() => setHoveredLink('instagram')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {displayMode === 'icons' ? (
            <div style={getLinkStyle('instagram').iconStyle || {}}>
              <svg width="14" height="14" viewBox="0 0 24 24" style={{fill: socialLinksIconStyle === 'plain' ? iconColor : (propIconColor || '#ffffff')}}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          ) : <p style={{ color: propIconColor || '#333333' }}>Instagram</p>}
        </a>
      )}
    </div>
  );
};
