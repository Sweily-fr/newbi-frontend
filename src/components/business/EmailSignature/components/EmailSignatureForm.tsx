import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Form, TextField, ColorPicker } from '../../../ui';
import Collapse from '../../../ui/Collapse';
import { EmailSignature } from './EmailSignaturesTable';
import { EMAIL_PATTERN } from '../../../../constants/formValidations';

interface EmailSignatureFormProps {
  initialData?: Partial<EmailSignature>;
  onSubmit: (data: Partial<EmailSignature>) => void;
  onCancel: () => void;
  onChange?: (data: Partial<EmailSignature>) => void; // Callback pour les changements en temps réel
}

export const EmailSignatureForm: React.FC<EmailSignatureFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onChange
}) => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm<Partial<EmailSignature>>({
    defaultValues: {
      name: initialData?.name || '',
      fullName: initialData?.fullName || '',
      jobTitle: initialData?.jobTitle || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      mobilePhone: initialData?.mobilePhone || '',
      website: initialData?.website || '',
      address: initialData?.address || '',
      companyName: initialData?.companyName || '',
      socialLinks: initialData?.socialLinks || {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      },
      template: initialData?.template || 'simple',
      primaryColor: initialData?.primaryColor || '#0066cc',
      secondaryColor: initialData?.secondaryColor || '#f5f5f5',
      logoUrl: initialData?.logoUrl || '',
      isDefault: initialData?.isDefault || false
    }
  });

  // Surveiller les changements pour la prévisualisation
  const formValues = watch();
  
  // Mettre à jour la prévisualisation en temps réel
  React.useEffect(() => {
    if (onChange) {
      onChange(formValues);
    }
  }, [formValues, onChange]);

  return (
    <div className="bg-white overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">
          {initialData ? 'Modifier la signature' : 'Créer une signature'}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <Form onSubmit={handleSubmit(onSubmit)} id="signatureForm">
          <Collapse title="Informations générales" defaultOpen={true}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Le nom de la signature est requis' }}
                render={({ field }) => (
                  <TextField
                    label="Nom de la signature"
                    placeholder="Ex: Signature professionnelle"
                    error={errors.name?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="isDefault"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                      Définir comme signature par défaut
                    </label>
                  </div>
                )}
              />
            </div>
          </Collapse>

          <Collapse title="Informations personnelles" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Controller
                name="fullName"
                control={control}
                rules={{ required: 'Le nom complet est requis' }}
                render={({ field }) => (
                  <TextField
                    label="Nom complet"
                    placeholder="Ex: Jean Dupont"
                    error={errors.fullName?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="jobTitle"
                control={control}
                rules={{ required: 'Le titre du poste est requis' }}
                render={({ field }) => (
                  <TextField
                    label="Titre du poste"
                    placeholder="Ex: Directeur Marketing"
                    error={errors.jobTitle?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'L\'email est requis',
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: 'Veuillez entrer une adresse email valide'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    placeholder="Ex: jean.dupont@example.com"
                    error={errors.email?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Téléphone fixe"
                    placeholder="Ex: 01 23 45 67 89"
                    error={errors.phone?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="mobilePhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Téléphone mobile"
                    placeholder="Ex: 06 12 34 56 78"
                    error={errors.mobilePhone?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Site web"
                    placeholder="Ex: www.example.com"
                    error={errors.website?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </Collapse>

          <Collapse title="Informations de l'entreprise" defaultOpen={false}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Nom de l'entreprise"
                    placeholder="Ex: Entreprise SAS"
                    error={errors.companyName?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Adresse"
                    placeholder="Ex: 123 rue de Paris, 75001 Paris, France"
                    error={errors.address?.message}
                    multiline
                    rows={3}
                    {...field}
                  />
                )}
              />

              <Controller
                name="logoUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="URL du logo"
                    placeholder="Ex: https://example.com/logo.png"
                    error={errors.logoUrl?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </Collapse>

          <Collapse title="Réseaux sociaux" defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Controller
                name="socialLinks.linkedin"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="LinkedIn"
                    placeholder="Ex: https://linkedin.com/in/jeandupont"
                    error={errors.socialLinks?.linkedin?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="socialLinks.twitter"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Twitter"
                    placeholder="Ex: https://twitter.com/jeandupont"
                    error={errors.socialLinks?.twitter?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="socialLinks.facebook"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Facebook"
                    placeholder="Ex: https://facebook.com/jeandupont"
                    error={errors.socialLinks?.facebook?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="socialLinks.instagram"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Instagram"
                    placeholder="Ex: https://instagram.com/jeandupont"
                    error={errors.socialLinks?.instagram?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </Collapse>

          <Collapse title="Apparence" defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <Controller
                  name="template"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        className={`border rounded-md p-3 cursor-pointer ${value === 'simple' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                        onClick={() => onChange('simple')}
                      >
                        <div className="text-sm font-medium">Simple</div>
                        <div className="text-xs text-gray-500">Design épuré et minimaliste</div>
                      </div>
                      <div 
                        className={`border rounded-md p-3 cursor-pointer ${value === 'professional' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                        onClick={() => onChange('professional')}
                      >
                        <div className="text-sm font-medium">Professionnel</div>
                        <div className="text-xs text-gray-500">Mise en page structurée</div>
                      </div>
                      <div 
                        className={`border rounded-md p-3 cursor-pointer ${value === 'modern' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                        onClick={() => onChange('modern')}
                      >
                        <div className="text-sm font-medium">Moderne</div>
                        <div className="text-xs text-gray-500">Design contemporain</div>
                      </div>
                      <div 
                        className={`border rounded-md p-3 cursor-pointer ${value === 'creative' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                        onClick={() => onChange('creative')}
                      >
                        <div className="text-sm font-medium">Créatif</div>
                        <div className="text-xs text-gray-500">Design audacieux</div>
                      </div>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
                  <Controller
                    name="primaryColor"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                          style={{ backgroundColor: value }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'color';
                            input.value = value;
                            input.addEventListener('input', (e) => {
                              onChange((e.target as HTMLInputElement).value);
                            });
                            input.click();
                          }}
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
                        />
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur secondaire</label>
                  <Controller
                    name="secondaryColor"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                          style={{ backgroundColor: value }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'color';
                            input.value = value;
                            input.addEventListener('input', (e) => {
                              onChange((e.target as HTMLInputElement).value);
                            });
                            input.click();
                          }}
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </Collapse>
        </Form>
      </div>
      <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="signatureForm"
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );
};
