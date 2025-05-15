import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUOTE } from '../../graphql/quotes';
import { Notification } from '../../../../components/';
import { Chart, DocumentText, TickCircle, Receipt21, ArrowRight2 } from 'iconsax-react';

interface Invoice {
  id: string;
  prefix: string;
  number: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
  finalTotalTTC?: number;
  isDeposit?: boolean;
}

interface QuoteInvoiceProgressProps {
  quoteTotal: number;
  linkedInvoices?: Invoice[];
  quoteId?: string;
  refreshInterval?: number;
}

export const QuoteInvoiceProgress: React.FC<QuoteInvoiceProgressProps> = ({
  quoteTotal,
  linkedInvoices: initialLinkedInvoices = [],
  quoteId,
  refreshInterval = 2000 // 2 secondes par défaut
}) => {
  // État pour contrôler l'affichage du contenu
  const [isContentVisible, setIsContentVisible] = useState(true);
  // Utiliser useQuery pour récupérer les données du devis en temps réel
  const { data, refetch, startPolling, stopPolling } = useQuery(GET_QUOTE, {
    variables: { id: quoteId },
    skip: !quoteId,
    fetchPolicy: 'network-only', // Forcer la récupération depuis le réseau à chaque fois
    notifyOnNetworkStatusChange: true, // Important pour détecter les changements de statut réseau
    onError: (error) => {
      console.error('Erreur lors de la récupération des données du devis:', error);
      Notification.error('Erreur lors de la mise à jour des factures liées', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
  });
  
  // Utiliser directement les données du serveur si disponibles, sinon utiliser les props initiales
  const linkedInvoices = data?.quote?.linkedInvoices || initialLinkedInvoices;
  
  // Forcer un rafraîchissement immédiat lors du montage du composant
  useEffect(() => {
    if (quoteId) {
      refetch();
    }
  }, [quoteId, refetch]);
  
  // Démarrer le polling lorsque le composant est monté
  useEffect(() => {
    if (quoteId) {
      startPolling(refreshInterval);
      
      // Force un premier rafraîchissement immédiat
      refetch();
      
      return () => {
        stopPolling();
      };
    }
    
    return undefined;
  }, [quoteId, refreshInterval, startPolling, stopPolling, refetch]);
  // Calculer le montant total des factures
  const invoicedAmount = linkedInvoices.reduce((sum: number, invoice: Invoice) => sum + (invoice.finalTotalTTC || 0), 0);
  
  // Calculer le pourcentage facturé
  const invoicedPercentage = (invoicedAmount / quoteTotal) * 100;
  
  // Calculer le montant et le pourcentage restants
  const remainingAmount = quoteTotal - invoicedAmount;
  const remainingPercentage = 100 - invoicedPercentage;

  // Filtrer les factures terminées (COMPLETED)
  const completedInvoices = linkedInvoices.filter((invoice: Invoice) => invoice.status === 'COMPLETED');
  const completedAmount = completedInvoices.reduce((sum: number, invoice: Invoice) => sum + (invoice.finalTotalTTC || 0), 0);
  const completedPercentage = (completedAmount / quoteTotal) * 100;

  return (
    <div className="bg-white rounded-lg border border-[#e6e1ff] overflow-hidden">
      <div className="px-4 py-3 bg-[#f0eeff] border-b border-[#e6e1ff]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#5b50ff] flex items-center">
            <Chart size="18" color="#5b50ff" variant="Bold" className="mr-4 text-[#5b50ff]" />
            Progression de facturation
          </h3>
          <span 
            className="text-xs font-medium bg-white text-[#5b50ff] px-3 py-1 rounded-full shadow-sm border border-[#e6e1ff] cursor-pointer hover:bg-[#f0eeff] transition-all duration-300"
            onClick={() => setIsContentVisible(!isContentVisible)}
          >
            {isContentVisible ? "Masquer" : "Afficher"}
          </span>
        </div>
      </div>
      
      {isContentVisible && (
        <div className="p-4 space-y-4 transition-all duration-300">
        {/* Barre de progression */}
        <div className="group">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600 flex items-center font-medium">
              <DocumentText size="14" color="#5b50ff" variant="Bold" className="mr-1.5 text-[#5b50ff]" />
              Facturé
            </span>
            <span className="text-xs font-medium text-[#5b50ff] bg-[#f0eeff] px-2 py-0.5 rounded-full transition-all duration-300 group-hover:bg-[#e6e1ff] inline-block whitespace-nowrap">
              {invoicedPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#f0eeff] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5b50ff] rounded-full transition-all duration-500 ease-in-out shadow-inner"
              style={{ width: `${invoicedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Barre de progression des factures terminées */}
        <div className="group">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600 flex items-center font-medium">
              <TickCircle size="14" color="#5b50FF" variant="Bold" className="mr-1.5 text-[#4a41e0]" />
              Encaissé
            </span>
            <span className="text-xs font-medium text-[#4a41e0] bg-[#f0eeff] px-2 py-0.5 rounded-full transition-all duration-300 group-hover:bg-[#e6e1ff] inline-block whitespace-nowrap">
              {completedPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#f0eeff] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4a41e0] rounded-full transition-all duration-500 ease-in-out shadow-inner"
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Informations sur les montants */}
        <div className="pt-4 border-t border-[#f0eeff] space-y-2.5">
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-600 flex items-center">
              <Receipt21 size="16" color="#5b50FF" className="mr-1.5 text-gray-500" />
              Montant total :
            </span>
            <span className="font-medium text-gray-800 bg-[#f0eeff] px-2.5 py-1 rounded-lg">{quoteTotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-600">Montant facturé :</span>
            <span className="font-medium text-[#5b50ff]">{invoicedAmount.toFixed(2)} € <span className="text-xs px-1.5 py-0.5 rounded-full ml-1 inline-block whitespace-nowrap">({invoicedPercentage.toFixed(1)}%)</span></span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-600">Montant encaissé :</span>
            <span className="font-medium text-[#4a41e0]">{completedAmount.toFixed(2)} € <span className="text-xs px-1.5 py-0.5 rounded-full ml-1 inline-block whitespace-nowrap">({completedPercentage.toFixed(1)}%)</span></span>
          </div>
          <div className="flex justify-between text-sm rounded-lg mt-3">
            <span className="text-gray-700 font-medium">Reste à facturer :</span>
            <span className="font-medium text-gray-800">{remainingAmount.toFixed(2)} € <span className="text-xs bg-white px-1.5 py-0.5 rounded-full ml-1 text-[#5b50ff] inline-block whitespace-nowrap">({remainingPercentage.toFixed(1)}%)</span></span>
          </div>
        </div>

        {/* Liste des factures liées */}
        {linkedInvoices.length > 0 && (
          <div className="pt-4 border-t border-[#f0eeff]">
            <h4 className="text-xs font-medium text-[#5b50ff] mb-3 flex items-center">
              <DocumentText size="16" color="#5b50ff" variant="Bold" className="mr-1.5 text-[#5b50ff]" />
              Factures liées
            </h4>
            <ul className="space-y-3">
              {linkedInvoices.map((invoice: Invoice) => (
                <li key={invoice.id} className="flex justify-between items-center text-sm p-2.5 rounded-lg hover:bg-[#f0eeff] transition-all duration-300 border border-transparent hover:border-[#e6e1ff] cursor-pointer group">
                  <div className="flex items-center">
                    <div className="mr-3 w-8 h-8 rounded-full bg-[#e6e1ff] flex items-center justify-center transition-all duration-300">
                      {invoice.status === 'COMPLETED' ? (
                        <TickCircle size="16" color="#4a41e0" variant="Bold" className="text-[#4a41e0] group-hover:text-white" />
                      ) : (
                        <Receipt21 size="16" color="#5b50ff" variant="Bold" className="text-[#5b50ff] group-hover:text-white" />
                      )}
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium group-hover:text-[#5b50ff] transition-colors duration-300">
                        {invoice.isDeposit ? "Acompte" : "Facture"} {invoice.prefix}{invoice.number}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full inline-flex items-center whitespace-nowrap ${
                        invoice.status === 'COMPLETED' ? 'bg-[#e6fff0] text-[#00c853] border border-[#a0ffc8]' :
                        invoice.status === 'PENDING' ? 'bg-[#fff8e6] text-[#e6a700] border border-[#ffe7a0]' :
                        'bg-[#f0eeff] text-[#5b50ff] border border-[#e6e1ff]'
                      }`}>
                        {invoice.status === 'DRAFT' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse"></span>}
                        {invoice.status === 'COMPLETED' ? 'Terminée' :
                        invoice.status === 'PENDING' ? 'À encaisser' :
                        'Brouillon'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">
                      {invoice.finalTotalTTC?.toFixed(2)} €
                    </span>
                    <ArrowRight2 size="16" color="#5b50ff" className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      )}
    </div>
  );
};
