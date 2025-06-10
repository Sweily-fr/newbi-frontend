import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD } from '../graphql/queries';
import { 
  CREATE_COLUMN, UPDATE_COLUMN, DELETE_COLUMN, REORDER_COLUMNS,
  CREATE_TASK, UPDATE_TASK, DELETE_TASK, MOVE_TASK,
  ADD_COMMENT, DELETE_COMMENT
} from '../graphql/mutations';
import { 
  KanbanBoard, ColumnInput, ColumnUpdateInput, ReorderColumnsInput,
  TaskInput, TaskUpdateInput, MoveTaskInput, CommentInput
} from '../types/kanban';
import { logger } from '../../../utils/logger';

// Colonnes par défaut pour les tableaux Kanban
const DEFAULT_COLUMNS = [
  { title: 'À faire', order: 0 },
  { title: 'En cours', order: 1 },
  { title: 'En attente', order: 2 },
  { title: 'Terminée', order: 3 }
];

export const useKanbanBoard = (boardId: string) => {
  // Récupérer les données du tableau
  const { 
    data: boardData, 
    loading: boardLoading, 
    error: boardError,
    refetch: refetchBoard 
  } = useQuery<{ kanbanBoard: KanbanBoard }>(GET_BOARD, {
    variables: { id: boardId },
    fetchPolicy: 'cache-and-network',
    // Activer le polling pour les mises à jour en temps réel
    pollInterval: 5000, // Rafraîchir toutes les 5 secondes
    skip: !boardId,
  });

  // Mutations pour les colonnes
  const [createColumnMutation, { loading: createColumnLoading }] = useMutation(CREATE_COLUMN);
  const [updateColumnMutation, { loading: updateColumnLoading }] = useMutation(UPDATE_COLUMN);
  const [deleteColumnMutation, { loading: deleteColumnLoading }] = useMutation(DELETE_COLUMN);
  const [reorderColumnsMutation, { loading: reorderColumnsLoading }] = useMutation(REORDER_COLUMNS);

  // Mutations pour les tâches
  const [createTaskMutation, { loading: createTaskLoading }] = useMutation(CREATE_TASK);
  const [updateTaskMutation, { loading: updateTaskLoading }] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation, { loading: deleteTaskLoading }] = useMutation(DELETE_TASK);
  const [moveTaskMutation, { loading: moveTaskLoading }] = useMutation(MOVE_TASK);

  // Mutations pour les commentaires
  const [addCommentMutation, { loading: addCommentLoading }] = useMutation(ADD_COMMENT);
  const [deleteCommentMutation, { loading: deleteCommentLoading }] = useMutation(DELETE_COMMENT);

  // Fonctions pour les colonnes
  const createColumn = async (input: ColumnInput) => {
    try {
      logger.log(`Création de colonne avec titre "${input.title}" pour le tableau ${boardId}`);
      
      // Exécuter la mutation avec mise à jour optimiste du cache
      const { data } = await createColumnMutation({
        variables: { boardId, input },
        update: (cache, { data: mutationData }) => {
          try {
            // Récupérer les données actuelles du cache
            const existingData = cache.readQuery({
              query: GET_BOARD,
              variables: { id: boardId }
            });
            
            if (existingData && mutationData?.addKanbanColumn) {
              // Mettre à jour le cache avec les nouvelles données
              cache.writeQuery({
                query: GET_BOARD,
                variables: { id: boardId },
                data: { kanbanBoard: mutationData.addKanbanColumn }
              });
              logger.log("Cache mis à jour avec la nouvelle colonne");
            }
          } catch (cacheError) {
            logger.error("Erreur lors de la mise à jour du cache:", cacheError);
          }
        },
        // Refetch pour s'assurer que les données sont à jour
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
        // Force le refetch pour garantir des données fraîches
        awaitRefetchQueries: true
      });
      
      logger.log("Résultat de la mutation addKanbanColumn:", data);
      
      if (!data || !data.addKanbanColumn) {
        throw new Error("La mutation addKanbanColumn n'a pas retourné de données");
      }
      
      // Forcer un rafraîchissement manuel pour garantir la mise à jour
      setTimeout(() => {
        refetchBoard();
      }, 100);
      
      return data.addKanbanColumn;
    } catch (error) {
      logger.error("Erreur lors de la création de la colonne:", error);
      throw error;
    }
  };

  const updateColumn = async (input: ColumnUpdateInput & { columnId: string }) => {
    try {
      const { columnId, ...updateData } = input;
      const { data } = await updateColumnMutation({
        variables: {
          boardId,
          columnId,
          input: updateData
        },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.updateKanbanColumn;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la colonne:", error);
      throw error;
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      const { data } = await deleteColumnMutation({
        variables: {
          boardId,
          columnId
        },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteKanbanColumn;
    } catch (error) {
      logger.error("Erreur lors de la suppression de la colonne:", error);
      throw error;
    }
  };

  const reorderColumns = async (input: ReorderColumnsInput) => {
    try {
      const { data } = await reorderColumnsMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.reorderKanbanColumns;
    } catch (error) {
      logger.error("Erreur lors de la réorganisation des colonnes:", error);
      throw error;
    }
  };

  // Fonctions pour les tâches
  const createTask = async (input: TaskInput & { columnId: string }) => {
    try {
      const { columnId, ...taskData } = input;
      // Ajouter le status par défaut si non fourni
      const taskInput = {
        ...taskData,
        status: taskData.status || 'todo' // Valeur par défaut pour le status requis
      };
      
      const { data } = await createTaskMutation({
        variables: { 
          boardId, 
          columnId, 
          input: taskInput 
        },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.addKanbanTask;
    } catch (error) {
      logger.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }
  };

  const updateTask = async (input: TaskUpdateInput & { taskId: string }) => {
    try {
      const { taskId, ...updateData } = input;
      // Corriger les paramètres pour correspondre à la mutation GraphQL
      const { data } = await updateTaskMutation({
        variables: { 
          boardId, // Utiliser boardId directement comme paramètre
          taskId,  // Utiliser taskId directement comme paramètre
          input: updateData // Ne pas inclure boardId dans l'input
        },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.updateKanbanTask;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la tâche:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { boardId, taskId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteKanbanTask;
    } catch (error) {
      logger.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  };

  const moveTask = async (input: MoveTaskInput) => {
    try {
      const { taskId, sourceColumnId, destinationColumnId, newOrder } = input;
      
      const { data } = await moveTaskMutation({
        variables: { 
          boardId, 
          taskId, 
          sourceColumnId, 
          targetColumnId: destinationColumnId, // Renommer destinationColumnId en targetColumnId
          order: newOrder || 0 // Utiliser newOrder ou 0 par défaut
        },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.moveKanbanTask;
    } catch (error) {
      logger.error("Erreur lors du déplacement de la tâche:", error);
      throw error;
    }
  };

  // Fonctions pour les commentaires
  const addComment = async (input: CommentInput & { taskId: string }) => {
    try {
      const { taskId, ...commentData } = input;
      const { data } = await addCommentMutation({
        variables: { input: { ...commentData, boardId, taskId } },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.addKanbanComment;
    } catch (error) {
      logger.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string, taskId: string) => {
    try {
      const { data } = await deleteCommentMutation({
        variables: { boardId, taskId, commentId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteKanbanComment;
    } catch (error) {
      logger.error("Erreur lors de la suppression du commentaire:", error);
      throw error;
    }
  };

  // Fonction pour initialiser les colonnes par défaut si le tableau est vide
  const initializeDefaultColumns = async () => {
    if (!boardData?.kanbanBoard) {
      logger.log("Impossible d'initialiser les colonnes : tableau non disponible");
      return;
    }
    
    const board = boardData.kanbanBoard;
    
    // Vérifier si le tableau a déjà des colonnes
    if (board.columns.length > 0) {
      logger.log("Le tableau possède déjà des colonnes, initialisation ignorée");
      return;
    }
    
    try {
      logger.log(`Création des colonnes par défaut pour le tableau ${board.id}`);
      
      // Créer les colonnes par défaut en séquence
      for (const column of DEFAULT_COLUMNS) {
        logger.log(`Création de la colonne par défaut: ${column.title}`);
        await createColumn(column);
        // Ajouter un petit délai entre chaque création pour éviter les conflits
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Rafraîchir une dernière fois pour s'assurer que toutes les colonnes sont chargées
      await refetchBoard();
      logger.log("Colonnes par défaut créées avec succès");
    } catch (error) {
      logger.error("Erreur lors de l'initialisation des colonnes par défaut:", error);
      throw error;
    }
  };

  return {
    board: boardData?.kanbanBoard,
    boardLoading,
    boardError,
    refetchBoard,
    
    // Opérations sur les colonnes
    createColumn,
    addColumn: createColumn, // Alias pour maintenir la compatibilité avec le composant KanbanBoard
    updateColumn,
    deleteColumn,
    reorderColumns,
    createColumnLoading,
    updateColumnLoading,
    deleteColumnLoading,
    reorderColumnsLoading,
    initializeDefaultColumns,
    
    // Opérations sur les tâches
    createTask,
    addTask: createTask, // Alias pour maintenir la compatibilité avec le composant KanbanBoard
    updateTask,
    deleteTask,
    moveTask,
    createTaskLoading,
    updateTaskLoading,
    deleteTaskLoading,
    moveTaskLoading,
    
    // Opérations sur les commentaires
    addComment,
    deleteComment,
    addCommentLoading,
    deleteCommentLoading,
  };
};
