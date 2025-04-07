import { Modal } from "../ui/Modal";
import {
  CheckCircleIcon,
  CreditCardIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
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
                <h3 className="font-semibold text-blue-800 text-sm">1er mois gratuit</h3>
                <p className="text-xs text-blue-700">
                  Essayez sans frais pendant 30 jours
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
          </div>
          
          {/* Tableau de prix Stripe */}
          <div className="md:w-2/3 border border-gray-200 rounded-lg p-6 bg-gray-900">
            <script
              async
              src="https://js.stripe.com/v3/pricing-table.js"
            ></script>
            <stripe-pricing-table
              pricing-table-id="prctbl_1R6D71KC7DkMHAp8DWBdSVEf"
              publishable-key="pk_test_51R6BRsKC7DkMHAp8CVLAisyHcc8bCT7HhHgWLj4MtuXmxRRMbw21UYZk9BUW2fIncGJ27YfpiskRCHZRvN8qKRTw00JlD22r3x"
            ></stripe-pricing-table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
