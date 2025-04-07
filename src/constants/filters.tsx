import { FilterOption } from '../components/business/Filters/FilterBar';
import { Tool } from './tools';

export const TOOL_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'devis', label: 'Devis', count: 1 },
  { id: 'factures', label: 'Factures', count: 1 },
];

// Fonction pour filtrer les outils en fonction du filtre sélectionné
export const filterTools = (tools: Tool[], activeFilter: string): Tool[] => {
  if (activeFilter === 'all') {
    return tools;
  }
  
  // Pour cette démonstration, nous allons simplement filtrer de manière aléatoire
  // Dans une application réelle, vous utiliseriez une propriété de l'outil pour filtrer
  const filterMap: Record<string, (tool: Tool) => boolean> = {
    devis: (tool) => tool.id === 'quotes',
    factures: (tool) => tool.id === 'invoices',
  };

  return tools.filter(filterMap[activeFilter] || (() => false));
};
