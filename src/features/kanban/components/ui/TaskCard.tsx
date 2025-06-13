import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { KanbanTask } from '../../types/kanban';
import { Calendar, MessageText1, AttachSquare, User } from 'iconsax-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskCardProps {
  task: KanbanTask;
  index: number;
  onClick: (task: KanbanTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  // Formater la date d'échéance si elle existe
  const formattedDueDate = task.dueDate 
    ? format(new Date(task.dueDate), 'dd MMM', { locale: fr })
    : null;
  
  // Vérifier si la date d'échéance est dépassée
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-3 mb-2 shadow-sm hover:shadow transition-all duration-200 cursor-pointer
            ${snapshot.isDragging ? 'shadow-md ring-2 ring-[#5b50ff]/20' : ''}
          `}
          onClick={() => onClick(task)}
        >
          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${label.color}20`, // Couleur avec opacité
                    color: label.color 
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Titre de la tâche */}
          <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>
          
          {/* Description (tronquée) */}
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          {/* Informations supplémentaires */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            {/* Date d'échéance */}
            {formattedDueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                <Calendar size="14" variant="Linear" />
                <span>{formattedDueDate}</span>
              </div>
            )}
            
            {/* Nombre de commentaires */}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageText1 size="14" variant="Linear" />
                <span>{task.comments.length}</span>
              </div>
            )}
            
            {/* Nombre de pièces jointes */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <AttachSquare size="14" variant="Linear" />
                <span>{task.attachments.length}</span>
              </div>
            )}
            
            {/* Utilisateur assigné */}
            {task.assignedTo && (
              <div className="flex items-center gap-1 ml-auto">
                {task.assignedTo.avatar ? (
                  <img 
                    src={task.assignedTo.avatar} 
                    alt={task.assignedTo.name} 
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#f0eeff] flex items-center justify-center">
                    <User size="12" variant="Bold" color="#5b50ff" />
                  </div>
                )}
                <span className="truncate max-w-[80px]">{task.assignedTo.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
