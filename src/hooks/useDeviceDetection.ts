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
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Définitions des seuils pour les différents appareils
      // Mobile: < 768px
      // Tablet: >= 768px et < 1024px
      // Desktop: >= 1024px
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setDeviceType({ isMobile, isTablet, isDesktop });
    };

    // Vérification initiale
    handleResize();

    // Ajout de l'écouteur d'événement pour les changements de taille
    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};
