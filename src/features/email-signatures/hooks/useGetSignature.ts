import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_EMAIL_SIGNATURE } from '../../../graphql/emailSignatures';
import { SignatureData } from '../types/index';
import { DEFAULT_PROFILE_PHOTO_SIZE } from '../constants/images';

/**
 * Hook pour récupérer les données d'une signature existante
 * @param id Identifiant de la signature à récupérer
 */
export const useGetSignature = (id?: string) => {
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  
  // Requête pour récupérer une signature spécifique
  const { loading, error, data } = useQuery(GET_EMAIL_SIGNATURE, {
    variables: { id },
    skip: !id, // Ne pas exécuter la requête si aucun ID n'est fourni
    fetchPolicy: 'network-only' // Toujours récupérer les données fraîches
  });
  
  // Convertir les données de l'API vers le format SignatureData
  useEffect(() => {
    if (data?.emailSignature) {
      const signature = data.emailSignature;
      
      // Conversion des données
      const convertedData: SignatureData = {
        name: signature.name,
        fullName: signature.fullName,
        jobTitle: signature.jobTitle,
        email: signature.email,
        phone: signature.phone || '',
        mobilePhone: signature.mobilePhone,
        primaryColor: signature.primaryColor,
        secondaryColor: signature.secondaryColor,
        companyName: signature.companyName || '',
        companyWebsite: signature.website || '',
        companyAddress: signature.address || '',
        socialLinks: signature.socialLinks || {
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: ''
        },
        socialLinksDisplayMode: signature.socialLinksDisplayMode || 'icons',
        socialLinksIconStyle: signature.socialLinksIconStyle || 'circle',
        socialLinksPosition: signature.socialLinksPosition || 'bottom',
        useNewbiLogo: signature.showLogo || true,
        customLogoUrl: signature.logoUrl || '',
        showLogo: signature.showLogo || true,
        profilePhotoUrl: signature.profilePhotoUrl || '',
        profilePhotoSize: signature.profilePhotoSize || DEFAULT_PROFILE_PHOTO_SIZE,
        fontFamily: signature.fontFamily || 'Arial',
        fontSize: signature.fontSize || 14,
        textStyle: 'normal',
        textAlignment: 'left',
        layout: signature.layout || 'vertical',
        horizontalSpacing: signature.horizontalSpacing || 20,
        verticalSpacing: signature.verticalSpacing || 10,
        verticalAlignment: signature.verticalAlignment || 'left',
        imagesLayout: signature.imagesLayout || 'stacked',
        isDefault: signature.isDefault || false,
        templateId: signature.templateId || '1',
        
        // Options d'affichage des icônes (valeurs par défaut)
        showEmailIcon: true,
        showPhoneIcon: true,
        showAddressIcon: true,
        showWebsiteIcon: true
      };
      
      setSignatureData(convertedData);
    }
  }, [data]);
  
  return {
    signatureData,
    loading,
    error
  };
};
