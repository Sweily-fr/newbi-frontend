import { logger } from '../utils/logger';
import { OCRMetadata } from '../features/depenses/types';

// Types pour la réponse de l'API Google Vision
interface VisionResponse {
  fullTextAnnotation?: {
    text: string;
  };
  // Champs correspondant à l'interface OCRMetadata de types.ts
  vendor?: string;
  amount?: number;
  date?: string;
  vatNumber?: string;
  invoiceNumber?: string;
  description?: string;
  category?: string;
  confidence?: number;
  rawData?: unknown;
  title?: string;
}

/**
 * Convertit un fichier en base64
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Supprimer le préfixe data:application/octet-stream;base64,
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extrait le texte d'une image ou d'un PDF en utilisant Google Vision API
 */
export const extractTextWithGoogleVision = async (file: File): Promise<OCRMetadata> => {
  try {
    logger.debug('Début de l\'extraction de texte avec Google Vision API');
    
    // Convertir le fichier en base64
    const base64File = await fileToBase64(file);
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    
    try {
      // Appeler l'API Google Vision via le backend
      const response = await fetch('/api/vision/annotate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          content: base64File,
          mimeType: file.type,
          features: [
            { type: 'DOCUMENT_TEXT_DETECTION' }, // Pour une meilleure détection de texte structuré
            { type: 'TEXT_DETECTION' } // Pour la détection de texte général
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de l\'extraction du texte');
      }
      
      const result = await response.json();
      
      // Convertir la réponse de Google Vision en format OCRMetadata
      return mapVisionResponseToOCRMetaData(result);
    } catch (error) {
      logger.error('Erreur lors de l\'appel à l\'API Vision:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur inconnue lors de l\'extraction du texte');
    }
  } catch (error) {
    logger.error('Erreur lors de l\'extraction de texte avec Google Vision', { error });
    throw error;
  }
};

/**
 * Convertit la réponse de Google Vision en format OCRMetadata
 */
const mapVisionResponseToOCRMetaData = (visionResponse: VisionResponse): OCRMetadata => {
  // Extraire le texte brut de la réponse
  const fullTextAnnotation = visionResponse.fullTextAnnotation;
  const rawText = fullTextAnnotation ? fullTextAnnotation.text : '';
  
  // Mapper les champs de la réponse vers le format OCRMetadata
  const metaData: OCRMetadata = {
    text: rawText || '', // Le texte brut est obligatoire
    vendor: visionResponse.vendor,
    amount: visionResponse.amount,
    date: visionResponse.date,
    vatNumber: visionResponse.vatNumber,
    invoiceNumber: visionResponse.invoiceNumber,
    description: visionResponse.description,
    category: visionResponse.category,
    confidence: visionResponse.confidence,
    rawData: visionResponse.rawData || {},
    title: visionResponse.title
  };
  
  return metaData;
};
