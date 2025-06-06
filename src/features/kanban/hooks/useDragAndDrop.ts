import { useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { KanbanBoard } from '../types/kanban';

interface UseDragAndDropProps {
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

export const useDragAndDrop = ({ board, moveTask, reorderColumns }: UseDragAndDropProps) => {
  const [localBoard, setLocalBoard] = useState<KanbanBoard | null>(null);
  
  // Mettre à jour l'état local lorsque le board change
  if (board && (!localBoard || board.id !== localBoard?.id)) {
    setLocalBoard(board);
  }

  // Fonction pour gérer la fin d'un drag-and-drop
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    
    // Si pas de destination ou si source = destination, ne rien faire
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }
    
    // Si on déplace une colonne
    if (type === 'column' && localBoard) {
      const newColumns = [...localBoard.columns];
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      
      // Mettre à jour l'ordre local immédiatement pour une meilleure UX
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
      
      return;
    }
    
    // Si on déplace une tâche
    if (type === 'task' && localBoard) {
      const sourceColumnId = source.droppableId;
      const destinationColumnId = destination.droppableId;
      
      // Trouver les colonnes source et destination
      const sourceColumn = localBoard.columns.find(col => col.id === sourceColumnId);
      const destinationColumn = localBoard.columns.find(col => col.id === destinationColumnId);
      
      if (!sourceColumn || !destinationColumn) return;
      
      // Copier les tâches des colonnes concernées
      const sourceTasks = [...sourceColumn.tasks];
      const destinationTasks = sourceColumnId === destinationColumnId 
        ? sourceTasks 
        : [...destinationColumn.tasks];
      
      // Récupérer la tâche déplacée
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      // Si même colonne, réordonner les tâches
      if (sourceColumnId === destinationColumnId) {
        destinationTasks.splice(destination.index, 0, movedTask);
        
        // Mettre à jour l'ordre local immédiatement
        const newColumns = localBoard.columns.map(col => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              tasks: destinationTasks.map((task, index) => ({
                ...task,
                order: index
              }))
            };
          }
          return col;
        });
        
        setLocalBoard({
          ...localBoard,
          columns: newColumns
        });
      } 
      // Si colonnes différentes, déplacer la tâche
      else {
        destinationTasks.splice(destination.index, 0, {
          ...movedTask,
          status: destinationColumn.title
        });
        
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
        
        setLocalBoard({
          ...localBoard,
          columns: newColumns
        });
      }
      
      // Envoyer la mise à jour au serveur
      try {
        await moveTask({
          boardId: board.id,
          sourceColumnId,
          destinationColumnId,
          taskId: movedTask.id,
          newOrder: destination.index
        });
      } catch (error) {
        console.error("Erreur lors du déplacement de la tâche:", error);
        // En cas d'erreur, revenir à l'état précédent
        setLocalBoard(board);
      }
    }
  };
  
  return {
    localBoard: localBoard || board,
    handleDragEnd
  };
};
