// /src/components/navigation/Pagination.tsx
import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  rowsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  hasNextPage?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  onItemsPerPageChange,
  hasNextPage,
  className = '',
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (page > Math.ceil(totalItems / itemsPerPage) && !hasNextPage) return;
    onPageChange(page);
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher
    
    // Si le nombre total de pages est inférieur ou égal au nombre maximum de pages à afficher
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sinon, afficher les pages autour de la page courante
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      // Ajuster si on dépasse le nombre total de pages
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Ajouter des ellipses si nécessaire
      if (startPage > 1) {
        pageNumbers.unshift(-1); // -1 représente une ellipse
        pageNumbers.unshift(1);  // Toujours afficher la première page
      }
      
      if (endPage < totalPages) {
        pageNumbers.push(-2); // -2 représente une ellipse
        pageNumbers.push(totalPages); // Toujours afficher la dernière page
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= totalItems && !hasNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span> à{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            sur <span className="font-medium">{totalItems}</span> résultats
          </p>
          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <label htmlFor="rows-per-page" className="text-sm text-gray-700">
                Lignes par page:
              </label>
              <select
                id="rows-per-page"
                value={itemsPerPage}
                onChange={(e) => {
                  onItemsPerPageChange(Number(e.target.value));
                }}
                className="rounded-md border-gray-300 py-1.5 text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-600"
              >
                {rowsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Bouton Précédent */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Précédent</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Numéros de page */}
            {pageNumbers.map((pageNumber, index) => {
              // Si c'est une ellipse
              if (pageNumber < 0) {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              
              // Si c'est un numéro de page normal
              return (
                <button
                  key={`page-${pageNumber}`}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === pageNumber
                      ? 'z-10 bg-[#f9f8ff] border-[#5b50ff] text-[#5b50ff]'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            {/* Bouton Suivant */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= totalItems && !hasNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Suivant</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};