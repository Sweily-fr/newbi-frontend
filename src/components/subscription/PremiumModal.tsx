import { Modal } from "../ui/Modal";
import {
  CheckCircleIcon,
  CreditCardIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
}

export const PremiumModal = ({ isOpen, onClose, onSubscribe }: PremiumModalProps) => {
  // Déterminer si nous sommes en mode production
  const isProduction = import.meta.env.MODE === 'production';
  
  // Utiliser la clé API publique depuis les variables d'environnement
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Utiliser l'ID de pricing table depuis les variables d'environnement
  const pricingTableId = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
  
  // État pour suivre si le script Stripe est chargé
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);

  // Charger le script Stripe dynamiquement
  useEffect(() => {
    if (isOpen && !isStripeLoaded) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;
      script.onload = () => setIsStripeLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        // Nettoyer si nécessaire
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen, isStripeLoaded]);

  // Afficher un message de debug en développement
  useEffect(() => {
    if (!isProduction) {
      console.log(`Stripe initialized in TEST mode with pricing table ID: ${pricingTableId}`);
    }
  }, [isProduction, pricingTableId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Passez à la version Premium"
      titleIcon={<CheckCircleIcon className="h-6 w-6 text-yellow-500" />}
      size="4xl"
      className="p-2"
    >
      <div className="p-0">
        {/* Avantages mis en avant et tableau de prix côte à côte */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="md:w-1/3 space-y-2">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex items-center">
              <div className="flex-shrink-0 mr-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm">21 jours gratuit</h3>
                <p className="text-xs text-blue-700">
                  Essayez sans frais pendant 21 jours
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-2 flex items-center">
              <div className="flex-shrink-0 mr-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-sm">Sans engagement</h3>
                <p className="text-xs text-green-700">
                  Résiliez à tout moment, sans frais
                </p>
              </div>
            </div>
            
            {/* Badge indiquant l'environnement en mode développement */}
            {!isProduction && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2">
                <p className="text-xs text-yellow-700 font-medium text-center">
                  Mode TEST - Aucun paiement réel ne sera effectué
                </p>
              </div>
            )}
          </div>
          
          {/* Tableau de prix Stripe */}
          <div className="md:w-2/3 border border-gray-200 rounded-lg p-6 bg-white">
            {/* Afficher le tableau de prix Stripe uniquement si le script est chargé et les variables d'environnement sont disponibles */}
            {isStripeLoaded && publishableKey && pricingTableId ? (
              <stripe-pricing-table
                pricing-table-id={pricingTableId}
                publishable-key={publishableKey}
              ></stripe-pricing-table>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
