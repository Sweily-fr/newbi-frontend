/**
 * Utilitaires pour l'authentification
 */

/**
 * Interface pour les données décodées du token JWT
 */
export interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  exp: number;
  iat: number;
  // Utilisation d'un type plus spécifique au lieu de any
  [key: string]: string | number | boolean | undefined;
}

/**
 * Vérifie si un token JWT est expiré
 * @param token Le token JWT à vérifier
 * @returns true si le token est expiré ou invalide, false sinon
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    // Décoder le payload du token (partie du milieu)
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Vérifier la date d'expiration
    const expirationTime = payload.exp * 1000; // Convertir en millisecondes
    const currentTime = Date.now();
    
    return currentTime > expirationTime;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return true; // En cas d'erreur, considérer le token comme expiré
  }
};

/**
 * Décode un token JWT et retourne son contenu
 * @param token Le token JWT à décoder
 * @returns L'objet contenant les informations du token ou null si invalide
 */
export const decodeToken = (token: string | null): DecodedToken | null => {
  if (!token) return null;
  
  try {
    // Décoder le payload du token (partie du milieu)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return payload;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};
