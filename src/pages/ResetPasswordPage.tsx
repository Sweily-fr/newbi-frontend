import { Link } from 'react-router-dom';
import { ResetPasswordForm } from '../features/auth/components/';
import { Logo } from '../assets/logo';
import { ROUTES } from '../routes/constants';

export const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen pt-10 bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-8 left-8">
          <Link 
            to={ROUTES.HOME}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour à l'accueil</span>
          </Link>
        </div>
        <div className="flex justify-center">
        <Logo variant="black" className="scale-[1.8]" withText={false} />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="px-8 sm:rounded-lg sm:px-12 rounded-xl">
              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
