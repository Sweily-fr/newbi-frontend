import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../routes/constants';
import { LoginForm, RegisterForm } from '../features/auth/components/';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../assets/logo';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { ArrowLeft2 } from 'iconsax-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen pt-10 bg-gray-50">
      <SEOHead 
        title="Connexion et Inscription | Newbi"
        description="Connectez-vous à votre compte Newbi ou créez un nouveau compte pour accéder à nos outils pour entrepreneurs et freelances."
        keywords="connexion, inscription, login, register, compte Newbi, outils freelances, marketing digital"
        schemaType="WebPage"
        noindex={true}
        ogImage="https://www.newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://www.newbi.fr/auth"
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-8 left-8">
          <Link 
            to={ROUTES.HOME}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft2 size="20" variant="Linear" color="gray" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
        <div className="flex justify-center">
          <Logo variant="black" className="scale-[1.8]" withText={false} />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className=" px-8 sm:rounded-lg sm:px-12 rounded-xl">
              {isLogin ? <LoginForm onSwitchToRegister={() => setIsLogin(false)} /> : <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
