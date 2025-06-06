import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask } from '../../types/kanban';
import { Calendar, MessageSquare, Paperclip, User } from 'react-feather';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface KanbanTaskProps {
  task: KanbanTask;
  onClick: () => void;
  columnId: string;
}

export const KanbanTaskDndKit: React.FC<KanbanTaskProps> = ({ task, onClick, columnId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      columnId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  };

  // Formater la date d'échéance si elle existe
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), 'dd MMM', { locale: fr })
    : null;

  // Déterminer la couleur de l'étiquette de priorité
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Extraire la priorité des étiquettes si elle existe
  const priorityLabel = task.labels?.find(label => 
    ['high', 'medium', 'low'].includes(label.toLowerCase())
  );
  
  const priorityClass = getPriorityColor(priorityLabel);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Titre de la tâche */}
      <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>
      
      {/* Description (si elle existe) */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      {/* Étiquettes */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-0.5 rounded-full ${
                ['high', 'medium', 'low'].includes(label.toLowerCase())
                  ? getPriorityColor(label.toLowerCase())
                  : 'bg-[#f0eeff] text-[#5b50ff]'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
      
      {/* Footer avec métadonnées */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div className="flex items-center space-x-3">
          {/* Date d'échéance */}
          {formattedDueDate && (
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{formattedDueDate}</span>
            </div>
          )}
          
          {/* Nombre de commentaires */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center">
              <MessageSquare size={12} className="mr-1" />
              <span>{task.comments.length}</span>
            </div>
          )}
          
          {/* Nombre de pièces jointes */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center">
              <Paperclip size={12} className="mr-1" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>
        
        {/* Assigné à */}
        {task.assignedTo && (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-[#5b50ff] flex items-center justify-center text-white text-xs">
              {task.assignedTo.email.substring(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
