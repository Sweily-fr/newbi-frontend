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

// Composant pour les balises meta par défaut qui seront présentes sur toutes les pages
// Les pages individuelles peuvent remplacer ces valeurs avec leur propre SEOHead
const DefaultSEO = () => (
  <Helmet>
    {/* Balises meta de base */}
    <meta name="description" content="Simplifiez la gestion de votre entreprise avec Newbi. Outils de facturation, devis, signatures email et plus encore pour les entrepreneurs et freelances." />
    <meta name="keywords" content="facturation, devis, gestion entreprise, entrepreneurs, freelance, signature email, outils business" />
    <meta name="author" content="Newbi" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://www.newbi.fr" />
    
    {/* Open Graph pour Facebook, LinkedIn, etc. */}
    <meta property="og:title" content="Newbi - Outils de gestion pour entrepreneurs" />
    <meta property="og:description" content="Simplifiez la gestion de votre entreprise avec nos outils de facturation, devis et plus encore." />
    <meta property="og:url" content="https://www.newbi.fr" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png" />
    
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Newbi - Outils de gestion pour entrepreneurs" />
    <meta name="twitter:description" content="Simplifiez la gestion de votre entreprise avec nos outils de facturation, devis et plus encore." />
    <meta name="twitter:image" content="https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png" />
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
              <Toaster position="bottom-left" />
            </CookieConsentProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
