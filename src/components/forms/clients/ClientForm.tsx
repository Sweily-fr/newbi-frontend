import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ClientFormData, ClientFormProps, ClientType } from '../../../types/client';
import { Form, TextField, FieldGroup, FormActions, Select } from '../../../components/ui';
import { 
  getClientValidationRules, 
  EMAIL_PATTERN, 
  SIRET_PATTERN, 
  VAT_PATTERN,
  STREET_PATTERN,
  CITY_PATTERN,
  POSTAL_CODE_PATTERN,
  COUNTRY_PATTERN,
  EMAIL_ERROR_MESSAGE,
  SIRET_ERROR_MESSAGE,
  VAT_ERROR_MESSAGE,
  STREET_ERROR_MESSAGE,
  CITY_ERROR_MESSAGE,
  POSTAL_CODE_ERROR_MESSAGE,
  COUNTRY_ERROR_MESSAGE
} from '../../../constants/formValidations';

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  id,
}) => {
  const isNewClient = !initialData?.name;
  const validationRules = getClientValidationRules(isNewClient);
  
  // Définir le type de client par défaut (COMPANY si non spécifié)
  const [clientType, setClientType] = useState<ClientType>(
    initialData?.type || ClientType.COMPANY
  );
  
  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
    defaultValues: {
      ...initialData,
      type: initialData?.type || ClientType.COMPANY
    },
    mode: 'onBlur', // Validate on blur for better user experience
  });
  
  // Observer les changements du type de client
  const watchedType = watch('type');
  
  // Mettre à jour l'état local quand le type change dans le formulaire
  useEffect(() => {
    if (watchedType) {
      setClientType(watchedType as ClientType);
    }
  }, [watchedType]);

  return (
    <Form 
      id={id}
      onSubmit={handleSubmit(onSubmit)} 
      spacing="loose"
      className="px-4"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              id="client-type"
              name="type"
              label="Type de client"
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              options={[
                { value: ClientType.COMPANY, label: 'Entreprise' },
                { value: ClientType.INDIVIDUAL, label: 'Particulier' }
              ]}
              required
            />
          )}
        />

        <TextField
          id="name"
          label="Nom"
          name="name"
          register={register}
          error={errors.name}
          required
          validation={{
            required: 'Le nom est requis',
            pattern: {
              value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/,
              message: 'Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, tirets ou apostrophes'
            }
          }}
        />
      </div>
      
      {clientType === ClientType.INDIVIDUAL && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
          <TextField
            id="firstName"
            label="Prénom"
            name="firstName"
            register={register}
            error={errors.firstName}
            validation={{
              pattern: {
                value: /^[a-zA-ZÀ-ÿ\s-]{1,50}$/,
                message: 'Prénom invalide'
              }
            }}
          />
          <TextField
            id="lastName"
            label="Nom de famille"
            name="lastName"
            register={register}
            error={errors.lastName}
            validation={{
              pattern: {
                value: /^[a-zA-ZÀ-ÿ\s-]{1,50}$/,
                message: 'Nom de famille invalide'
              }
            }}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
        <TextField
          id="email"
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
          validation={{
            required: 'L\'email est requis',
            pattern: {
              value: EMAIL_PATTERN,
              message: EMAIL_ERROR_MESSAGE
            }
          }}
        />
        
        <TextField
          id="siret"
          label="SIRET"
          name="siret"
          register={register}
          error={errors.siret}
          helpText="Format attendu : 14 chiffres"
          validation={{
            pattern: {
              value: SIRET_PATTERN,
              message: SIRET_ERROR_MESSAGE
            }
          }}
        />
      </div>

      <div className="mb-4">
        <TextField
          id="vatNumber"
          label="Numéro de TVA"
          name="vatNumber"
          register={register}
          error={errors.vatNumber}
          helpText="Format attendu : FR suivi de 11 chiffres"
          validation={{
            pattern: {
              value: VAT_PATTERN,
              message: VAT_ERROR_MESSAGE
            }
          }}
        />
      </div>

      <FieldGroup title="Adresse" spacing="normal">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
          <TextField
            id="street"
            label="Rue"
            name="address.street"
            register={register}
            error={errors.address?.street}
            required
            validation={{
              required: 'La rue est requise',
              pattern: {
                value: STREET_PATTERN,
                message: STREET_ERROR_MESSAGE
              }
            }}
          />

          <TextField
            id="city"
            label="Ville"
            name="address.city"
            register={register}
            error={errors.address?.city}
            required
            validation={{
              required: 'La ville est requise',
              pattern: {
                value: CITY_PATTERN,
                message: CITY_ERROR_MESSAGE
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
          <TextField
            id="postalCode"
            label="Code postal"
            name="address.postalCode"
            register={register}
            error={errors.address?.postalCode}
            required
            validation={{
              required: 'Le code postal est requis',
              pattern: {
                value: POSTAL_CODE_PATTERN,
                message: POSTAL_CODE_ERROR_MESSAGE
              }
            }}
          />

          <TextField
            id="country"
            label="Pays"
            name="address.country"
            register={register}
            error={errors.address?.country}
            required
            validation={{
              required: 'Le pays est requis',
              pattern: {
                value: COUNTRY_PATTERN,
                message: COUNTRY_ERROR_MESSAGE
              }
            }}
          />
        </div>
      </FieldGroup>
      
      {onCancel && (
        <div className="flex justify-end space-x-4 mt-4">
          <FormActions
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            align="right"
          />
        </div>
      )}
    </Form>
  );
};
