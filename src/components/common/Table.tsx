import { ReactNode, useState, createContext } from 'react';
import { Pagination } from '../specific/navigation/Pagination';
import { TruncatedText } from '../specific/TruncatedText';
import { ArrowDown2, ArrowUp2, Sort, EmptyWallet } from 'iconsax-react';
import { ActionButton, ActionMenuItem } from './ActionButton';

// Contexte pour gérer l'état des menus déroulants dans le tableau
interface TableMenuContext {
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
}

// Exporter le contexte pour qu'il soit accessible par ActionButton
export const TableMenuContext = createContext<TableMenuContext>({
  activeMenuId: null,
  setActiveMenuId: () => {}
});

// Types pour les colonnes
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: 'left' | 'center' | 'right';
  className?: string;
  sortable?: boolean;
  isAction?: boolean;
}

// Réexporter le type ActionMenuItem depuis ActionButton pour la rétrocompatibilité
export type { ActionMenuItem } from './ActionButton';

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
  sortConfig?: {
    key: keyof T | null;
    direction: 'asc' | 'desc' | null;
    onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  };
  actionItems?: ActionMenuItem<T>[];
  actionButtonLabel?: string;
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

// Le composant ActionMenu a été remplacé par le composant ActionButton

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className = '',
  onRowClick,
  emptyState,
  pagination,
  sortConfig,
  actionItems,
  actionButtonLabel
}: TableProps<T>) {
  // État pour suivre quel menu est actuellement ouvert
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  // Si les données sont vides et qu'un état vide est fourni, afficher l'état vide
  if (data.length === 0 && emptyState) {
    return (
      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-2xl">
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#f0eeff]">
            {emptyState.icon || <EmptyWallet size={24} variant="Bulk" color="#5b50ff" />}
          </div>
          <h3 className="mt-4 text-base font-medium text-gray-900">{emptyState.title}</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{emptyState.description}</p>
          {emptyState.action && <div className="mt-6">{emptyState.action}</div>}
        </div>
      </div>
    );
  }

  return (
    <TableMenuContext.Provider value={{ activeMenuId, setActiveMenuId }}>
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto overflow-visible rounded-2xl">
          <table className={`min-w-full divide-y divide-gray-100 rounded-2xl ${className}`}>
          <thead className="bg-[#f9f8ff] rounded-t-2xl">
            <tr className="rounded-t-2xl">
              {columns.map((column, index) => {
                const isSorted = sortConfig?.key === column.accessor && typeof column.accessor !== 'function';
                const sortDirection = isSorted ? sortConfig.direction : null;
                
                return (
                  <th
                    key={index}
                    className={`px-6 py-4 text-${column.align || 'left'} text-xs font-medium text-gray-600 tracking-wider ${index === 0 ? 'first:rounded-tl-2xl' : ''} ${index === columns.length - 1 ? 'last:rounded-tr-2xl' : ''} ${column.className || ''}`}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <button 
                          className="focus:outline-none"
                          onClick={() => {
                            if (sortConfig?.onSort && typeof column.accessor !== 'function') {
                              const direction = 
                                isSorted && sortDirection === 'asc' ? 'desc' : 'asc';
                              sortConfig.onSort(column.accessor as keyof T, direction);
                            }
                          }}
                        >
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp2 size={16} variant="Bold" color="#5b50ff" />
                            ) : (
                              <ArrowDown2 size={16} variant="Bold" color="#5b50ff" />
                            )
                          ) : (
                            <Sort size={16} variant="Linear" color="#9ca3af" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 rounded-b-2xl">
            {data.map((item) => (
              <tr 
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={`${onRowClick ? 'cursor-pointer hover:bg-[#f0eeff]/50 transition-colors duration-150' : ''} ${data.length === 1 ? 'rounded-b-2xl' : ''} ${data.indexOf(item) === data.length - 1 ? 'last:rounded-b-2xl' : ''}`}
              >
                {columns.map((column, index) => {
                  const value = typeof column.accessor === 'function' 
                    ? column.accessor(item)
                    : item[column.accessor];
                  
                  return (
                    <td 
                      key={index} 
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${column.isAction ? 'overflow-visible' : ''} ${data.indexOf(item) === data.length - 1 && index === 0 ? 'last:first:rounded-bl-2xl' : ''} ${data.indexOf(item) === data.length - 1 && index === columns.length - 1 ? 'last:last:rounded-br-2xl' : ''} ${column.className || ''}`}
                      style={{ textAlign: column.align || 'left', position: column.isAction ? 'relative' : 'static' }}
                    >
                      {column.isAction && actionItems ? (
                        <div className="overflow-visible" style={{ position: 'relative' }}>
                          <ActionButton
                            item={item}
                            actions={actionItems}
                            buttonLabel={actionButtonLabel}
                            className="relative"
                            menuId={keyExtractor(item).toString()}
                          />
                        </div>
                      ) : typeof value === 'string' ? (
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
        
        {pagination && data.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.onPageChange}
            rowsPerPageOptions={pagination.rowsPerPageOptions}
            onItemsPerPageChange={pagination.onItemsPerPageChange}
            hasNextPage={pagination.hasNextPage}
            className="border-t border-gray-100 rounded-b-2xl overflow-hidden"
          />
        )}
      </div>
    </TableMenuContext.Provider>
  );
}