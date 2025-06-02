import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD } from '../graphql/queries';
import { 
  CREATE_COLUMN, UPDATE_COLUMN, DELETE_COLUMN, REORDER_COLUMNS,
  CREATE_TASK, UPDATE_TASK, DELETE_TASK, MOVE_TASK,
  ADD_COMMENT, DELETE_COMMENT
} from '../graphql/mutations';
import { 
  KanbanBoard, CreateColumnInput, UpdateColumnInput, ReorderColumnsInput,
  CreateTaskInput, UpdateTaskInput, MoveTaskInput, AddCommentInput
} from '../types/kanban';

export const useKanbanBoard = (boardId: string) => {
  // Récupérer les données du tableau
  const { 
    data: boardData, 
    loading: boardLoading, 
    error: boardError,
    refetch: refetchBoard 
  } = useQuery<{ board: KanbanBoard }>(GET_BOARD, {
    variables: { id: boardId },
    fetchPolicy: 'cache-and-network',
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
  const createColumn = async (input: CreateColumnInput) => {
    try {
      const { data } = await createColumnMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.createColumn;
    } catch (error) {
      console.error("Erreur lors de la création de la colonne:", error);
      throw error;
    }
  };

  const updateColumn = async (input: UpdateColumnInput) => {
    try {
      const { data } = await updateColumnMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.updateColumn;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la colonne:", error);
      throw error;
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      const { data } = await deleteColumnMutation({
        variables: { boardId, columnId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteColumn;
    } catch (error) {
      console.error("Erreur lors de la suppression de la colonne:", error);
      throw error;
    }
  };

  const reorderColumns = async (input: ReorderColumnsInput) => {
    try {
      const { data } = await reorderColumnsMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.reorderColumns;
    } catch (error) {
      console.error("Erreur lors de la réorganisation des colonnes:", error);
      throw error;
    }
  };

  // Fonctions pour les tâches
  const createTask = async (input: CreateTaskInput) => {
    try {
      const { data } = await createTaskMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.createTask;
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }
  };

  const updateTask = async (input: UpdateTaskInput) => {
    try {
      const { data } = await updateTaskMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.updateTask;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      throw error;
    }
  };

  const deleteTask = async (columnId: string, taskId: string) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { boardId, columnId, taskId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteTask;
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  };

  const moveTask = async (input: MoveTaskInput) => {
    try {
      const { data } = await moveTaskMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.moveTask;
    } catch (error) {
      console.error("Erreur lors du déplacement de la tâche:", error);
      throw error;
    }
  };

  // Fonctions pour les commentaires
  const addComment = async (input: AddCommentInput) => {
    try {
      const { data } = await addCommentMutation({
        variables: { input },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.addComment;
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  };

  const deleteComment = async (columnId: string, taskId: string, commentId: string) => {
    try {
      const { data } = await deleteCommentMutation({
        variables: { boardId, columnId, taskId, commentId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteComment;
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      throw error;
    }
  };

  return {
    board: boardData?.board,
    boardLoading,
    boardError,
    refetchBoard,
    
    // Opérations sur les colonnes
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    createColumnLoading,
    updateColumnLoading,
    deleteColumnLoading,
    reorderColumnsLoading,
    
    // Opérations sur les tâches
    createTask,
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
