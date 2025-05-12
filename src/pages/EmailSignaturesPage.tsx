import React, { useState } from 'react';
// Import du nouveau composant avec la disposition sur deux colonnes
import { EmailSignatureFormLayout } from '../features/email-signatures/components/EmailSignatureFormLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { SEOHead } from '../components/SEO/SEOHead';
import { Personalcard, Instagram, Paintbucket, Grid5 } from 'iconsax-react';
import { CircularProgressBar } from '../features/email-signatures/components/CircularProgressBar';
import { useSignatureProgress } from '../features/email-signatures/hooks/useSignatureProgress';
import { SignatureData } from '../features/email-signatures/types';

const EmailSignaturesPage: React.FC = () => {
  // État pour contrôler la section active dans la sidebar
  const [activeSection, setActiveSection] = useState<'info' | 'social' | 'appearance' | 'settings'>('info');
  
  // État pour stocker les données de signature
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  
  // Calculer la progression de la signature
  const progress = useSignatureProgress(signatureData || {} as SignatureData);

  return (
    <div className="relative">
      <SEOHead 
        title="Créateur de Signatures Email Professionnelles | Newbi"
        description="Créez des signatures email professionnelles et personnalisées pour votre entreprise. Outil facile à utiliser et hautement personnalisable."
        keywords="signatures email, signature professionnelle, créateur de signature, email marketing, branding, signature d'entreprise"
        schemaType="WebApplication"
        schemaName="Créateur de Signatures Email Professionnelles"
        schemaPrice="14.99"
        ogImage="https://newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://newbi.fr/signatures-email"
        isPremium={true}
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
      />
      {/* Composant original commenté 
      <main className="mt-6" role="main" aria-label="Gestionnaire de signatures email">
        <EmailSignatureManager />
      </main>
      */}
      
      {/* Structure principale avec sidebar à l'extrême gauche */}
      <div className="flex w-full relative">
        {/* Espace réservé pour la sidebar */}
        <div className="w-20 flex-shrink-0"></div>
        
        {/* Contenu principal */}
        <main className="flex-1 container mx-auto pl-0 pr-4 py-8 mt-6" role="main" aria-label="Éditeur de signatures email">
          {/* Sidebar de navigation - positionnée à l'extrême gauche, fixée pour rester visible au scroll */}
          <div className="w-20 bg-white flex flex-col items-center py-8 fixed left-0 top-[80px] bottom-0 shadow-[2px_0px_5px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col items-center space-y-8">
              {/* Logo Newbi en haut */}
              <div className="mb-8 flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-[#b19aff]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#5b50ff]"></div>
                </div>
              </div>
              
              {/* Icône Informations */}
              <button 
                onClick={() => setActiveSection('info')} 
                className={`p-2 rounded-xl transition-all ${activeSection === 'info' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
              >
                <Personalcard size="24" color={activeSection === 'info' ? '#5b50ff' : '#222'} variant={activeSection === 'info' ? 'Bold' : 'Linear'} />
              </button>
              
              {/* Icône Réseaux sociaux */}
              <button 
                onClick={() => setActiveSection('social')} 
                className={`p-2 rounded-xl transition-all ${activeSection === 'social' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
              >
                <Instagram size="24" color={activeSection === 'social' ? '#5b50ff' : '#222'} variant={activeSection === 'social' ? 'Bold' : 'Linear'} />
              </button>
              
              {/* Icône Apparence */}
              <button 
                onClick={() => setActiveSection('appearance')} 
                className={`p-2 rounded-xl transition-all ${activeSection === 'appearance' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
              >
                <Paintbucket size="24" color={activeSection === 'appearance' ? '#5b50ff' : '#222'} variant={activeSection === 'appearance' ? 'Bold' : 'Linear'} />
              </button>
              
              {/* Icône Paramètres (vide pour l'instant) */}
              <button 
                onClick={() => setActiveSection('settings')} 
                className={`p-2 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-[#f0eeff] text-[#5b50ff]' : 'text-[#222] hover:text-[#5b50ff]'}`}
              >
                <Grid5 size="24" color={activeSection === 'settings' ? '#5b50ff' : '#222'} variant={activeSection === 'settings' ? 'Bold' : 'Linear'} />
              </button>
            </div>
            
            {/* Barre de progression circulaire en bas de la sidebar */}
            <div className="mt-auto mb-2 relative group">
              <CircularProgressBar 
                progress={progress} 
                size={40} 
                strokeWidth={2.5}
                circleColor="#E3E2E5"
                progressColor="#5b50ff"
              />
              
              {/* Bulle d'information au survol de la barre de progression */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 w-44 text-center shadow-lg">
                  <p>Taux de complétion de votre signature email</p>
                </div>
                <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute left-1/2 -bottom-1 -ml-1"></div>
              </div>
            </div>
          </div>
          <PageHeader
            title="Signatures Email"
            description="Créez et gérez vos signatures email professionnelles"
          />
          <div className="mt-6">
            <EmailSignatureFormLayout
              defaultNewbiLogoUrl="/images/logo_newbi/SVG/Logo_Texte_Purple.svg"
              activeSection={activeSection}
              onSignatureDataChange={setSignatureData}
            />
          </div>
        </main>
      </div>

      {/* Le formulaire est maintenant géré par le composant EmailSignatureManager */}
    </div>
  );
};

export default EmailSignaturesPage;
