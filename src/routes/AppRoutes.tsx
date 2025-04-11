import { Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  AuthPage,
  ProfilePage,
  ToolsPage,
  InvoicesPage,
  QuotesPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmail,
  ResendVerification,
  LegalNoticePage,
  PrivacyPolicyPage,
  TermsPage,
  ContactPage,
  CookiePreferencesPage,
  MobileRedirectPage,
  LegalNoticeGeneratorPage
} from '../pages';
import { ProtectedRoute, PublicRoute, SubscriptionRoute } from './guards';
import { ROUTES } from './constants';
import { MainLayout } from '../components/layout/MainLayout';
import { DeviceRedirect } from '../components/utils/DeviceRedirect';

export const AppRoutes = () => {
  return (
    <MainLayout>
      <DeviceRedirect>
        <Routes>
        {/* Route publique accessible à tous */}
        <Route path={ROUTES.HOME} element={<PublicRoute><HomePage /></PublicRoute>} />

        {/* Routes publiques restreintes aux utilisateurs non connectés */}
        <Route path={ROUTES.AUTH} element={
          <PublicRoute restricted>{<AuthPage />}</PublicRoute>
        } />
        <Route path={ROUTES.FORGOT_PASSWORD} element={
          <PublicRoute restricted>{<ForgotPasswordPage />}</PublicRoute>
        } />
        <Route path={ROUTES.RESET_PASSWORD} element={
          <PublicRoute restricted>{<ResetPasswordPage />}</PublicRoute>
        } />
        <Route path={ROUTES.VERIFY_EMAIL} element={
          <PublicRoute restricted>{<VerifyEmail />}</PublicRoute>
        } />
        <Route path={ROUTES.RESEND_VERIFICATION} element={
          <PublicRoute restricted>{<ResendVerification />}</PublicRoute>
        } />

        {/* Routes protégées nécessitant une authentification */}

        <Route path={ROUTES.PROFILE} element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.TOOLS} element={
          <ProtectedRoute>
            <ToolsPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.INVOICES} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <InvoicesPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.QUOTES} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <QuotesPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        {/* Pages légales */}
        <Route path={ROUTES.LEGAL_NOTICE} element={<PublicRoute><LegalNoticePage /></PublicRoute>} />
        <Route path={ROUTES.LEGAL_NOTICE_GENERATOR} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <LegalNoticeGeneratorPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PublicRoute><PrivacyPolicyPage /></PublicRoute>} />
        <Route path={ROUTES.TERMS} element={<PublicRoute><TermsPage /></PublicRoute>} />
        <Route path={ROUTES.CONTACT} element={<PublicRoute><ContactPage /></PublicRoute>} />
        <Route path={ROUTES.COOKIE_PREFERENCES} element={<PublicRoute><CookiePreferencesPage /></PublicRoute>} />

        {/* Page de redirection mobile */}
        <Route path={ROUTES.MOBILE} element={<PublicRoute><MobileRedirectPage /></PublicRoute>} />
        
        {/* Redirection par défaut vers la page d'accueil */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
      </DeviceRedirect>
    </MainLayout>
  );
};
