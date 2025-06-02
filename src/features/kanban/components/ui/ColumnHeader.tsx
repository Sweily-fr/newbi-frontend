import React, { useState, useRef } from 'react';
import { Edit2, More, Trash } from 'iconsax-react';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';

interface ColumnHeaderProps {
  title: string;
  taskCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ 
  title, 
  taskCount,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Fermer le menu quand on clique à l'extérieur
  useOutsideClick(menuRef, () => {
    if (showMenu) setShowMenu(false);
  });
  
  return (
    <div className="flex items-center justify-between px-2 py-2 mb-2">
      <div className="flex items-center">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {taskCount}
        </span>
      </div>
      
      <div className="relative" ref={menuRef}>
        <button
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Options de colonne"
        >
          <More size="18" variant="Linear" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
            <div className="py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowMenu(false);
                  onEdit();
                }}
              >
                <Edit2 size="16" className="mr-2" />
                Modifier
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
              >
                <Trash size="16" className="mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
