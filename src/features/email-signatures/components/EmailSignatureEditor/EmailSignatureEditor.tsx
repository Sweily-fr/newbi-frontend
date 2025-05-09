import React, { useState, useEffect } from 'react';
import { EmailSignatureForm } from '../EmailSignatureForm';
import { EmailSignaturePreview } from '../EmailSignaturePreview';
import { EmailSignature } from '../../types';

interface EmailSignatureEditorProps {
  initialData?: Partial<EmailSignature>;
  onSubmit: (data: Partial<EmailSignature>) => void;
  onCancel: () => void;
  onChange?: (data: Partial<EmailSignature>) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const EmailSignatureEditor: React.FC<EmailSignatureEditorProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onChange
  // isLoading et error sont disponibles mais non utilisés pour le moment
}) => {
  const [signatureData, setSignatureData] = useState<Partial<EmailSignature>>(initialData || {});

  // Mettre à jour les données de signature lorsque initialData change
  useEffect(() => {
    if (initialData) {
      setSignatureData(initialData);
    }
  }, [initialData]);

  // Gérer les changements dans le formulaire
  const handleFormChange = (data: Partial<EmailSignature>) => {
    setSignatureData(data);
    // Propager les changements au parent si la fonction onChange est fournie
    if (onChange) {
      onChange(data);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="lg:order-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Éditer la signature</h2>
          <EmailSignatureForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onChange={handleFormChange}
          />
        </div>
      </div>
      <div className="lg:order-2">
        <div className="bg-white rounded-lg shadow p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Aperçu de la signature</h2>
          <div className="border rounded-lg p-6 bg-gray-50">
            <EmailSignaturePreview signature={signatureData} />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Cet aperçu montre comment votre signature apparaîtra dans vos emails.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
