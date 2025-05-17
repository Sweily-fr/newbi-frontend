import { useState, useEffect } from 'react';

interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useDeviceDetection = (): DeviceDetection => {
  const [deviceType, setDeviceType] = useState<DeviceDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const detectDevice = () => {
      // Détection basée sur l'User-Agent
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Expressions régulières pour détecter les appareils mobiles et tablettes
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /ipad|android(?!.*mobile)|tablet|kindle|playbook|silk|(?=.*android)(?=.*mobile)/i;
      
      // Détection basée sur l'User-Agent
      const isMobileByUA = mobileRegex.test(userAgent) && !tabletRegex.test(userAgent);
      const isTabletByUA = tabletRegex.test(userAgent);
      
      // Détection basée sur la largeur d'écran
      const width = window.innerWidth;
      const isMobileByWidth = width < 768;
      const isTabletByWidth = width >= 768 && width < 1024;
      
      // Combinaison des deux méthodes de détection
      // Privilégier la détection par User-Agent, mais utiliser la largeur comme fallback
      const isMobile = isMobileByUA || (isMobileByWidth && !isTabletByUA);
      const isTablet = isTabletByUA || (isTabletByWidth && !isMobileByUA);
      const isDesktop = !isMobile && !isTablet;

      setDeviceType({ isMobile, isTablet, isDesktop });
    };

    // Vérification initiale
    detectDevice();

    // Ajout de l'écouteur d'événement pour les changements de taille
    window.addEventListener('resize', detectDevice);

    // Nettoyage
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return deviceType;
};
