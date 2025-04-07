import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { Button } from '../../ui';
import { formatDate } from '../../../utils/date';
import { QuoteInvoiceCreationModal } from './QuoteInvoiceCreationModal';
import { QuoteInvoiceProgress } from './QuoteInvoiceProgress';
import { useQuery } from '@apollo/client';
import { GET_QUOTE } from '../../../graphql/quotes';
import { QuotePreview } from '../../forms/quotes/QuotePreview';
import { Quote } from '../../../types';

interface Invoice {
  id: string;
  prefix: string;
  number: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
  finalTotalTTC?: number;
  isDeposit?: boolean;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit?: string;
  discount?: number;
  discountType?: string;
  details?: string;
}

// Type étendu pour inclure le statut CANCELED qui est utilisé dans l'interface mais pas dans le type Quote
type ExtendedQuoteStatus = Quote['status'] | 'CANCELED';

// Type étendu pour le devis dans la sidebar
type SidebarQuote = Omit<Quote, 'status'> & {
  status: ExtendedQuoteStatus;
  id: string;
  prefix: string;
  number: string;
  issueDate: string;
  totalHT: number;
  totalTTC: number;
  finalTotalHT: number;
  finalTotalTTC: number;
  client: {
    name: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  };
  convertedToInvoice?: {
    id: string;
    prefix: string;
    number: string;
    status: string;
  };
  linkedInvoices?: Invoice[];
};

interface QuoteSidebarProps {
  quote: SidebarQuote;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}

export const QuoteSidebar: React.FC<QuoteSidebarProps> = ({
  quote: initialQuote,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [isInvoiceCreationModalOpen, setIsInvoiceCreationModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  // État local pour stocker les données du devis mises à jour
  const [quote, setQuote] = useState(initialQuote);

  // Utiliser useQuery pour obtenir les données à jour du devis
  const { data, refetch } = useQuery(GET_QUOTE, {
    variables: { id: initialQuote?.id },
    skip: !initialQuote?.id || !isOpen,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // Mettre à jour l'état local lorsque les données du devis changent
  useEffect(() => {
    if (data?.quote) {
      setQuote(data.quote);
    }
  }, [data]);

  // Mettre à jour l'état local lorsque les props changent
  useEffect(() => {
    setQuote(initialQuote);
  }, [initialQuote]);

  const handleCreateInvoice = () => {
    setIsInvoiceCreationModalOpen(true);
  };

  const handleInvoiceCreated = useCallback(() => {
    // Forcer une récupération des données à jour depuis le serveur
    refetch().then(({ data }) => {
      if (data?.quote) {
        setQuote(data.quote);
      }
    });
  }, [refetch]);
  
  // Fonction pour basculer l'affichage de la prévisualisation
  const togglePreview = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  // Définir l'interface pour les actions de statut
  interface StatusAction {
    label: string;
    action: () => void;
    color: string;
    disabled?: boolean;
  }

  const getStatusActions = (): StatusAction[] => {
    if (!quote) return [];

    switch (quote.status) {
      case 'DRAFT':
        return [
          {
            label: 'Marquer comme envoyé',
            action: () => onStatusChange('PENDING'),
            color: 'purple'
          }
        ];
      case 'PENDING':
        return [
          {
            label: 'Marquer comme accepté',
            action: () => onStatusChange('COMPLETED'),
            color: 'green'
          },
        ];
      case 'COMPLETED': {
        // Vérifier si on peut encore créer des factures (max 3)
        const linkedInvoicesCount = quote.linkedInvoices?.length || 0;
        const canCreateMoreInvoices = linkedInvoicesCount < 3;
        
        return canCreateMoreInvoices ? [
          {
            label: linkedInvoicesCount === 0 ? 'Créer une facture' : 'Ajouter une facture',
            action: handleCreateInvoice,
            color: 'blue',
            disabled: false
          }
        ] : [];
      }
      case 'CANCELED':
        return [];
      default:
        return [];
    }
  };

  if (!quote) return null;

  const statusActions = getStatusActions();



  return (
    <>
      {/* Prévisualisation du devis */}
      {showPreview && (
        <div
          className={`fixed top-0 left-0 h-full w-[calc(100%-32rem)] bg-gray-50 z-[9999] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="h-full overflow-auto relative">
            <QuotePreview
              quote={{
                ...quote,
                status: quote.status === 'CANCELED' ? 'COMPLETED' : quote.status
              }}
            />
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isOpen}
        onClose={onClose}
        title={`Devis ${quote.prefix}${quote.number}`}
        width="w-[32rem]"
        position="right"
        actions={
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Statut</h3>
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                quote.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                quote.status === 'PENDING' ? 'bg-purple-100 text-purple-800' :
                quote.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {quote.status === 'DRAFT' ? 'Brouillon' :
                 quote.status === 'PENDING' ? 'En attente' :
                 quote.status === 'CANCELED' ? 'Annulé' :
                 'Accepté'}
              </span>
            </div>
          </div>

            {/* Progression des factures */}
            {quote.linkedInvoices && quote.linkedInvoices.length > 0 && (
              <QuoteInvoiceProgress
                quoteTotal={quote.finalTotalTTC}
                linkedInvoices={quote.linkedInvoices}
                quoteId={quote.id}
                refreshInterval={2000} // Rafraîchir toutes les 2 secondes
                key={`invoice-progress-${quote.linkedInvoices.length}`} // Forcer le remontage du composant quand le nombre de factures change
              />
            )}

          <div className="space-y-2 mt-2">
            {/* Vérifier si toutes les factures sont complétées et si le montant total est atteint */}
            {quote.linkedInvoices && quote.linkedInvoices.length > 0 && (
              (() => {
                const totalInvoiced = quote.linkedInvoices.reduce((sum, inv) => sum + (inv.finalTotalTTC || 0), 0);
                const remainingAmount = quote.finalTotalTTC - totalInvoiced;
                const isFullyPaid = quote.linkedInvoices.every(inv => inv.status === 'COMPLETED') && 
                                   Math.abs(remainingAmount) < 0.01; // Tolérance pour les erreurs d'arrondi
                const hasMaxInvoices = quote.linkedInvoices.length >= 3;
                
                if (isFullyPaid) {
                  return (
                    <Button
                      variant="outline"
                      color="green"
                      fullWidth
                      disabled={true}
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Payée
                      </span>
                    </Button>
                  );
                } else if (Math.abs(remainingAmount) < 0.01 || hasMaxInvoices) {
                  // Ne pas afficher les boutons si le reste à facturer est 0 ou si 3 factures sont déjà liées
                  return null;
                }
                
                // Sinon, afficher les boutons d'action normaux
                return statusActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    color={action.color}
                    fullWidth
                    onClick={action.action}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </Button>
                ));
              })()
            )}
            
            {/* Si pas de factures liées, afficher les boutons normaux */}
            {(!quote.linkedInvoices || quote.linkedInvoices.length === 0) && 
              statusActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  color={action.color}
                  fullWidth
                  onClick={action.action}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))
            }
          </div>
        </div>
          {quote.status !== 'COMPLETED' && quote.status !== 'CANCELED' && (
            <Button
              variant="outline"
              onClick={onEdit}
              fullWidth
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Modifier
            </Button>
          )}
          {quote.status === 'DRAFT' && (
            <Button
              variant="outline"
              color="red"
              onClick={onDelete}
              fullWidth
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Supprimer
            </Button>
          )}
          {quote.status === 'PENDING' && (
            <Button
              variant="outline"
              color="red"
              onClick={() => onStatusChange('CANCELED')}
              fullWidth
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Annuler
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Statut et actions */}


        {/* Informations générales */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Informations générales</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <dl>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Date d'émission</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(quote.issueDate)}
                </dd>
              </div>
              {quote.validUntil && (
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Valide jusqu'au</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(quote.validUntil)}
                  </dd>
                </div>
              )}
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Montant HT</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.totalHT?.toFixed(2) || '0.00'} €
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">TVA</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.totalVAT?.toFixed(2) || '0.00'} €
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Montant TTC</dt>
                <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.totalTTC?.toFixed(2) || '0.00'} €
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Client */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <dl>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Nom</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.client.name}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quote.client.email}
                </dd>
              </div>
              {quote.client.address && (
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {quote.client.address.street}<br />
                    {quote.client.address.postalCode} {quote.client.address.city}<br />
                    {quote.client.address.country}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Éléments du devis */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Éléments du devis</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {quote.items && quote.items.map((item: QuoteItem, index: number) => (
                <li key={index} className="px-4 py-3">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit || 'unité(s)'} x {item.unitPrice.toFixed(2)} € 
                        {item.discount && item.discount > 0 && ` (-${item.discount}${item.discountType === 'PERCENTAGE' ? '%' : '€'})`}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {((item.quantity * item.unitPrice) * (1 - (item.discountType === 'PERCENTAGE' && item.discount ? item.discount / 100 : 0))).toFixed(2)} €
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notes */}
        {(quote.headerNotes || quote.footerNotes || quote.termsAndConditions) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {quote.headerNotes && (
                <div className="px-4 py-3">
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">En-tête</h4>
                  <p className="text-sm text-gray-900">{quote.headerNotes}</p>
                </div>
              )}
              {quote.footerNotes && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Pied de page</h4>
                  <p className="text-sm text-gray-900">{quote.footerNotes}</p>
                </div>
              )}
              {quote.termsAndConditions && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Conditions générales</h4>
                  <p className="text-sm text-gray-900">{quote.termsAndConditions}</p>
                  {quote.termsAndConditionsLink && (
                    <a 
                      href={quote.termsAndConditionsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      {quote.termsAndConditionsLinkTitle || 'Voir les conditions générales'}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de création de facture */}
      <QuoteInvoiceCreationModal
        isOpen={isInvoiceCreationModalOpen}
        onClose={() => setIsInvoiceCreationModalOpen(false)}
        quoteId={quote.id}
        quoteTotal={quote.finalTotalTTC}
        linkedInvoices={quote.linkedInvoices}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </Sidebar>
    </>
  );
};
