import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../graphql/products';
import { Modal } from '../../feedback/Modal';
import { ConfirmationModal } from '../../feedback/ConfirmationModal';
import { Button, TextField, TextArea, Select } from '../../';
import { Product } from '../../business/products/ProductsTable';
import { Notification } from '../../feedback/Notification';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess?: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess
}) => {
  const isEditMode = !!product;
  
  // État pour la modal de confirmation d'annulation
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    unitPrice: product?.unitPrice?.toString() || '',
    vatRate: product?.vatRate?.toString() || '20', // Taux de TVA par défaut à 20%
    unit: product?.unit || 'unité',
    category: product?.category || '',
    reference: product?.reference || ''
  });

  // Gestion des erreurs
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mutations GraphQL
  const [createProduct, { loading: createLoading }] = useMutation(CREATE_PRODUCT);
  const [updateProduct, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT);

  const loading = createLoading || updateLoading;

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Valider le champ modifié
    validateField(name, value);
  };

  // Validation du formulaire
  const validateForm = () => {
    const errorObj: Record<string, string> = {};
    
    // Validation du nom selon le pattern du serveur (NAME_REGEX): lettres, espaces, tirets, apostrophes, 2-50 caractères
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/;
    if (!formData.name) {
      errorObj.name = 'Le nom du produit est requis';
    } else if (!nameRegex.test(formData.name)) {
      errorObj.name = 'Veuillez fournir un nom valide (2 à 50 caractères, lettres, espaces, tirets et apostrophes uniquement)';
    }
    
    // Validation du prix unitaire
    const unitPrice = parseFloat(formData.unitPrice);
    if (!formData.unitPrice) {
      errorObj.unitPrice = 'Le prix unitaire est requis';
    } else if (isNaN(unitPrice) || unitPrice < 0) {
      errorObj.unitPrice = 'Le prix unitaire doit être un nombre positif ou nul';
    }
    
    // Validation du taux de TVA
    const vatRate = parseFloat(formData.vatRate);
    if (!formData.vatRate) {
      errorObj.vatRate = 'Le taux de TVA est requis';
    } else if (isNaN(vatRate) || vatRate < 0 || vatRate > 100) {
      errorObj.vatRate = 'Le taux de TVA doit être un pourcentage entre 0 et 100';
    }
    
    // Validation de l'unité
    if (!formData.unit) {
      errorObj.unit = 'L\'unité est requise';
    }
    
    // Validation spécifique pour la description (optionnelle)
    if (formData.description && formData.description.length > 1000) {
      errorObj.description = 'La description ne doit pas dépasser 1000 caractères';
    }
    
    // Validation de la catégorie (optionnelle)
    if (formData.category && formData.category.length > 50) {
      errorObj.category = 'La catégorie ne doit pas dépasser 50 caractères';
    }
    
    setErrors(errorObj);
    return Object.keys(errorObj).length === 0;
  };
  
  // Valider un champ spécifique lors de la modification
  const validateField = (name: string, value: string) => {
    let fieldError = '';
    
    // Regex pour la validation du nom (identique à celle du serveur)
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/;
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          fieldError = 'Le nom du produit est requis';
        } else if (!nameRegex.test(value.trim())) {
          fieldError = 'Veuillez fournir un nom valide (2 à 50 caractères, lettres, espaces, tirets et apostrophes uniquement)';
        }
        break;
        
      case 'unitPrice':
        if (!value.trim()) {
          fieldError = 'Le prix unitaire est requis';
        } else if (isNaN(parseFloat(value))) {
          fieldError = 'Le prix doit être un nombre valide';
        } else if (parseFloat(value) < 0) {
          fieldError = 'Le prix ne peut pas être négatif';
        } else if (parseFloat(value) > 1000000) {
          fieldError = 'Le prix ne peut pas dépasser 1 000 000 €';
        }
        break;
        
      case 'vatRate':
        if (!value.trim()) {
          fieldError = 'Le taux de TVA est requis';
        } else if (isNaN(parseFloat(value))) {
          fieldError = 'Le taux de TVA doit être un nombre valide';
        } else if (parseFloat(value) < 0) {
          fieldError = 'Le taux de TVA ne peut pas être négatif';
        } else if (parseFloat(value) > 100) {
          fieldError = 'Le taux de TVA ne peut pas dépasser 100%';
        }
        break;
        
      case 'unit':
        if (!value.trim()) {
          fieldError = 'L\'unité est requise';
        }
        break;
        
      case 'category':
        if (value && value.trim().length > 50) {
          fieldError = 'La catégorie ne peut pas dépasser 50 caractères';
        }
        break;
        
      case 'reference':
        if (value && value.trim().length > 30) {
          fieldError = 'La référence ne peut pas dépasser 30 caractères';
        }
        break;
    }
    
    // Mettre à jour les erreurs
    setErrors(prev => {
      const newErrors = { ...prev };
      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
    
    return !fieldError;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Créer l'objet avec les champs obligatoires
      const productInput: {
        name: string;
        unitPrice: number;
        vatRate: number;
        unit: string;
        description?: string;
        category?: string;
        reference?: string;
      } = {
        name: formData.name,
        unitPrice: parseFloat(formData.unitPrice),
        vatRate: parseFloat(formData.vatRate),
        unit: formData.unit,
      };
      
      // Traitement différent des champs optionnels selon le mode (création ou édition)
      if (isEditMode && product) {
        // En mode édition, on inclut toujours les champs optionnels, même vides
        // pour permettre d'effacer une valeur existante
        productInput.description = formData.description;
        productInput.category = formData.category || '';
        productInput.reference = formData.reference || '';
      } else {
        // En mode création, on n'ajoute les champs optionnels que s'ils ont une valeur
        if (formData.description && formData.description.trim() !== '') {
          productInput.description = formData.description;
        }
        
        if (formData.category && formData.category.trim() !== '') {
          productInput.category = formData.category;
        }
        
        if (formData.reference && formData.reference.trim() !== '') {
          productInput.reference = formData.reference;
        }
      }
      
      if (isEditMode && product) {
        await updateProduct({
          variables: {
            id: product.id,
            input: productInput
          }
        });
        
        // Afficher une notification de succès en bas à gauche
        Notification.success(`Produit ${formData.name} modifié avec succès`, {
          position: 'bottom-left',
          duration: 3000
        });
      } else {
        await createProduct({
          variables: {
            input: productInput
          }
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la sauvegarde du produit' });
    }
  };

  return (
    <>
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}
      maxWidth="2xl"
      footer={
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsCancelConfirmationOpen(true)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            form="productForm"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : isEditMode ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      }
    >
      <div className="bg-white pb-4">
        <div className="sm:flex sm:items-start">
          <div className="text-center sm:text-left w-full">
              <form id="productForm" onSubmit={handleSubmit} className="px-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                  {/* Nom du produit */}
                  <TextField
                    id="name"
                    name="name"
                    label="Nom du produit"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    className="mb-0"
                    helpText={errors.name ? undefined : "Nom du produit ou service"}
                  />
                  
                  {/* Référence */}
                  <TextField
                    id="reference"
                    name="reference"
                    label="Référence"
                    value={formData.reference}
                    onChange={handleChange}
                    error={errors.reference}
                    className="mb-0"
                    helpText={errors.reference ? undefined : "Référence interne (optionnel)"}
                  />
                </div>
                
                {/* Prix unitaire et TVA sur une ligne */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                  <div>
                    <TextField
                      id="unitPrice"
                      name="unitPrice"
                      label="Prix unitaire (HT)"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      error={errors.unitPrice}
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="mb-0"
                      inputClassName="pl-7"
                      prefix="€"
                      helpText={errors.unitPrice ? undefined : "Prix HT (décimal accepté)"}
                    />
                  </div>
                  
                  <div>
                    <Select
                      id="vatRate"
                      name="vatRate"
                      label="Taux de TVA (%)"
                      value={formData.vatRate}
                      onChange={handleChange}
                      error={errors.vatRate}
                      required
                      options={[
                        { value: "0", label: "0%" },
                        { value: "5.5", label: "5.5%" },
                        { value: "10", label: "10%" },
                        { value: "20", label: "20%" }
                      ]}
                      className="mb-0"
                      helpText={errors.vatRate ? undefined : "TVA applicable"}
                    />
                  </div>
                </div>
                
                {/* Unité et Catégorie sur une ligne */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                  <div>
                    <Select
                      id="unit"
                      name="unit"
                      label="Unité"
                      value={formData.unit}
                      onChange={handleChange}
                      error={errors.unit}
                      required
                      options={[
                        { value: 'unité', label: 'unité' },
                        { value: 'heure', label: 'heure' },
                        { value: 'jour', label: 'jour' },
                        { value: 'mois', label: 'mois' },
                        { value: 'g', label: 'g - gramme' },
                        { value: 'kg', label: 'kg - kilogramme' },
                        { value: 'l', label: 'l - litre' },
                        { value: 'm', label: 'm - mètre' },
                        { value: 'm²', label: 'm² - mètre carré' },
                        { value: 'm³', label: 'm³ - mètre cube' },
                        { value: 'ampère', label: 'ampère' },
                        { value: 'article', label: 'article' },
                        { value: 'cm', label: 'cm - centimètre' },
                        { value: 'm³/h', label: 'm³/h - mètre cube par heure' },
                        { value: 'gigajoule', label: 'gigajoule' },
                        { value: 'gigawatt', label: 'gigawatt' },
                        { value: 'gigawattheure', label: 'gigawattheure' },
                        { value: 'semestre', label: 'semestre' },
                        { value: 'joule', label: 'joule' },
                        { value: 'kilojoule', label: 'kilojoule' },
                        { value: 'kilovar', label: 'kilovar' },
                        { value: 'kilowatt', label: 'kilowatt' },
                        { value: 'kilowattheure', label: 'kilowattheure' },
                        { value: 'mégajoule', label: 'mégajoule' },
                        { value: 'mégawatt', label: 'mégawatt' },
                        { value: 'mégawattheure', label: 'mégawattheure' },
                        { value: 'mg', label: 'mg - milligramme' },
                        { value: 'ml', label: 'ml - millilitre' },
                        { value: 'mm', label: 'mm - millimètre' },
                        { value: 'minute', label: 'minute' },
                        { value: 'paire', label: 'paire' },
                        { value: 'trimestre', label: 'trimestre' },
                        { value: 'seconde', label: 'seconde' },
                        { value: 'ensemble', label: 'ensemble' },
                        { value: 't', label: 't - tonne' },
                        { value: 'deux semaines', label: 'deux semaines' },
                        { value: 'wattheure', label: 'wattheure' },
                        { value: 'semaine', label: 'semaine' },
                        { value: 'année', label: 'année' }
                      ]}
                      className="mb-0"
                      helpText={errors.unit ? undefined : "Unité de mesure"}
                    />
                  </div>
                  
                  <div>
                    <TextField
                      id="category"
                      name="category"
                      label="Catégorie"
                      value={formData.category}
                      onChange={handleChange}
                      error={errors.category}
                      className="mb-0"
                      helpText={errors.category ? undefined : "Catégorie (optionnel)"}
                    />
                  </div>
                </div>
                
                {/* Description */}
                <TextArea
                  id="description"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="mb-6"
                  helpText="Description détaillée du produit ou service (optionnel)"
                />
                

              </form>
          </div>
        </div>
      </div>
    </Modal>
    
    {/* Modal de confirmation d'annulation */}
    <ConfirmationModal
      isOpen={isCancelConfirmationOpen}
      onClose={() => setIsCancelConfirmationOpen(false)}
      onConfirm={() => {
        setIsCancelConfirmationOpen(false);
        onClose();
      }}
      title="Confirmation d'annulation"
      message="Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues."
      confirmButtonText="Oui, annuler"
      cancelButtonText="Non, continuer"
      confirmButtonVariant="danger"
    />
    </>
  );
};
