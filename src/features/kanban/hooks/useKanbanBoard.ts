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
      const { data } = await createColumnMutation({
        variables: { input: { ...input, boardId } },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.createKanbanColumn;
    } catch (error) {
      console.error("Erreur lors de la création de la colonne:", error);
      throw error;
    }
  };

  const updateColumn = async (input: ColumnUpdateInput & { columnId: string }) => {
    try {
      const { columnId, ...updateData } = input;
      const { data } = await updateColumnMutation({
        variables: { id: columnId, input: { ...updateData, boardId } },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.updateKanbanColumn;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la colonne:", error);
      throw error;
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      const { data } = await deleteColumnMutation({
        variables: { id: columnId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteKanbanColumn;
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
      return data.reorderKanbanColumns;
    } catch (error) {
      console.error("Erreur lors de la réorganisation des colonnes:", error);
      throw error;
    }
  };

  // Fonctions pour les tâches
  const createTask = async (input: TaskInput & { columnId: string }) => {
    try {
      const { columnId, ...taskData } = input;
      const { data } = await createTaskMutation({
        variables: { input: { ...taskData, boardId, columnId } },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.createKanbanTask;
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      throw error;
    }
  };

  const updateTask = async (input: TaskUpdateInput & { taskId: string }) => {
    try {
      const { taskId, ...updateData } = input;
      const { data } = await updateTaskMutation({
        variables: { id: taskId, input: { ...updateData, boardId } },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.updateKanbanTask;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { id: taskId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteKanbanTask;
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  };

  const moveTask = async (input: MoveTaskInput) => {
    try {
      const { data } = await moveTaskMutation({
        variables: { input: { ...input, boardId } },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.moveKanbanTask;
    } catch (error) {
      console.error("Erreur lors du déplacement de la tâche:", error);
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
      console.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { data } = await deleteCommentMutation({
        variables: { id: commentId },
        refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
      });
      return data.deleteKanbanComment;
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
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
