import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTask } from '../../types/kanban';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, Calendar, User, Edit, Trash, Plus } from 'react-feather';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { KanbanTaskDndKit } from '../ui/KanbanTaskDndKit';

// Fonction de formatage de date
const formatDate = (date: string): string => {
  if (!date) return '';
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

// Types pour les opérations internes du composant
type TaskMoveParams = {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  newOrder: number; // Ordre dans la nouvelle colonne
};

interface DragItem {
  id: string;
  type: 'task';
  columnId: string; // Pour les tâches, colonne d'origine
}

export const KanbanBoard: React.FC<{ boardId: string }> = ({ boardId }) => {
  // États pour les modales
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  // État pour suivre l'élément en cours de glissement
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  
  // Configurer les capteurs pour le drag and drop
  const mouseSensor = useSensor(MouseSensor, {
    // Délai avant de commencer le drag (en ms)
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Délai avant de commencer le drag (en ms)
    activationConstraint: {
      delay: 200,
      tolerance: 8,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);
  
  // Récupérer les données du tableau et les fonctions
  const {
    board,
    loading,
    error: boardError,
    moveTask,
    addColumn,
    addTask,
    updateTask,
    deleteTask,
    updateColumn,
    deleteColumn,
  } = useKanbanBoard(boardId);
  
  // Normaliser les données du board pour s'assurer que toutes les propriétés sont correctement nommées
  const normalizedBoard = useMemo(() => {
    if (!board) return { id: boardId, title: '', columns: [], members: [], createdAt: '' };
    
    // S'assurer que toutes les propriétés sont correctement nommées
    return {
      id: board.id,
      title: board.title,
      description: board.description,
      columns: board.columns.map(column => ({
        id: column.id,
        title: column.title,
        order: column.order,
        tasks: (column.tasks || []).map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          order: task.order,
          dueDate: task.dueDate,
          labels: task.labels,
          assignedTo: task.assignedTo,
          comments: task.comments,
          attachments: task.attachments,
          createdAt: task.createdAt
        }))
      })),
      members: board.members,
      createdAt: board.createdAt
    };
  }, [board, boardId]);
  
  // Définir le localBoard basé sur les données normalisées
  const [localBoard, setLocalBoard] = useState(normalizedBoard);
  
  // Mettre à jour le localBoard quand normalizedBoard change
  useEffect(() => {
    setLocalBoard(normalizedBoard);
  }, [normalizedBoard]);
  
  // Fonction pour gérer la fin du drag-and-drop
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveItem(null);
      return;
    }
    
    // Vérifier si c'est une tâche
    if (active.data.current?.type === 'task') {
      const taskId = active.id as string;
      const sourceColumnId = active.data.current.columnId as string;
      
      // Vérifier si la destination est une colonne ou une tâche
      if (over.data.current?.type === 'task') {
        // Si on dépose sur une autre tâche, on récupère sa colonne
        const destinationColumnId = over.data.current.columnId as string;
        
        if (sourceColumnId !== destinationColumnId) {
          console.log(`Moving task ${taskId} from column ${sourceColumnId} to column ${destinationColumnId}`);
          moveTask({
            taskId,
            sourceColumnId,
            destinationColumnId,
            newOrder: 0 // Valeur par défaut, sera recalculée côté serveur
          });
        }
      } else if (over.data.current?.type === 'column') {
        // Si on dépose directement sur une colonne
        const destinationColumnId = over.id as string;
        
        if (sourceColumnId !== destinationColumnId) {
          console.log(`Moving task ${taskId} from column ${sourceColumnId} to column ${destinationColumnId}`);
          moveTask({
            taskId,
            sourceColumnId,
            destinationColumnId,
            newOrder: 0 // Valeur par défaut, sera recalculée côté serveur
          });
        }
      }
    }
    
    setActiveItem(null);
  }, [moveTask, setActiveItem]);
  
  // Fonction pour gérer le début du drag-and-drop
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'task') {
      setActiveItem({
        id: active.id as string,
        type: 'task',
        columnId: active.data.current.columnId
      });
    }
  }, [setActiveItem]);
  
  // Fonction pour initialiser les colonnes si nécessaire
  const initializeColumns = useCallback(async () => {
    if (!board || board.columns.length > 0) {
      return;
    }
    
    try {
      // Créer les colonnes par défaut
      await addColumn({ title: 'À faire' });
      await addColumn({ title: 'En cours' });
      await addColumn({ title: 'Terminé' });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des colonnes:', error);
    }
  }, [board, addColumn]);
  
  // Initialiser les colonnes au chargement initial
  useEffect(() => {
    if (board && !loading) {
      initializeColumns();
    }
  }, [board, loading, initializeColumns]);
  
  // Fonction pour ajouter une colonne (utilisée dans l'UI)
  const handleAddColumn = useCallback(async () => {
    if (!newColumnTitle.trim()) {
      return;
    }
    
    try {
      await addColumn({ title: newColumnTitle });
      setNewColumnTitle('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la colonne:', error);
    }
  }, [newColumnTitle, addColumn]);
  
  // Fonction pour ajouter une tâche
  const handleAddTask = useCallback(async (columnId: string, title: string) => {
    if (!title.trim() || !columnId) {
      return;
    }
    
    try {
      await addTask({
        title,
        description: '',
        columnId
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  }, [addTask]);
  
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
  
  // Fonction pour voir les détails d'une tâche
  const handleViewTask = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  }, [setSelectedTask, setIsTaskDetailModalOpen]);

// Gérer la mise à jour d'une tâche
const handleUpdateTask = useCallback(async (taskId: string, updates: Record<string, unknown>) => {
  try {
    // Mettre à jour la tâche
    await updateTask({
      taskId,
      ...updates,
    });

    // Fermer la modal si nécessaire
    if (selectedTask?.id === taskId) {
      setIsTaskDetailModalOpen(false);
      setSelectedTask(null);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
  }
}, [updateTask, selectedTask, setIsTaskDetailModalOpen, setSelectedTask]);

// Afficher un message de chargement
if (loading) {
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
  <div className="h-full">
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {/* Nous n'utilisons pas SortableContext pour les colonnes car nous ne voulons pas qu'elles soient triables */}
        <div className="flex gap-4">
          {board.columns && board.columns.length > 0 ? (
            board.columns
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <div 
                  key={column.id} 
                  className="flex flex-col bg-white rounded-lg shadow-sm w-72 min-w-72 max-w-72 h-full"
                  data-type="column"
                >
                  {/* Header de la colonne - sans les attributs de drag */}
                  <div className="p-3 flex items-center justify-between bg-[#f0eeff] rounded-t-lg">
                    <h3 className="font-medium text-gray-800">{column.title}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateColumn(column.id, column.title)}
                        className="p-1 hover:bg-[#e6e1ff] rounded-full transition-colors"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteColumn(column.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Liste des tâches avec SortableContext pour chaque colonne */}
                  <div className="flex-1 p-2 overflow-y-auto bg-gray-50 flex flex-col gap-2 min-h-[200px]">
                    <SortableContext
                      items={column.tasks ? column.tasks.map(task => task.id) : []}
                      strategy={verticalListSortingStrategy}
                    >
                      {column.tasks && column.tasks.length > 0 ? (
                        column.tasks
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((task) => (
                            <KanbanTaskDndKit
                              key={task.id}
                              task={task}
                              columnId={column.id}
                              onClick={() => handleViewTask(task)}
                            />
                          ))
                      ) : (
                        <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
                          Aucune tâche
                        </div>
                      )}
                    </SortableContext>
                  </div>
                  
                  {/* Footer avec bouton d'ajout */}
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => handleAddTask(column.id, 'Nouvelle tâche')}
                      className="w-full flex items-center justify-center py-2 px-3 bg-[#f0eeff] hover:bg-[#e6e1ff] text-[#5b50ff] rounded-md transition-colors text-sm font-medium"
                    >
                      <Plus size={16} className="mr-1" />
                      Ajouter une tâche
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="bg-[#f0eeff] border border-[#5b50ff]/20 rounded-lg p-4 text-gray-700">
                <p className="flex items-center">
                  <MessageSquare size={20} color="#5b50ff" className="mr-2" />
                  Aucune colonne n'a été créée pour ce tableau.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
    
    {/* Modal de détail de tâche */}
    {selectedTask && isTaskDetailModalOpen && (
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
