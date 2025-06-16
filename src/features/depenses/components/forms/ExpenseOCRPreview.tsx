import React, { useState } from 'react';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import { Badge } from '../../../../components/common/Badge';
import { OCRMetadata } from '../../types';
import { useExpenses } from '../../hooks/useExpenses';
import { 
  Document, 
  ArrowRight,
  Scanner
} from 'iconsax-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { logger } from '../../../../utils/logger';

// Fonctions pour déterminer les classes CSS basées sur le score de confiance
const getConfidenceColor = (score: number) => {
  if (score >= 0.7) return '#10b981'; // Vert pour haute confiance
  if (score >= 0.4) return '#f59e0b'; // Orange pour confiance moyenne
  return '#ef4444'; // Rouge pour faible confiance
};

const getConfidenceTextColor = (score: number) => {
  if (score >= 0.7) return 'text-[#10b981]';
  if (score >= 0.4) return 'text-[#f59e0b]';
  return 'text-[#ef4444]';
};

// Fonction pour déterminer la variante du badge en fonction du score
const getConfidenceBadgeVariant = (score: number): 'success' | 'warning' | 'error' => {
  if (score >= 0.7) return 'success';
  if (score >= 0.4) return 'warning';
  return 'error';
};

interface ExpenseOCRPreviewProps {
  expenseId: string;
  ocrData: OCRMetadata;
  onApply?: (data: OCRMetadata) => void;
}

const ExpenseOCRPreview: React.FC<ExpenseOCRPreviewProps> = ({
  expenseId,
  ocrData,
  onApply
}) => {
  // Utilisation du hook useExpenses avec une implémentation temporaire pour updateExpenseOCRMetadata
  const expensesHook = useExpenses();
  const { applyOCRDataToExpense, loading } = expensesHook;
  
  // Fonction temporaire pour mettre à jour les métadonnées OCR
  // Cette fonction devrait être implémentée dans le hook useExpenses
  const updateExpenseOCRMetadata = async (expenseId: string, metadata: OCRMetadata) => {
    try {
      // Simulation de mise à jour
      logger.info('Mise à jour des métadonnées OCR:', { expenseId, metadata });
      return metadata;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour des métadonnées OCR:', error);
      throw error;
    }
  };
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<OCRMetadata>(ocrData);
  
  // Vérifier si des données OCR sont disponibles
  const hasOCRData = ocrData && Object.values(ocrData).some(value => 
    value !== null && value !== undefined && value !== ''
  );
  
  // Formater le score de confiance
  const formatConfidenceScore = (score?: number) => {
    if (!score) return 'Faible';
    if (score >= 0.7) return 'Élevée';
    if (score >= 0.4) return 'Moyenne';
    return 'Faible';
  };
  
  // Gérer les changements dans les champs éditables
  const handleChange = (field: keyof OCRMetadata, value: string | number | null) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Sauvegarder les modifications
  const handleSave = async () => {
    try {
      await updateExpenseOCRMetadata(expenseId, editedData);
      setEditMode(false);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour des données OCR:', error);
    }
  };
  
  // Appliquer les données OCR à la dépense
  const handleApply = async () => {
    try {
      await applyOCRDataToExpense(expenseId);
      if (onApply) {
        onApply(editMode ? editedData : ocrData);
      }
    } catch (error) {
      logger.error('Erreur lors de l\'application des données OCR:', error);
    }
  };
  
  if (!hasOCRData) {
    return (
      <div className="bg-[#f0eeff] rounded-lg p-4 border border-[#e6e1ff]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="m-0 text-base font-semibold text-[#5b50ff] flex items-center gap-2">
            <Document size={20} variant="Bold" color="#5b50ff" />
            Données OCR
          </h4>
        </div>
        <div className="text-center p-4 text-gray-500">
          Aucune donnée OCR disponible. Téléchargez un fichier et traitez-le avec OCR pour extraire des informations.
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f0eeff] rounded-lg p-4 border border-[#e6e1ff]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="m-0 text-base font-semibold text-[#5b50ff] flex items-center gap-2">
          <Scanner size={20} variant="Bold" color="#5b50ff" />
          Données extraites par OCR
          {ocrData.confidenceScore !== undefined && (
            <Badge 
              variant={getConfidenceBadgeVariant(ocrData.confidenceScore || 0)}
              className="text-xs"
            >
              Confiance {formatConfidenceScore(ocrData.confidenceScore)}
            </Badge>
          )}
        </h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Annuler' : 'Modifier'}
        </Button>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">Fournisseur</div>
            {editMode ? (
              <Input
                value={editedData.vendorName || ''}
                onChange={e => handleChange('vendorName', e.target.value)}
                placeholder="Nom du fournisseur"
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">{ocrData.vendorName || '-'}</div>
            )}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">N° TVA</div>
            {editMode ? (
              <Input
                value={editedData.vendorVatNumber || ''}
                onChange={e => handleChange('vendorVatNumber', e.target.value)}
                placeholder="Numéro de TVA"
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">{ocrData.vendorVatNumber || '-'}</div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">N° de facture</div>
            {editMode ? (
              <Input
                value={editedData.invoiceNumber || ''}
                onChange={e => handleChange('invoiceNumber', e.target.value)}
                placeholder="Numéro de facture"
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">{ocrData.invoiceNumber || '-'}</div>
            )}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">Date de facture</div>
            {editMode ? (
              <Input
                type="date"
                value={editedData.invoiceDate ? new Date(editedData.invoiceDate).toISOString().split('T')[0] : ''}
                onChange={e => handleChange('invoiceDate', e.target.value)}
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">
                {ocrData.invoiceDate ? formatDate(ocrData.invoiceDate) : '-'}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">Montant total</div>
            {editMode ? (
              <Input
                type="number"
                value={editedData.totalAmount || ''}
                onChange={e => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">
                {ocrData.totalAmount 
                  ? formatCurrency(ocrData.totalAmount, ocrData.currency || 'EUR') 
                  : '-'
                }
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">Montant TVA</div>
            {editMode ? (
              <Input
                type="number"
                value={editedData.vatAmount || ''}
                onChange={e => handleChange('vatAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">
                {ocrData.vatAmount 
                  ? formatCurrency(ocrData.vatAmount, ocrData.currency || 'EUR') 
                  : '-'
                }
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">Devise</div>
            {editMode ? (
              <Input
                value={editedData.currency || ''}
                onChange={e => handleChange('currency', e.target.value)}
                placeholder="EUR"
              />
            ) : (
              <div className="font-medium text-gray-900 flex items-center gap-2">{ocrData.currency || '-'}</div>
            )}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm text-gray-500 mb-1">Confiance</div>
            <div className="font-medium text-gray-900 flex items-center gap-2">
              <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full" 
                  style={{
                    width: `${(ocrData.confidenceScore || 0) * 100}%`,
                    backgroundColor: getConfidenceColor(ocrData.confidenceScore || 0)
                  }}
                ></div>
              </div>
              <span className={`text-xs ml-2 ${getConfidenceTextColor(ocrData.confidenceScore || 0)}`}>
                {formatConfidenceScore(ocrData.confidenceScore)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        {editMode ? (
          <Button 
            onClick={handleSave} 
            isLoading={loading}
            className="bg-[#5b50ff] hover:bg-[#4a41e0]"
          >
            Enregistrer les modifications
          </Button>
        ) : (
          <Button 
            onClick={handleApply} 
            isLoading={loading}
            className="bg-[#5b50ff] hover:bg-[#4a41e0] flex items-center gap-2"
          >
            Appliquer à la dépense
            <ArrowRight size={16} color="#ffffff" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpenseOCRPreview;
