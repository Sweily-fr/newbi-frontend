import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { client } from './lib/apolloClient';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { SessionExpiredNotification } from './features/auth/components/';
import { CookieBanner } from './components/specific/CookieBanner';
import { ScrollToTop } from './utils/ScrollToTop';
import { Helmet } from 'react-helmet';

// Composant pour les balises meta minimales par défaut qui seront présentes sur toutes les pages
// Les balises spécifiques à chaque page sont gérées par les composants SEO de chaque page
const DefaultSEO = () => (
  <Helmet>
    {/* Balises meta de base qui ne sont pas spécifiques à chaque page */}
    <meta name="author" content="Newbi" />
    <meta name="robots" content="index, follow" />
    <title>Newbi</title> {/* Titre par défaut, sera remplacé par les composants SEO spécifiques */}
    
    {/* Balises pour les appareils mobiles */}
    <meta name="format-detection" content="telephone=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    
    {/* Balises de sécurité */}
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </Helmet>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Ajoute les balises meta par défaut */}
      <DefaultSEO />
      <ApolloProvider client={client}>
        <AuthProvider>
          <SubscriptionProvider>
            <CookieConsentProvider>
              <SessionExpiredNotification />
              <AppRoutes />
              <CookieBanner />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  duration: 5000,
                }}
              />
            </CookieConsentProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
