import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumn as KanbanColumnType, KanbanTask } from '../../types/kanban';
import { MoreVertical, Plus, Edit, Trash } from 'react-feather';
import { KanbanTaskDndKit } from './KanbanTaskDndKit';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onTaskClick?: (task: KanbanTask) => void;
  onAddTask: (columnId: string, title: string, description?: string, dueDate?: string, priority?: string) => void;
  onEditColumn: (columnId: string, title?: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  isDragging?: boolean; // Propriété pour indiquer si la colonne est en cours de glissement
}

export const KanbanColumnDndKit: React.FC<KanbanColumnProps> = ({
  column,
  onTaskClick,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  isDragging: externalIsDragging
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium'); // 'low', 'medium', 'high'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dndIsDragging,
    isOver
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  // Utiliser isDragging externe s'il est fourni, sinon utiliser celui de useSortable
  const isDragging = externalIsDragging !== undefined ? externalIsDragging : dndIsDragging;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  // Classe CSS pour l'indicateur de drop zone avec effet de "snap"
  const dropIndicatorClass = isOver 
    ? 'bg-[#f0eeff] border-2 border-[#5b50ff] shadow-[0_0_0_3px_rgba(91,80,255,0.2)] scale-[1.02] transition-all duration-150' 
    : '';

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
    if (title.trim() && title !== column.title) {
      onEditColumn(column.id, title);
    } else {
      // Réinitialiser le titre si vide ou inchangé
      setTitle(column.title);
    }
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

  // Gestion de l'ajout d'une tâche
  const handleAddTaskClick = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleTaskSubmit = () => {
    if (newTaskTitle.trim()) {
      // Passer les informations complètes de la tâche
      onAddTask(column.id, newTaskTitle, newTaskDescription, newTaskDueDate, newTaskPriority);
      
      // Réinitialiser les champs
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskPriority('medium');
      setIsAddTaskModalOpen(false);
    }
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTaskSubmit();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col bg-white rounded-lg shadow-sm w-72 min-w-72 max-w-72 h-full transition-colors duration-200 ${dropIndicatorClass ? 'border-2 ' + dropIndicatorClass : 'border border-gray-200'}`}
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
            placeholder="Nom de la colonne"
            aria-label="Modifier le nom de la colonne"
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
                <Edit size={14} className="mr-2 text-gray-600" />
                Modifier
              </button>
              {onDeleteColumn && (
                <button 
                  onClick={handleDeleteClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash size={14} className="mr-2" />
                  Supprimer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Liste des tâches */}
      <div className={`flex-1 p-2 overflow-y-auto ${isOver ? 'bg-[#f0eeff]/50' : 'bg-gray-50'} flex flex-col gap-2 min-h-[200px] transition-colors duration-150 ${isOver ? 'border-dashed border-2 border-[#5b50ff]/40 rounded-md' : ''}`}>
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <KanbanTaskDndKit
                key={task.id}
                task={task}
                onClick={() => onTaskClick && onTaskClick(task)}
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
          onClick={handleAddTaskClick}
          className="flex items-center justify-center w-full py-2 px-3 text-sm text-[#5b50ff] bg-[#f0eeff] hover:bg-[#e6e1ff] rounded transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Ajouter une tâche
        </button>
      </div>

      {/* Modal d'ajout de tâche */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Ajouter une tâche"
      >
        <div className="p-4">
          {/* Titre de la tâche */}
          <div className="mb-4">
            <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la tâche *
            </label>
            <input
              id="taskTitle"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleTaskKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff]/30 focus:border-[#5b50ff]"
              placeholder="Entrez le titre de la tâche"
              autoFocus
            />
          </div>
          
          {/* Description de la tâche */}
          <div className="mb-4">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="taskDescription"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff]/30 focus:border-[#5b50ff] min-h-[80px]"
              placeholder="Entrez une description détaillée de la tâche"
            />
          </div>
          
          {/* Date d'échéance */}
          <div className="mb-4">
            <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance
            </label>
            <input
              id="taskDueDate"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff]/30 focus:border-[#5b50ff]"
            />
          </div>
          
          {/* Priorité */}
          <div className="mb-4">
            <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              id="taskPriority"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff]/30 focus:border-[#5b50ff]"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              onClick={() => setIsAddTaskModalOpen(false)}
              variant="outline"
              size="sm"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleTaskSubmit}
              variant="primary"
              size="sm"
              disabled={!newTaskTitle.trim()}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
