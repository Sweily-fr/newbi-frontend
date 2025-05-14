import React, { useState, useEffect } from 'react';
import { Item } from '../../../types/invoice';
import { TextField, Select, Button, TextArea } from '../../../../../components/';
import { validateInvoiceItem } from '../../../../../constants/formValidations';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../../products/graphql';

// Liste des mentions de TVA disponibles
const VAT_EXEMPTION_OPTIONS = [
  { value: 'Article 259-1 du CGI', label: 'Article 259-1 du CGI', text: 'TVA non applicable, article 259-1 du CGI - Exportation de biens et services' },
  { value: 'Article 259 B du CGI', label: 'Article 259 B du CGI', text: 'TVA non applicable, article 259 B du CGI – Services à un client non assujetti hors UE.' },
  { value: 'Article 261 du CGI', label: 'Article 261 du CGI', text: 'TVA non applicable, article 261 du CGI - Opérations bancaires et financières' },
  { value: 'Article 261 D du CGI', label: 'Article 261 D du CGI', text: 'TVA non applicable, article 261 D du CGI - Location de terres et de bâtiments agricoles.' },
  { value: 'Article 261 D-4° du CGI', label: 'Article 261 D-4° du CGI', text: 'TVA non applicable, article 261 D-4°du CGI - Location à usage d\'habitation' },
  { value: 'Article 261 2-4° du CGI', label: 'Article 261 2-4° du CGI', text: 'TVA non applicable, article 261, 2-4° du CGI - Activités de pêche' },
  { value: 'Article 261-4 du CGI', label: 'Article 261-4 du CGI', text: 'TVA non applicable, article 261-4 du CGI - Activités médicales et paramédicales' },
  { value: 'Article 261 4-4° du CGI', label: 'Article 261 4-4° du CGI', text: 'TVA non applicable, article 261 4-4° du CGI - Enseignement et formation professionnelle' },
  { value: 'Article 262 du CGI', label: 'Article 262 du CGI', text: 'Exonération de TVA article 262 du CGI' },
  { value: 'Article 262 ter-I du CGI', label: 'Article 262 ter-I du CGI', text: 'Exonération de TVA article 262 ter-I du CGI - Vente intracommunautaire de biens' },
  { value: 'Article 275 du CGI', label: 'Article 275 du CGI', text: 'Exonération de TVA article 275 du CGI - Marchandises destinées à l\'exportation' },
  { value: 'Article 283 du CGI', label: 'Article 283 du CGI', text: 'Autoliquidation de la TVA – article 283 du CGI : la taxe est due par le preneur.' },
  { value: 'Article 283-2 du CGI', label: 'Article 283-2 du CGI', text: 'Autoliquidation de la TVA – article 283-2 du CGI' },
  { value: 'Article 293 B du CGI', label: 'Article 293 B du CGI', text: 'TVA non applicable, article 293 B du CGI - Micro-entrepreneur ou association à but lucratif' },
  { value: 'Article 298 sexies du CGI', label: 'Article 298 sexies du CGI', text: 'Exonération de TVA – Livraison intracommunautaire d\'un nouveau moyen de transport, article 298 sexies du CGI.' },
  { value: 'Article 44 de la Directive 2006/112/CE', label: 'Article 44 de la Directive 2006/112/CE', text: 'TVA non applicable, services intracommunautaires, article 44 de la Directive 2006/112/CE. Le preneur est redevable de la taxe.' },
];

interface InvoiceItemsProps {
  items: Item[];
  handleItemChange: (index: number, field: string, value: any) => void;
  handleRemoveItem: (index: number) => void;
  handleAddItem: () => void;
  // Nouvelle prop pour mettre à jour un item avec un produit complet
  handleProductSelect?: (index: number, product: {
    id: string;
    name: string;
    description?: string;
    unitPrice?: number;
    vatRate?: number;
    unit?: string;
  }) => void;
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  items,
  handleItemChange,
  handleRemoveItem,
  handleAddItem,
  handleProductSelect,
}) => {
  // État pour stocker les erreurs de validation
  const [itemErrors, setItemErrors] = useState<Array<{
    descriptionError?: string;
    quantityError?: string;
    unitPriceError?: string;
    vatRateError?: string;
    unitError?: string;
    discountError?: string;
    vatExemptionTextError?: string;
  }>>([]);
  
  // État pour suivre l'index de l'élément en cours de modification
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  
  // État pour afficher/masquer le champ de taux de TVA personnalisé
  const [showCustomVatRate, setShowCustomVatRate] = useState<Record<number, boolean>>({});

  // États pour la recherche de produits
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    description?: string;
    unitPrice?: number;
    vatRate?: number;
    unit?: string;
  }>>([]);

  // Initialiser le tableau d'erreurs avec la taille du tableau d'items
  useEffect(() => {
    setItemErrors(Array(items.length).fill({}));
  }, []);

  // Mettre à jour le tableau d'erreurs lorsque le nombre d'items change
  useEffect(() => {
    if (itemErrors.length !== items.length) {
      setItemErrors(prev => {
        if (prev.length < items.length) {
          // Ajouter des objets vides pour les nouveaux items
          return [...prev, ...Array(items.length - prev.length).fill({})];
        } else {
          // Supprimer les erreurs pour les items supprimés
          return prev.slice(0, items.length);
        }
      });
    }
  }, [items.length, itemErrors.length]);
  
  // Effet pour valider les items après leur mise à jour
  useEffect(() => {
    // Pour chaque item, valider les champs et mettre à jour les erreurs
    const validateAllItems = () => {
      const newErrors = items.map(item => {
        // Valider l'item
        const result = validateInvoiceItem(
          item.description,
          item.quantity,
          item.unitPrice,
          item.vatRate,
          item.unit,
          item.discount,
          item.discountType as 'PERCENTAGE' | 'FIXED',
          item.vatExemptionText, // Ajouter la validation du texte d'exemption de TVA
        );
        
        return {
          descriptionError: result.descriptionError,
          quantityError: result.quantityError,
          unitPriceError: result.unitPriceError,
          vatRateError: result.vatRateError,
          unitError: result.unitError,
          discountError: result.discountError,
          vatExemptionTextError: result.vatExemptionTextError // Ajouter l'erreur du texte d'exemption de TVA
        };
      });
      
      setItemErrors(newErrors);
    };
    
    validateAllItems();
  }, [items]); // Se déclenche chaque fois que les items changent

  // Fonction pour valider un item et mettre à jour les erreurs
  const validateItem = (index: number, field: string, value: any) => {
    const item = items[index];
    
    // Mettre à jour la valeur temporairement pour la validation
    const updatedItem = { ...item, [field]: value };
    
    // Valider l'item
    const result = validateInvoiceItem(
      updatedItem.description,
      updatedItem.quantity,
      updatedItem.unitPrice,
      updatedItem.vatRate,
      updatedItem.unit,
      updatedItem.discount,
      updatedItem.discountType as 'PERCENTAGE' | 'FIXED',
      updatedItem.vatExemptionText,
    );
    
    // Mettre à jour les erreurs pour cet item
    setItemErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = {
        descriptionError: result.descriptionError,
        quantityError: result.quantityError,
        unitPriceError: result.unitPriceError,
        vatRateError: result.vatRateError,
        unitError: result.unitError,
        discountError: result.discountError,
        vatExemptionTextError: result.vatExemptionTextError
      };
      return newErrors;
    });
    
    // Appeler la fonction de changement d'item du parent
    handleItemChange(index, field, value);
  };

  // Requête GraphQL pour récupérer les produits
  const { loading, data: productsData } = useQuery(GET_PRODUCTS, {
    // Ne pas filtrer côté serveur pour pouvoir faire la recherche sur tous les champs côté client
    variables: { limit: 100 }, // Récupérer un maximum de produits
    skip: !searchQuery || searchQuery.length < 1,
    fetchPolicy: 'cache-and-network', // Pour avoir des résultats rapides et à jour
  });

  // Effet pour filtrer les produits lorsque les données ou la recherche changent
  useEffect(() => {
    if (productsData?.products?.products && searchQuery) {
      
      // Filtrer les résultats côté client pour rechercher sur tous les champs
      const searchLower = searchQuery.toLowerCase();
      const filteredResults = productsData.products.products.filter((product: {
        id: string;
        name: string;
        description?: string;
        unitPrice?: number;
        vatRate?: number;
        unit?: string;
      }) => {
        // Débogage pour chaque produit
        const nameMatch = product.name ? product.name.toLowerCase().includes(searchLower) : false;
        const descriptionMatch = product.description ? product.description.toLowerCase().includes(searchLower) : false;
        const priceMatch = product.unitPrice !== undefined ? product.unitPrice.toString().includes(searchQuery) : false;
        
        return nameMatch || descriptionMatch || priceMatch;
      });
      
      setSearchResults(filteredResults);
    } else if (!searchQuery) {
      setSearchResults([]);
    }
  }, [productsData, searchQuery]);



  // Fonction pour sélectionner un produit et remplir les champs
  const handleSelectProduct = (index: number, product: {
    id: string;
    name: string;
    description?: string;
    unitPrice?: number;
    vatRate?: number;
    unit?: string;
  }) => {
    try {
      // S'assurer que le prix unitaire est défini
      const productWithPrice = {
        ...product,
        unitPrice: product.unitPrice !== undefined && product.unitPrice !== null ? product.unitPrice : 0
      };
      
      // Si la prop handleProductSelect est fournie, l'utiliser pour mettre à jour l'item complet
      if (handleProductSelect) {
        // Appeler la fonction du parent qui mettra à jour l'item complet en une seule fois
        handleProductSelect(index, productWithPrice);
      } else {
        // Fallback: mettre à jour manuellement tous les champs importants
        // Cette partie ne devrait pas être utilisée si handleProductSelect est fourni correctement
        handleItemChange(index, 'description', product.name);
        handleItemChange(index, 'unitPrice', productWithPrice.unitPrice);
        
        if (product.description) {
          handleItemChange(index, 'details', product.description);
        }
        
        if (product.vatRate !== undefined && product.vatRate !== null) {
          handleItemChange(index, 'vatRate', product.vatRate);
        }
        
        if (product.unit) {
          handleItemChange(index, 'unit', product.unit);
        }
      }
      
      // Réinitialiser les erreurs pour cet item
      setItemErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = {};
        return newErrors;
      });
      
      // Attendre 500ms avant de réinitialiser la recherche pour s'assurer que les mises à jour sont terminées
      setTimeout(() => {
        setSearchResults([]);
        setSearchQuery('');
        setCurrentItemIndex(null);
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'item:', error);
    }
  };

  // Fonction pour gérer la saisie dans le champ description
  const handleDescriptionChange = (index: number, value: string) => {
    // Valider et mettre à jour la valeur avant de déclencher la recherche
    validateItem(index, 'description', value);
    
    // Déclencher la recherche si la valeur a au moins 1 caractère
    if (value && value.length >= 1) {
      setCurrentItemIndex(index);
      // Mettre à jour la requête de recherche
      setSearchQuery(value);
    } else {
      // Réinitialiser la recherche si le champ est vide
      setSearchResults([]);
      setSearchQuery('');
      setCurrentItemIndex(null);
    }
  };

  // Options pour les unités
  const unitOptions = [
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
  ];

  // Options pour les taux de TVA
  const vatRateOptions = [
    { value: '20', label: '20%' },
    { value: '10', label: '10%' },
    { value: '5.5', label: '5.5%' },
    { value: '2.1', label: '2.1%' },
    { value: '0', label: '0%' }
  ];

  // Options pour les types de remise
  const discountTypeOptions = [
    { value: 'PERCENTAGE', label: 'Pourcentage (%)' },
    { value: 'FIXED', label: 'Montant fixe (€)' }
  ];

  return (
    <div className="mb-6">
         <div className="mb-4 p-3 bg-[#f0eeff] border border-[#e6e1ff] rounded-lg text-sm text-gray-700">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-[#5b50ff] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-[#5b50ff] mb-1">Astuce</p>
            <p>Vous pouvez enregistrer vos produits et services dans le catalogue pour les réutiliser facilement dans vos factures et devis.</p>
            <p className="mt-1">Rendez-vous dans <a href="/profile?tab=products" className="font-medium text-[#5b50ff] hover:text-[#4a41e0] underline">Paramètres &gt; Catalogue de produits</a> pour gérer votre catalogue.</p>
          </div>
        </div>
      </div>
      <h3 className="block text-sm font-medium text-gray-700 mb-2">
        Éléments
      </h3>
      {items.map((item, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
          {/* Bouton de suppression en haut à droite */}
          <Button
            type="button"
            onClick={() => handleRemoveItem(index)}
            variant="outline"
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            disabled={items.length === 1}
            aria-label="Supprimer l'article"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
          
          {/* Titre de l'élément */}
          <h4 className="text-lg font-medium mb-4">Élément {index + 1}</h4>
          
          {/* Description (Titre) avec recherche de produit */}
          <div className="mb-4">
            <div className="relative">
              <div className="relative">
                <TextField
                  id={`item-description-${index}`}
                  name={`item-description-${index}`}
                  label="Titre"
                  value={item.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder="Rechercher un produit ou saisir un titre"
                  required
                  className="w-full"
                  autoComplete="off"
                  error={itemErrors[index]?.descriptionError ? { message: itemErrors[index].descriptionError } : undefined}
                />
                {/* Affichage des résultats de recherche */}
                {currentItemIndex === index && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectProduct(index, product)}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {product.description && product.description.substring(0, 40)}
                          {product.description && product.description.length > 40 ? '...' : ''}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {product.unitPrice !== undefined ? `${product.unitPrice}€` : ''}
                          {product.vatRate !== undefined ? ` | TVA: ${product.vatRate}%` : ''}
                          {product.unit ? ` | ${product.unit}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {currentItemIndex === index && loading && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-2 text-center">
                    <span className="text-gray-500">Recherche en cours...</span>
                  </div>
                )}
                {currentItemIndex === index && !loading && searchQuery && searchResults.length === 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-2 text-center">
                    <span className="text-gray-500">Aucun produit trouvé</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Détails (optionnel) - Champ texte multiligne */}
          <div className="mb-6">
            <TextArea
              id={`item-details-${index}`}
              name={`item-details-${index}`}
              label="Détails (optionnel)"
              value={item.details || ''}
              onChange={(e) => validateItem(index, 'details', e.target.value)}
              placeholder="Ajoutez plus de détails"
              rows={3}
              className="w-full"
            />
          </div>
          
          {/* Ligne Quantité et Prix unitaire */}
          <div className="flex gap-4 mb-4">
            {/* Quantité avec unité intégrée */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
              <div className="flex">
                <TextField
                  id={`item-quantity-${index}`}
                  name={`item-quantity-${index}`}
                  label=""
                  type="number"
                  value={item.quantity.toString()}
                  onChange={(e) => validateItem(index, 'quantity', parseInt(e.target.value))}
                  placeholder="1"
                  min="1"
                  required
                  className="w-3/5"
                  inputClassName="!rounded-r-none"
                  error={itemErrors[index]?.quantityError ? { message: itemErrors[index].quantityError } : undefined}
                />
                <Select
                  id={`item-unit-${index}`}
                  name={`item-unit-${index}`}
                  label=""
                  value={item.unit || 'unité'}
                  onChange={(e) => validateItem(index, 'unit', e.target.value)}
                  options={unitOptions}
                  required
                  className="w-2/5"
                  selectClassName="!rounded-l-none"
                  error={itemErrors[index]?.unitError ? { message: itemErrors[index].unitError } : undefined}
                />
              </div>
            </div>
            
            {/* Prix unitaire */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
              <TextField
                id={`item-unit-price-${index}`}
                name={`item-unit-price-${index}`}
                label=""
                type="number"
                value={(item.unitPrice !== undefined && item.unitPrice !== null) ? item.unitPrice.toString() : '0'}
                key={`unitPrice-${index}-${JSON.stringify(item)}`} // Forcer le rendu quand n'importe quelle propriété de l'item change
                onChange={(e) => validateItem(index, 'unitPrice', parseFloat(e.target.value))}
                placeholder="0.00"
                min="0"
                step="0.01" // Utiliser 0.01 pour permettre les décimales
                required
                className="w-full"
                prefix="EUR"
                error={itemErrors[index]?.unitPriceError ? { message: itemErrors[index].unitPriceError } : undefined}
              />
            </div>
          </div>
          
          {/* Remise (conditionnelle) */}
          {(item.discount !== undefined || item.discountType) && (
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <Select
                  id={`item-discount-type-${index}`}
                  name={`item-discount-type-${index}`}
                  label="Type de remise"
                  value={item.discountType || 'FIXED'}
                  onChange={(e) => validateItem(index, 'discountType', e.target.value as 'PERCENTAGE' | 'FIXED')}
                  options={discountTypeOptions}
                  className="w-full"
                />
              </div>
              <div className="w-1/2">
                <TextField
                  id={`item-discount-${index}`}
                  name={`item-discount-${index}`}
                  label="Remise"
                  type="number"
                  value={item.discount !== undefined ? item.discount.toString() : ''}
                  onChange={(e) => validateItem(index, 'discount', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="0"
                  min="0"
                  step="1"
                  className="w-full"
                  error={itemErrors[index]?.discountError ? { message: itemErrors[index].discountError } : undefined}
                />
              </div>
            </div>
          )}
          
          {/* TVA */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">TVA</label>
            <div className="flex flex-wrap gap-2">
              {vatRateOptions.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={item.vatRate.toString() === option.value && !showCustomVatRate[index] ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    // Désactiver le mode "Autre" si actif
                    if (showCustomVatRate[index]) {
                      setShowCustomVatRate(prev => ({
                        ...prev,
                        [index]: false
                      }));
                    }
                    validateItem(index, 'vatRate', parseFloat(option.value));
                    
                    // Si le taux de TVA n'est pas 0, supprimer la mention d'exonération
                    if (parseFloat(option.value) !== 0 && item.vatExemptionText) {
                      handleItemChange(index, 'vatExemptionText', undefined);
                    }
                  }}
                >
                  {option.label}
                </Button>
              ))}
              <Button
                type="button"
                variant={showCustomVatRate[index] ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  // Mettre à jour l'état pour afficher/masquer le champ personnalisé
                  const newValue = !showCustomVatRate[index];
                  setShowCustomVatRate(prev => ({
                    ...prev,
                    [index]: newValue
                  }));
                  
                  // Si on désactive le bouton "Autre", on réinitialise à 20%
                  if (!newValue) {
                    validateItem(index, 'vatRate', 20);
                    // Supprimer la mention d'exonération si elle existe
                    if (item.vatExemptionText) {
                      handleItemChange(index, 'vatExemptionText', undefined);
                    }
                  }
                }}
              >
                Autre
              </Button>
            </div>
            {showCustomVatRate[index] && (
              <div className="mt-2">
                <TextField
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Taux personnalisé"
                  value={item.vatRate.toString()}
                  onChange={(e) => {
                    const newVatRate = parseFloat(e.target.value);
                    validateItem(index, 'vatRate', newVatRate);
                    
                    // Si le taux de TVA n'est pas 0, supprimer la mention d'exonération
                    if (newVatRate !== 0 && item.vatExemptionText) {
                      handleItemChange(index, 'vatExemptionText', undefined);
                    }
                  }}
                  className="w-full"
                />
              </div>
            )}
            {itemErrors[index]?.vatRateError && (
              <p className="mt-1 text-sm text-red-600">{itemErrors[index].vatRateError}</p>
            )}
            
            {/* Mention d'exonération de TVA (visible uniquement si TVA à 0%) */}
            {item.vatRate === 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mention d'exonération de TVA</label>
                <Select
                  id={`item-vat-exemption-${index}`}
                  name={`item-vat-exemption-${index}`}
                  label=""
                  value={item.vatExemptionText ? VAT_EXEMPTION_OPTIONS.find(opt => opt.text === item.vatExemptionText)?.value || '' : ''}
                  onChange={(e) => {
                    const selectedOption = VAT_EXEMPTION_OPTIONS.find(opt => opt.value === e.target.value);
                    validateItem(index, 'vatExemptionText', selectedOption ? selectedOption.text : '');
                  }}
                  options={[
                    { value: '', label: 'Sélectionner une mention' },
                    ...VAT_EXEMPTION_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
                  ]}
                  className={`w-full mb-2 ${!item.vatExemptionText && itemErrors[index]?.vatExemptionTextError ? 'border-red-500' : ''}`}
                />
                <TextArea
                  id={`item-vat-exemption-text-${index}`}
                  name={`item-vat-exemption-text-${index}`}
                  value={item.vatExemptionText || ''}
                  onChange={(e) => validateItem(index, 'vatExemptionText', e.target.value)}
                  placeholder="Texte de la mention d'exonération"
                  rows={3}
                  className={`w-full ${!item.vatExemptionText && itemErrors[index]?.vatExemptionTextError ? 'border-red-500' : ''}`}
                />
                {itemErrors[index]?.vatExemptionTextError && (
                  <p className="mt-1 text-sm text-red-600">{itemErrors[index].vatExemptionTextError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      
      <div className="flex justify-center w-full mt-2">
        <Button
          type="button"
          onClick={handleAddItem}
          variant="outline"
        >
          + Ajouter un élément
        </Button>
      </div>
    </div>
  );
};
