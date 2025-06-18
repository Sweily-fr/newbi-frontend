import { useState, useEffect } from "react";
import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import { Expense, CreateExpenseInput, UpdateExpenseInput, OCRMetadata } from "../../types";
import { useExpenses } from "../../hooks/useExpenses";
import { ExpenseFileUpload, ExpenseOCRPreview } from "../index";
import {
  Receipt2,
  Calendar,
  Money,
  Bank,
  DocumentText as FileText,
  PercentageSquare as Percent,
} from "iconsax-react";

// Styles définis avec Tailwind CSS directement dans les composants

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onSuccess?: () => void;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSuccess,
}) => {
  const { createExpense, updateExpense } = useExpenses();

  const [formData, setFormData] = useState<
    Omit<CreateExpenseInput, "id" | "userId">
  >({
    title: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    documentNumber: "",
    accountingAccount: "606900", // Compte par défaut "Autres achats"
    vatAmount: 0,
    vatRate: 20, // Taux par défaut à 20%
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showOCRPreview, setShowOCRPreview] = useState<boolean>(false);

  // Fonction utilitaire pour formater une date de manière sécurisée
  const formatDateSafely = (dateString: string): string => {
    try {
      // Essayer de parser la date
      const date = new Date(dateString);
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        // Si la date est invalide, retourner la date du jour
        return new Date().toISOString().split("T")[0];
      }
      
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      // En cas d'erreur, retourner la date du jour
      return new Date().toISOString().split("T")[0];
    }
  };

  // Initialiser le formulaire avec les données de la dépense si elle existe
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount,
        date: formatDateSafely(expense.date),
        vendor: expense.vendor || "",
        documentNumber: expense.documentNumber || "",
        accountingAccount: expense.accountingAccount || "606900",
        vatAmount: expense.vatAmount || 0,
        vatRate: expense.vatRate || 20,
      });

      if (expense.ocrMetadata) {
        setShowOCRPreview(true);
      }
    } else {
      // Réinitialiser le formulaire pour une nouvelle dépense
      setFormData({
        title: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        vendor: "",
        documentNumber: "",
        accountingAccount: "606900",
        vatAmount: 0,
        vatRate: 20,
      });
    }
  }, [expense]);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) {
      newErrors.title = "Le libellé est requis";
    }

    if (formData.amount === undefined || formData.amount === null) {
      newErrors.amount = "Le montant est requis";
    } else if (formData.amount <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0";
    }

    if (!formData.date) {
      newErrors.date = "La date est requise";
    }

    if (!formData.vendor) {
      newErrors.vendor = "Le nom du fournisseur est requis";
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = "Le numéro de pièce justificative est requis";
    }

    if (!formData.accountingAccount) {
      newErrors.accountingAccount = "Le compte comptable est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (expense?.id) {
        // Maintenant que le backend accepte documentNumber et accountingAccount, nous les incluons dans la mise à jour
        const updateData = { ...formData };
        
        // Vérifier si updateData contient au moins un champ à mettre à jour
        if (Object.keys(updateData).length === 0) {
          setErrors(prev => ({ ...prev, submit: "Aucune modification détectée. Veuillez modifier au moins un champ." }));
          setLoading(false);
          return;
        }
        
        await updateExpense(expense.id, updateData as UpdateExpenseInput);
      } else {
        // Pour la création, on peut exclure certains champs si nécessaire
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { documentNumber, accountingAccount, ...submissionData } = formData;
        await createExpense(submissionData as CreateExpenseInput);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "Une erreur est survenue lors de l'enregistrement",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Suppression de l'interface OCRData redondante
  // Utilisation de l'interface OCRMetadata existante

  // Cette fonction sera utilisée dans une future implémentation pour appliquer les données OCR
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApplyOCRData = (ocrData: Partial<OCRMetadata>) => {
    if (!ocrData) return;

    setFormData((prev) => ({
      ...prev,
      title: ocrData.vendorName || prev.title,
      amount: ocrData.totalAmount || prev.amount,
      date: ocrData.invoiceDate
        ? new Date(ocrData.invoiceDate).toISOString().split("T")[0]
        : prev.date,
      vendor: ocrData.vendorName || prev.vendor,
      documentNumber: ocrData.invoiceNumber || prev.documentNumber,
      vatAmount: ocrData.vatAmount || prev.vatAmount,
      vatRate:
        ocrData.vatAmount && ocrData.totalAmount
          ? Math.round(
              (ocrData.vatAmount / (ocrData.totalAmount - ocrData.vatAmount)) *
                100
            )
          : prev.vatRate,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? "Modifier la dépense" : "Nouvelle dépense"}
      size="2xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              Libellé de la dépense*
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Libellé de la dépense"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                Montant TTC*
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00 €"
                value={formData.amount}
                onChange={(e) =>
                  handleChange("amount", parseFloat(e.target.value) || 0)
                }
                error={errors.amount}
                className="w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                Date de la dépense *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                error={errors.date}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              Nom du fournisseur *
            </label>
            <Input
              id="vendor"
              name="vendor"
              placeholder="Ex: Fournisseur SARL"
              value={formData.vendor}
              onChange={(e) => handleChange("vendor", e.target.value)}
              error={errors.vendor}
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              Numéro de pièce justificative *
            </label>
            <Input
              id="documentNumber"
              name="documentNumber"
              placeholder="Ex: FACT-2023-001"
              value={formData.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              error={errors.documentNumber}
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              Compte comptable d'affectation *
            </label>
            <Select
              id="accountingAccount"
              name="accountingAccount"
              value={formData.accountingAccount}
              onChange={(e: string | React.ChangeEvent<HTMLSelectElement>) => {
                // Extraire la valeur directement de l'événement ou de l'objet
                const selectedValue = typeof e === 'string' ? e : 
                                      e && e.target ? e.target.value : 
                                      '606900';
                handleChange("accountingAccount", selectedValue);
              }}
              // Forcer la valeur à être une chaîne pour éviter les problèmes avec l'objet event
              options={[
                { value: "606100", label: "606100 - Achats de fournitures" },
                {
                  value: "606200",
                  label: "606200 - Achats de services extérieurs",
                },
                { value: "606300", label: "606300 - Achats de matériel" },
                {
                  value: "606400",
                  label: "606400 - Achats de prestations intellectuelles",
                },
                { value: "606500", label: "606500 - Achats de sous-traitance" },
                {
                  value: "606600",
                  label:
                    "606600 - Achats non stockés de matières et fournitures",
                },
                { value: "606700", label: "606700 - Achats de marchandises" },
                {
                  value: "606800",
                  label: "606800 - Achats de matières premières",
                },
                { value: "606900", label: "606900 - Autres achats" },
              ]}
              error={errors.accountingAccount}
              className="w-full"
            />
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              Taux de TVA (%)
            </label>
            <Input
              id="vatRate"
              name="vatRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="20,0"
              value={formData.vatRate || ""}
              onChange={(e) =>
                handleChange(
                  "vatRate",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700 flex items-center gap-2">
              Montant TVA (€)
            </label>
            <Input
              id="vatAmount"
              name="vatAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.vatAmount || ""}
              onChange={(e) =>
                handleChange(
                  "vatAmount",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-gray-700">
              Date de paiement
            </label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleChange("paymentDate", e.target.value)}
              disabled={formData.status !== "PAID"}
              placeholder="Sélectionner une date"
              className="w-full"
            />
          </div>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm mt-1">{errors.submit}</p>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} isLoading={loading}>
            {expense ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpenseFormModal;
