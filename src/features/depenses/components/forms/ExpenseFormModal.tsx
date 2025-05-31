import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import Select from '../../../../components/common/Select';
import TextArea from '../../../../components/common/TextArea';
import Checkbox from '../../../../components/common/Checkbox';
import { 
  Expense, 
  CreateExpenseInput, 
  UpdateExpenseInput, 
  ExpenseCategory, 
  ExpenseStatus, 
  ExpensePaymentMethod,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS,
  EXPENSE_PAYMENT_METHOD_LABELS
} from '../../types';
import { useExpenses } from '../../hooks/useExpenses';
import { ExpenseFileUpload } from '../index';
import { ExpenseOCRPreview } from '../index';
import { 
  Receipt2, 
  Calendar, 
  Category, 
  Bank, 
  Tag, 
  DocumentText, 
  Money, 
  CloseCircle, 
  TickCircle
} from 'iconsax-react';
// import { formatCurrency } from '../../../../utils/formatters';

// Styles définis avec Tailwind CSS directement dans les composants

// Styles définis avec Tailwind CSS directement dans les composants

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  onSuccess?: () => void;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSuccess
}) => {
  const { createExpense, updateExpense } = useExpenses();
  
  const [formData, setFormData] = useState<CreateExpenseInput | UpdateExpenseInput>({
    title: '',
    description: '',
    amount: 0,
    currency: 'EUR',
    category: ExpenseCategory.OTHER,
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    vendorVatNumber: '',
    invoiceNumber: '',
    vatAmount: 0,
    vatRate: 0,
    isVatDeductible: true,
    status: ExpenseStatus.DRAFT,
    paymentMethod: ExpensePaymentMethod.BANK_TRANSFER,
    notes: '',
    tags: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showOCRPreview, setShowOCRPreview] = useState(false);
  
  // Initialiser le formulaire avec les données de la dépense existante
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        description: expense.description || '',
        amount: expense.amount,
        currency: expense.currency,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        vendor: expense.vendor || '',
        vendorVatNumber: expense.vendorVatNumber || '',
        invoiceNumber: expense.invoiceNumber || '',
        vatAmount: expense.vatAmount || 0,
        vatRate: expense.vatRate || 0,
        isVatDeductible: expense.isVatDeductible,
        status: expense.status,
        paymentMethod: expense.paymentMethod,
        paymentDate: expense.paymentDate ? new Date(expense.paymentDate).toISOString().split('T')[0] : undefined,
        notes: expense.notes || '',
        tags: expense.tags || []
      });
      
      if (expense.ocrMetadata) {
        setShowOCRPreview(true);
      }
    }
  }, [expense]);
  
  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (formData.amount === undefined || formData.amount === null) {
      newErrors.amount = 'Le montant est requis';
    } else if (formData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
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
        await updateExpense(expense.id, formData as UpdateExpenseInput);
      } else {
        await createExpense(formData as CreateExpenseInput);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue lors de l\'enregistrement'
      }));
    } finally {
      setLoading(false);
    }
  };
  
  interface OCRData {
    title?: string;
    amount?: number;
    date?: string;
    vendor?: string;
    vendorVatNumber?: string;
    invoiceNumber?: string;
    vatAmount?: number;
    vatRate?: number;
    [key: string]: any; // Pour les autres propriétés possibles
  }

  const handleApplyOCRData = (ocrData: OCRData) => {
    if (!ocrData) return;
    
    const updatedData = { ...formData };
    
    Object.entries(ocrData).forEach(([key, value]) => {
      if (key in updatedData && value !== undefined && value !== null) {
        updatedData[key as keyof typeof updatedData] = value;
      }
    });
    
    setFormData(updatedData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={expense ? 'Modifier la dépense' : 'Nouvelle dépense'}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Receipt2 size={16} variant="Bold" color="#5b50ff" />
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
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Money size={16} variant="Bold" color="#5b50ff" />
              </div>
              Montant*
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={e => handleChange('amount', parseFloat(e.target.value))}
              error={errors.amount}
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
              onChange={e => handleChange('date', e.target.value)}
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
              onChange={e => handleChange('vendor', e.target.value)}
            />
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="font-medium mb-2 text-gray-700">N° TVA</label>
            <Input
              id="vendorVatNumber"
              name="vendorVatNumber"
              placeholder="Numéro de TVA du fournisseur"
              value={formData.vendorVatNumber}
              onChange={e => handleChange('vendorVatNumber', e.target.value)}
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
              onChange={e => handleChange('invoiceNumber', e.target.value)}
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
              onChange={e => handleChange('vatAmount', parseFloat(e.target.value))}
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
              onChange={e => handleChange('vatRate', parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <Checkbox
              id="isVatDeductible"
              name="isVatDeductible"
              checked={formData.isVatDeductible}
              onChange={e => handleChange('isVatDeductible', e.target.checked)}
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
              onChange={value => handleChange('status', value)}
              options={Object.entries(EXPENSE_STATUS_LABELS).map(([value, label]) => ({
                value,
                label
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
              onChange={value => handleChange('paymentMethod', value)}
              options={Object.entries(EXPENSE_PAYMENT_METHOD_LABELS).map(([value, label]) => ({
                value,
                label
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
              onChange={e => handleChange('paymentDate', e.target.value)}
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
              onChange={e => handleChange('description', e.target.value)}
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
              onChange={e => handleChange('notes', e.target.value)}
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
        
        <hr className="border-none h-px bg-gray-200 my-4" />
        <h3 className="text-[#5b50ff] text-base font-semibold mb-4">Fichiers et OCR</h3>
        
        {expense && (
          <ExpenseFileUpload
            expenseId={expense.id}
            files={expense.files}
            onOCRComplete={() => setShowOCRPreview(true)}
          />
        )}
        
        {expense && showOCRPreview && expense.ocrMetadata && (
          <ExpenseOCRPreview
            expenseId={expense.id}
            ocrData={expense.ocrMetadata}
            onApply={handleApplyOCRData}
          />
        )}
        
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
