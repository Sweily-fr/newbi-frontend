import { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPLOAD_COMPANY_LOGO, DELETE_COMPANY_LOGO } from '../graphql';
import { Notification } from '../../../components/';

interface UseCompanyLogoProps {
  initialLogo?: string;
  onLogoChange?: (logoUrl: string) => void;
}

export const useCompanyForm = ({ initialLogo = '', onLogoChange }: UseCompanyLogoProps = {}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialLogo);

  const [uploadLogo, { loading: uploadLoading }] = useMutation(UPLOAD_COMPANY_LOGO, {
    onCompleted: (data) => {
      const newLogoUrl = data.uploadCompanyLogo.company.logo;
      setLogoUrl(newLogoUrl);
      setIsUploading(false);
      
      if (onLogoChange) {
        onLogoChange(newLogoUrl);
      }
    },
    onError: (error) => {
      setIsUploading(false);
      console.error('Erreur lors du téléchargement du logo:', error.message);
    },
  });

  const [deleteLogo, { loading: deleteLoading }] = useMutation(DELETE_COMPANY_LOGO, {
    onCompleted: (data) => {
      setLogoUrl('');
      setLogoToDelete(false);
      
      if (onLogoChange) {
        onLogoChange('');
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du logo:', error);
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.match('image.*')) {
      Notification.warning('Veuillez sélectionner une image', {
        duration: 5000,
        position: 'bottom-left'
      });
      return;
    }

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Notification.warning('L\'image ne doit pas dépasser 2MB', {
        duration: 5000,
        position: 'bottom-left'
      });
      return;
    }

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setPreviewImage(imageData);
      setBase64Image(imageData);
    };
    reader.readAsDataURL(file);
  };

  const uploadLogoToServer = async () => {
    if (!base64Image) return null;
    
    setIsUploading(true);
    try {
      const { data } = await uploadLogo({
        variables: {
          base64Image
        }
      });
      return data.uploadCompanyLogo.company.logo;
    } catch (error) {
      // L'erreur est déjà affichée par le toaster dans App.tsx
      console.error("Erreur lors de l'upload du logo:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteLogoFromServer = async () => {
    if (!logoToDelete) return false;
      try {
      await deleteLogo();
      setLogoToDelete(false); // Réinitialiser l'état après la suppression
      return true;
    } catch (error) {
      // L'erreur est déjà affichée par le toaster dans App.tsx
      console.error("Erreur lors de la suppression du logo:", error);
      return false;
    }
  };

  const resetLogoState = () => {
    setBase64Image(null);
    setPreviewImage(null);
    setLogoToDelete(false);
  };

  return {
    fileInputRef,
    previewImage,
    base64Image,
    isUploading,
    logoToDelete,
    logoUrl,
    uploadLoading,
    deleteLoading,
    setLogoToDelete,
    handleLogoUpload,
    uploadLogoToServer,
    deleteLogoFromServer,
    resetLogoState
  };
};
