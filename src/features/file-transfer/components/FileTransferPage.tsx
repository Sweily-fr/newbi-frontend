import React, { useState, useEffect } from 'react';
import { useMyFileTransfers, useDeleteFileTransfer } from '../hooks/useFileTransfer';
import { formatFileSize, formatExpiryDate } from '../utils/fileUtils';
import { FileTransfer } from '../types';
import FileTransferForm from './FileTransferForm';
import { ArrowRight, DocumentText, Link1, Trash, TickCircle, RefreshCircle } from 'iconsax-react';
import { logger } from '../../../utils/logger';
import { Table } from '../../../components/common/Table';

const FileTransferPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const { loading, error, fileTransfers, pagination, refetch } = useMyFileTransfers(currentPage, itemsPerPage);
  const { deleteTransfer, loading: deleteLoading } = useDeleteFileTransfer();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Rafraîchir automatiquement les données au chargement du composant
  useEffect(() => {
    handleRefresh();
    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fonction pour rafraîchir les données
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch(currentPage, itemsPerPage);
    } catch (err) {
      logger.error('Erreur lors du rafraîchissement des données:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce transfert de fichiers ?')) {
      try {
        await deleteTransfer(id);
        await refetch(currentPage, itemsPerPage);
      } catch (err) {
        logger.error('Erreur lors de la suppression du transfert:', err);
      }
    }
  };

  const copyToClipboard = (shareLink: string, accessKey: string, id: string) => {
    const fullLink = `${window.location.origin}/file-transfer/download?link=${shareLink}&key=${accessKey}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // Gestion du changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Gestion du changement du nombre d'éléments par page
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Revenir à la première page lors du changement d'items par page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transfert de fichiers</h1>
          <p className="text-gray-600 mt-1">
            Partagez des fichiers volumineux jusqu'à 100GB avec vos clients ou collaborateurs
          </p>
        </div>
        <div className="flex space-x-2">
          {!showForm && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              title="Rafraîchir"
            >
              <RefreshCircle 
                size="16" 
                color={isRefreshing ? '#5b50ff' : '#6b7280'}
                className={`${isRefreshing ? 'animate-spin' : ''}`} 
              />
              <span className="ml-1">Rafraîchir</span>
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
          >
            {showForm ? 'Voir mes transferts' : 'Nouveau transfert'}
            <ArrowRight size="16" className="ml-2" color="#ffffff" />
          </button>
        </div>
      </div>

      {showForm ? (
        <FileTransferForm />
      ) : (
        loading && fileTransfers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-[#5b50ff] border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-gray-500">Chargement des transferts...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 text-center text-red-500">
            Une erreur est survenue lors du chargement des transferts.
          </div>
        ) : (
          <Table
            columns={[
              {
                header: 'Fichiers',
                accessor: (transfer: FileTransfer) => (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#f0eeff] rounded-lg">
                      <DocumentText size="20" variant="Bulk" color="#5b50ff" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transfer.files.length} fichier{transfer.files.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {transfer.files.map(f => f.originalName).join(', ')}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Taille',
                accessor: (transfer: FileTransfer) => formatFileSize(transfer.totalSize),
              },
              {
                header: 'Date de création',
                accessor: (transfer: FileTransfer) => new Date(transfer.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }),
              },
              {
                header: 'Expiration',
                accessor: (transfer: FileTransfer) => formatExpiryDate(transfer.expiryDate),
              },
              {
                header: 'Statut',
                accessor: (transfer: FileTransfer) => (
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transfer.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : transfer.status === 'EXPIRED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transfer.status === 'ACTIVE'
                      ? 'Actif'
                      : transfer.status === 'EXPIRED'
                      ? 'Expiré'
                      : 'Supprimé'}
                  </span>
                ),
              },
              {
                header: 'Téléchargements',
                accessor: 'downloadCount',
              },
              {
                header: 'Actions',
                accessor: (transfer: FileTransfer) => (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => copyToClipboard(transfer.shareLink, transfer.accessKey, transfer.id)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-[#5b50ff] bg-[#f0eeff] hover:bg-[#e6e1ff] border border-[#e6e1ff]"
                      title="Copier le lien"
                    >
                      {copiedId === transfer.id ? (
                        <>
                          <TickCircle size="16" color="#10B981" variant="Bulk" className="mr-1" />
                          <span className="text-green-600">Copié</span>
                        </>
                      ) : (
                        <>
                          <Link1 size="16" className="mr-1" color="#5b50ff" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(transfer.id)}
                      disabled={deleteLoading}
                      className="text-gray-600 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash size="18" />
                    </button>
                  </div>
                ),
                align: 'right',
              },
            ]}
            data={fileTransfers}
            keyExtractor={(transfer) => transfer.id}
            emptyState={{
              icon: <DocumentText size="24" variant="Bulk" color="#5b50ff" />,
              title: "Aucun transfert de fichiers",
              description: "Vous n'avez pas encore de transferts de fichiers.",
            }}
            pagination={{
              currentPage: pagination.currentPage,
              totalItems: pagination.totalItems,
              itemsPerPage: itemsPerPage,
              onPageChange: handlePageChange,
              rowsPerPageOptions: [5, 10, 25, 50],
              onItemsPerPageChange: handleItemsPerPageChange,
              hasNextPage: pagination.hasNextPage
            }}
            className="rounded-xl"
          />
        )
      )}
    </div>
  );
};

export default FileTransferPage;
