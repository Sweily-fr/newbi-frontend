import { useQuery, useMutation } from '@apollo/client';
import { GET_BOARDS, GET_BOARD } from '../graphql/queries';
import { CREATE_BOARD, UPDATE_BOARD, DELETE_BOARD } from '../graphql/mutations';
import { BoardsResponse, KanbanBoardInput, KanbanBoardUpdateInput, KanbanBoard } from '../types/kanban';
import { useState } from 'react';

export const useKanbanBoards = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Récupérer tous les tableaux Kanban avec pagination
  const { 
    data: boardsData, 
    loading: boardsLoading, 
    error: boardsError,
    refetch: refetchBoards,
    fetchMore: fetchMoreBoards
  } = useQuery<{ kanbanBoards: BoardsResponse }>(GET_BOARDS, {
    variables: { page, limit },
    fetchPolicy: 'cache-and-network',
  });

  // Fonction pour obtenir la requête d'un tableau Kanban spécifique
  // Cette fonction ne doit pas être appelée directement dans le composant
  const getBoardQuery = (id: string) => {
    return {
      query: GET_BOARD,
      variables: { id },
      fetchPolicy: 'cache-and-network' as const,
    };
  };

  // Créer un nouveau tableau Kanban
  const [createBoardMutation, { loading: createBoardLoading }] = useMutation(CREATE_BOARD, {
    update(cache, { data: { createKanbanBoard } }) {
      try {
        // Mettre à jour le cache pour la requête GET_BOARDS
        const existingData = cache.readQuery<{ kanbanBoards: BoardsResponse }>({
          query: GET_BOARDS,
          variables: { page: 1, limit },
        });

        if (existingData) {
          cache.writeQuery({
            query: GET_BOARDS,
            variables: { page: 1, limit },
            data: {
              kanbanBoards: {
                boards: [createKanbanBoard, ...existingData.kanbanBoards.boards],
                totalCount: existingData.kanbanBoards.totalCount + 1,
                hasNextPage: existingData.kanbanBoards.hasNextPage,
              },
            },
          });
        }
      } catch (e) {
        console.error("Erreur lors de la mise à jour du cache:", e);
      }
    },
  });

  const createBoard = async (input: KanbanBoardInput) => {
    try {
      const { data } = await createBoardMutation({
        variables: { input },
      });
      return data.createKanbanBoard;
    } catch (error) {
      console.error("Erreur lors de la création du tableau:", error);
      throw error;
    }
  };

  // Mettre à jour un tableau Kanban
  const [updateBoardMutation, { loading: updateBoardLoading }] = useMutation(UPDATE_BOARD);

  const updateBoard = async (id: string, input: KanbanBoardUpdateInput) => {
    try {
      const { data } = await updateBoardMutation({
        variables: { id, input },
      });
      return data.updateKanbanBoard;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tableau:", error);
      throw error;
    }
  };

  // Supprimer un tableau Kanban
  const [deleteBoardMutation, { loading: deleteBoardLoading }] = useMutation(DELETE_BOARD, {
    update(cache, { data: { deleteKanbanBoard } }) {
      try {
        // Mettre à jour le cache pour la requête GET_BOARDS
        const existingData = cache.readQuery<{ kanbanBoards: BoardsResponse }>({
          query: GET_BOARDS,
          variables: { page, limit },
        });

        if (existingData) {
          cache.writeQuery({
            query: GET_BOARDS,
            variables: { page, limit },
            data: {
              kanbanBoards: {
                boards: existingData.kanbanBoards.boards.filter((board: KanbanBoard) => board.id !== deleteKanbanBoard),
                totalCount: existingData.kanbanBoards.totalCount - 1,
                hasNextPage: existingData.kanbanBoards.hasNextPage,
              },
            },
          });
        }
      } catch (e) {
        console.error("Erreur lors de la mise à jour du cache:", e);
      }
    },
  });

  const deleteBoard = async (id: string) => {
    try {
      const { data } = await deleteBoardMutation({
        variables: { id },
      });
      return data.deleteBoard;
    } catch (error) {
      console.error("Erreur lors de la suppression du tableau:", error);
      throw error;
    }
  };

  // Charger plus de tableaux (pagination)
  const loadMoreBoards = () => {
    if (boardsData?.kanbanBoards?.hasNextPage) {
      fetchMoreBoards({
        variables: {
          page: page + 1,
          limit,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          setPage(page + 1);
          
          return {
            kanbanBoards: {
              boards: [
                ...prev.kanbanBoards.boards,
                ...fetchMoreResult.kanbanBoards.boards,
              ],
              totalCount: fetchMoreResult.kanbanBoards.totalCount,
              hasNextPage: fetchMoreResult.kanbanBoards.hasNextPage,
            },
          };
        },
      });
    }
  };

  return {
    boards: boardsData?.kanbanBoards?.boards || [],
    totalCount: boardsData?.kanbanBoards?.totalCount || 0,
    hasMore: boardsData?.kanbanBoards?.hasNextPage || false,
    boardsLoading,
    boardsError,
    getBoardQuery,
    createBoard,
    updateBoard,
    deleteBoard,
    createBoardLoading,
    updateBoardLoading,
    deleteBoardLoading,
    loadMoreBoards,
    refetchBoards,
    setLimit,
  };
};
