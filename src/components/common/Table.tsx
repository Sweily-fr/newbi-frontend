import { ReactNode } from 'react';
import { Pagination } from '../specific/navigation/Pagination';
import { TruncatedText } from '../specific/TruncatedText';

// Types pour les colonnes
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: 'left' | 'center' | 'right';
  className?: string;
}

// Props pour le composant Table
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  onRowClick?: (item: T) => void;
  emptyState?: {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
  };
  // Props de pagination
  pagination?: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    rowsPerPageOptions?: number[];
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    hasNextPage?: boolean;
  };
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className = '',
  onRowClick,
  emptyState,
  pagination
}: TableProps<T>) {
  // Si les données sont vides et qu'un état vide est fourni, afficher l'état vide
  if (data.length === 0 && emptyState) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="text-center py-12">
          {emptyState.icon}
          <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyState.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyState.description}</p>
          {emptyState.action && <div className="mt-6">{emptyState.action}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr 
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-[#f0eeff]/50' : ''}
              >
                {columns.map((column, index) => {
                  const value = typeof column.accessor === 'function' 
                    ? column.accessor(item)
                    : item[column.accessor];
                  
                  return (
                    <td 
                      key={index} 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${column.align === 'right' ? 'text-right' : ''} ${column.className || ''}`}
                    >
                      {typeof value === 'string' ? (
                        <TruncatedText text={value} />
                      ) : (
                        value as ReactNode
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
          rowsPerPageOptions={pagination.rowsPerPageOptions}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
          hasNextPage={pagination.hasNextPage}
        />
      )}
    </div>
  );
}