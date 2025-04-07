/**
 * Utilitaires pour l'authentification
 */

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
