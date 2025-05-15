import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Notification } from '../../../components/common/Notification';
import { CREATE_EMAIL_SIGNATURE, UPDATE_EMAIL_SIGNATURE } from '../../../graphql/emailSignatures';
import { SignatureData } from '../types';
import { useSignatureValidation } from './useSignatureValidation';
import { DEFAULT_PROFILE_PHOTO_SIZE } from '../constants/images';

/**
 * Hook simple pour enregistrer une signature de mail
 */
export const useSaveSignature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { validateSignature, errors, resetErrors } = useSignatureValidation();
  
  // Mutation pour créer une signature
  const [createSignature] = useMutation(CREATE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success('Signature créée avec succès');
      setIsLoading(false);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la création de la signature: ${error.message}`);
      setIsLoading(false);
    },
    refetchQueries: ['GetEmailSignatures']
  });
  
  // Mutation pour mettre à jour une signature
  const [updateSignature] = useMutation(UPDATE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success('Signature mise à jour avec succès');
      setIsLoading(false);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour de la signature: ${error.message}`);
      setIsLoading(false);
    },
    refetchQueries: ['GetEmailSignatures']
  });
  
  /**
   * Fonction pour préparer les données de la signature pour l'API
   */
  const prepareSignatureData = (data: SignatureData) => {
    console.log('Données avant préparation:', data);
    
    // S'assurer que les URLs des réseaux sociaux sont complètes
    const formattedSocialLinks = {
      linkedin: data.socialLinks.linkedin ? ensureUrlProtocol(data.socialLinks.linkedin) : '',
      twitter: data.socialLinks.twitter ? ensureUrlProtocol(data.socialLinks.twitter) : '',
      facebook: data.socialLinks.facebook ? ensureUrlProtocol(data.socialLinks.facebook) : '',
      instagram: data.socialLinks.instagram ? ensureUrlProtocol(data.socialLinks.instagram) : ''
    };
    
    // Correspondance exacte avec les champs attendus par le backend
    const formattedData = {
      name: data.name,
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      email: data.email,
      // Formater le numéro de téléphone au format international (ex: +33612345678)
      phone: formatPhoneNumber(data.phone || ''),
      mobilePhone: formatPhoneNumber(data.mobilePhone || ''),
      website: data.companyWebsite ? ensureUrlProtocol(data.companyWebsite) : '',
      address: data.companyAddress || '',
      companyName: data.companyName || '',
      socialLinks: formattedSocialLinks,
      // Le backend attend une valeur d'énumération spécifique pour template
      // Les valeurs valides sont: 'simple', 'professional', 'modern', 'creative'
      template: mapTemplateIdToName(data.templateId),
      primaryColor: data.primaryColor || '#5b50ff',
      secondaryColor: data.secondaryColor || '#f5f5f5',
      logoUrl: data.customLogoUrl || '',
      showLogo: data.showLogo !== undefined ? data.showLogo : true,
      isDefault: data.isDefault !== undefined ? data.isDefault : false,
      profilePhotoUrl: data.profilePhotoUrl || '',
      profilePhotoBase64: data.profilePhotoBase64 || null,
      profilePhotoSize: data.profilePhotoSize || DEFAULT_PROFILE_PHOTO_SIZE,
      layout: data.layout || 'vertical',
      horizontalSpacing: data.horizontalSpacing || 10,
      verticalSpacing: data.verticalSpacing || 10,
      verticalAlignment: data.textAlignment || 'left', // Utiliser textAlignment pour définir verticalAlignment
      imagesLayout: data.imagesLayout || 'vertical',
      // Utiliser une police de caractères valide selon l'énumération du backend
      fontFamily: getValidFontFamily(data.fontFamily),
      fontSize: data.fontSize || 14,
      textStyle: data.textStyle || 'normal',
      socialLinksDisplayMode: data.socialLinksDisplayMode || 'icons',
      socialLinksIconStyle: data.socialLinksIconStyle || 'plain',
      socialLinksPosition: data.socialLinksPosition || 'bottom',
      socialLinksIconColor: data.socialLinksIconColor || '#5b50ff',
      socialLinksIconBgColor: data.socialLinksIconColor ? lightenColor(data.socialLinksIconColor) : '#f0eeff',
      // Options d'affichage des icônes
      showEmailIcon: data.showEmailIcon !== undefined ? data.showEmailIcon : true,
      showPhoneIcon: data.showPhoneIcon !== undefined ? data.showPhoneIcon : true,
      showAddressIcon: data.showAddressIcon !== undefined ? data.showAddressIcon : true,
      showWebsiteIcon: data.showWebsiteIcon !== undefined ? data.showWebsiteIcon : true,
      iconTextSpacing: data.iconTextSpacing || 5
    };
    
    console.log('Données formatées pour l\'API:', formattedData);
    return formattedData;
  };
  
  /**
   * S'assure qu'une URL a un protocole (http:// ou https://)
   */
  const ensureUrlProtocol = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };
  
  /**
   * Formate un numéro de téléphone au format international
   * Le backend attend un format comme +33612345678
   */
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Supprimer tous les caractères non numériques
    let cleaned = phone.replace(/\D/g, '');
    
    // Si le numéro commence par 0, le remplacer par +33 (France)
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = `+33${cleaned.substring(1)}`;
    } 
    // Si le numéro ne commence pas par +, ajouter +
    else if (!cleaned.startsWith('+') && cleaned.length > 0) {
      cleaned = `+${cleaned}`;
    }
    
    return cleaned;
  };
  
  /**
   * Mappe un ID de template au nom de template valide attendu par le backend
   * Les valeurs valides sont: 'simple', 'professional', 'modern', 'creative'
   */
  const mapTemplateIdToName = (templateId?: string | number): string => {
    // Tableau de correspondance entre les IDs et les noms de templates
    const templateMap: Record<string, string> = {
      '1': 'simple',
      '2': 'professional',
      '3': 'modern',
      '4': 'creative',
      // Ajouter d'autres mappings si nécessaire
    };
    
    // Convertir en string si c'est un nombre
    const templateIdStr = templateId ? String(templateId) : '';
    
    // Retourner le nom correspondant ou 'simple' par défaut
    return templateMap[templateIdStr] || 'simple';
  };
  
  /**
   * Retourne une police de caractères valide selon l'énumération du backend
   * Les valeurs valides sont: 'Arial, sans-serif', 'Helvetica, sans-serif', etc.
   */
  const getValidFontFamily = (fontFamily?: string): string => {
    // Liste des polices de caractères valides selon le backend
    const validFonts = [
      'Arial, sans-serif',
      'Helvetica, sans-serif',
      'Georgia, serif',
      'Times New Roman, serif',
      'Courier New, monospace',
      'Verdana, sans-serif'
    ];
    
    // Mappings pour les noms courts vers les noms complets
    const fontMap: Record<string, string> = {
      'Arial': 'Arial, sans-serif',
      'Helvetica': 'Helvetica, sans-serif',
      'Georgia': 'Georgia, serif',
      'Times New Roman': 'Times New Roman, serif',
      'Courier New': 'Courier New, monospace',
      'Verdana': 'Verdana, sans-serif'
    };
    
    // Si la police est déjà valide, la retourner
    if (fontFamily && validFonts.includes(fontFamily)) {
      return fontFamily;
    }
    
    // Si la police est un nom court, retourner le nom complet
    if (fontFamily && fontMap[fontFamily]) {
      return fontMap[fontFamily];
    }
    
    // Retourner Arial par défaut
    return 'Arial, sans-serif';
  };
  
  /**
   * Éclaircit une couleur hexadécimale pour créer une couleur de fond
   */
  const lightenColor = (color: string): string => {
    // Retourne une couleur par défaut si la couleur n'est pas valide
    if (!color || !color.startsWith('#')) return '#f0eeff';
    
    try {
      // Convertir la couleur hex en RGB
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      
      // Éclaircir la couleur (mélanger avec du blanc)
      const lightR = Math.min(255, r + 200);
      const lightG = Math.min(255, g + 200);
      const lightB = Math.min(255, b + 200);
      
      // Convertir en hex
      return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
    } catch (e) {
      return '#f0eeff'; // Couleur par défaut en cas d'erreur
    }
  };
  
  /**
   * Fonction pour enregistrer une signature
   */
  const saveSignature = async (data: SignatureData, id?: string) => {
    setIsLoading(true);
    resetErrors();
    
    // Valider les données avant l'enregistrement
    const isValid = validateSignature(data);
    
    if (!isValid) {
      setIsLoading(false);
      Notification.error('Veuillez corriger les erreurs dans le formulaire');
      return false;
    }
    
    try {
      const input = prepareSignatureData(data);
      
      if (id) {
        // Mise à jour d'une signature existante
        await updateSignature({
          variables: {
            id,
            input
          }
        });
      } else {
        // Création d'une nouvelle signature
        await createSignature({
          variables: {
            input
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la signature:', error);
      Notification.error(`Erreur lors de l'enregistrement de la signature: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsLoading(false);
      return false;
    }
  };
  
  return {
    saveSignature,
    isLoading,
    validationErrors: errors
  };
};
