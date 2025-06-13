import React from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

/**
 * Composant de pagination avec navigation par pages
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Si une seule page ou moins, ne pas afficher la pagination
  if (totalPages <= 1) return null;
  
  // Fonction pour générer la liste des pages à afficher
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // Nombre total de boutons de page à afficher
    const totalBlocks = totalNumbers + 2; // +2 pour les boutons "..." de début et fin
    
    if (totalPages <= totalBlocks) {
      // Si le nombre total de pages est inférieur au nombre de boutons, afficher toutes les pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Cas 1: Afficher les points à droite uniquement
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      
      return [...leftRange, '...', totalPages];
    }
    
    // Cas 2: Afficher les points à gauche uniquement
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      
      return [1, '...', ...rightRange];
    }
    
    // Cas 3: Afficher les points à gauche et à droite
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      
      return [1, '...', ...middleRange, '...', totalPages];
    }
    
    // Par défaut, retourner toutes les pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };
  
  const pages = getPageNumbers();
  
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="flex w-0 flex-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 ${
            currentPage === 1
              ? 'border-transparent text-gray-300 cursor-not-allowed'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } pt-4 pr-1 text-sm font-medium`}
        >
          <ArrowLeft2 size={20} className="mr-2" />
          Précédent
        </button>
      </div>
      
      <div className="hidden md:flex">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={`page-${page}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                currentPage === page
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 ${
            currentPage === totalPages
              ? 'border-transparent text-gray-300 cursor-not-allowed'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } pt-4 pl-1 text-sm font-medium`}
        >
          Suivant
          <ArrowRight2 size={20} className="ml-2" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
