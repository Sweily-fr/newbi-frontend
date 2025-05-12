import React, { useState } from 'react';
import { SignatureData } from '../../types';
import { getSocialIconStyle, hasSocialLinksEnabled } from './utils';

// Définir le type pour les liens sociaux
type SocialLinksType = NonNullable<SignatureData['socialLinks']>;

interface SocialLinksProps {
  socialLinks?: SocialLinksType;
  displayMode: 'icons' | 'text';
  socialLinksIconStyle: string;
  primaryColor: string; // Pour compatibilité avec l'ancien code
  iconColor?: string; // Couleur pour le SVG (l'icône elle-même) en mode "plain" ou pour le texte
  backgroundColor?: string; // Couleur de fond pour les styles "carré arrondi" et "cercle"
}

export const SocialLinksComponent: React.FC<SocialLinksProps> = ({
  socialLinks,
  displayMode,
  socialLinksIconStyle,
  primaryColor,
  iconColor: propIconColor,
  backgroundColor: propBackgroundColor
}) => {
  // Pas besoin de logs de débogage en production
  
  // Nous n'utilisons plus iconColor directement, nous utilisons textColor pour les textes
  // et backgroundColor pour les fonds d'icônes
  
  // Couleur de fond pour les styles "carré arrondi" et "cercle"
  // Utiliser la couleur de fond fournie ou la couleur primaire par défaut
  const backgroundIconColor = propBackgroundColor || primaryColor;
  
  // Couleur pour le texte des liens sociaux (toujours en noir ou gris foncé)
  const textColor = '#333333';
  
  if (!hasSocialLinksEnabled(socialLinks)) return null;

  // États pour gérer les effets de survol
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Appliquer le style approprié en fonction du mode d'affichage et du style d'icône
  const socialLinksContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: displayMode === 'text' ? '12px' : '10px',
    marginTop: '10px',
    justifyContent: 'flex-start',
    alignItems: 'center'
  };
  
  // Obtenir le style approprié pour chaque lien social en fonction du mode d'affichage et de l'état de survol
  const getLinkStyle = (linkType: string) => {
    const isHovered = hoveredLink === linkType;
    
    // Si le mode d'affichage est 'text', ajuster le style pour le texte
    if (displayMode === 'text') {
      return {
        display: 'inline-block',
        padding: '4px 8px',
        marginRight: '8px',
        color: isHovered ? '#4a41e0' : textColor, // Utiliser textColor pour les liens en mode texte
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '13px',
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
    
    switch (socialLinksIconStyle) {
      case 'rounded':
        return {
          ...baseStyle,
          padding: '6px',
          borderRadius: '5px',
          backgroundColor: isHovered ? '#4a41e0' : backgroundIconColor, // Couleur de fond (couleur primaire)
          color: '#ffffff', // Couleur du SVG toujours en blanc sur fond coloré
          minWidth: '28px',
          minHeight: '28px'
        };
      case 'circle':
        return {
          ...baseStyle,
          padding: '6px',
          borderRadius: '50%',
          backgroundColor: isHovered ? '#4a41e0' : backgroundIconColor, // Couleur de fond (couleur primaire)
          color: '#ffffff', // Couleur du SVG toujours en blanc sur fond coloré
          width: '28px',
          height: '28px'
        };
      case 'plain':
      default:
        return {
          ...baseStyle,
          color: isHovered ? '#4a41e0' : textColor // Utiliser textColor pour les icônes en mode plain
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          ) : 'LinkedIn'}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          ) : 'Twitter'}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          ) : 'Facebook'}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          ) : 'Instagram'}
        </a>
      )}
    </div>
  );
};
