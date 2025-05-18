import React, { useState, useEffect } from "react";
import { Select, TextField, Button } from "../../../../../components/";
import {
  DISCOUNT_PERCENTAGE_ERROR_MESSAGE,
  DISCOUNT_FIXED_ERROR_MESSAGE,
  CUSTOM_FIELD_VALUE_PATTERN,
  CUSTOM_FIELD_VALUE_ERROR_MESSAGE,
} from "../../../../../constants/formValidations";
import { AddCircle, CloseCircle, DiscountShape, Calculator, Magicpen } from "iconsax-react";

interface CustomField {
  key: string;
  value: string;
}

interface ValidationError {
  key?: string;
  value?: string;
}

interface InvoiceDiscountAndTotalsProps {
  discount: number;
  setDiscount: (discount: number) => void;
  discountType: "PERCENTAGE" | "FIXED";
  setDiscountType: (type: "PERCENTAGE" | "FIXED") => void;
  calculateTotals?: () => {
    totalHT: number;
    totalVAT: number;
    discountAmount: number;
    finalTotalTTC: number;
  };
  totals?: {
    totalHT: number;
    totalVAT: number;
    discountAmount: number;
    finalTotalTTC: number;
  };
  customFields: CustomField[];
  handleAddCustomField: () => void;
  handleRemoveCustomField: (index: number) => void;
  handleCustomFieldChange: (
    index: number,
    field: "key" | "value",
    value: string
  ) => void;
}

export const InvoiceDiscountAndTotals: React.FC<
  InvoiceDiscountAndTotalsProps
> = ({
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  calculateTotals,
  totals,
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleCustomFieldChange,
}) => {
  const [discountError, setDiscountError] = useState<string | undefined>(
    undefined
  );
  const [discountInputValue, setDiscountInputValue] = useState<string>(
    discount === 0 ? "" : discount.toString()
  );
  // État pour stocker les erreurs de validation des champs personnalisés
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: ValidationError;
  }>({});

  // Valider la remise à chaque changement de valeur ou de type
  useEffect(() => {
    validateDiscount(discount);
    setDiscountInputValue(discount.toString());
  }, [discount, discountType]);

  // Fonction de validation de la remise
  const validateDiscount = (value: number) => {
    if (value < 0) {
      setDiscountError(
        discountType === "PERCENTAGE"
          ? DISCOUNT_PERCENTAGE_ERROR_MESSAGE
          : DISCOUNT_FIXED_ERROR_MESSAGE
      );
      return false;
    }

    if (discountType === "PERCENTAGE" && value > 100) {
      setDiscountError(DISCOUNT_PERCENTAGE_ERROR_MESSAGE);
      return false;
    }

    setDiscountError(undefined);
    return true;
  };

  return (
    <>
      {/* Remise */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff]">
            <DiscountShape size="20" color="#5b50ff" variant="Linear" />
          </span>
          Remise
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              id="discount-type"
              name="discount-type"
              label="Type de remise"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value as "PERCENTAGE" | "FIXED");
                // Revalider avec le nouveau type
                validateDiscount(discount);
              }}
              options={[
                { value: "FIXED", label: "Montant fixe" },
                { value: "PERCENTAGE", label: "Pourcentage" },
              ]}
            />
          </div>
          <div className="flex-1">
            <TextField
              id="discount-amount"
              name="discount-amount"
              label={`Montant de la remise ${
                discountType === "PERCENTAGE" ? "(%)" : "(€)"
              }`}
              type="number"
              min="0"
              max={discountType === "PERCENTAGE" ? "100" : undefined}
              step={discountType === "PERCENTAGE" ? "0.1" : "0.01"}
              value={discountInputValue}
              onChange={(e) => {
                const inputValue = e.target.value;
                setDiscountInputValue(inputValue);

                if (inputValue === "") {
                  // Champ vide, définir la remise à 0 dans le modèle de données
                  setDiscount(0);
                  setDiscountError(undefined);
                } else {
                  const newValue = parseFloat(inputValue);
                  if (!isNaN(newValue)) {
                    // Valeur numérique valide
                    setDiscount(newValue);
                    validateDiscount(newValue);
                  }
                }
              }}
              error={discountError}
            />
          </div>
        </div>
      </div>

      {/* Champs personnalisés */}
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-[#5b50ff]">
              <Magicpen size="20" color="#5b50ff" variant="Linear" />
            </span>
            Champs personnalisés
          </h3>
          <Button
            type="button"
            onClick={handleAddCustomField}
            variant="outline"
            className="flex items-center gap-2 text-[#5b50ff] border-[#5b50ff] hover:bg-[#f0eeff]"
          >
            <AddCircle size="18" color="#5b50ff" variant="Linear" />
            Ajouter un champ
          </Button>
        </div>
        <hr className="border-t border-gray-200 mb-4" />

        {customFields?.map((field, index) => (
          <div key={index} className="flex items-center space-x-4 mb-3">
            <TextField
              id={`custom-field-name-${index}`}
              name={`custom-field-name-${index}`}
              value={field.key}
              onChange={(e) => {
                const newValue = e.target.value;
                handleCustomFieldChange(index, "key", newValue);
                // Valider la clé
                const errors = { ...validationErrors };
                if (newValue && !CUSTOM_FIELD_VALUE_PATTERN.test(newValue)) {
                  errors[index] = {
                    ...errors[index],
                    key: CUSTOM_FIELD_VALUE_ERROR_MESSAGE,
                  };
                } else {
                  if (errors[index]) {
                    delete errors[index].key;
                    if (Object.keys(errors[index] || {}).length === 0) {
                      delete errors[index];
                    }
                  }
                }
                setValidationErrors(errors);
              }}
              placeholder="Nom"
              disabled={false}
              className="flex-1"
              error={validationErrors[index]?.key}
            />
            <TextField
              id={`custom-field-value-${index}`}
              name={`custom-field-value-${index}`}
              value={field.value}
              onChange={(e) => {
                const newValue = e.target.value;
                handleCustomFieldChange(index, "value", newValue);
                // Valider la valeur
                const errors = { ...validationErrors };
                if (newValue && !CUSTOM_FIELD_VALUE_PATTERN.test(newValue)) {
                  errors[index] = {
                    ...errors[index],
                    value: CUSTOM_FIELD_VALUE_ERROR_MESSAGE,
                  };
                } else {
                  if (errors[index]) {
                    delete errors[index].value;
                    if (Object.keys(errors[index] || {}).length === 0) {
                      delete errors[index];
                    }
                  }
                }
                setValidationErrors(errors);
              }}
              placeholder="Valeur"
              disabled={false}
              className="flex-1"
              error={validationErrors[index]?.value}
            />
            <button
              type="button"
              onClick={() => handleRemoveCustomField(index)}
              className="p-1 min-w-0 hover:text-red-800 bg-transparent border-0 cursor-pointer"
              aria-label="Supprimer le champ"
            >
              <CloseCircle size="20" color="#ef4444" variant="Linear" />
            </button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2 text-[#5b50ff]">
            <Calculator size="20" color="#5b50ff" variant="Linear" />
          </span>
          Totaux
        </h3>
        <hr className="border-t border-gray-200 mb-4" />
        {calculateTotals ? (
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            {/* Utiliser l'opérateur de chaînage optionnel pour éviter les erreurs si calculateTotals() retourne undefined */}
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total HT:</span>
              <span className="font-medium">{calculateTotals()?.totalHT?.toFixed(2) || "0.00"} €</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">TVA:</span>
              <span className="font-medium">{calculateTotals()?.totalVAT?.toFixed(2) || "0.00"} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-2 text-red-600">
                <span className="flex items-center">
                  <DiscountShape size="16" color="#ef4444" variant="Linear" className="mr-1" />
                  Remise{discountType === "PERCENTAGE" ? ` (${discount}%)` : ""}:
                </span>
                <span className="font-medium">-{calculateTotals()?.discountAmount?.toFixed(2) || '0.00'} €</span>
              </div>
            )}
            <div className="flex justify-between mt-2 pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-[#5b50ff]">Total TTC:</span>
              <span className="text-lg font-bold text-[#5b50ff]">{calculateTotals()?.finalTotalTTC?.toFixed(2) || "0.00"} €</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total HT:</span>
              <span className="font-medium">{totals?.totalHT?.toFixed(2) || '0.00'} €</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">TVA:</span>
              <span className="font-medium">{totals?.totalVAT?.toFixed(2) || '0.00'} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-2 text-red-600">
                <span className="flex items-center">
                  <DiscountShape size="16" color="#ef4444" variant="Linear" className="mr-1" />
                  Remise{discountType === "PERCENTAGE" ? ` (${discount}%)` : ""}:
                </span>
                <span className="font-medium">-{totals?.discountAmount?.toFixed(2) || '0.00'} €</span>
              </div>
            )}
            <div className="flex justify-between mt-2 pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-[#5b50ff]">Total TTC:</span>
              <span className="text-lg font-bold text-[#5b50ff]">{totals?.finalTotalTTC?.toFixed(2) || '0.00'} €</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Composant séparé pour les champs personnalisés
interface InvoiceCustomFieldsProps {
  customFields: CustomField[];
  handleAddCustomField?: () => void;
  handleRemoveCustomField?: (index: number) => void;
  handleCustomFieldChange?: (
    index: number,
    field: "key" | "value",
    value: string
  ) => void;
  // Nouveaux noms de props utilisés dans QuoteFormModal
  onAddCustomField?: () => void;
  onRemoveCustomField?: (index: number) => void;
  onCustomFieldChange?: (
    index: number,
    field: keyof CustomField,
    value: string
  ) => void;
}

export const InvoiceCustomFields: React.FC<InvoiceCustomFieldsProps> = ({
  customFields = [], // Ajouter une valeur par défaut pour éviter l'erreur
  handleAddCustomField,
  handleRemoveCustomField,
  handleCustomFieldChange,
  onAddCustomField,
  onRemoveCustomField,
  onCustomFieldChange,
}) => {
  // Utiliser les nouveaux noms de props s'ils sont fournis, sinon utiliser les anciens
  const addCustomField = onAddCustomField || handleAddCustomField || (() => {});
  const removeCustomField = onRemoveCustomField || handleRemoveCustomField || (() => {});
  const customFieldChange = (index: number, field: "key" | "value", value: string) => {
    if (onCustomFieldChange) {
      onCustomFieldChange(index, field as keyof CustomField, value);
    } else if (handleCustomFieldChange) {
      handleCustomFieldChange(index, field, value);
    }
  };
  // État pour stocker les erreurs de validation des champs personnalisés
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: ValidationError;
  }>({});

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2 text-[#5b50ff]">
            <Calculator size="20" color="#5b50ff" variant="Bulk" />
          </span>
          Champs personnalisés
        </h3>
        <Button
          type="button"
          onClick={addCustomField}
          variant="outline"
          className="flex items-center gap-2 text-[#5b50ff] border-[#5b50ff] hover:bg-[#f0eeff]"
        >
          <AddCircle size="18" color="#5b50ff" variant="Linear" />
          Ajouter un champ
        </Button>
      </div>

      {customFields.map((field, index) => (
        <div key={index} className="flex items-center space-x-4 mb-3">
          <TextField
            id={`custom-field-name-${index}`}
            name={`custom-field-name-${index}`}
            value={field.key}
            onChange={(e) => {
              const newValue = e.target.value;
              customFieldChange(index, "key", newValue);
              // Valider la clé
              const errors = { ...validationErrors };
              if (newValue && !CUSTOM_FIELD_VALUE_PATTERN.test(newValue)) {
                errors[index] = {
                  ...errors[index],
                  key: CUSTOM_FIELD_VALUE_ERROR_MESSAGE,
                };
              } else {
                if (errors[index]) {
                  delete errors[index].key;
                  if (Object.keys(errors[index] || {}).length === 0) {
                    delete errors[index];
                  }
                }
              }
              setValidationErrors(errors);
            }}
            placeholder="Clé"
            disabled={false}
            className="flex-1"
            error={validationErrors[index]?.key}
          />
          <TextField
            id={`custom-field-value-${index}`}
            name={`custom-field-value-${index}`}
            value={field.value}
            onChange={(e) => {
              const newValue = e.target.value;
              customFieldChange(index, "value", newValue);
              // Valider la valeur
              const errors = { ...validationErrors };
              if (newValue && !CUSTOM_FIELD_VALUE_PATTERN.test(newValue)) {
                errors[index] = {
                  ...errors[index],
                  value: CUSTOM_FIELD_VALUE_ERROR_MESSAGE,
                };
              } else {
                if (errors[index]) {
                  delete errors[index].value;
                  if (Object.keys(errors[index] || {}).length === 0) {
                    delete errors[index];
                  }
                }
              }
              setValidationErrors(errors);
            }}
            placeholder="Valeur"
            className="flex-1"
            error={validationErrors[index]?.value}
          />
          <Button
            type="button"
            onClick={() => removeCustomField(index)}
            variant="outline"
            className="p-1 min-w-0 text-red-600 hover:text-red-800 border-transparent hover:border-red-200 hover:bg-red-50"
            aria-label="Supprimer le champ personnalisé"
          >
            <CloseCircle size="20" color="#ef4444" variant="Linear" />
          </Button>
        </div>
      ))}
    </div>
  );
};
