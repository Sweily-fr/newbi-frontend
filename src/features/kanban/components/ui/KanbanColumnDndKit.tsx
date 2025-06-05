import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumn as KanbanColumnType, KanbanTask } from '../../types/kanban';
import { Plus, MoreVertical, Edit2, Trash2 } from 'react-feather';
import { KanbanTaskDndKit } from './KanbanTaskDndKit';

interface KanbanColumnProps {
  column: KanbanColumnType;
  index: number;
  onTaskClick: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  onEditColumn: (columnId: string, title: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export const KanbanColumnDndKit: React.FC<KanbanColumnProps> = ({
  column,
  index,
  onTaskClick,
  onAddTask,
  onEditColumn,
  onDeleteColumn
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    if (onDeleteColumn) {
      onDeleteColumn(column.id);
    }
    setShowMenu(false);
  };

  const handleTitleSubmit = () => {
    onEditColumn(column.id, title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col bg-white rounded-lg shadow-sm w-72 min-w-72 max-w-72 h-full"
    >
      {/* Header de la colonne */}
      <div 
        className="p-3 flex items-center justify-between bg-[#f0eeff] rounded-t-lg cursor-grab"
        {...attributes}
        {...listeners}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-[#5b50ff] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5b50ff]/30"
            autoFocus
          />
        ) : (
          <h3 className="font-medium text-gray-800">{column.title}</h3>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-[#e6e1ff] rounded-full transition-colors"
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
              <button 
                onClick={handleEditClick}
                className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-[#f0eeff] transition-colors"
              >
                <Edit2 size={14} className="mr-2 text-gray-600" />
                Modifier
              </button>
              {onDeleteColumn && (
                <button 
                  onClick={handleDeleteClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash2 size={14} className="mr-2" />
                  Supprimer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Liste des tâches */}
      <div className="flex-1 p-2 overflow-y-auto bg-gray-50 flex flex-col gap-2 min-h-[200px]">
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <KanbanTaskDndKit
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
                columnId={column.id}
              />
            ))
        ) : (
          <div className="flex items-center justify-center h-20 text-gray-400 text-sm italic">
            Aucune tâche
          </div>
        )}
      </div>
      
      {/* Footer avec bouton d'ajout */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={() => onAddTask(column.id)}
          className="flex items-center justify-center w-full py-2 px-3 text-sm text-[#5b50ff] bg-[#f0eeff] hover:bg-[#e6e1ff] rounded transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Ajouter une tâche
        </button>
      </div>
    </div>
  );
};
