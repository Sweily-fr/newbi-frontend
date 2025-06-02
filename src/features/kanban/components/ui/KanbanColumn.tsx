import React, { useState, ChangeEvent } from 'react';
import { Droppable, Draggable, DroppableProvided, DraggableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { KanbanColumn as KanbanColumnType, KanbanTask } from '../../types/kanban';
import { TaskCard } from './TaskCard';
import { ColumnHeader } from './ColumnHeader';
import { Add } from 'iconsax-react';
import { Modal, Button, Input, TextArea } from '../../../../components';

interface KanbanColumnProps {
  column: KanbanColumnType;
  index: number;
  onTaskClick: (task: KanbanTask) => void;
  onAddTask: (columnId: string, title: string, description?: string) => Promise<void>;
  onEditColumn: (columnId: string, title: string) => Promise<void>;
  onDeleteColumn: (columnId: string) => Promise<void>;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  index,
  onTaskClick,
  onAddTask,
  onEditColumn,
  onDeleteColumn
}) => {
  // États pour les modals
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  
  // États pour les formulaires
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [columnTitle, setColumnTitle] = useState(column.title);
  
  // États pour le chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // Gérer l'ajout d'une tâche
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await onAddTask(column._id, newTaskTitle, newTaskDescription);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAddTaskModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la modification d'une colonne
  const handleEditColumn = async () => {
    if (!columnTitle.trim() || columnTitle === column.title) {
      setIsEditColumnModalOpen(false);
      return;
    }
    
    setIsLoading(true);
    try {
      await onEditColumn(column._id, columnTitle);
      setIsEditColumnModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la modification de la colonne:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la suppression d'une colonne
  const handleDeleteColumn = async () => {
    setIsLoading(true);
    try {
      await onDeleteColumn(column._id);
      setIsDeleteColumnModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la colonne:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Draggable draggableId={column._id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex flex-col bg-gray-50 rounded-lg w-72 min-w-72 max-w-72 h-full mr-4"
        >
          {/* En-tête de la colonne */}
          <div {...provided.dragHandleProps}>
            <ColumnHeader
              title={column.title}
              taskCount={column.tasks.length}
              onEdit={() => {
                setColumnTitle(column.title);
                setIsEditColumnModalOpen(true);
              }}
              onDelete={() => setIsDeleteColumnModalOpen(true)}
            />
          </div>
          
          {/* Zone de drop pour les tâches */}
          <Droppable droppableId={column._id} type="task">
            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-grow p-2 overflow-y-auto min-h-[100px] transition-colors
                  ${snapshot.isDraggingOver ? 'bg-[#f0eeff]' : ''}
                `}
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              >
                {column.tasks.map((task, taskIndex) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    index={taskIndex}
                    onClick={onTaskClick}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          
          {/* Bouton d'ajout de tâche */}
          <div className="p-2">
            <button
              className="flex items-center justify-center w-full py-2 px-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              <Add size="18" className="mr-1" />
              <span>Ajouter une tâche</span>
            </button>
          </div>
          
          {/* Modal d'ajout de tâche */}
          <Modal
            isOpen={isAddTaskModalOpen}
            onClose={() => setIsAddTaskModalOpen(false)}
            title="Ajouter une tâche"
          >
            <div className="p-4">
              <Input
                label="Titre"
                value={newTaskTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
                placeholder="Titre de la tâche"
                required
                className="mb-4"
              />
              
              <TextArea
                id="task-description"
                name="task-description"
                label="Description"
                value={newTaskDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewTaskDescription(e.target.value)}
                placeholder="Description de la tâche (optionnel)"
                className="mb-6"
                rows={4}
              />
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddTaskModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim() || isLoading}
                  isLoading={isLoading}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </Modal>
          
          {/* Modal de modification de colonne */}
          <Modal
            isOpen={isEditColumnModalOpen}
            onClose={() => setIsEditColumnModalOpen(false)}
            title="Modifier la colonne"
          >
            <div className="p-4">
              <Input
                label="Titre"
                value={columnTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setColumnTitle(e.target.value)}
                placeholder="Titre de la colonne"
                required
                className="mb-6"
              />
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditColumnModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEditColumn}
                  disabled={!columnTitle.trim() || columnTitle === column.title || isLoading}
                  isLoading={isLoading}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </Modal>
          
          {/* Modal de confirmation de suppression */}
          <Modal
            isOpen={isDeleteColumnModalOpen}
            onClose={() => setIsDeleteColumnModalOpen(false)}
            title="Supprimer la colonne"
          >
            <div className="p-4">
              <p className="mb-6 text-gray-700">
                Êtes-vous sûr de vouloir supprimer la colonne "{column.title}" ?
                <br />
                <span className="text-red-500 font-medium">
                  Cette action supprimera également toutes les tâches associées.
                </span>
              </p>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsDeleteColumnModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteColumn}
                  isLoading={isLoading}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </Draggable>
  );
};
