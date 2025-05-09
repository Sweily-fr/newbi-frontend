import React, { useState, useEffect } from 'react';
import { EmailSignatureForm } from '../EmailSignatureForm';
import { EmailSignaturePreview } from '../EmailSignaturePreview';
import { EmailSignature } from '../../types';
import './EmailSignatureEditor.css'; // Importer les styles personnalisés

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
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      {/* Colonne du formulaire */}
      <div className="lg:order-1 flex flex-col h-full overflow-hidden border-r border-gray-200">
        <div className="bg-white flex flex-col h-full">
          {/* Contenu défilable - uniquement les sections collapsibles */}
          <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
            <EmailSignatureForm
              initialData={initialData}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onChange={handleFormChange}
              hideButtons={true} /* Masquer les boutons dans le formulaire */
            />
          </div>
          
          {/* Pied de page fixe avec boutons d'action */}
          <div className="flex justify-end gap-4 p-6 border-t flex-shrink-0 bg-white">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg font-medium focus:outline-none border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 py-3 px-6 text-sm font-medium"
              onClick={onCancel}
            >
              Annuler
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg font-medium focus:outline-none border border-transparent bg-[#5b50ff] text-white hover:bg-[#4a41d0] py-3 px-6 text-sm font-medium"
              onClick={() => {
                // Déclencher la soumission du formulaire
                const form = document.querySelector('form');
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
            >
              {initialData?.id ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Colonne de prévisualisation - Style fenêtre navigateur */}
      <div className="lg:order-2 h-full overflow-hidden bg-gray-50 p-6">
        <div className="h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Aperçu</h2>
          <div className="flex-1 flex items-center justify-center overflow-auto">
            {/* Fenêtre style navigateur Mac */}
            <div className="bg-[#2D2D2D] rounded-lg shadow-lg w-full max-w-2xl overflow-hidden border border-gray-800">
              {/* Barre de titre style Mac avec boutons de contrôle */}
              <div className="px-4 py-3 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                {/* Barre d'adresse */}
                <div className="flex-1 mx-4">
                  <div className="bg-[#444444] rounded-md flex items-center px-3 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-gray-300 text-xs">www.awayout.fr</span>
                  </div>
                </div>
              </div>
              
              {/* Contenu du site avec email */}
              <div className="bg-white w-full">
                {/* Image de bannière */}
                <div className="h-48 bg-gradient-to-r from-blue-400 to-teal-500 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Vue montagne" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Contenu du site */}
                <div className="p-6 bg-white">
                  {/* Interface email épurée */}
                  <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
                    {/* Champs d'en-tête */}
                    <div className="space-y-3 mb-4 border-b border-gray-100 pb-4">
                      <div className="flex items-center">
                        <div className="w-16 text-gray-500 text-sm">À :</div>
                        <div className="flex-1 text-gray-800">client@example.com</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 text-gray-500 text-sm">Objet :</div>
                        <div className="flex-1 text-gray-800">Confirmation de réservation</div>
                      </div>
                    </div>
                    
                    {/* Corps de l'email avec la signature */}
                    <div className="text-gray-800">
                      <p className="mb-4">Bonjour,</p>
                      <p className="mb-4">Nous vous confirmons votre réservation pour la Villa vue sur montagne.</p>
                      <p className="mb-4">N'hésitez pas à nous contacter pour toute information complémentaire.</p>
                      <p className="mb-4">Cordialement,</p>
                      
                      {/* Signature */}
                      <div className="border-t border-gray-200 pt-4">
                        <EmailSignaturePreview signature={signatureData} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};