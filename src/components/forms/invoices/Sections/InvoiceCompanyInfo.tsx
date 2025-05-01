import React from 'react';

interface CompanyAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  siret: string;
  vatNumber: string;
  logo?: string;
  address: CompanyAddress;
}

interface UserData {
  me?: {
    company?: {
      name?: string;
      email?: string;
      phone?: string;
      website?: string;
      siret?: string;
      vatNumber?: string;
      logo?: string;
      address?: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
      };
    };
  };
}

interface InvoiceCompanyInfoProps {
  companyInfo: CompanyInfo;
  userData: UserData;
  apiUrl: string;
  onConfigureInfoClick?: () => void;
  setCompanyInfo?: (companyInfo: CompanyInfo) => void;
}

export const InvoiceCompanyInfo: React.FC<InvoiceCompanyInfoProps> = ({
  companyInfo,
  userData,
  apiUrl,
  onConfigureInfoClick,
  setCompanyInfo
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (onConfigureInfoClick) {
              onConfigureInfoClick();
            } else {
              window.location.href = "/profile?tab=company";
            }
          }} 
          className="text-sm text-[#5b50ff] hover:underline"
        >
          Configurer mes informations
        </a>
      </div>

      {!userData?.me?.company ? (
        <div className="text-center py-8 px-4">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Informations d'entreprise manquantes</h3>
          <p className="text-sm text-gray-500 mb-6">
            Vous devez configurer les informations de votre entreprise avant de pouvoir créer une facture.
            Ces informations seront automatiquement ajoutées à toutes vos factures.
          </p>
          <a
            href="/account"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.533 1.533 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Configurer mes informations
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Logo de l'entreprise */}
          <div className="mb-4 flex justify-center">
            {companyInfo.logo ? (
              <div className="relative rounded-full overflow-hidden w-32 h-32">
                <img
                  src={`${import.meta.env.VITE_API_URL}${companyInfo.logo}`}
                  alt="Logo de l'entreprise"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-md">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Informations principales */}
          <div className="space-y-4">
            {/* Informations de base */}
            <div className="mb-4">
              <div className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise*</div>
              <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                {companyInfo.name || ''}
              </div>
            </div>

            <div className="mb-4">
              <div className="block text-sm font-medium text-gray-700 mb-2">Adresse e-mail*</div>
              <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                {companyInfo.email || ''}
              </div>
            </div>

            <div className="mb-4">
              <div className="block text-sm font-medium text-gray-700 mb-2">SIRET*</div>
              <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                {companyInfo.siret || ''}
              </div>
            </div>
            
            {/* Champs optionnels */}
            {companyInfo.phone && (
              <div className="mb-4">
                <div className="block text-sm font-medium text-gray-700 mb-2">Téléphone</div>
                <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                  {companyInfo.phone}
                </div>
              </div>
            )}
            
            {companyInfo.website && (
              <div className="mb-4">
                <div className="block text-sm font-medium text-gray-700 mb-2">Site web</div>
                <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                  {companyInfo.website}
                </div>
              </div>
            )}
            
            {companyInfo.vatNumber && (
              <div className="mb-4">
              <div className="block text-sm font-medium text-gray-700 mb-2">Numéro de TVA (optionnel)</div>
              <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                {companyInfo.vatNumber || ''}
              </div>
            </div>
            )}
            
            {/* Adresse de l'entreprise */}
            <div className="mb-4">
              <h4 className="text-md font-medium mb-3">Adresse de l'entreprise</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Rue*</div>
                  <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                    {companyInfo.address?.street || ''}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Ville*</div>
                  <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                    {companyInfo.address?.city || ''}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Code postal*</div>
                  <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                    {companyInfo.address?.postalCode || ''}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Pays*</div>
                  <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-base text-gray-500">
                    {companyInfo.address?.country || ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
