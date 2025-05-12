import React from "react";
import { Checkbox, InfoBox } from "../../../ui";

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

interface InvoiceBankDetailsProps {
  userData: UserData;
  useBankDetails: boolean;
  setUseBankDetails: (value: boolean) => void;
  setCompanyInfo: (updater: (prev: any) => any) => void;
  onConfigureBankDetailsClick?: () => void;
}

export const InvoiceBankDetails: React.FC<InvoiceBankDetailsProps> = ({
  userData,
  useBankDetails,
  setUseBankDetails,
  setCompanyInfo,
  onConfigureBankDetailsClick,
}) => {
  return (
    <div className="mb-4 space-y-4 col-span-2">
      <div className="space-y-4">
        <InfoBox
          actionLink={{
            href: "#",
            label: "Configurer mes coordonnées bancaires",
            onClick: (e) => {
              e.preventDefault();
              if (onConfigureBankDetailsClick) {
                onConfigureBankDetailsClick();
              } else {
                window.location.href = "/profile?tab=company";
              }
            }
          }}
        >
          L'ajout de vos coordonnées bancaires sur vos factures facilite
          le paiement par vos clients. Vous pouvez configurer ces
          informations dans votre profil d'entreprise.
        </InfoBox>
        <div className="flex items-center justify-between w-full">
          <h4 className="text-lg font-medium">Coordonnées bancaires / RIB</h4>
        </div>

        <div className="flex items-center justify-between w-full">
          {userData?.me?.company?.bankDetails?.iban &&
            userData?.me?.company?.bankDetails?.bic &&
            userData?.me?.company?.bankDetails?.bankName &&
            userData?.me?.company?.bankDetails?.iban !== "" &&
            userData?.me?.company?.bankDetails?.bic !== "" &&
            userData?.me?.company?.bankDetails?.bankName !== "" && (
              <div className="flex items-center">
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
          <InfoBox
            variant="warning"
            actionLink={{
              href: "/profile?tab=company",
              label: "Configurer mes coordonnées bancaires"
            }}
          >
            Aucune coordonnée bancaire n'est enregistrée pour votre
            entreprise.
          </InfoBox>
        )}

        {useBankDetails && userData?.me?.company?.bankDetails && (
          <InfoBox variant="info">
            Les coordonnées bancaires de votre entreprise seront
            automatiquement ajoutées à la facture.
          </InfoBox>
        )}
      </div>
    </div>
  );
};
