import React from "react";
import { Checkbox } from "../../../../../components/";
import { Bank, InfoCircle, Warning2 } from "iconsax-react";

interface UserData {
  me?: {
    company?: {
      bankDetails?: {
        iban?: string;
        bic?: string;
        bankName?: string;
      };
    };
  };
}

interface CompanyInfo {
  bankDetails?: {
    iban?: string;
    bic?: string;
    bankName?: string;
  };
  [key: string]: unknown;
}

interface InvoiceBankDetailsProps {
  userData: UserData;
  useBankDetails: boolean;
  setUseBankDetails: (value: boolean) => void;
  setCompanyInfo: (updater: (prev: CompanyInfo) => CompanyInfo) => void;
  onConfigureBankDetailsClick?: () => void;
  documentType?: 'facture' | 'devis';
}

export const InvoiceBankDetails: React.FC<InvoiceBankDetailsProps> = ({
  userData,
  useBankDetails,
  setUseBankDetails,
  setCompanyInfo,
  onConfigureBankDetailsClick,
  documentType = 'facture',
}) => {
  return (
    <div className="mb-6 col-span-2">
      <div className="space-y-6">
        <div className="flex items-start gap-2 p-4 bg-[#f9f8ff] border border-[#5b50ff]/20 rounded-2xl">
          <InfoCircle size="20" color="#5b50ff" variant="Linear" className="mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">
              L'ajout de vos coordonnées bancaires sur vos factures facilite
              le paiement par vos clients. Vous pouvez configurer ces
              informations dans votre profil d'entreprise.
            </p>
            <a
              href="#"
              className="text-sm font-medium text-[#5b50ff] hover:text-[#4a41e0] underline"
              onClick={(e) => {
                e.preventDefault();
                if (onConfigureBankDetailsClick) {
                  onConfigureBankDetailsClick();
                } else {
                  window.location.href = "/profile?tab=company";
                }
              }}
            >
              Configurer mes coordonnées bancaires
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2 text-[#5b50ff]">
              <Bank size="20" color="#5b50ff" variant="Linear" />
            </span>
            Coordonnées bancaires / RIB
          </h3>
          <hr className="border-t border-gray-200 mb-4" />
        </div>

        <div className="mb-4">
          {userData?.me?.company?.bankDetails?.iban &&
            userData?.me?.company?.bankDetails?.bic &&
            userData?.me?.company?.bankDetails?.bankName &&
            userData?.me?.company?.bankDetails?.iban !== "" &&
            userData?.me?.company?.bankDetails?.bic !== "" &&
            userData?.me?.company?.bankDetails?.bankName !== "" && (
              <div className="flex items-center p-3 bg-[#f0eeff] rounded-lg">
                <Checkbox
                  id="useBankDetails"
                  name="useBankDetails"
                  label="Inclure les coordonnées bancaires"
                  checked={useBankDetails}
                  onChange={(e) => {
                    setUseBankDetails(e.target.checked);
                    if (!e.target.checked) {
                      // Toujours vider les champs quand on décoche
                      setCompanyInfo((prev) => ({
                        ...prev,
                        bankDetails: undefined,
                      }));
                    } else if (userData?.me?.company?.bankDetails) {
                      // Ajouter les coordonnées bancaires seulement si elles existent
                      const { ...bankDetails } =
                        userData.me.company.bankDetails;
                      setCompanyInfo((prev) => ({
                        ...prev,
                        bankDetails,
                      }));
                    }
                  }}
                  disabled={!userData?.me?.company?.bankDetails}
                />
              </div>
            )}
        </div>

        {(!userData?.me?.company?.bankDetails ||
          !userData?.me?.company?.bankDetails?.iban ||
          !userData?.me?.company?.bankDetails?.bic ||
          !userData?.me?.company?.bankDetails?.bankName ||
          userData?.me?.company?.bankDetails?.iban === "" ||
          userData?.me?.company?.bankDetails?.bic === "" ||
          userData?.me?.company?.bankDetails?.bankName === "") && (
          <div className="flex items-start gap-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <Warning2 size="20" color="#f59e0b" variant="Linear" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700 mb-2">
                Aucune coordonnée bancaire n'est enregistrée pour votre
                entreprise.
              </p>
              <a
                href="/profile?tab=company"
                className="text-sm font-medium text-yellow-700 hover:text-yellow-800 underline"
              >
                Configurer mes coordonnées bancaires
              </a>
            </div>
          </div>
        )}

        {useBankDetails && userData?.me?.company?.bankDetails && (
          <div className="flex items-start gap-2 p-4 bg-[#f9f8ff] rounded-2xl border border-[#5b50ff]/20">
            <InfoCircle size="20" color="#5b50ff" variant="Linear" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Les coordonnées bancaires de votre entreprise seront
                automatiquement ajoutées {documentType === 'facture' ? 'à la facture' : 'au devis'}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
