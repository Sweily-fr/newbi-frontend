import React, { useState, useEffect } from 'react';
import Input from '../../../../components/common/Input';
import Select from '../../../../components/common/Select';
import Button from '../../../../components/common/Button';
import { 
  ExpenseFilters as ExpenseFiltersType,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_STATUS_LABELS
} from '../../types';
import { 
  SearchNormal, 
  Calendar, 
  FilterSearch, 
  CloseCircle, 
  Category, 
  DocumentText, 
  Tag
} from 'iconsax-react';
import { logger } from '../../../../utils/logger';

// Styles définis avec Tailwind CSS directement dans les composants

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
  onReset: () => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const [localFilters, setLocalFilters] = useState<ExpenseFiltersType>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Mettre à jour les filtres locaux lorsque les filtres externes changent
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Gérer les changements dans les filtres
  const handleChange = (name: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Appliquer les filtres
  const handleApply = () => {
    logger.debug('Applying expense filters:', localFilters);
    onFiltersChange(localFilters);
  };
  
  // Réinitialiser les filtres
  const handleReset = () => {
    logger.debug('Resetting expense filters');
    onReset();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
              <SearchNormal size={14} variant="Bold" color="#5b50ff" />
            </div>
            Recherche
          </label>
          <Input
            placeholder="Rechercher par titre, fournisseur..."
            value={localFilters.search || ''}
            onChange={e => handleChange('search', e.target.value)}
            leftIcon={<SearchNormal size={18} color="#9ca3af" />}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
              <Calendar size={14} variant="Bold" color="#5b50ff" />
            </div>
            Période
          </label>
          {/* DateRangePicker remplacé par des inputs date simples */}
          <div className="flex gap-2">
            <Input
              type="date"
              value={localFilters.startDate || ''}
              onChange={e => handleChange('startDate', e.target.value)}
              placeholder="Date de début"
            />
            <Input
              type="date"
              value={localFilters.endDate || ''}
              onChange={e => handleChange('endDate', e.target.value)}
              placeholder="Date de fin"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
              <Category size={14} variant="Bold" color="#5b50ff" />
            </div>
            Catégorie
          </label>
          <Select
            value={localFilters.category || ''}
            onChange={value => handleChange('category', value)}
            options={[
              { value: '', label: 'Toutes les catégories' },
              ...Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
                value,
                label
              }))
            ]}
            placeholder="Sélectionner une catégorie"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
              <DocumentText size={14} variant="Bold" color="#5b50ff" />
            </div>
            Statut
          </label>
          <Select
            value={localFilters.status || ''}
            onChange={value => handleChange('status', value)}
            options={[
              { value: '', label: 'Tous les statuts' },
              ...Object.entries(EXPENSE_STATUS_LABELS).map(([value, label]) => ({
                value,
                label
              }))
            ]}
            placeholder="Sélectionner un statut"
          />
        </div>
      </div>
      
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(91,80,255,0.1)] text-[#5b50ff]">
                <Tag size={14} variant="Bold" color="#5b50ff" />
              </div>
              Tags
            </label>
            {/* TagInput remplacé par un input simple */}
            <Input
              placeholder="Ajouter des tags (séparés par des virgules)"
              value={localFilters.tags?.join(', ') || ''}
              onChange={e => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            />
          </div>
        </div>
      )}
      
      <button 
        className="bg-transparent border-none text-[#5b50ff] text-sm font-medium cursor-pointer p-0 flex items-center gap-1 mt-4 hover:text-[#4a41e0] hover:underline"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? (
          <>
            <CloseCircle size={16} color="#5b50ff" />
            Masquer les filtres avancés
          </>
        ) : (
          <>
            <FilterSearch size={16} color="#5b50ff" />
            Afficher les filtres avancés
          </>
        )}
      </button>
      
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button 
          onClick={handleApply} 
          className="bg-[#5b50ff] border-[#5b50ff] hover:bg-[#4a41e0] hover:border-[#4a41e0]"
        >
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default ExpenseFilters;
