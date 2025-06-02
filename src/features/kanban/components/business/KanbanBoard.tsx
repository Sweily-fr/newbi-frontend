import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { KanbanColumn } from '../ui/KanbanColumn';
import { KanbanTask, KanbanUser } from '../../types/kanban';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { Add, InfoCircle, Edit2, Trash, User } from 'iconsax-react';
import { Modal, Button, Input } from '../../../../components';

interface KanbanBoardProps {
  boardId: string;
  currentUser: KanbanUser;
  // Note: availableUsers sera utilisé ultérieurement pour l'assignation des tâches
  availableUsers?: KanbanUser[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  boardId,
  currentUser
}) => {
  // États pour les modals
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  
  // États pour les formulaires
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérer les données du tableau et les fonctions
  const {
    board,
    boardLoading,
    boardError,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    addComment,
    deleteComment
  } = useKanbanBoard(boardId);
  
  // Utiliser le hook de drag-and-drop
  const { localBoard, handleDragEnd } = useDragAndDrop({
    board: board || { _id: '', title: '', columns: [], members: [], creator: currentUser, createdAt: '', updatedAt: '' },
    moveTask,
    reorderColumns
  });
  
  // Gérer l'ajout d'une colonne
  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await createColumn({
        boardId,
        title: newColumnTitle
      });
      setNewColumnTitle('');
      setIsAddColumnModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la colonne:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer l'ajout d'une tâche
  const handleAddTask = async (columnId: string, title: string, description?: string) => {
    try {
      await createTask({
        boardId,
        columnId,
        title,
        description
      });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }
  };
  
  // Gérer la modification d'une colonne
  const handleUpdateColumn = async (columnId: string, title: string) => {
    try {
      await updateColumn({
        boardId,
        columnId,
        title
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la colonne:", error);
      throw error;
    }
  };
  
  // Gérer la suppression d'une colonne
  const handleDeleteColumn = async (columnId: string) => {
    try {
      await deleteColumn(columnId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la colonne:", error);
      throw error;
    }
  };
  
  // Gérer le clic sur une tâche
  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };
  
  // Gérer la mise à jour d'une tâche
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateTask = async (taskId: string, updates: Record<string, unknown>) => {
    if (!selectedTask) return;
    
    const columnId = localBoard.columns.find(col => 
      col.tasks.some(task => task._id === taskId)
    )?._id;
    
    if (!columnId) return;
    
    try {
      await updateTask({
        boardId,
        columnId,
        taskId,
        ...updates
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      throw error;
    }
  };
  
  // Gérer la suppression d'une tâche
  const handleDeleteTask = async (taskId: string) => {
    if (!selectedTask) return;
    
    const columnId = localBoard.columns.find(col => 
      col.tasks.some(task => task._id === taskId)
    )?._id;
    
    if (!columnId) return;
    
    try {
      await deleteTask(columnId, taskId);
      setIsTaskDetailModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  };
  
  // Gérer l'ajout d'un commentaire
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddComment = async (taskId: string, content: string) => {
    if (!selectedTask) return;
    
    const columnId = localBoard.columns.find(col => 
      col.tasks.some(task => task._id === taskId)
    )?._id;
    
    if (!columnId) return;
    
    try {
      await addComment({
        boardId,
        columnId,
        taskId,
        content
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  };
  
  // Gérer la suppression d'un commentaire
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteComment = async (taskId: string, commentId: string) => {
    if (!selectedTask) return;
    
    const columnId = localBoard.columns.find(col => 
      col.tasks.some(task => task._id === taskId)
    )?._id;
    
    if (!columnId) return;
    
    try {
      await deleteComment(columnId, taskId, commentId);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      throw error;
    }
  };
  
  // Afficher un message de chargement
  if (boardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (boardError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="flex items-center">
            <InfoCircle size="20" variant="Bold" className="mr-2" />
            Une erreur est survenue lors du chargement du tableau.
          </p>
          <p className="text-sm mt-2">Veuillez réessayer ultérieurement.</p>
        </div>
      </div>
    );
  }
  
  // Si le tableau n'existe pas
  if (!board) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-[#f0eeff] border border-[#5b50ff]/20 rounded-lg p-4 text-gray-700">
          <p className="flex items-center">
            <InfoCircle size="20" variant="Bold" color="#5b50ff" className="mr-2" />
            Ce tableau n'existe pas ou vous n'avez pas les permissions nécessaires.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* En-tête du tableau avec titre et description */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">{board.title}</h1>
        {board.description && (
          <p className="text-gray-600">{board.description}</p>
        )}
      </div>
      
      {/* Conteneur du tableau Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 250px)' }}>
          {/* Colonnes */}
          {localBoard.columns.map((column, index) => (
            <KanbanColumn
              key={column._id}
              column={column}
              index={index}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
              onEditColumn={handleUpdateColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
          
          {/* Bouton d'ajout de colonne */}
          <div className="flex-shrink-0 w-72 h-16">
            <button
              className="flex items-center justify-center w-full h-full bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsAddColumnModalOpen(true)}
            >
              <Add size="20" className="mr-2" />
              <span>Ajouter une colonne</span>
            </button>
          </div>
        </div>
      </DragDropContext>
      
      {/* Modal d'ajout de colonne */}
      <Modal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        title="Ajouter une colonne"
      >
        <div className="p-4">
          <Input
            label="Titre"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Titre de la colonne"
            required
            className="mb-6"
          />
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsAddColumnModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim() || isLoading}
              loading={isLoading}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de détail de tâche */}
      {selectedTask && (
        <Modal
          isOpen={isTaskDetailModalOpen}
          onClose={() => setIsTaskDetailModalOpen(false)}
          title={selectedTask.title}
          size="lg"
        >
          <div className="p-4">
            {/* Contenu de la tâche */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">{selectedTask.description || "Aucune description"}</p>
            </div>
            
            {/* Informations sur la tâche */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Statut</h4>
                <div className="bg-[#f0eeff] text-[#5b50ff] text-sm font-medium px-2 py-1 rounded-md inline-block">
                  {selectedTask.status}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Assigné à</h4>
                {selectedTask.assignedTo ? (
                  <div className="flex items-center">
                    {selectedTask.assignedTo.avatar ? (
                      <img 
                        src={selectedTask.assignedTo.avatar} 
                        alt={selectedTask.assignedTo.name} 
                        className="w-6 h-6 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#f0eeff] flex items-center justify-center mr-2">
                        <User size="14" variant="Bold" color="#5b50ff" />
                      </div>
                    )}
                    <span>{selectedTask.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Non assigné</span>
                )}
              </div>
              
              {selectedTask.dueDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date d'échéance</h4>
                  <div className="flex items-center">
                    <Calendar size="16" variant="Linear" className="mr-1" />
                    <span>{new Date(selectedTask.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Créé par</h4>
                <div className="flex items-center">
                  {selectedTask.creator.avatar ? (
                    <img 
                      src={selectedTask.creator.avatar} 
                      alt={selectedTask.creator.name} 
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#f0eeff] flex items-center justify-center mr-2">
                      <User size="14" variant="Bold" color="#5b50ff" />
                    </div>
                  )}
                  <span>{selectedTask.creator.name}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 mb-6">
              <Button
                variant="secondary"
                onClick={() => {
                  // Implémenter l'édition de la tâche
                }}
              >
                <Edit2 size="16" className="mr-1" />
                Modifier
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteTask(selectedTask._id);
                }}
              >
                <Trash size="16" className="mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
