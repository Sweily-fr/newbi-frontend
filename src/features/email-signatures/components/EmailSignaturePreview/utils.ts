import { SignatureData } from '../../types';

// Type pour les liens sociaux
type SocialLinksType = NonNullable<SignatureData['socialLinks']>;

// Fonction pour préfixer l'URL du logo ou de la photo de profil avec l'URL de l'API si nécessaire
export const getFullImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  
  // Si l'image est déjà une URL complète ou une data URL, la retourner telle quelle
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Si le chemin commence par "/images/", c'est une ressource statique du dossier public
  if (imagePath.startsWith('/images/')) {
    return imagePath; // Retourner le chemin tel quel pour les ressources statiques
  }
  
  // URL de base de l'API pour les images
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  
  // Vérifier si l'URL contient déjà l'URL de l'API (pour éviter les doubles préfixes)
  if (imagePath.includes(apiUrl)) {
    return imagePath;
  }
  
  // Pour les autres chemins relatifs, ajouter le préfixe de l'API
  const fullUrl = `${apiUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  return fullUrl;
};

// Fonction spécifique pour l'URL de la photo de profil
export const getFullProfilePhotoUrl = (photoPath: string | undefined): string => {
  if (!photoPath) return '';
  if (photoPath && photoPath.startsWith('data:image')) {
    return photoPath;
  }
  return getFullImageUrl(photoPath);
};

// Fonction spécifique pour l'URL du logo
export const getFullLogoUrl = (logoPath: string | undefined): string => {
  if (!logoPath) return '';
  
  // Si le chemin commence par '/images/', c'est une ressource statique du dossier public
  if (logoPath.startsWith('/images/')) {
    // Pour les ressources statiques, utiliser directement le chemin
    return logoPath;
  }
  
  // Pour les autres chemins, utiliser la fonction générique
  return getFullImageUrl(logoPath);
};

// Vérifier si des liens sociaux sont définis
export const hasSocialLinksEnabled = (socialLinks?: SocialLinksType): boolean => {
  if (!socialLinks) return false;
  return !!(
    socialLinks.linkedin || 
    socialLinks.twitter || 
    socialLinks.facebook || 
    socialLinks.instagram
  );
};

// Fonction pour déterminer le style des liens
export const getLinkStyle = (primaryColor: string = '#5b50ff'): React.CSSProperties => ({
  color: primaryColor,
  textDecoration: 'none'
});

// Fonction pour générer les styles CSS pour les réseaux sociaux
export const getSocialIconStyle = (
  socialLinksIconStyle: string = 'plain',
  primaryColor: string = '#5b50ff'
): React.CSSProperties => {
  // Assurons-nous que le style est bien une valeur valide
  const style = ['plain', 'rounded', 'circle'].includes(socialLinksIconStyle) 
    ? socialLinksIconStyle 
    : 'plain';
  
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    margin: '0 5px',
    textDecoration: 'none'
  };

  // Utilisons une console.log pour déboguer
  console.log('Style d\'icône appliqué:', style, 'Couleur:', primaryColor);

  switch (style) {
    case 'rounded':
      return {
        ...baseStyle,
        padding: '6px',
        borderRadius: '5px',
        backgroundColor: primaryColor,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '28px',
        minHeight: '28px'
      };
    case 'circle':
      return {
        ...baseStyle,
        padding: '6px',
        borderRadius: '50%',
        backgroundColor: primaryColor,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px'
      };
    case 'plain':
    default:
      return {
        ...baseStyle,
        color: primaryColor
      };
  }
};
