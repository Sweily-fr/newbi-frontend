import React, { useState } from 'react';
import { useCompany } from '../hooks';
import { Button } from '../components';
import { Spinner } from '../components/feedback';
import { Notification } from '../components/feedback';
import { NotificationComponent } from '../components/';
import { SEOHead } from '../components/SEO/SEOHead';

// Types pour le formulaire
interface PrivacyPolicyForm {
  companyName: string;
  companyStatus: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companySIRET: string;
  companyVAT: string;
  directorName: string;
  websiteUrl: string;
  collectsPersonalData: string;
  collectsLocation: string;
  collectsCookies: string;
  sharesDataWithThirdParties: string;
  dataRetentionPeriod: string;
  hasNewsletterSubscription: string;
  hasContactForm: string;
  hasDPO: string;
  dpoName: string;
  dpoEmail: string;
}

// Valeurs initiales du formulaire
const initialFormValues: PrivacyPolicyForm = {
  companyName: '',
  companyStatus: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companySIRET: '',
  companyVAT: '',
  directorName: '',
  websiteUrl: '',
  collectsPersonalData: 'yes',
  collectsLocation: 'no',
  collectsCookies: 'yes',
  sharesDataWithThirdParties: 'no',
  dataRetentionPeriod: '36',
  hasNewsletterSubscription: 'no',
  hasContactForm: 'yes',
  hasDPO: 'no',
  dpoName: '',
  dpoEmail: '',
};

const PrivacyPolicyGeneratorPage: React.FC = () => {
  // Les constantes SEO sont maintenant directement dans le composant SEOHead
  // Récupération des informations de l'entreprise
  const { company, loading } = useCompany();

  // États pour le formulaire et le résultat
  const [formValues, setFormValues] = useState<PrivacyPolicyForm>(initialFormValues);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copyFormat, setCopyFormat] = useState<'text' | 'html'>('text');
  const [errors, setErrors] = useState<Record<keyof PrivacyPolicyForm, string>>({} as Record<keyof PrivacyPolicyForm, string>);

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
  const validateField = (name: keyof PrivacyPolicyForm, value: string): string => {
    const { EMAIL_PATTERN, URL_PATTERN, REQUIRED_FIELD_MESSAGE, EMAIL_ERROR_MESSAGE } = {
      EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      URL_PATTERN: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*([?][;&a-z\d%_.~+=-]*)?([#][-a-z\d_]*)?$/i,
      REQUIRED_FIELD_MESSAGE: 'Ce champ est requis',
      EMAIL_ERROR_MESSAGE: 'Adresse email invalide'
    };

    // Définir les champs obligatoires
    const requiredFields: (keyof PrivacyPolicyForm)[] = [
      'companyName', 
      'companyAddress', 
      'companyEmail', 
      'directorName',
      'websiteUrl'
    ];

    // Vérifier si le champ est obligatoire et vide
    if (requiredFields.includes(name) && !value.trim()) {
      return REQUIRED_FIELD_MESSAGE;
    }

    // Validation spécifique pour les emails
    if ((name === 'companyEmail' || name === 'dpoEmail') && value.trim()) {
      if (!EMAIL_PATTERN.test(value)) {
        return EMAIL_ERROR_MESSAGE;
      }
    }

    // Validation spécifique pour les URLs
    if (name === 'websiteUrl' && value.trim()) {
      if (!URL_PATTERN.test(value)) {
        return 'URL invalide';
      }
    }

    // Validation pour le DPO si hasDPO est "yes"
    if (name === 'hasDPO' && value === 'yes') {
      if (!formValues.dpoName.trim()) {
        setErrors(prev => ({ ...prev, dpoName: REQUIRED_FIELD_MESSAGE }));
      }
      if (!formValues.dpoEmail.trim()) {
        setErrors(prev => ({ ...prev, dpoEmail: REQUIRED_FIELD_MESSAGE }));
      }
    }

    return '';
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mettre à jour les valeurs du formulaire
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Valider le champ
    const error = validateField(name as keyof PrivacyPolicyForm, value);
    
    // Mettre à jour les erreurs
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Fonction pour générer la politique de confidentialité
  const generatePrivacyPolicy = () => {
    // Vérifier tous les champs du formulaire
    let hasErrors = false;
    const newErrors: Record<keyof PrivacyPolicyForm, string> = {} as Record<keyof PrivacyPolicyForm, string>;
    
    // Parcourir tous les champs du formulaire et les valider
    Object.keys(formValues).forEach((key) => {
      const fieldName = key as keyof PrivacyPolicyForm;
      const fieldValue = formValues[fieldName];
      const error = validateField(fieldName, fieldValue);
      
      if (error) {
        hasErrors = true;
        newErrors[fieldName] = error;
      } else {
        newErrors[fieldName] = '';
      }
    });
    
    // Vérification supplémentaire pour les champs du DPO si hasDPO est "yes"
    if (formValues.hasDPO === 'yes') {
      if (!formValues.dpoName.trim()) {
        hasErrors = true;
        newErrors.dpoName = 'Ce champ est requis quand vous avez un DPO';
      }
      if (!formValues.dpoEmail.trim()) {
        hasErrors = true;
        newErrors.dpoEmail = 'Ce champ est requis quand vous avez un DPO';
      }
    }
    
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
    
    // Génération du texte de la politique de confidentialité en format texte brut
    const text = `
POLITIQUE DE CONFIDENTIALITÉ

Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}

1. INTRODUCTION

${formValues.companyName}${formValues.companyStatus ? ` (${formValues.companyStatus})` : ''}, situé(e) à ${formValues.companyAddress}, s'engage à protéger la vie privée des utilisateurs de son site web ${formValues.websiteUrl}. La présente politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations personnelles lorsque vous visitez notre site web.

En utilisant notre site, vous consentez aux pratiques décrites dans la présente politique de confidentialité.

2. RESPONSABLE DU TRAITEMENT

Le responsable du traitement des données à caractère personnel est :
${formValues.companyName}
Adresse : ${formValues.companyAddress}
Email : ${formValues.companyEmail}
Téléphone : ${formValues.companyPhone || 'Non communiqué'}
${formValues.companySIRET ? `SIRET : ${formValues.companySIRET}` : ''}
${formValues.companyVAT ? `TVA : ${formValues.companyVAT}` : ''}

Représentant légal : ${formValues.directorName}

${formValues.hasDPO === 'yes' ? `Délégué à la protection des données (DPO) :
${formValues.dpoName}
Email : ${formValues.dpoEmail}
` : ''}

3. DONNÉES COLLECTÉES

${formValues.collectsPersonalData === 'yes' ? `Nous collectons les types d'informations personnelles suivants :

- Informations d'identification (nom, prénom, adresse email)
- Informations de contact (adresse postale, numéro de téléphone)
${formValues.hasContactForm === 'yes' ? `- Informations fournies via notre formulaire de contact
` : ''}${formValues.hasNewsletterSubscription === 'yes' ? `- Informations fournies lors de l'inscription à notre newsletter
` : ''}${formValues.collectsLocation === 'yes' ? `- Données de localisation
` : ''}` : `Nous ne collectons pas d'informations personnelles directement identifiables sur notre site web.`}

4. FINALITÉS DU TRAITEMENT

Nous utilisons vos informations personnelles aux fins suivantes :

- Fournir et améliorer nos services
- Répondre à vos demandes et questions
${formValues.hasNewsletterSubscription === 'yes' ? `- Vous envoyer des newsletters et communications marketing (avec votre consentement)
` : ''}- Respecter nos obligations légales
- Protéger nos droits et prévenir les activités frauduleuses

5. BASE JURIDIQUE DU TRAITEMENT

Nous traitons vos données personnelles sur les bases juridiques suivantes :

- Votre consentement
- L'exécution d'un contrat auquel vous êtes partie
- Le respect de nos obligations légales
- Nos intérêts légitimes (amélioration de nos services, sécurité)

6. CONSERVATION DES DONNÉES

Nous conservons vos données personnelles pendant une durée n'excédant pas ${formValues.dataRetentionPeriod} mois à compter de votre dernière interaction avec notre site, sauf obligation légale de conservation plus longue.

7. COOKIES ET TECHNOLOGIES SIMILAIRES

${formValues.collectsCookies === 'yes' ? `Notre site utilise des cookies et technologies similaires pour améliorer votre expérience de navigation, analyser l'utilisation du site et personnaliser le contenu.

Types de cookies utilisés :
- Cookies essentiels : nécessaires au fonctionnement du site
- Cookies analytiques : pour comprendre comment les visiteurs interagissent avec le site
- Cookies de préférence : pour mémoriser vos préférences

Vous pouvez gérer vos préférences en matière de cookies en modifiant les paramètres de votre navigateur.` : `Notre site n'utilise pas de cookies ni de technologies similaires pour suivre votre activité.`}

8. PARTAGE DES DONNÉES

${formValues.sharesDataWithThirdParties === 'yes' ? `Nous pouvons partager vos informations personnelles avec les catégories de destinataires suivantes :

- Nos prestataires de services qui nous aident à exploiter notre site web
- Les autorités publiques lorsque la loi l'exige
- Des tiers en cas de réorganisation, fusion, vente ou transfert d'actifs

Nous ne vendons pas vos données personnelles à des tiers.` : `Nous ne partageons pas vos informations personnelles avec des tiers, sauf lorsque la loi l'exige ou avec votre consentement explicite.`}

9. TRANSFERTS INTERNATIONAUX DE DONNÉES

Vos données personnelles peuvent être transférées et traitées dans des pays autres que celui où vous résidez. Ces pays peuvent avoir des lois de protection des données différentes.

Lorsque nous transférons vos données en dehors de l'Espace Économique Européen, nous mettons en place des garanties appropriées conformément au RGPD.

10. VOS DROITS

Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :

- Droit d'accès à vos données personnelles
- Droit de rectification des données inexactes
- Droit à l'effacement ("droit à l'oubli")
- Droit à la limitation du traitement
- Droit à la portabilité des données
- Droit d'opposition au traitement
- Droit de retirer votre consentement à tout moment
- Droit d'introduire une réclamation auprès d'une autorité de contrôle

Pour exercer ces droits, veuillez nous contacter à l'adresse email suivante : ${formValues.companyEmail}

11. SÉCURITÉ DES DONNÉES

Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération et la destruction.

12. MODIFICATIONS DE LA POLITIQUE DE CONFIDENTIALITÉ

Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours disponible sur notre site web avec la date de dernière mise à jour.

13. CONTACT

Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, veuillez nous contacter à :

${formValues.companyName}
Email : ${formValues.companyEmail}
Adresse : ${formValues.companyAddress}

----------

Cette politique de confidentialité a été générée via Newbi le ${new Date().toLocaleDateString('fr-FR')}.
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
    try {
      let textToCopy = generatedText;
      
      // Si le format HTML est sélectionné, convertir le texte en HTML
      if (copyFormat === 'html') {
        textToCopy = generatedText
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>')
          .replace(/^/, '<p>')
          .replace(/$/, '</p>')
          // Remplacer les titres
          .replace(/<p>([0-9]+\. [A-ZÉÈÊËÀÂÄÔÖÙÛÜÇ\s]+)<\/p>/g, '</p><h2>$1</h2><p>');
      }
      
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          // Succès
          Notification.success(`Texte copié au format ${copyFormat === 'html' ? 'HTML' : 'texte'}`, {
            duration: 3000,
            position: 'bottom-left'
          });
        },
        (err) => {
          // Erreur
          console.error('Erreur lors de la copie :', err);
          Notification.error('Erreur lors de la copie du texte', {
            duration: 3000,
            position: 'bottom-left'
          });
        }
      );
    } catch (error) {
      console.error('Erreur lors de la copie :', error);
      Notification.error('Erreur lors de la copie du texte', {
        duration: 3000,
        position: 'bottom-left'
      });
    }
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
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title="Générateur de Politique de Confidentialité RGPD Gratuit | Newbi"
        description="Créez facilement une politique de confidentialité conforme au RGPD pour votre site web. Outil gratuit, personnalisable et prêt à l'emploi."
        keywords="politique de confidentialité, RGPD, générateur, protection des données, confidentialité, site web, légal, mentions légales"
        schemaType="WebApplication"
        schemaName="Générateur de Politique de Confidentialité RGPD"
        schemaPrice="0"
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
        canonicalUrl="https://newbi.fr/generator-politique-confidentialite"
      />
      <div className="max-w-4xl mx-auto">
        <header>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Générateur de Politique de Confidentialité</h1>
          <p className="text-gray-600 mb-6">Créez une politique de confidentialité conforme au RGPD en quelques minutes</p>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center h-64" role="status" aria-live="polite">
            <Spinner size="lg" />
            <span className="sr-only">Chargement des informations...</span>
          </div>
        ) : showResult ? (
          <section id="result-section" className="bg-white shadow-md rounded-lg p-6" aria-labelledby="result-heading">
            <div className="flex justify-between items-center mb-6">
              <h2 id="result-heading" className="text-lg font-semibold text-gray-700">Politique de confidentialité générée</h2>
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
                aria-label="Contenu de la politique de confidentialité"
                id="privacy-policy-content"
              />
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Note :</strong> Cette politique de confidentialité est générée à titre indicatif. Il est recommandé de la faire vérifier par un professionnel du droit avant publication.
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
        ) : (
          <section className="bg-white shadow-md rounded-lg p-6" aria-labelledby="form-heading">
            <div className="flex justify-between items-center mb-6">
              <h2 id="form-heading" className="text-lg font-semibold text-gray-700">Informations pour votre politique de confidentialité</h2>
              {company && (
                <Button onClick={fillCompanyInfo} variant="outline" className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Importer les infos de mon entreprise
                </Button>
              )}
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); generatePrivacyPolicy(); }}>
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Astuce :</strong> Si vous avez déjà renseigné les informations de votre entreprise dans votre profil, vous pouvez les importer automatiquement en cliquant sur le bouton ci-dessus.
                  </p>
                </div>
                
                <h3 id="company-info-section" className="text-md font-semibold text-gray-700 border-b pb-2">Informations sur l'entreprise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formValues.companyName}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="companyStatus" className="block text-sm font-medium text-gray-700 mb-1">Statut juridique</label>
                    <input
                      type="text"
                      id="companyStatus"
                      name="companyStatus"
                      value={formValues.companyStatus}
                      onChange={handleChange}
                      placeholder="SARL, SAS, Auto-entrepreneur..."
                      className={`w-full p-2 border ${errors.companyStatus ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companyStatus && <p className="mt-1 text-sm text-red-600">{errors.companyStatus}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Adresse complète <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      id="companyAddress"
                      name="companyAddress"
                      value={formValues.companyAddress}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.companyAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companyAddress && <p className="mt-1 text-sm text-red-600">{errors.companyAddress}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">Email de contact <span className="text-red-600">*</span></label>
                    <input
                      type="email"
                      id="companyEmail"
                      name="companyEmail"
                      value={formValues.companyEmail}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.companyEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companyEmail && <p className="mt-1 text-sm text-red-600">{errors.companyEmail}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="text"
                      id="companyPhone"
                      name="companyPhone"
                      value={formValues.companyPhone}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.companyPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companyPhone && <p className="mt-1 text-sm text-red-600">{errors.companyPhone}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="companySIRET" className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                    <input
                      type="text"
                      id="companySIRET"
                      name="companySIRET"
                      value={formValues.companySIRET}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.companySIRET ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companySIRET && <p className="mt-1 text-sm text-red-600">{errors.companySIRET}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="companyVAT" className="block text-sm font-medium text-gray-700 mb-1">Numéro de TVA</label>
                    <input
                      type="text"
                      id="companyVAT"
                      name="companyVAT"
                      value={formValues.companyVAT}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.companyVAT ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.companyVAT && <p className="mt-1 text-sm text-red-600">{errors.companyVAT}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="directorName" className="block text-sm font-medium text-gray-700 mb-1">Nom du responsable <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      id="directorName"
                      name="directorName"
                      value={formValues.directorName}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.directorName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.directorName && <p className="mt-1 text-sm text-red-600">{errors.directorName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">URL du site web <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formValues.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://www.example.com"
                      className={`w-full p-2 border ${errors.websiteUrl ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.websiteUrl && <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>}
                  </div>
                </div>
                
                <h3 id="data-collection-section" className="text-md font-semibold text-gray-700 border-b pb-2 mt-8">Informations sur la collecte de données</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="collectsPersonalData" className="block text-sm font-medium text-gray-700 mb-1">Collectez-vous des données personnelles ?</label>
                    <select
                      id="collectsPersonalData"
                      name="collectsPersonalData"
                      value={formValues.collectsPersonalData}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="collectsLocation" className="block text-sm font-medium text-gray-700 mb-1">Collectez-vous des données de localisation ?</label>
                    <select
                      id="collectsLocation"
                      name="collectsLocation"
                      value={formValues.collectsLocation}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="collectsCookies" className="block text-sm font-medium text-gray-700 mb-1">Utilisez-vous des cookies ?</label>
                    <select
                      id="collectsCookies"
                      name="collectsCookies"
                      value={formValues.collectsCookies}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="sharesDataWithThirdParties" className="block text-sm font-medium text-gray-700 mb-1">Partagez-vous des données avec des tiers ?</label>
                    <select
                      id="sharesDataWithThirdParties"
                      name="sharesDataWithThirdParties"
                      value={formValues.sharesDataWithThirdParties}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dataRetentionPeriod" className="block text-sm font-medium text-gray-700 mb-1">Durée de conservation des données (en mois)</label>
                    <input
                      type="number"
                      id="dataRetentionPeriod"
                      name="dataRetentionPeriod"
                      value={formValues.dataRetentionPeriod}
                      onChange={handleChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hasNewsletterSubscription" className="block text-sm font-medium text-gray-700 mb-1">Proposez-vous un abonnement à une newsletter ?</label>
                    <select
                      id="hasNewsletterSubscription"
                      name="hasNewsletterSubscription"
                      value={formValues.hasNewsletterSubscription}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="hasContactForm" className="block text-sm font-medium text-gray-700 mb-1">Avez-vous un formulaire de contact ?</label>
                    <select
                      id="hasContactForm"
                      name="hasContactForm"
                      value={formValues.hasContactForm}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="hasDPO" className="block text-sm font-medium text-gray-700 mb-1">Avez-vous un Délégué à la Protection des Données (DPO) ?</label>
                    <select
                      id="hasDPO"
                      name="hasDPO"
                      value={formValues.hasDPO}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                    </select>
                  </div>
                </div>
                
                {formValues.hasDPO === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="dpoName" className="block text-sm font-medium text-gray-700 mb-1">Nom du DPO <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        id="dpoName"
                        name="dpoName"
                        value={formValues.dpoName}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.dpoName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.dpoName && <p className="mt-1 text-sm text-red-600">{errors.dpoName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="dpoEmail" className="block text-sm font-medium text-gray-700 mb-1">Email du DPO <span className="text-red-600">*</span></label>
                      <input
                        type="email"
                        id="dpoEmail"
                        name="dpoEmail"
                        value={formValues.dpoEmail}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.dpoEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.dpoEmail && <p className="mt-1 text-sm text-red-600">{errors.dpoEmail}</p>}
                    </div>
                  </div>
                )}
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                  <p className="text-sm text-yellow-700">
                    <strong>Note :</strong> Les champs marqués d'un astérisque (*) sont obligatoires.
                  </p>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" variant="primary" className="flex items-center hover:bg-[#4a41e0] focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Générer la politique de confidentialité
                  </Button>
                </div>
              </div>
            </form>
          </section>
        )}
      </div>
      
      {notification && (
        <NotificationComponent
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default PrivacyPolicyGeneratorPage;
