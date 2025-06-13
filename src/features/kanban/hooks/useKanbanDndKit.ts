import { useState, useEffect } from 'react';
import { KanbanBoard, KanbanColumn, KanbanTask } from '../types/kanban';
import { arrayMove } from '@dnd-kit/sortable';

interface UseKanbanDndKitProps {
  board: KanbanBoard;
  moveTask: (input: {
    boardId: string;
    sourceColumnId: string;
    destinationColumnId: string;
    taskId: string;
    newOrder: number;
  }) => Promise<void>;
  reorderColumns: (input: {
    boardId: string;
    columnIds: string[];
  }) => Promise<void>;
}

export const useKanbanDndKit = ({ board, moveTask, reorderColumns }: UseKanbanDndKitProps) => {
  const [localBoard, setLocalBoard] = useState<KanbanBoard | null>(null);
  
  // Mettre à jour l'état local lorsque le board change
  useEffect(() => {
    if (board) {
      console.log("Mise à jour du localBoard depuis useKanbanDndKit");
      setLocalBoard(board);
    }
  }, [board]);

  // Fonction pour gérer le déplacement d'une colonne
  const handleColumnReorder = async (activeId: string, overId: string) => {
    if (!localBoard) return;
    
    const oldColumns = [...localBoard.columns];
    const activeColumnIndex = oldColumns.findIndex(col => col.id === activeId);
    const overColumnIndex = oldColumns.findIndex(col => col.id === overId);
    
    if (activeColumnIndex === -1 || overColumnIndex === -1) return;
    
    // Réorganiser les colonnes localement
    const newColumns = arrayMove(oldColumns, activeColumnIndex, overColumnIndex);
    
    // Mettre à jour l'état local immédiatement pour une meilleure UX
    const updatedBoard = {
      ...localBoard,
      columns: newColumns.map((col, index) => ({
        ...col,
        order: index
      }))
    };
    setLocalBoard(updatedBoard);
    
    // Envoyer la mise à jour au serveur
    try {
      await reorderColumns({
        boardId: board.id,
        columnIds: newColumns.map(col => col.id)
      });
    } catch (error) {
      console.error("Erreur lors de la réorganisation des colonnes:", error);
      // En cas d'erreur, revenir à l'état précédent
      setLocalBoard(board);
    }
  };
  
  // Fonction pour gérer le déplacement d'une tâche
  const handleTaskMove = async (
    taskId: string, 
    sourceColumnId: string, 
    destinationColumnId: string, 
    newIndex: number
  ) => {
    if (!localBoard) return;
    
    // Trouver les colonnes source et destination
    const sourceColumn = localBoard.columns.find(col => col.id === sourceColumnId);
    const destinationColumn = localBoard.columns.find(col => col.id === destinationColumnId);
    
    if (!sourceColumn || !destinationColumn) return;
    
    // Trouver la tâche à déplacer
    const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);
    if (!taskToMove) return;
    
    // Copier les tâches des colonnes concernées
    const sourceTasks = [...sourceColumn.tasks];
    const destinationTasks = sourceColumnId === destinationColumnId 
      ? sourceTasks 
      : [...destinationColumn.tasks];
    
    // Supprimer la tâche de la colonne source
    const sourceTaskIndex = sourceTasks.findIndex(task => task.id === taskId);
    if (sourceTaskIndex === -1) return;
    const [movedTask] = sourceTasks.splice(sourceTaskIndex, 1);
    
    // Ajouter la tâche à la colonne destination
    if (sourceColumnId === destinationColumnId) {
      // Même colonne, juste réordonner
      destinationTasks.splice(newIndex, 0, movedTask);
    } else {
      // Colonnes différentes, changer aussi le statut
      const taskWithNewStatus = {
        ...movedTask,
        status: destinationColumn.title
      };
      destinationTasks.splice(newIndex, 0, taskWithNewStatus);
    }
    
    // Mettre à jour l'ordre local immédiatement
    const newColumns = localBoard.columns.map(col => {
      if (col.id === sourceColumnId) {
        return {
          ...col,
          tasks: sourceTasks.map((task, index) => ({
            ...task,
            order: index
          }))
        };
      }
      if (col.id === destinationColumnId) {
        return {
          ...col,
          tasks: destinationTasks.map((task, index) => ({
            ...task,
            order: index,
            status: col.title
          }))
        };
      }
      return col;
    });
    
    // Mettre à jour l'état local
    setLocalBoard({
      ...localBoard,
      columns: newColumns
    });
    
    // Envoyer la mise à jour au serveur
    try {
      await moveTask({
        boardId: board.id,
        sourceColumnId,
        destinationColumnId,
        taskId: movedTask.id,
        newOrder: newIndex
      });
    } catch (error) {
      console.error("Erreur lors du déplacement de la tâche:", error);
      // En cas d'erreur, revenir à l'état précédent
      setLocalBoard(board);
    }
  };
  
  return {
    localBoard: localBoard || board,
    handleColumnReorder,
    handleTaskMove
  };
};
