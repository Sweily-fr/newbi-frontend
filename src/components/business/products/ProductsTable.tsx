import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../graphql/products';
import { Table, Column } from '../../data-display/Table';
import { Button, SearchInput } from '../../';
import { PlusIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '../../../utils/formatters';
import { Spinner } from '../../feedback/Spinner';

// Type pour un produit
export interface Product {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  vatRate: number;
  unit: string;
  category?: string;
  reference?: string;
}

interface ProductsTableProps {
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ 
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  // Référence pour le champ de recherche
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Fonction pour effectuer la recherche
  const handleSearch = useCallback(() => {
    setSearch(searchInput);
  }, [searchInput]);
  
  // Fonction pour réinitialiser la recherche
  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearch('');
  }, []);
  
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { page, limit, search },
    fetchPolicy: 'network-only',
    onCompleted: () => {
      // Remettre le focus sur le champ de recherche après le chargement des données
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      // Désactiver le loader après un court délai pour une meilleure UX
      setTimeout(() => {
        setLocalLoading(false);
      }, 300);
    }
  });
  
  // Effet pour gérer l'état de chargement
  useEffect(() => {
    if (loading) {
      setLocalLoading(true);
    }
  }, [loading]);

  // Fonction pour stopper la propagation des événements
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Définition des colonnes du tableau (colonnes Référence, TVA et Catégorie supprimées)
  const columns: Column<Product>[] = [
    {
      header: 'Nom',
      accessor: 'name',
      className: 'w-2/12'
    },
    {
      header: 'Description',
      accessor: (product) => product.description || '-',
      className: 'w-3/12'
    },
    {
      header: 'Prix unitaire',
      accessor: (product) => formatPrice(product.unitPrice),
      align: 'right',
      className: 'w-2/12'
    },
    {
      header: 'Unité',
      accessor: 'unit',
      className: 'w-2/12'
    },
    {
      header: 'Actions',
      accessor: (product) => (
        <div className="flex justify-end space-x-2" onClick={stopPropagation}>
          {onEditProduct && (
            <button
              onClick={() => onEditProduct(product)}
              className="p-1 text-[#5b50ff] hover:text-[#4a41e0] rounded-full hover:bg-[#f0eeff]"
              title="Modifier"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          {onDeleteProduct && (
            <button
              onClick={() => onDeleteProduct(product)}
              className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
              title="Supprimer"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
      className: 'w-1/12'
    }
  ];

  // État vide pour le tableau
  const emptyState = {
    icon: <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />,
    title: "Aucun produit ou service",
    description: "Commencez par ajouter votre premier produit ou service à votre catalogue.",
    action: onAddProduct ? (
      <Button
        onClick={onAddProduct}
        variant="primary"
        className="inline-flex items-center"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Ajouter un produit
      </Button>
    ) : undefined
  };

  if (error) return <div className="py-10 text-center text-red-500">Erreur: {error.message}</div>;

  const products = data?.products?.products || [];
  const totalCount = data?.products?.totalCount || 0;
  const hasNextPage = data?.products?.hasNextPage || false;

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-lg font-medium text-gray-900">Catalogue de produits et services</h2>
        
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          {/* Barre de recherche */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center space-x-4">
            <SearchInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClear={clearSearch}
              isLoading={localLoading}
              width="w-[300px]"
              className="py-3"
              ref={searchInputRef}
              placeholder="Rechercher un produit..."
            />
            <Button type="submit" variant="secondary" className="h-[100%]">
              Rechercher
            </Button>
          </form>
        </div>
        <div>
          {onAddProduct && (
            <Button
              onClick={onAddProduct}
              variant="primary"
              className="inline-flex items-center"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Ajouter un produit
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative">
        {localLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
            <Spinner size="lg" />
          </div>
        )}
        
        <Table
          columns={columns}
          data={products}
          keyExtractor={(item) => item.id}
          onRowClick={onEditProduct ? (item) => onEditProduct(item) : undefined}
          emptyState={emptyState}
          pagination={{
            currentPage: page,
            totalItems: totalCount,
            itemsPerPage: limit,
            onPageChange: setPage,
            hasNextPage: hasNextPage,
            rowsPerPageOptions: [5, 10, 20, 50],
            onItemsPerPageChange: setLimit
          }}
        />
      </div>
    </div>
  );
};
