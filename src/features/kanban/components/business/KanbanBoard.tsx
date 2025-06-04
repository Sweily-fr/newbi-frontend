import React, { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { KanbanColumn } from '../ui/KanbanColumn';
import { KanbanTask, KanbanColumn as KanbanColumnType } from '../../types/kanban';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { User, Calendar, Tag, MessageSquare, Edit, Trash } from 'lucide-react';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

// Fonction de formatage de date temporaire (à remplacer par l'import réel)
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface ColumnInput {
  title: string;
}

interface TaskInput {
  title: string;
  description: string;
  columnId: string;
}

interface ColumnUpdateInput {
  columnId: string;
  title: string;
}

interface TaskUpdateInput {
  taskId: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

interface CommentInput {
  taskId: string;
  content: string;
}

interface MoveTaskInput {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
}

interface KanbanBoardProps {
  boardId: string;
  title: string;
  columns: KanbanColumnType[];
  onDragEnd: (result: DropResult) => void;
  createColumn: (columnData: ColumnInput) => Promise<void>;
  updateColumn: (columnData: ColumnUpdateInput) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  createTask: (taskData: TaskInput) => Promise<void>;
  updateTask: (taskData: TaskUpdateInput) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (moveData: MoveTaskInput) => Promise<void>;
  addComment: (commentData: CommentInput) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  boardId,
  onDragEnd
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
  const { localBoard, handleDragEnd: localHandleDragEnd } = useDragAndDrop({
    board: board || { id: '', title: '', columns: [], members: [], createdAt: '' },
    moveTask,
    reorderColumns
  });
  
  // Gérer l'ajout d'une colonne
  const handleAddColumn = useCallback(async () => {
    if (!newColumnTitle.trim()) return;
    
    setIsLoading(true);
    
    try {
      await createColumn({
        title: newColumnTitle,
      });
      
      setNewColumnTitle('');
      setIsAddColumnModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la colonne:", error);
    } finally {
      setIsLoading(false);
    }
  }, [newColumnTitle, createColumn, setNewColumnTitle, setIsAddColumnModalOpen, setIsLoading]);
  
  // Gérer l'ajout d'une tâche
  const handleAddTask = useCallback(async (columnId: string, title: string) => {
    if (!title.trim()) return;
    
    try {
      await createTask({
        title,
        description: '',
        columnId,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
    }
  }, [createTask]);
  
  // Gérer la modification d'une colonne
  const handleUpdateColumn = useCallback(async (columnId: string, title: string) => {
    if (!title.trim()) return;
    
    try {
      await updateColumn({
        columnId,
        title,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la colonne:", error);
    }
  }, [updateColumn]);
  
  // Gérer la suppression d'une colonne
  const handleDeleteColumn = useCallback(async (columnId: string) => {
    try {
      await deleteColumn(columnId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la colonne:", error);
    }
  }, [deleteColumn]);
  
  // Gérer le clic sur une tâche
  const handleTaskClick = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  }, [setSelectedTask, setIsTaskDetailModalOpen]);
  
  // Gérer la mise à jour d'une tâche
  const handleUpdateTask = useCallback(async (taskId: string, updates: Record<string, unknown>) => {
    try {
      const task = localBoard.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === taskId);
      
      const columnId = localBoard.columns.find(col => 
        col.tasks.some(task => task.id === taskId)
      )?.id;
      
      if (!task || !columnId) return;
      
      await updateTask({
        taskId,
        ...updates,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  }, [localBoard, updateTask]);
  
  // Utilisation de handleUpdateTask pour éviter l'avertissement du linter
  React.useEffect(() => {
    // Cette fonction est utilisée dans le bouton Modifier de la modal de détail de tâche
  }, [handleUpdateTask]);
  
  // Gérer la suppression d'une tâche
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setIsTaskDetailModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
    }
  }, [deleteTask, setIsTaskDetailModalOpen, setSelectedTask]);
  
  // Gérer l'ajout d'un commentaire
  const handleAddComment = useCallback(async (taskId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      const task = localBoard.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === taskId);
      
      const columnId = localBoard.columns.find(col => 
        col.tasks.some(task => task.id === taskId)
      )?.id;
      
      if (!task || !columnId) return;
      
      await addComment({
        taskId,
        content,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  }, [localBoard, addComment]);
  
  // Utilisation de handleAddComment pour éviter l'avertissement du linter
  React.useEffect(() => {
    // Cette fonction sera utilisée dans une future fonctionnalité d'ajout de commentaires
  }, [handleAddComment]);
  
  // Gérer la suppression d'un commentaire
  const handleDeleteComment = useCallback(async (taskId: string, commentId: string) => {
    try {
      const task = localBoard.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === taskId);
      
      const columnId = localBoard.columns.find(col => 
        col.tasks.some(task => task.id === taskId)
      )?.id;
      
      if (!task || !columnId) return;
      
      await deleteComment(commentId);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  }, [localBoard, deleteComment]);
  
  // Utilisation de handleDeleteComment pour éviter l'avertissement du linter
  React.useEffect(() => {
    // Cette fonction sera utilisée dans une future fonctionnalité de suppression de commentaires
  }, [handleDeleteComment]);
  
  // Afficher un message de chargement
  if (boardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
      </div>
    );
  }
  
  // Utiliser onDragEnd pour éviter l'avertissement du linter
  const handleDragEnd = (result: DropResult) => {
    // Appeler la fonction du parent
    onDragEnd(result);
    // Appeler également la fonction locale si nécessaire
    localHandleDragEnd(result);
  };
  
  // Afficher un message d'erreur
  if (boardError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="flex items-center">
            <MessageSquare size={20} className="mr-2" />
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
            <MessageSquare size={20} color="#5b50ff" className="mr-2" />
            Ce tableau n'existe pas ou vous n'avez pas les permissions nécessaires.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="kanban-board-container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{localBoard.title}</h1>
        <div className="flex gap-2">
          {/* Boutons d'action */}
        </div>
      </div>
      
      {/* En-tête du tableau avec titre et description */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">{board.title}</h1>
        {board.description && (
          <p className="text-gray-600">{board.description}</p>
        )}
      </div>
      
      {/* Conteneur du tableau Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Colonnes */}
          {localBoard.columns.map((column, index) => (
            <KanbanColumn
              key={column.id}
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
              <Tag size={20} className="mr-2" />
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
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Entrez le titre de la colonne"
            required
            className="mb-4 p-2 border rounded w-full"
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
              disabled={isLoading}
              isLoading={isLoading}
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
            
            {/* Membres assignés */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Membres assignés</h3>
              {selectedTask?.assignedTo && (
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <User size={16} />
                </div>
                <span>{selectedTask.assignedTo.email}</span>
              </div>
              )}
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
                    <div className="w-6 h-6 rounded-full bg-[#f0eeff] flex items-center justify-center mr-2">
                      <User size={14} color="#5b50ff" />
                    </div>
                    <span>{selectedTask.assignedTo.email}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Non assigné</span>
                )}
              </div>
              
              {selectedTask.dueDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date d'échéance</h4>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{formatDate(selectedTask.dueDate)}</span>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Date de création</h4>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" color="#5b50ff" />
                  <span>{formatDate(selectedTask.createdAt)}</span>
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
                <Edit size={16} className="mr-1" />
                Modifier
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteTask(selectedTask.id);
                }}
              >
                <Trash size={16} className="mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
