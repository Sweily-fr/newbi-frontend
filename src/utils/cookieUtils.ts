/**
 * Définit un cookie avec le nom, la valeur et la durée d'expiration spécifiés
 * @param name Nom du cookie
 * @param value Valeur du cookie
 * @param days Nombre de jours avant expiration
 */
export const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

/**
 * Récupère la valeur d'un cookie par son nom
 * @param name Nom du cookie à récupérer
 * @returns La valeur du cookie ou une chaîne vide si non trouvé
 */
export const getCookie = (name: string): string => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  
  return '';
};

/**
 * Supprime un cookie par son nom
 * @param name Nom du cookie à supprimer
 */
export const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};

/**
 * Vérifie si le consentement a été donné pour une catégorie spécifique de cookies
 * @param category Catégorie de cookie à vérifier
 * @returns true si le consentement a été donné, false sinon
 */
export const hasCookieConsent = (category: string): boolean => {
  const consentCookie = getCookie('cookie_consent');
  
  if (!consentCookie) {
    return false;
  }
  
  try {
    const consent = JSON.parse(consentCookie);
    return consent[category] === true;
  } catch (error) {
    console.error('Erreur lors de la vérification du consentement aux cookies:', error);
    return false;
  }
};

/**
 * Initialise les scripts de suivi en fonction des consentements de l'utilisateur
 * Cette fonction peut être appelée après que l'utilisateur a donné son consentement
 */
export const initializeTrackingScripts = (): void => {
  // Initialiser Google Analytics si le consentement est donné
  if (hasCookieConsent('analytics')) {
    initializeGoogleAnalytics();
  }
  
  // Initialiser les scripts marketing si le consentement est donné
  if (hasCookieConsent('marketing')) {
    initializeMarketingScripts();
  }
};

/**
 * Initialise Google Analytics
 * Cette fonction ne doit être appelée que si l'utilisateur a donné son consentement
 */
const initializeGoogleAnalytics = (): void => {
  // Code d'initialisation de Google Analytics
  // Exemple:
  /*
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', process.env.REACT_APP_GA_TRACKING_ID);
  */
  
};

/**
 * Initialise les scripts marketing (Facebook Pixel, etc.)
 * Cette fonction ne doit être appelée que si l'utilisateur a donné son consentement
 */
const initializeMarketingScripts = (): void => {
  // Code d'initialisation des scripts marketing
  // Exemple pour Facebook Pixel:
  /*
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.REACT_APP_FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
  */
  
};
