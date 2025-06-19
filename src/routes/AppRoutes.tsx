import { Routes, Route } from 'react-router-dom';
import {
  HomePage,
  AuthPage,
  ProfilePage,
  ToolsPage,
  InvoicesPage,
  QuotesPage,
  PurchaseOrderPage,
  ExpensesPage,
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
  LegalNoticeGeneratorPage,
  PrivacyPolicyGeneratorPage,
  BlogSeoOptimizerPage,
  EmailSignaturesPage,
  FileTransferPage,
  FileTransferDownloadPage,
  NotFoundPage,
  BlogPage,
  BlogArticlePage,
  KanbanPage,
} from '../pages';
import { ProtectedRoute, PublicRoute, SubscriptionRoute } from './guards';
import { ROUTES } from './constants';
import { MainLayout } from '../components/layout/MainLayout';
import { DeviceRedirect } from '../utils/DeviceRedirect';

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

        <Route path={ROUTES.PURCHASE_ORDER} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <PurchaseOrderPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.EXPENSES} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <ExpensesPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.EMAIL_SIGNATURES} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <EmailSignaturesPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.FILE_TRANSFER} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <FileTransferPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.KANBAN} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <KanbanPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.KANBAN_BOARD} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <KanbanPage />
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
        <Route path={ROUTES.PRIVACY_POLICY_GENERATOR} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <PrivacyPolicyGeneratorPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.BLOG_SEO_OPTIMIZER} element={
          <ProtectedRoute>
            <SubscriptionRoute>
              <BlogSeoOptimizerPage />
            </SubscriptionRoute>
          </ProtectedRoute>
        } />
        
        {/* Route publique pour le téléchargement des fichiers partagés */}
        <Route path={ROUTES.FILE_TRANSFER_DOWNLOAD} element={<PublicRoute><FileTransferDownloadPage /></PublicRoute>} />
        
        {/* Routes du blog */}
        <Route path={ROUTES.BLOG} element={<PublicRoute><BlogPage /></PublicRoute>} />
        <Route path={ROUTES.BLOG_ARTICLE} element={<PublicRoute><BlogArticlePage /></PublicRoute>} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PublicRoute><PrivacyPolicyPage /></PublicRoute>} />
        <Route path={ROUTES.TERMS} element={<PublicRoute><TermsPage /></PublicRoute>} />
        <Route path={ROUTES.CONTACT} element={<PublicRoute><ContactPage /></PublicRoute>} />
        <Route path={ROUTES.COOKIE_PREFERENCES} element={<PublicRoute><CookiePreferencesPage /></PublicRoute>} />

        {/* Page de redirection mobile */}
        <Route path={ROUTES.MOBILE} element={<PublicRoute><MobileRedirectPage /></PublicRoute>} />
        
        {/* Page 404 personnalisée */}
        <Route path={ROUTES.NOT_FOUND} element={<PublicRoute><NotFoundPage /></PublicRoute>} />
        
        {/* Route par défaut - affiche la page 404 pour toutes les routes non définies */}
        <Route path="*" element={<PublicRoute><NotFoundPage /></PublicRoute>} />
      </Routes>
      </DeviceRedirect>
    </MainLayout>
  );
};
