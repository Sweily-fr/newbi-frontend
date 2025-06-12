import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT_SESSION_FOR_FILE_TRANSFER } from '../graphql/stripe-connect-mutations';
import { logger } from '../../../utils/logger';
import { ArrowRight, TickCircle, InfoCircle } from 'iconsax-react';
import { Button } from '../../../components/common/Button';
import { Spinner } from '../../../components/common/Spinner';

interface FileTransferPaymentCheckoutProps {
  transferId: string;
  amount: number;
  currency: string;
  fileName: string;
  fileSize: string;
  senderName: string;
  onPaymentSuccess: () => void;
}

export const FileTransferPaymentCheckout: React.FC<FileTransferPaymentCheckoutProps> = ({
  transferId,
  amount,
  currency,
  fileName,
  fileSize,
  senderName,
  onPaymentSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mutation pour créer une session de paiement Stripe Checkout
  const [createPaymentSession] = useMutation(CREATE_PAYMENT_SESSION_FOR_FILE_TRANSFER, {
    onCompleted: (data) => {
      if (data.createPaymentSessionForFileTransfer.success && data.createPaymentSessionForFileTransfer.sessionUrl) {
        // Rediriger vers la page de paiement Stripe Checkout
        window.location.href = data.createPaymentSessionForFileTransfer.sessionUrl;
      } else {
        setError(data.createPaymentSessionForFileTransfer.message || 'Une erreur est survenue lors de la création de la session de paiement');
        setIsLoading(false);
        logger.error('Erreur lors de la création de la session de paiement:', data.createPaymentSessionForFileTransfer.message);
      }
    },
    onError: (error) => {
      setError('Une erreur est survenue lors de la création de la session de paiement');
      setIsLoading(false);
      logger.error('Erreur lors de la création de la session de paiement:', error);
    }
  });

  // Vérifier si le paiement a été effectué (via query param après redirection de Stripe)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      onPaymentSuccess();
    }
  }, [onPaymentSuccess]);

  const handlePaymentClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await createPaymentSession({
        variables: {
          transferId
        }
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la création de la session de paiement');
      setIsLoading(false);
      logger.error('Erreur lors de la création de la session de paiement:', err);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement requis pour accéder aux fichiers</h2>
        <p className="text-gray-600">
          {senderName} demande un paiement pour accéder à ce transfert de fichiers
        </p>
      </div>

      <div className="bg-[#f0eeff] rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <InfoCircle size="24" color="#5b50ff" variant="Bold" className="mr-2" />
          <h3 className="font-medium text-gray-800">Détails du transfert</h3>
        </div>
        <div className="pl-8">
          <p className="text-gray-700 mb-1"><span className="font-medium">Nom du fichier:</span> {fileName}</p>
          <p className="text-gray-700 mb-1"><span className="font-medium">Taille:</span> {fileSize}</p>
          <p className="text-gray-700 mb-1"><span className="font-medium">Expéditeur:</span> {senderName}</p>
          <p className="text-gray-700 font-medium mt-3">
            Montant à payer: <span className="text-[#5b50ff] text-lg">{formatCurrency(amount, currency)}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handlePaymentClick}
          disabled={isLoading}
          className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white py-3 px-6 rounded-full flex items-center justify-center transition-all"
        >
          {isLoading ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <>
              Payer maintenant
              <ArrowRight size="20" className="ml-2" />
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="flex items-center justify-center">
          <TickCircle size="16" color="#5b50ff" className="mr-1" />
          Paiement sécurisé via Stripe
        </p>
      </div>
    </div>
  );
};
