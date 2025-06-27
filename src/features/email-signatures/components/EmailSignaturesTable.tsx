import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Column, ActionMenuItem } from '../../../components/common/Table';
import { Button, SearchInput } from '../../../components';
import { Add, Sms, Edit2, Trash, TickCircle } from 'iconsax-react';
import { formatDateShort } from '../../../utils/date';
import { Spinner } from '../../../components/common/Spinner';

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
  socialLinksIconStyle?: 'plain' | 'rounded' | 'circle' | 'filled';
  socialLinksIconBgColor?: string;
  socialLinksIconColor?: string;
  socialLinksIconSize?: number;
  socialLinksPosition?: 'bottom' | 'right';
  layout?: 'horizontal' | 'vertical';
  horizontalSpacing?: number;
  verticalSpacing?: number;
  verticalAlignment?: 'left' | 'center' | 'right';
  imagesLayout?: 'horizontal' | 'vertical';
  fontFamily?: string;
  fontSize?: number;
  // Options d'affichage des icônes pour les coordonnées
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  iconTextSpacing?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailSignaturesTableProps {
  signatures: EmailSignature[];
  totalCount: number;
  loading: boolean;
  onAddSignature?: () => void;
  onEditSignature?: (signature: EmailSignature) => void;
  onDeleteSignature?: (signature: EmailSignature) => void;
  onSetDefault?: (signature: EmailSignature) => void;
  actionButtonLabel?: string;
}

export const EmailSignaturesTable: React.FC<EmailSignaturesTableProps> = ({ 
  signatures = [],
  totalCount = 0,
  loading = false,
  onAddSignature,
  onEditSignature,
  onDeleteSignature,
  onSetDefault,
  actionButtonLabel = "Actions"
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
  
  // Effet pour gérer l'état de chargement
  useEffect(() => {
    if (loading) {
      setLocalLoading(true);
    } else {
      // Désactiver le loader après un court délai pour une meilleure UX
      setTimeout(() => {
        setLocalLoading(false);
      }, 300);
    }
  }, [loading]);

  // Définir les actions disponibles pour le menu d'actions
  const getActionItems = (): ActionMenuItem<EmailSignature>[] => {
    const items: ActionMenuItem<EmailSignature>[] = [];
    
    // Ajouter l'action de modification si disponible
    if (onEditSignature) {
      items.push({
        label: 'Modifier',
        icon: <Edit2 size={16} variant="Linear" color="#5b50ff" />,
        onClick: (signature) => onEditSignature(signature)
      });
    }
    
    // Ajouter l'action pour définir comme défaut si disponible
    if (onSetDefault) {
      items.push({
        label: 'Définir par défaut',
        icon: <TickCircle size={16} variant="Linear" color="#22c55e" />,
        onClick: (signature) => {
          // Ne pas permettre de définir comme défaut si c'est déjà la signature par défaut
          if (!signature.isDefault) {
            onSetDefault(signature);
          }
        }
      });
    }
    
    // Ajouter l'action de suppression si disponible
    if (onDeleteSignature) {
      items.push({
        label: 'Supprimer',
        icon: <Trash size={16} variant="Linear" color="#ef4444" />,
        onClick: (signature) => onDeleteSignature(signature),
        variant: 'danger'
      });
    }
    
    return items;
  };

  // Définition des colonnes du tableau
  const columns: Column<EmailSignature>[] = [
    {
      header: 'Nom',
      accessor: (signature) => (
        <div className="flex items-center">
          {signature.isDefault && (
            <div title="Signature par défaut">
              <TickCircle size={20} variant="Linear" color="#22c55e" className="mr-1" />
            </div>
          )}
          {signature.name}
        </div>
      ),
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
      header: 'Nom complet',
      accessor: 'fullName',
      className: 'w-2/12'
    },
    {
      header: 'Entreprise',
      accessor: (signature) => signature.companyName || '-',
      className: 'w-2/12'
    },
    {
      header: 'Fonction',
      accessor: 'jobTitle',
      className: 'w-2/12'
    },
    {
      header: 'Créée le',
      accessor: (signature) => formatDateShort(signature.createdAt),
      className: 'w-1/12'
    },
    {
      header: 'Modifiée le',
      accessor: (signature) => formatDateShort(signature.updatedAt),
      className: 'w-1/12'
    },
    {
      header: 'Actions',
      accessor: () => null,
      className: 'w-1/12',
      isAction: true
    }
  ];

  // État vide pour le tableau
  const emptyState = {
    icon: <Sms size={48} variant="Bulk" color="#9ca3af" className="mx-auto" />,
    title: "Aucune signature email",
    description: "Commencez par créer votre première signature email professionnelle.",
    action: onAddSignature ? (
      <Button
        onClick={onAddSignature}
        variant="primary"
        className="inline-flex items-center"
      >
        <Add size={20} variant="Linear" color="#ffffff" className="-ml-1 mr-2" />
        Créer une signature
      </Button>
    ) : undefined
  };

  return (
    <div>
      <div className="py-5">
        {localLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table
            data={signatures}
            columns={columns}
            emptyState={emptyState}
            keyExtractor={(signature) => signature.id}
            pagination={{
              currentPage: page,
              totalItems: totalCount,
              itemsPerPage: limit,
              onPageChange: setPage,
              rowsPerPageOptions: [5, 10, 20, 50],
              onItemsPerPageChange: setLimit
            }}
            actionItems={getActionItems()}
            actionButtonLabel={actionButtonLabel}
          />
        )}
      </div>
    </div>
  );
};
