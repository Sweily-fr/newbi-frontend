import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMAIL_SIGNATURES } from '../../../../graphql/emailSignatures';
import { Table, Column } from '../../../data-display/Table';
import { Button, SearchInput } from '../../../ui';
import { PlusIcon, EnvelopeIcon, PencilIcon, TrashIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../../utils/formatters';
import { Spinner } from '../../../feedback/Spinner';

// Type pour une signature email
export interface EmailSignature {
  id: string;
  name: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  address?: string;
  companyName?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  template: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  showLogo?: boolean;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
  profilePhotoToDelete?: boolean;
  profilePhotoSize?: number;
  socialLinksDisplayMode?: 'icons' | 'text';
  socialLinksIconStyle?: 'plain' | 'rounded' | 'circle';
  socialLinksIconBgColor?: string;
  socialLinksIconColor?: string;
  layout?: 'horizontal' | 'vertical';
  horizontalSpacing?: number;
  fontFamily?: string;
  fontSize?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailSignaturesTableProps {
  onAddSignature?: () => void;
  onEditSignature?: (signature: EmailSignature) => void;
  onDeleteSignature?: (signature: EmailSignature) => void;
  onSetDefault?: (signature: EmailSignature) => void;
}

export const EmailSignaturesTable: React.FC<EmailSignaturesTableProps> = ({ 
  onAddSignature,
  onEditSignature,
  onDeleteSignature,
  onSetDefault
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  // Référence pour le champ de recherche
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Fonction pour appliquer un délai à la recherche
  const debouncedSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        setSearch(value);
      }, 500); // Délai de 500ms
      
      return () => {
        clearTimeout(timer);
      };
    },
    []
  );
  
  // Effet pour déclencher la recherche avec délai
  useEffect(() => {
    const cleanup = debouncedSearch(searchInput);
    return cleanup;
  }, [searchInput, debouncedSearch]);
  
  // Effet pour réinitialiser la pagination lorsque la recherche change
  useEffect(() => {
    setPage(1);
  }, [search]);
  
  const { loading, error, data } = useQuery(GET_EMAIL_SIGNATURES, {
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

  // Définition des colonnes du tableau
  const columns: Column<EmailSignature>[] = [
    {
      header: 'Nom',
      accessor: (signature) => (
        <div className="flex items-center">
          {signature.isDefault && (
            <CheckBadgeIcon className="h-5 w-5 text-green-600 mr-1" title="Signature par défaut" />
          )}
          {signature.name}
        </div>
      ),
      className: 'w-2/12'
    },
    {
      header: 'Nom complet',
      accessor: 'fullName',
      className: 'w-2/12'
    },
    {
      header: 'Poste',
      accessor: 'jobTitle',
      className: 'w-2/12'
    },
    {
      header: 'Email',
      accessor: 'email',
      className: 'w-2/12'
    },
    {
      header: 'Template',
      accessor: (signature) => {
        const templates = {
          SIMPLE: 'Simple',
          PROFESSIONAL: 'Professionnel',
          MODERN: 'Moderne',
          CREATIVE: 'Créatif'
        };
        return templates[signature.template as keyof typeof templates] || signature.template;
      },
      className: 'w-1/12'
    },
    {
      header: 'Date de création',
      accessor: (signature) => formatDate(signature.createdAt),
      className: 'w-2/12'
    },
    {
      header: 'Actions',
      accessor: (signature) => (
        <div className="flex justify-end space-x-2" onClick={stopPropagation}>
          {onEditSignature && (
            <button
              onClick={() => onEditSignature(signature)}
              className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
              title="Modifier"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          {onDeleteSignature && (
            <button
              onClick={() => onDeleteSignature(signature)}
              className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
              title="Supprimer"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
          {onSetDefault && !signature.isDefault && (
            <button
              onClick={() => onSetDefault(signature)}
              className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
              title="Définir comme signature par défaut"
            >
              <CheckBadgeIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
      className: 'w-1/12'
    }
  ];

  // État vide pour le tableau
  const emptyState = {
    icon: <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />,
    title: "Aucune signature email",
    description: "Commencez par créer votre première signature email professionnelle.",
    action: onAddSignature ? (
      <Button
        onClick={onAddSignature}
        variant="primary"
        className="inline-flex items-center"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Créer une signature
      </Button>
    ) : undefined
  };

  if (error) return <div className="py-10 text-center text-red-500">Erreur: {error.message}</div>;

  const signatures = data?.emailSignatures?.signatures || [];
  const totalCount = data?.emailSignatures?.totalCount || 0;
  const hasNextPage = data?.emailSignatures?.hasNextPage || false;

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-lg font-medium text-gray-900">Signatures Email</h2>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          {/* Barre de recherche */}
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher une signature..."
            className="w-64"
            ref={searchInputRef}
          />
        </div>
        <div>
          {onAddSignature && (
            <Button
              onClick={onAddSignature}
              variant="primary"
              className="inline-flex items-center"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Créer une signature
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
          data={signatures}
          keyExtractor={(item) => item.id}
          onRowClick={onEditSignature ? (item) => onEditSignature(item) : undefined}
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
