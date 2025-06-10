import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { KanbanTask } from '../../types/kanban';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageCircle, Calendar, User, Edit2, Trash, Add, DocumentText, InfoCircle, Clock, Activity, People } from 'iconsax-react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { KanbanColumnDndKit } from '../ui/KanbanColumnDndKit';
import { KanbanTaskDndKit } from '../ui/KanbanTaskDndKit';
import { logger } from '../../../../utils/logger';
// CSS est utilisé dans KanbanTaskDndKit, pas besoin de l'importer ici

// Fonction de formatage de date
const formatDate = (date: string): string => {
  if (!date) return '';
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

// Type pour les éléments glissables utilisé dans le drag and drop
interface DragItem {
  id: string;
  type: 'column' | 'task';
  columnId?: string;
}

export const KanbanBoard: React.FC<{ boardId: string }> = ({ boardId }) => {
  // États pour les modales
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  
  // États pour l'édition de tâche
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');
  // États pour suivre l'élément actif dans le drag and drop
  // activeItem est utilisé pour stocker les informations de l'élément en cours de déplacement
  const [, setActiveItem] = useState<DragItem | null>(null);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  // activeTaskId n'est pas directement utilisé dans le rendu mais est nécessaire pour le suivi interne
  const [, setActiveTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

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
    boardLoading,
    boardError,
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

    return {
      ...board,
      columns: board.columns || []
    };
  }, [board, boardId]);

  // Mettre à jour l'interface quand les données du tableau changent
  useEffect(() => {
    // Effet pour réagir aux changements des données du tableau
    // Actuellement vide car le rendu est géré par React avec normalizedBoard
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
          logger.log(`Moving task ${taskId} from column ${sourceColumnId} to column ${destinationColumnId}`);
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
          logger.log(`Moving task ${taskId} from column ${sourceColumnId} to column ${destinationColumnId}`);
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
      const taskId = active.id as string;
      const columnId = active.data.current.columnId as string;
      
      setActiveItem({
        id: taskId,
        type: 'task',
        columnId: columnId
      });
      
      // Trouver la tâche correspondante pour l'overlay
      if (board && board.columns) {
        const column = board.columns.find(col => col.id === columnId);
        if (column && column.tasks) {
          const task = column.tasks.find(t => t.id === taskId);
          if (task) {
            setActiveTask(task);
            setActiveTaskId(taskId);
            setActiveColumnId(columnId);
          }
        }
      }
    }
  }, [board, setActiveItem, setActiveTask, setActiveTaskId, setActiveColumnId]);

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
      logger.error('Erreur lors de l\'initialisation des colonnes:', error);
    }
  }, [board, addColumn]);

  // Initialiser les colonnes au chargement initial
  useEffect(() => {
    if (board && !boardLoading) {
      initializeColumns();
    }
  }, [board, boardLoading, initializeColumns]);

  // Fonction pour ajouter une colonne (utilisée dans l'UI)
  const handleAddColumn = useCallback(async () => {
    if (!newColumnTitle.trim()) {
      return;
    }

    try {
      await addColumn({ title: newColumnTitle });
      setNewColumnTitle('');
    } catch (error) {
      logger.error('Erreur lors de l\'ajout de la colonne:', error);
    }
  }, [newColumnTitle, addColumn]);

  // Fonction pour ajouter une tâche
  const handleAddTask = useCallback(async (columnId: string, title: string, description?: string, dueDate?: string, priority?: string) => {
    // Si title n'est pas fourni ou vide, on ne fait rien
    if (!title?.trim() || !columnId) {
      return;
    }

    try {
      // Créer un tableau de labels basé sur la priorité
      const labels: string[] = [];
      if (priority) {
        labels.push(priority); // Ajouter la priorité comme label
      }

      await addTask({
        title,
        description: description || '',
        columnId,
        dueDate: dueDate || undefined,
        labels
      });
    } catch (error) {
      logger.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  }, [addTask]);

  // Gérer la modification d'une colonne - fonction interne avec gestion des promesses
  const handleUpdateColumn = useCallback((columnId: string, title: string) => {
    if (!title.trim()) return;

    try {
      // Appel asynchrone sans attendre
      updateColumn({
        columnId,
        title
      }).catch(error => {
        logger.error("Erreur lors de la mise à jour de la colonne:", error);
      });
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la colonne:", error);
    }
  }, [updateColumn]);
  
  // Fonction wrapper avec la signature exacte attendue par KanbanColumnDndKit
  const handleColumnEdit = useCallback((columnId: string, title?: string) => {
    if (title) handleUpdateColumn(columnId, title);
  }, [handleUpdateColumn]);

  // Gérer la suppression d'une colonne
  const handleDeleteColumn = useCallback(async (columnId: string) => {
    try {
      await deleteColumn(columnId);
    } catch (error) {
      logger.error("Erreur lors de la suppression de la colonne:", error);
    }
  }, [deleteColumn]);
  
  // Fonction pour voir les détails d'une tâche
  const handleViewTask = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  }, [setSelectedTask, setIsTaskDetailModalOpen]);

  // Gérer la mise à jour d'une tâche
  // Fonction commentée car non utilisée actuellement, mais préparée pour une future fonctionnalité
  /*const handleUpdateTask = useCallback(async (taskId: string, updates: Record<string, unknown>) => {
    try {
      await updateTask({
        taskId,
        ...updates as Record<string, unknown> // Conversion de type nécessaire pour compatibilité
      });
      
      // Fermer la modal si la tâche mise à jour est celle affichée
      if (selectedTask?.id === taskId) {
        setIsTaskDetailModalOpen(false);
        setSelectedTask(null);
      }
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  }, [updateTask, selectedTask, setIsTaskDetailModalOpen, setSelectedTask]);*/

// Gérer la suppression d'une tâche
const handleDeleteTask = useCallback(async (taskId: string) => {
  try {
    await deleteTask(taskId);
    
    // Fermer la modale après suppression
    setIsTaskDetailModalOpen(false);
    setSelectedTask(null);
  } catch (error) {
    logger.error("Erreur lors de la suppression de la tâche:", error);
  }
}, [deleteTask, setIsTaskDetailModalOpen, setSelectedTask]);

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
          <MessageCircle size={20} variant="Bold" className="mr-2" />
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
          <MessageCircle size={20} variant="Bold" color="#5b50ff" className="mr-2" />
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
                <KanbanColumnDndKit
                  key={column.id}
                  column={column}
                  onTaskClick={handleViewTask}
                  onAddTask={handleAddTask}
                  onEditColumn={handleColumnEdit}
                  onDeleteColumn={handleDeleteColumn}
                />
              ))
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="bg-[#f0eeff] border border-[#5b50ff]/20 rounded-lg p-4 text-gray-700">
                <p className="flex items-center">
                  <MessageCircle size={20} color="#5b50ff" className="mr-2" />
                  Aucune colonne n'a été créée pour ce tableau.
                </p>
              </div>
            </div>
          )}
          
          {/* Bouton pour ajouter une colonne */}
          <div className="flex-shrink-0 w-72 h-fit">
            <button
              onClick={() => setIsAddColumnModalOpen(true)}
              className="w-full bg-[#f0eeff] hover:bg-[#e6e1ff] text-[#5b50ff] border border-[#5b50ff]/20 rounded-lg p-3 flex items-center justify-center transition-colors duration-200"
            >
              <Add size={18} className="mr-2" />
              Ajouter une colonne
            </button>
          </div>
        </div>
      </div>
      
      {/* DragOverlay pour afficher la tâche qui suit la souris pendant le drag */}
      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <KanbanTaskDndKit
            task={activeTask}
            onClick={() => {}}
            columnId={activeColumnId || ''}
          />
        )}
      </DragOverlay>
    </DndContext>
    
    {/* Modal d'ajout de colonne */}
    <Modal
      isOpen={isAddColumnModalOpen}
      onClose={() => setIsAddColumnModalOpen(false)}
      title="Ajouter une colonne"
      size="sm"
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        if (newColumnTitle.trim()) {
          handleAddColumn();
          setIsAddColumnModalOpen(false);
        }
      }} className="p-4">
        <div className="mb-4">
          <label htmlFor="column-title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la colonne
          </label>
          <input
            id="column-title"
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Ex: À faire, En cours, Terminé..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
            autoFocus
            aria-label="Titre de la nouvelle colonne"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsAddColumnModalOpen(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!newColumnTitle.trim()}
            className="px-4 py-2 bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter
          </button>
        </div>
      </form>
    </Modal>
    
    {/* Modal de détail de tâche */}
    {selectedTask && isTaskDetailModalOpen && (
      <Modal
        isOpen={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        title={selectedTask.title}
        size="lg"
      >
        <div className="p-4">
          {/* En-tête avec priorité */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {selectedTask.labels && selectedTask.labels.length > 0 && (
                <div className="mr-3">
                  {selectedTask.labels.includes('high') && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-200">
                      Priorité haute
                    </span>
                  )}
                  {selectedTask.labels.includes('medium') && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-orange-200">
                      Priorité moyenne
                    </span>
                  )}
                  {selectedTask.labels.includes('low') && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-200">
                      Priorité basse
                    </span>
                  )}
                </div>
              )}
              <div className="bg-[#f0eeff] text-[#5b50ff] text-sm font-medium px-2 py-1 rounded-md inline-block">
                {selectedTask.status}
              </div>
            </div>
            
            {selectedTask.dueDate && (
              <div className="flex items-center text-sm">
                <Calendar size={16} variant="Bold" className="mr-1 text-[#5b50ff]" />
                <span className={`${new Date(selectedTask.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                  Échéance : {formatDate(selectedTask.dueDate)}
                </span>
              </div>
            )}
          </div>
          
          {/* Description de la tâche */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <DocumentText size={18} variant="Bold" className="mr-2 text-[#5b50ff]" />
              Description
            </h3>
            {selectedTask.description ? (
              <p className="text-gray-700 whitespace-pre-line">{selectedTask.description}</p>
            ) : (
              <p className="text-gray-500 italic">Aucune description fournie pour cette tâche.</p>
            )}
          </div>
          
          {/* Informations sur la tâche */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Colonne gauche */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                <InfoCircle size={18} variant="Bold" className="mr-2 text-[#5b50ff]" />
                Détails
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Créée le</h4>
                  <div className="flex items-center">
                    <Clock size={14} variant="Linear" className="mr-2 text-gray-400" />
                    <span>{format(new Date(selectedTask.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Statut</h4>
                  <div className="flex items-center">
                    <Activity size={14} variant="Bold" className="mr-2 text-[#5b50ff]" />
                    <div className="bg-[#f0eeff] text-[#5b50ff] text-sm font-medium px-2 py-1 rounded-md">
                      {selectedTask.status}
                    </div>
                  </div>
                </div>
                
                {selectedTask.dueDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Date d'échéance</h4>
                    <div className="flex items-center">
                      <Calendar size={14} variant="Linear" className="mr-2 text-gray-400" />
                      <span>{format(new Date(selectedTask.dueDate), 'dd MMMM yyyy', { locale: fr })}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Colonne droite */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                <People size={18} variant="Bold" className="mr-2 text-[#5b50ff]" />
                Membres
              </h3>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Assigné à</h4>
                {selectedTask.assignedTo ? (
                  <div className="flex items-center bg-[#f0eeff]/50 p-2 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center mr-2 border border-[#5b50ff]/20">
                      <User size={16} variant="Bold" color="#5b50ff" />
                    </div>
                    <span>{selectedTask.assignedTo.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center bg-gray-100 p-2 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <User size={16} variant="Linear" color="#9ca3af" />
                    </div>
                    <span className="text-gray-500">Non assigné</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (selectedTask) {
                  // Initialiser les valeurs du formulaire d'édition
                  setEditTaskTitle(selectedTask.title);
                  setEditTaskDescription(selectedTask.description || '');
                  setEditTaskStatus(selectedTask.status || '');
                  setEditTaskDueDate(selectedTask.dueDate || '');
                  setIsEditTaskModalOpen(true);
                  setIsTaskDetailModalOpen(false);
                }
              }}
            >
              <Edit2 size={16} variant="Bold" className="mr-1" />
              Modifier
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleDeleteTask(selectedTask.id);
              }}
            >
              <Trash size={16} variant="Bold" className="mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    )}

    {/* Modale d'édition de tâche */}
    {isEditTaskModalOpen && selectedTask && (
      <Modal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setIsTaskDetailModalOpen(true); // Revenir à la modale de détail
        }}
        title="Modifier la tâche"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              id="taskTitle"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="taskDescription"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent min-h-[100px]"
              value={editTaskDescription}
              onChange={(e) => setEditTaskDescription(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="taskStatus"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
              value={editTaskStatus}
              onChange={(e) => setEditTaskStatus(e.target.value)}
            >
              <option value="">Sélectionner un statut</option>
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="En attente">En attente</option>
              <option value="Terminée">Terminée</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              id="taskDueDate"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
              value={editTaskDueDate ? new Date(editTaskDueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditTaskDueDate(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditTaskModalOpen(false);
                setIsTaskDetailModalOpen(true); // Revenir à la modale de détail
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (selectedTask && editTaskTitle.trim()) {
                  try {
                    // Récupérer l'ancien statut et la colonne actuelle de la tâche
                    const oldStatus = selectedTask.status;
                    const newStatus = editTaskStatus;
                    
                    // Mettre à jour la tâche
                    await updateTask({
                      taskId: selectedTask.id,
                      title: editTaskTitle,
                      description: editTaskDescription,
                      status: editTaskStatus,
                      dueDate: editTaskDueDate ? new Date(editTaskDueDate).toISOString() : undefined,
                    });
                    
                    // Si le statut a changé, déplacer la tâche vers la colonne correspondante
                    if (newStatus && oldStatus !== newStatus && normalizedBoard.columns.length > 0) {
                      // Trouver la colonne source (où se trouve actuellement la tâche)
                      let sourceColumn = null;
                      for (const column of normalizedBoard.columns) {
                        if (column.tasks.some(task => task.id === selectedTask.id)) {
                          sourceColumn = column;
                          break;
                        }
                      }
                      
                      // Trouver la colonne de destination basée sur le nouveau statut
                      const destinationColumn = normalizedBoard.columns.find(column => column.title === newStatus);
                      
                      if (sourceColumn && destinationColumn && sourceColumn.id !== destinationColumn.id) {
                        logger.log(`Déplacement de la tâche de la colonne "${sourceColumn.title}" vers "${destinationColumn.title}"`);
                        
                        // Déplacer la tâche vers la nouvelle colonne
                        await moveTask({
                          taskId: selectedTask.id,
                          sourceColumnId: sourceColumn.id,
                          destinationColumnId: destinationColumn.id,
                          newOrder: 0 // Placer la tâche en haut de la colonne
                        });
                      }
                    }
                    
                    // Fermer la modale d'édition
                    setIsEditTaskModalOpen(false);
                    // Fermer également la modale de détail pour montrer les changements
                    setIsTaskDetailModalOpen(false);
                    setSelectedTask(null);
                    
                    // Afficher un message de succès (à implémenter si nécessaire)
                    logger.log('Tâche mise à jour avec succès');
                  } catch (error) {
                    logger.error('Erreur lors de la mise à jour de la tâche:', error);
                    // Afficher un message d'erreur (à implémenter si nécessaire)
                  }
                }
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    )}
    </div>
  );
};
