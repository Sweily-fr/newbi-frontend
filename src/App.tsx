import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { client } from './lib/apolloClient';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { SessionExpiredNotification } from './components/business/auth/SessionExpiredNotification';
import { CookieBanner } from './components/feedback/CookieBanner';
import { ScrollToTop } from './components/utils/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ApolloProvider client={client}>
        <AuthProvider>
          <SubscriptionProvider>
            <CookieConsentProvider>
              <SessionExpiredNotification />
              <AppRoutes />
              {/* Cookie Banner */}
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
