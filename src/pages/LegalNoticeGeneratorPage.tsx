import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../features/profile/hooks';
import { Button, Spinner } from '../components';
import { Notification } from '../components/common/Notification';
import { NotificationComponent } from '../components/';
import { SEOHead } from '../components/specific/SEO/SEOHead';

// Types pour le formulaire
interface LegalNoticeForm {
  companyName: string;
  companyStatus: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyCapital: string;
  companyRCS: string;
  companySIRET: string;
  companyVAT: string;
  directorName: string;
  websiteUrl: string;
  hostingName: string;
  hostingAddress: string;
  hostingPhone: string;
  hostingEmail: string;
}

// Valeurs initiales du formulaire
const initialFormValues: LegalNoticeForm = {
  companyName: '',
  companyStatus: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companyCapital: '',
  companyRCS: '',
  companySIRET: '',
  companyVAT: '',
  directorName: '',
  websiteUrl: '',
  hostingName: '',
  hostingAddress: '',
  hostingPhone: '',
  hostingEmail: '',
};

export const LegalNoticeGeneratorPage: React.FC = () => {
  // Récupération des informations de l'entreprise
  const { isAuthenticated } = useAuth();
  const { company, loading } = useCompany();

  // États pour le formulaire et le résultat
  const [formValues, setFormValues] = useState<LegalNoticeForm>(initialFormValues);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copyFormat, setCopyFormat] = useState<'text' | 'html'>('text');
  const [errors, setErrors] = useState<Record<keyof LegalNoticeForm, string>>({} as Record<keyof LegalNoticeForm, string>);

  // Fonction pour remplir automatiquement les champs avec les informations de l'entreprise
  const fillCompanyInfo = () => {
    if (company) {
      // Formater l'adresse complète si elle existe
      const formattedAddress = company.address ? 
        `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}` : '';

      setFormValues({
        ...formValues,
        companyName: company.name || '',
        companyStatus: company.legalStatus || '',
        companyAddress: formattedAddress,
        companyEmail: company.email || '',
        companyPhone: company.phone || '',
        companyCapital: company.capital ? company.capital.toString() : '',
        companyRCS: company.rcs || '',
        companySIRET: company.siret || '',
        companyVAT: company.vatNumber || '',
        directorName: company.directorName || '',
      });
      
      // Afficher une notification de succès
      Notification.success('Informations de l\'entreprise importées avec succès', {
        duration: 3000,
        position: 'bottom-left'
      });
    }
  };

  // Fonction pour valider un champ du formulaire
  const validateField = (name: keyof LegalNoticeForm, value: string): string => {
    const { EMAIL_PATTERN, URL_PATTERN, PHONE_PATTERN, REQUIRED_FIELD_MESSAGE, EMAIL_ERROR_MESSAGE, PHONE_ERROR_MESSAGE } = {
      EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      URL_PATTERN: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*([?][;&a-z\d%_.~+=-]*)?([#][-a-z\d_]*)?$/i,
      PHONE_PATTERN: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      REQUIRED_FIELD_MESSAGE: 'Ce champ est requis',
      EMAIL_ERROR_MESSAGE: 'Adresse email invalide',
      PHONE_ERROR_MESSAGE: 'Format de téléphone invalide (format français attendu)'
    };

    // Définir les champs obligatoires
    const requiredFields: (keyof LegalNoticeForm)[] = [
      'companyName', 
      'companyAddress', 
      'companyEmail', 
      'directorName',
      'websiteUrl',
      'hostingName'
    ];

    // Vérifier si le champ est obligatoire et vide
    if (requiredFields.includes(name) && !value.trim()) {
      return REQUIRED_FIELD_MESSAGE;
    }

    // Validations spécifiques par champ
    switch (name) {
      case 'companyEmail':
      case 'hostingEmail':
        if (value && !EMAIL_PATTERN.test(value)) {
          return EMAIL_ERROR_MESSAGE;
        }
        break;
      case 'websiteUrl':
        if (value && !URL_PATTERN.test(value)) {
          return 'URL invalide';
        }
        break;
      case 'companyPhone':
        if (value && !/^[+]?[0-9\s]{8,15}$/.test(value)) {
          return 'Numéro de téléphone invalide';
        }
        break;
      case 'hostingPhone':
        if (value && !PHONE_PATTERN.test(value)) {
          return PHONE_ERROR_MESSAGE;
        }
        break;
      case 'companySIRET':
        if (value && !/^[0-9]{14}$/.test(value)) {
          return 'Le SIRET doit contenir 14 chiffres';
        }
        break;
      case 'companyVAT':
        if (value && !/^FR[0-9]{11}$/.test(value)) {
          return 'Le numéro de TVA doit être au format FR suivi de 11 chiffres';
        }
        break;
    }

    return '';
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Valider le champ et mettre à jour les erreurs
    const fieldError = validateField(name as keyof LegalNoticeForm, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  // Fonction pour générer les mentions légales
  const generateLegalNotice = () => {
    // Vérifier tous les champs du formulaire
    let hasErrors = false;
    const newErrors: Record<keyof LegalNoticeForm, string> = {} as Record<keyof LegalNoticeForm, string>;
    
    // Parcourir tous les champs du formulaire et les valider
    Object.keys(formValues).forEach((key) => {
      const fieldName = key as keyof LegalNoticeForm;
      const fieldValue = formValues[fieldName];
      const error = validateField(fieldName, fieldValue);
      
      if (error) {
        hasErrors = true;
        newErrors[fieldName] = error;
      } else {
        newErrors[fieldName] = '';
      }
    });
    
    // Mettre à jour l'état des erreurs
    setErrors(newErrors);
    
    if (hasErrors) {
      // Afficher une notification d'erreur
      Notification.error('Veuillez corriger les erreurs dans le formulaire', {
        duration: 3000,
        position: 'bottom-left'
      });
      
      // Faire défiler jusqu'au premier champ avec une erreur
      const firstErrorField = document.querySelector('.text-red-600');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    // Génération du texte des mentions légales en format texte brut uniquement
    const text = `
MENTIONS LÉGALES

1. Présentation du site

En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site ${formValues.websiteUrl} l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :

Propriétaire du site : ${formValues.companyName}${formValues.companyStatus ? ` - ${formValues.companyStatus}` : ''}
Adresse : ${formValues.companyAddress}
Contact : ${formValues.companyEmail}${formValues.companyPhone ? ` - Téléphone : ${formValues.companyPhone}` : ''}
${formValues.companyCapital ? `Capital social : ${formValues.companyCapital} euros` : ''}
${formValues.companyRCS ? `RCS : ${formValues.companyRCS}` : ''}
${formValues.companySIRET ? `SIRET : ${formValues.companySIRET}` : ''}
${formValues.companyVAT ? `Numéro de TVA intracommunautaire : ${formValues.companyVAT}` : ''}

Directeur de la publication : ${formValues.directorName}

2. Hébergement

Le site ${formValues.websiteUrl} est hébergé par :
${formValues.hostingName}
${formValues.hostingAddress ? `Adresse : ${formValues.hostingAddress}` : ''}
${formValues.hostingPhone ? `Téléphone : ${formValues.hostingPhone}` : ''}
${formValues.hostingEmail ? `Email : ${formValues.hostingEmail}` : ''}

3. Propriété intellectuelle

L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.

La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.

4. Données personnelles

Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition aux données vous concernant.

Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez contacter ${formValues.companyName} à l'adresse suivante : ${formValues.companyEmail}.

5. Cookies

Le site ${formValues.websiteUrl} peut utiliser des cookies pour améliorer l'expérience utilisateur. Vous pouvez désactiver l'utilisation de cookies en modifiant les paramètres de votre navigateur.

6. Liens hypertextes

Le site ${formValues.websiteUrl} peut contenir des liens hypertextes vers d'autres sites. ${formValues.companyName} n'a pas la possibilité de vérifier le contenu de ces sites et n'assumera aucune responsabilité de ce fait.

7. Droit applicable et juridiction compétente

Tout litige en relation avec l'utilisation du site ${formValues.websiteUrl} est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents.

----------

Ces mentions légales ont été générées via Newbi le ${new Date().toLocaleDateString('fr-FR')}.
`;

    setGeneratedText(text);
    setShowResult(true);
    
    // Scroll vers le résultat
    setTimeout(() => {
      const resultSection = document.getElementById('result-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Fonction pour copier le texte généré
  const copyToClipboard = () => {
    let contentToCopy = '';
    
    if (copyFormat === 'html') {
      // Convertir le texte brut en HTML basique
      contentToCopy = generatedText
        .replace(/^MENTIONS LÉGALES$/m, '<h1>MENTIONS LÉGALES</h1>')
        .replace(/^(\d+\. .*)$/gm, '<h2>$1</h2>')
        .replace(/^(Propriétaire du site|Adresse|Contact|Capital social|RCS|SIRET|Numéro de TVA intracommunautaire|Directeur de la publication) : /gm, '<strong>$1 :</strong> ')
        .replace(/\n/g, '<br>')
        .replace(/----------/g, '<hr>');
    } else {
      contentToCopy = generatedText;
    }
    
    navigator.clipboard.writeText(contentToCopy).then(() => {
      // Afficher une notification de succès
      Notification.success(`Mentions légales copiées au format ${copyFormat === 'html' ? 'HTML' : 'texte'}`, {
        duration: 3000,
        position: 'bottom-left'
      });
    }).catch(() => {
      // Afficher une notification d'erreur
      Notification.error('Erreur lors de la copie', {
        duration: 3000,
        position: 'bottom-left'
      });
    });
  };

  // Fonction pour modifier le texte généré
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedText(e.target.value);
  };

  // Fonction pour revenir au formulaire
  const backToForm = () => {
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <SEOHead 
        title="Générateur de Mentions Légales Gratuit | Conforme RGPD | Newbi"
        description="Créez facilement des mentions légales conformes à la législation française pour votre site web. Outil gratuit, personnalisable et prêt à l'emploi."
        keywords="mentions légales, générateur, site web, RGPD, conformité légale, hébergeur, entreprise, directeur de publication"
        schemaType="WebApplication"
        schemaName="Générateur de Mentions Légales Newbi"
        schemaPrice="0"
        canonicalUrl="https://newbi.fr/generator-mentions-legales"
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        <header>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Générateur de mentions légales</h1>
          <p className="text-gray-600 mb-6">Créez des mentions légales conformes à la législation française en quelques clics</p>
        </header>
        
        {notification && (
          <NotificationComponent
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
        
        {!showResult ? (
          <section className="bg-white shadow-md rounded-lg p-6" aria-labelledby="form-heading">
            <div className="flex justify-between items-center mb-6">
              <h2 id="form-heading" className="text-lg font-semibold text-gray-700">Informations pour vos mentions légales</h2>
              {isAuthenticated && (
                <Button
                  onClick={fillCompanyInfo}
                  disabled={loading}
                  className="flex items-center"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Importer mes informations
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <form className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-700">
                  Les champs marqués d'un * sont obligatoires pour générer des mentions légales conformes.
                </p>
              </div>
              
              <h3 id="company-info-section" className="text-md font-medium text-gray-700 border-b pb-2 mb-4">Informations sur l'entreprise</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formValues.companyName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.companyName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    required
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.companyName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Forme juridique
                  </label>
                  <select
                    id="companyStatus"
                    name="companyStatus"
                    value={formValues.companyStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez une forme juridique</option>
                    <option value="EURL">EURL</option>
                    <option value="SARL">SARL</option>
                    <option value="SAS">SAS</option>
                    <option value="SASU">SASU</option>
                    <option value="SA">SA</option>
                    <option value="SCI">SCI</option>
                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                    <option value="Entreprise individuelle">Entreprise individuelle</option>
                    <option value="Association loi 1901">Association loi 1901</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    value={formValues.companyAddress}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.companyAddress ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    required
                  />
                  {errors.companyAddress && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.companyAddress}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="companyEmail"
                    name="companyEmail"
                    value={formValues.companyEmail}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.companyEmail ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    required
                  />
                  {errors.companyEmail && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.companyEmail}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="companyPhone"
                    name="companyPhone"
                    value={formValues.companyPhone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.companyPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  />
                  {errors.companyPhone && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.companyPhone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyCapital" className="block text-sm font-medium text-gray-700 mb-1">
                    Capital social (en euros)
                  </label>
                  <input
                    type="text"
                    id="companyCapital"
                    name="companyCapital"
                    value={formValues.companyCapital}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="directorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du directeur de publication *
                  </label>
                  <input
                    type="text"
                    id="directorName"
                    name="directorName"
                    value={formValues.directorName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.directorName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    required
                  />
                  {errors.directorName && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.directorName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyRCS" className="block text-sm font-medium text-gray-700 mb-1">
                    RCS
                  </label>
                  <input
                    type="text"
                    id="companyRCS"
                    name="companyRCS"
                    value={formValues.companyRCS}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="companySIRET" className="block text-sm font-medium text-gray-700 mb-1">
                    SIRET
                  </label>
                  <input
                    type="text"
                    id="companySIRET"
                    name="companySIRET"
                    value={formValues.companySIRET}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.companySIRET ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  />
                  {errors.companySIRET && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.companySIRET}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyVAT" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de TVA
                  </label>
                  <input
                    type="text"
                    id="companyVAT"
                    name="companyVAT"
                    value={formValues.companyVAT}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.companyVAT ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  />
                  {errors.companyVAT && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.companyVAT}</p>
                  )}
                </div>
              </div>
              
              <h3 id="website-info-section" className="text-md font-medium text-gray-700 border-b pb-2 mb-4 mt-8">Informations sur le site web</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL du site web *
                  </label>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formValues.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.websiteUrl ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    required
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.websiteUrl}</p>
                  )}
                </div>
              </div>
              
              <h3 id="hosting-info-section" className="text-md font-medium text-gray-700 border-b pb-2 mb-4 mt-8">Informations sur l'hébergeur</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="hostingName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'hébergeur *
                  </label>
                  <input
                    type="text"
                    id="hostingName"
                    name="hostingName"
                    value={formValues.hostingName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.hostingName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    required
                  />
                  {errors.hostingName && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.hostingName}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="hostingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de l'hébergeur
                  </label>
                  <input
                    type="text"
                    id="hostingAddress"
                    name="hostingAddress"
                    value={formValues.hostingAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="hostingPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone de l'hébergeur
                  </label>
                  <input
                    type="tel"
                    id="hostingPhone"
                    name="hostingPhone"
                    value={formValues.hostingPhone}
                    onChange={handleChange}
                    placeholder="Ex: 06 12 34 56 78"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.hostingPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  />
                  {errors.hostingPhone && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.hostingPhone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="hostingEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email de l'hébergeur
                  </label>
                  <input
                    type="email"
                    id="hostingEmail"
                    name="hostingEmail"
                    value={formValues.hostingEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button onClick={generateLegalNotice} variant="primary" className="hover:bg-[#4a41e0] focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]">
                  Générer les mentions légales
                </Button>
              </div>
            </form>
          </section>
        ) : (
          <section id="result-section" className="bg-white shadow-md rounded-lg p-6" aria-labelledby="result-heading">
            <div className="flex justify-between items-center mb-6">
              <h2 id="result-heading" className="text-lg font-semibold text-gray-700">Mentions légales générées</h2>
              <div className="flex items-center space-x-4">

                <div className="flex items-center">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden pr-2">
                    <label htmlFor="copy-format" className="text-sm text-gray-600 bg-gray-50 h-full flex items-center border-r border-gray-300 mr-2 p-3">Copier en :</label>
                    <select
                      id="copy-format"
                      value={copyFormat}
                      onChange={(e) => setCopyFormat(e.target.value as 'text' | 'html')}
                      className="text-sm h-full p-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Texte</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>
                </div>
                <Button onClick={copyToClipboard} variant="outline" className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Copier
                </Button>
                <Button onClick={backToForm} variant="outline" className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Retour
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <textarea
                value={generatedText}
                onChange={handleTextChange}
                className="w-full h-[500px] font-mono text-sm focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff] resize-none"
                aria-label="Contenu des mentions légales"
                id="legal-notice-content"
              />
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Note :</strong> Ces mentions légales sont générées à titre indicatif. Il est recommandé de les faire vérifier par un professionnel du droit avant publication.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={backToForm} variant="outline" className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Modifier les informations
              </Button>
              <Button onClick={copyToClipboard} variant="primary" className="flex items-center hover:bg-[#4a41e0] focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Copier au format {copyFormat === 'html' ? 'HTML' : 'texte'}
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LegalNoticeGeneratorPage;
