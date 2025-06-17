import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { Expense, OCRMetadata } from '../../types';

// Extension du type OCRMetadata pour inclure les propriétés utilisées dans le composant
interface ExtendedOCRMetadata extends OCRMetadata {
  vendorName?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
  vatAmount?: number;
  currency?: string;
  confidenceScore?: number;
}
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import Select from '../../../../components/common/Select';
import TextArea from '../../../../components/common/TextArea';
import Checkbox from '../../../../components/common/Checkbox';
import { DocumentText, Calendar, Category, InfoCircle, Bank, Tag, TickCircle, CloseCircle, Receipt2, ArrowUp } from 'iconsax-react';
import { logger } from '../../../../utils/logger';
import { Badge } from '../../../../components/common/Badge';

// Définition du type ExpenseStatus si non importé
enum ExpenseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Type pour les données OCR - extension de OCRMetadata
type OCRData = ExtendedOCRMetadata;

// Types locaux pour le formulaire
enum LocalExpenseCategory {
  MEAL = 'MEAL',
  TRAVEL = 'TRAVEL',
  OFFICE = 'OFFICE',
  EQUIPMENT = 'EQUIPMENT',
  SOFTWARE = 'SOFTWARE',
  OTHER = 'OTHER'
}

enum LocalExpenseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REIMBURSED = 'REIMBURSED',
  REJECTED = 'REJECTED'
}

enum LocalExpensePaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  OTHER = 'OTHER'
}

// Mappage des labels pour l'affichage
const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  [LocalExpenseCategory.MEAL]: 'Repas',
  [LocalExpenseCategory.TRAVEL]: 'Voyage',
  [LocalExpenseCategory.OFFICE]: 'Bureau',
  [LocalExpenseCategory.EQUIPMENT]: 'Équipement',
  [LocalExpenseCategory.SOFTWARE]: 'Logiciel',
  [LocalExpenseCategory.OTHER]: 'Autre'
};

const EXPENSE_STATUS_LABELS: Record<string, string> = {
  [LocalExpenseStatus.DRAFT]: 'Brouillon',
  [LocalExpenseStatus.SUBMITTED]: 'Soumis',
  [LocalExpenseStatus.APPROVED]: 'Approuvé',
  [LocalExpenseStatus.REIMBURSED]: 'Remboursé',
  [LocalExpenseStatus.REJECTED]: 'Rejeté'
};

const EXPENSE_PAYMENT_METHOD_LABELS: Record<string, string> = {
  [LocalExpensePaymentMethod.CASH]: 'Espèces',
  [LocalExpensePaymentMethod.CREDIT_CARD]: 'Carte bancaire',
  [LocalExpensePaymentMethod.BANK_TRANSFER]: 'Virement',
  [LocalExpensePaymentMethod.PAYPAL]: 'PayPal',
  [LocalExpensePaymentMethod.OTHER]: 'Autre'
};

// Définition du type pour les fichiers d'une dépense
interface ExpenseFile {
  id: string;
  url: string;
  name: string;
  type: string;
}



// Types pour le formulaire
interface ExpenseFormData {
  id?: string;
  title?: string;
  vendor: string;
  vendorVatNumber: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  description: string;
  categoryId: string;
  accountId: string;
  vatAmount: number;
  vatRate: number;
  isVatDeductible: boolean;
  paymentMethod: string;
  paymentDate: string;
  tags: string[];
  files: ExpenseFile[];
  currency?: string;
  status?: ExpenseStatus;
  category?: string;
  notes?: string;
}

// Type pour les données de formulaire

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  onSuccess?: () => void;
  initialOcrData?: OCRData;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSuccess,
  initialOcrData
}) => {
  const { createExpense, updateExpense } = useExpenses();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // État pour suivre le traitement du fichier
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrData, setOcrData] = useState<ExtendedOCRMetadata | null>(null);

  const initialFormData: ExpenseFormData = {
    vendor: '',
    vendorVatNumber: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: '',
    categoryId: '',
    accountId: '',
    vatAmount: 0,
    vatRate: 0,
    isVatDeductible: true,
    paymentMethod: LocalExpensePaymentMethod.CREDIT_CARD,
    paymentDate: new Date().toISOString().split('T')[0],
    tags: [],
    files: [],
    status: ExpenseStatus.DRAFT
  };

  // États du formulaire
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  
  // Fonctions pour gérer l'importation de factures
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      setErrors(prev => ({ ...prev, ocr: 'Format de fichier non supporté. Veuillez utiliser une image (JPG, PNG) ou un PDF.' }));
      return;
    }

    setSelectedFile(file);
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsFileProcessing(true);
    setIsProcessing(true);
    setErrors(prev => ({ ...prev, ocr: '' }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/expenses/process-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du traitement du fichier');
      }

      const result = await response.json();
      const extractedData = result.data as OCRData;
      setOcrData(extractedData);
      
      // Les données OCR seront appliquées automatiquement via l'effet useEffect
      logger.info('Données OCR extraites avec succès:', extractedData);
    } catch (error) {
      logger.error('Erreur lors du traitement OCR:', error);
      setErrors(prev => ({ ...prev, ocr: 'Erreur lors du traitement du fichier. Veuillez réessayer.' }));
    } finally {
      setIsFileProcessing(false);
      setIsProcessing(false);
      // Réinitialiser l'input pour permettre la sélection du même fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setOcrData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fonction pour mapper les données de l'API au format du formulaire
  const mapExpenseToFormData = useCallback((expenseData: Partial<Expense>): ExpenseFormData => {
    const mappedData: ExpenseFormData = {
      id: expenseData.id,
      vendor: expenseData.vendor || '',
      vendorVatNumber: expenseData.vendorVatNumber || '',
      invoiceNumber: expenseData.invoiceNumber || '',
      date: expenseData.date ? new Date(expenseData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      amount: expenseData.amount || 0,
      description: expenseData.description || '',
      categoryId: expenseData.categoryId || '',
      accountId: expenseData.accountId || '',
      vatAmount: expenseData.vatAmount || 0,
      vatRate: expenseData.vatRate || 20,
      isVatDeductible: expenseData.isVatDeductible !== false,
      paymentMethod: expenseData.paymentMethod || 'CASH',
      paymentDate: expenseData.paymentDate 
        ? new Date(expenseData.paymentDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      tags: [],
      files: []
    };

    if (Array.isArray((expenseData as { files?: ExpenseFile[] }).files)) {
      mappedData.files = (expenseData as { files?: ExpenseFile[] }).files?.map(f => ({
        id: f.id || '',
        url: f.url || '',
        name: f.name || '',
        type: f.type || 'application/octet-stream'
      })) as ExpenseFile[];
    } else {
      mappedData.files = [];
    }

    if (Array.isArray((expenseData as { tags?: string[] }).tags)) {
      mappedData.tags = [...(expenseData as { tags?: string[] }).tags || []];
    }

    return mappedData;
  }, []);

  // Initialiser le formulaire avec les données de la dépense existante
  useEffect(() => {
    if (expense) {
      const formData = mapExpenseToFormData(expense);
      setFormData(formData);
    } else if (initialOcrData) {
      setOcrData(initialOcrData);
    }
  }, [expense, initialOcrData, mapExpenseToFormData]);

  // Appliquer les données OCR au formulaire
  const handleApplyOCRData = useCallback((data: ExtendedOCRMetadata) => {
    const totalAmount = data.totalAmount !== undefined && !isNaN(data.totalAmount) 
      ? data.totalAmount 
      : 0;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        vendor: prev.vendor || data.vendorName || '',
        vendorVatNumber: prev.vendorVatNumber || data.vendorVatNumber || '',
        invoiceNumber: prev.invoiceNumber || data.invoiceNumber || '',
        date: prev.date || data.invoiceDate || new Date().toISOString().split('T')[0],
        amount: totalAmount,
        vatAmount: data.vatAmount !== undefined ? data.vatAmount : prev.vatAmount,
        currency: data.currency || prev.currency || 'EUR', 
      };
      
      return updatedData;
    });
  }, []);

  // Appliquer les données OCR au chargement si disponible
  useEffect(() => {
    if (ocrData) {
      handleApplyOCRData(ocrData);
    }
  }, [ocrData, handleApplyOCRData]);

  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.vendor) {
      newErrors.vendor = 'Le fournisseur est requis';
    }
    
    if (!formData.invoiceNumber) {
      newErrors.invoiceNumber = 'Le numéro de facture est requis';
    }
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }
    
    if (formData.amount === undefined || formData.amount === null) {
      newErrors.amount = 'Le montant est requis';
    } else if (formData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (expense) {
        await updateExpense(expense.id, formData);
      } else {
        await createExpense({
          ...formData,
          userId: 'current'
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      logger.error('Erreur lors de la soumission du formulaire:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue lors de l\'enregistrement'
      }));
    } finally {
      setLoading(false);
    }
  };



  // Section pour l'import OCR et l'aperçu
  const renderOCRSection = () => {
    return (
      <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-[#5b50ff] text-base font-semibold mb-4 flex items-center gap-2">
          <Receipt2 size={20} variant="Bold" color="#5b50ff" />
          Importer une facture
        </h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            Importez une facture ou un reçu pour extraire automatiquement les informations grâce à notre technologie OCR.
          </p>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
              disabled={isProcessing}
            />
            <Button
              type="button"
              variant="outline"
              className="border-[#5b50ff] text-[#5b50ff] hover:bg-[#f0eeff] relative overflow-hidden w-full md:w-auto"
              onClick={handleButtonClick}
              disabled={isFileProcessing}
            >
              {isFileProcessing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#5b50ff] border-t-transparent rounded-full"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  {selectedFile ? selectedFile.name : 'Sélectionner une facture'}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      aria-label="Supprimer le fichier"
                    >
                      <CloseCircle className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </Button>
          </div>
          {errors.ocr && (
            <p className="text-red-500 text-sm mt-2">{errors.ocr}</p>
          )}
        </div>
        {ocrData && (
          <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Données extraites</h4>
              {ocrData.confidenceScore !== undefined && (
                <Badge
                  variant={(ocrData.confidenceScore || 0) >= 0.7 ? 'success' : (ocrData.confidenceScore || 0) >= 0.4 ? 'warning' : 'error'}
                  className="text-xs"
                >
                  Confiance: {Math.round((ocrData.confidenceScore || 0) * 100)}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {ocrData.vendorName && (
                <div>
                  <p className="text-xs text-gray-500">Fournisseur</p>
                  <p className="font-medium">{ocrData.vendorName}</p>
                </div>
              )}
              {ocrData.totalAmount !== undefined && (
                <div>
                  <p className="text-xs text-gray-500">Montant</p>
                  <p className="font-medium">
                    {ocrData.totalAmount.toFixed(2)} {ocrData.currency || '€'}
                  </p>
                </div>
              )}
              {ocrData.invoiceDate && (
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(ocrData.invoiceDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {ocrData.invoiceNumber && (
                <div>
                  <p className="text-xs text-gray-500">N° de facture</p>
                  <p className="font-medium">{ocrData.invoiceNumber}</p>
                </div>
              )}
              {ocrData.vatAmount !== undefined && (
                <div>
                  <p className="text-xs text-gray-500">TVA</p>
                  <p className="font-medium">
                    {ocrData.vatAmount.toFixed(2)} {ocrData.currency || '€'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? 'Modifier la dépense' : 'Créer une dépense'}
      size="lg"
    >
      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Section d'importation OCR - uniquement pour la création, pas pour l'édition */}
        {!expense && renderOCRSection()}
        
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <DocumentText size={16} variant="Bold" color="#5b50ff" />
              </div>
              Titre*
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Titre de la dépense"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              error={errors.title}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="mb-4">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)]">
                <InfoCircle size={16} variant="Bold" color="#5b50ff" />
              </div>
              Montant TTC*
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Montant TTC"
              value={formData.amount || 0}
              onChange={e => handleChange('amount', parseFloat(e.target.value))}
              error={errors.amount}
              min={0}
              step={0.01}
            />
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Devise</label>
            <Select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={value => handleChange('currency', value)}
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'USD', label: 'USD' },
                { value: 'GBP', label: 'GBP' }
              ]}
            />
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Category size={16} variant="Bold" color="#5b50ff" />
              </div>
              Catégorie
            </label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={value => handleChange('category', value)}
              options={Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
                value,
                label
              }))}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Calendar size={16} variant="Bold" color="#5b50ff" />
              </div>
              Date*
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('date', e.target.value)}
              error={errors.date}
            />
          </div>
        </div>

        <hr className="border-none h-px bg-gray-200 my-4" />
        <h3 className="text-[#5b50ff] text-base font-semibold mb-4">Informations du fournisseur</h3>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Fournisseur</label>
            <Input
              id="vendor"
              name="vendor"
              placeholder="Nom du fournisseur"
              value={formData.vendor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vendor', e.target.value)}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">N° TVA</label>
            <Input
              id="vendorVatNumber"
              name="vendorVatNumber"
              placeholder="Numéro de TVA du fournisseur"
              value={formData.vendorVatNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vendorVatNumber', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">N° de facture</label>
            <Input
              id="invoiceNumber"
              name="invoiceNumber"
              placeholder="Numéro de facture"
              value={formData.invoiceNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('invoiceNumber', e.target.value)}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Montant TVA</label>
            <Input
              id="vatAmount"
              name="vatAmount"
              type="number"
              placeholder="0.00"
              value={formData.vatAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vatAmount', parseFloat(e.target.value))}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Taux TVA (%)</label>
            <Input
              id="vatRate"
              name="vatRate"
              type="number"
              placeholder="20"
              value={formData.vatRate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vatRate', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <Checkbox
              id="isVatDeductible"
              name="isVatDeductible"
              checked={formData.isVatDeductible}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('isVatDeductible', e.target.checked)}
              label="TVA déductible"
            />
          </div>
        </div>

        <hr className="border-none h-px bg-gray-200 my-4" />
        <h3 className="text-[#5b50ff] text-base font-semibold mb-4">Statut et paiement</h3>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                {formData.status === ExpenseStatus.APPROVED ? (
                  <TickCircle size={16} variant="Bold" color="#4CAF50" />
                ) : formData.status === ExpenseStatus.REJECTED ? (
                  <CloseCircle size={16} variant="Bold" color="#F44336" />
                ) : (
                  <DocumentText size={16} variant="Bold" color="#5b50ff" />
                )}
              </div>
              Statut
            </label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={(value: string) => handleChange('status', value)}
              options={Object.entries(EXPENSE_STATUS_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Bank size={16} variant="Bold" color="#5b50ff" />
              </div>
              Méthode de paiement
            </label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={(value: string) => handleChange('paymentMethod', value)}
              options={Object.entries(EXPENSE_PAYMENT_METHOD_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Date de paiement</label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('paymentDate', e.target.value)}
              disabled={formData.status !== ExpenseStatus.PAID}
              placeholder="Sélectionner une date"
            />
          </div>
        </div>

        <hr className="border-none h-px bg-gray-200 my-4" />
        <h3 className="text-[#5b50ff] text-base font-semibold mb-4">Informations complémentaires</h3>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Description</label>
            <TextArea
              id="description"
              name="description"
              placeholder="Description détaillée de la dépense"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">Notes</label>
            <TextArea
              id="notes"
              name="notes"
              placeholder="Notes internes"
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('notes', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Tag size={16} variant="Bold" color="#5b50ff" />
              </div>
              Tags
            </label>
            {/* Remplacer TagInput par une solution compatible avec Tailwind */}
            <Input
              id="tags"
              name="tags"
              placeholder="Ajouter un tag (séparés par des virgules)"
              value={formData.tags?.join(', ') || ''}
              onChange={e => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            />
          </div>
        </div>
        
        {errors.submit && <p className="text-red-500 text-sm mt-1">{errors.submit}</p>}
        
        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} isLoading={loading}>
            {expense ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpenseFormModal;
