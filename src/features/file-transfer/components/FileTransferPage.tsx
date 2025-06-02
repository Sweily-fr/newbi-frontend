import React, { useState } from 'react';
import { useMyFileTransfers, useDeleteFileTransfer } from '../hooks/useFileTransfer';
import { formatFileSize, formatExpiryDate } from '../utils/fileUtils';
import { FileTransfer } from '../types';
import FileTransferForm from './FileTransferForm';
import { ArrowRight, DocumentText, Link1, Trash, TickCircle } from 'iconsax-react';
import { logger } from '../../../utils/logger';

const FileTransferPage: React.FC = () => {
  const { loading, error, fileTransfers, refetch } = useMyFileTransfers();
  const { deleteTransfer, loading: deleteLoading } = useDeleteFileTransfer();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce transfert de fichiers ?')) {
      try {
        await deleteTransfer(id);
        await refetch();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transfert de fichiers</h1>
          <p className="text-gray-600 mt-1">
            Partagez des fichiers volumineux jusqu'à 100GB avec vos clients ou collaborateurs
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
        >
          {showForm ? 'Voir mes transferts' : 'Nouveau transfert'}
          <ArrowRight size="16" className="ml-2" />
        </button>
      </div>

      {showForm ? (
        <FileTransferForm />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-[#f0eeff]">
            <h2 className="text-xl font-semibold text-gray-900">Mes transferts de fichiers</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Une erreur est survenue lors du chargement de vos transferts.
            </div>
          ) : fileTransfers.length === 0 ? (
            <div className="p-12 text-center">
              <DocumentText size="48" color="#CBD5E0" variant="Bulk" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun transfert</h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore créé de transfert de fichiers.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
              >
                Créer mon premier transfert
                <ArrowRight size="16" className="ml-2" />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fichiers
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Taille
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date de création
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Expiration
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Téléchargements
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fileTransfers.map((transfer: FileTransfer) => (
                    <tr key={transfer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#f0eeff] rounded-full flex items-center justify-center">
                            <DocumentText size="20" color="#5b50ff" variant="Bulk" />
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(transfer.totalSize)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transfer.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatExpiryDate(transfer.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transfer.downloadCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => copyToClipboard(transfer.shareLink, transfer.accessKey, transfer.id)}
                            className="text-gray-600 hover:text-[#5b50ff] p-1 rounded-full hover:bg-[#f0eeff]"
                            title="Copier le lien"
                          >
                            {copiedId === transfer.id ? (
                              <TickCircle size="18" color="#10B981" variant="Bulk" />
                            ) : (
                              <Link1 size="18" />
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileTransferPage;
