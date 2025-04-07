import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/constants';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { isMobile, isTablet } = useDeviceDetection();
  
  // Vérifier si l'URL actuelle est une page d'authentification
  const isAuthPage = 
    location.pathname === ROUTES.AUTH || 
    location.pathname === ROUTES.LOGIN || 
    location.pathname.startsWith(ROUTES.FORGOT_PASSWORD) || 
    location.pathname.includes('reset-password') ||
    location.pathname === ROUTES.CHANGE_PASSWORD;
    
  // Vérifier si c'est la page mobile ou si l'utilisateur est sur mobile/tablette
  const isMobilePage = location.pathname === ROUTES.MOBILE;
  const shouldHideNavAndFooter = isAuthPage || isMobilePage || isMobile || isTablet;
  
  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavAndFooter && <Navbar />}
      <main className={`flex-grow ${!isMobilePage && !isMobile && !isTablet ? 'bg-gray-50' : 'bg-white'}`}>
        {children}
      </main>
      {!shouldHideNavAndFooter && <Footer />}
    </div>
  );
};
