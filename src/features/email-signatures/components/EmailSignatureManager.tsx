import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMAIL_SIGNATURES } from '../../../graphql/emailSignatures';
import { Notification } from '../../../components/common/Notification';
import { useNavigate } from 'react-router-dom';
import { EmailSignature } from '../types';

/**
 * Composant principal pour la gestion des signatures de mail
 * Ce composant affiche la liste des signatures et permet d'accéder aux fonctionnalités de création/édition
 */
export const EmailSignatureManager: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Récupérer la liste des signatures
  const { loading, error, data } = useQuery(GET_EMAIL_SIGNATURES, {
    variables: {
      page: currentPage,
      limit: 10,
      search: searchTerm
    },
    fetchPolicy: 'network-only' // Toujours récupérer les données fraîches
  });
  
  // Gérer les erreurs de chargement
  if (error) {
    Notification.error(`Erreur lors du chargement des signatures: ${error.message}`);
  }
  
  // Extraire les données des signatures
  const signatures = data?.emailSignatures?.signatures || [];
  const totalCount = data?.emailSignatures?.totalCount || 0;
  const hasNextPage = data?.emailSignatures?.hasNextPage || false;
  
  // Fonction pour naviguer vers la page de création de signature
  const handleCreateSignature = () => {
    navigate('/email-signatures/new');
  };
  
  // Fonction pour naviguer vers la page d'édition de signature
  const handleEditSignature = (signature: EmailSignature) => {
    navigate(`/email-signatures/edit/${signature.id}`);
  };
  
  // Fonction pour gérer la pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  // Fonction pour gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser la pagination lors d'une recherche
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Signatures de mail</h1>
        <button
          onClick={handleCreateSignature}
          className="px-4 py-2 bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-md transition-colors duration-200"
        >
          Créer une signature
        </button>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une signature..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      
      {/* Tableau des signatures */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
          </div>
        ) : signatures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune signature trouvée</p>
            <button
              onClick={handleCreateSignature}
              className="mt-4 px-4 py-2 bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-md transition-colors duration-200"
            >
              Créer votre première signature
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Par défaut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {signatures.map((signature: EmailSignature) => (
                <tr key={signature.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{signature.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{signature.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{signature.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{signature.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {signature.isDefault ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Par défaut
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditSignature(signature)}
                      className="text-[#5b50ff] hover:text-[#4a41e0] mr-4"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && signatures.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> à{' '}
            <span className="font-medium">{Math.min(currentPage * 10, totalCount)}</span> sur{' '}
            <span className="font-medium">{totalCount}</span> signatures
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#5b50ff] hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Précédent
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className={`px-3 py-1 rounded-md ${
                !hasNextPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#5b50ff] hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
