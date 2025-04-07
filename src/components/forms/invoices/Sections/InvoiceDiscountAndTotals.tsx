import React, { useState, useEffect } from "react";
import { Select, TextField, Button } from "../../../../components/ui";
import {
  DISCOUNT_PERCENTAGE_ERROR_MESSAGE,
  DISCOUNT_FIXED_ERROR_MESSAGE,
  getDiscountValidationRules,
  CUSTOM_FIELD_VALUE_PATTERN,
  CUSTOM_FIELD_VALUE_ERROR_MESSAGE,
  getCustomFieldValidationRules,
} from "../../../../constants/formValidations";

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
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Remise</h3>
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
      <div className="mt-8 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Champs personnalisés</h3>
          <Button
            type="button"
            onClick={handleAddCustomField}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Ajouter un champ
          </Button>
        </div>

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
            <Button
              type="button"
              onClick={() => handleRemoveCustomField(index)}
              variant="icon"
              className="text-red-600 hover:text-red-800"
              aria-label="Supprimer le champ"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium">Totaux</h3>
        {calculateTotals ? (
          <div>
            <div className="flex justify-between">
              <span>Total HT:</span>
              <span>{calculateTotals().totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>TVA:</span>
              <span>{calculateTotals().totalVAT.toFixed(2)} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>
                  Remise{discountType === "PERCENTAGE" ? ` (${discount}%)` : ""}:
                </span>
                <span>-{calculateTotals().discountAmount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total TTC:</span>
              <span>{calculateTotals().finalTotalTTC.toFixed(2)} €</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between">
              <span>Total HT:</span>
              <span>{totals?.totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>TVA:</span>
              <span>{totals?.totalVAT.toFixed(2)} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>
                  Remise{discountType === "PERCENTAGE" ? ` (${discount}%)` : ""}:
                </span>
                <span>-{totals?.discountAmount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total TTC:</span>
              <span>{totals?.finalTotalTTC.toFixed(2)} €</span>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Champs personnalisés</h3>
        <Button
          type="button"
          onClick={addCustomField}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
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
            className="text-red-600 hover:text-red-800"
            aria-label="Supprimer le champ personnalisé"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      ))}
    </div>
  );
};
