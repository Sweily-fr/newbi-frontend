import { useQuery, useMutation } from '@apollo/client';
import { GET_BOARDS, GET_BOARD } from '../graphql/queries';
import { CREATE_BOARD, UPDATE_BOARD, DELETE_BOARD } from '../graphql/mutations';
import { BoardsResponse, BoardResponse, CreateBoardInput, UpdateBoardInput } from '../types/kanban';
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
  } = useQuery<{ boards: BoardsResponse }>(GET_BOARDS, {
    variables: { page, limit },
    fetchPolicy: 'cache-and-network',
  });

  // Récupérer un tableau Kanban spécifique
  const getBoard = (id: string) => {
    return useQuery<{ board: BoardResponse }>(GET_BOARD, {
      variables: { id },
      fetchPolicy: 'cache-and-network',
    });
  };

  // Créer un nouveau tableau Kanban
  const [createBoardMutation, { loading: createBoardLoading }] = useMutation(CREATE_BOARD, {
    update(cache, { data: { createBoard } }) {
      try {
        // Mettre à jour le cache pour la requête GET_BOARDS
        const existingBoards = cache.readQuery<{ boards: BoardsResponse }>({
          query: GET_BOARDS,
          variables: { page: 1, limit },
        });

        if (existingBoards) {
          cache.writeQuery({
            query: GET_BOARDS,
            variables: { page: 1, limit },
            data: {
              boards: {
                ...existingBoards.boards,
                items: [createBoard, ...existingBoards.boards.items],
                totalCount: existingBoards.boards.totalCount + 1,
              },
            },
          });
        }
      } catch (e) {
        console.error("Erreur lors de la mise à jour du cache:", e);
      }
    },
  });

  const createBoard = async (input: CreateBoardInput) => {
    try {
      const { data } = await createBoardMutation({
        variables: { input },
      });
      return data.createBoard;
    } catch (error) {
      console.error("Erreur lors de la création du tableau:", error);
      throw error;
    }
  };

  // Mettre à jour un tableau Kanban
  const [updateBoardMutation, { loading: updateBoardLoading }] = useMutation(UPDATE_BOARD);

  const updateBoard = async (id: string, input: UpdateBoardInput) => {
    try {
      const { data } = await updateBoardMutation({
        variables: { id, input },
      });
      return data.updateBoard;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tableau:", error);
      throw error;
    }
  };

  // Supprimer un tableau Kanban
  const [deleteBoardMutation, { loading: deleteBoardLoading }] = useMutation(DELETE_BOARD, {
    update(cache, { data: { deleteBoard } }) {
      try {
        // Mettre à jour le cache pour la requête GET_BOARDS
        const existingBoards = cache.readQuery<{ boards: BoardsResponse }>({
          query: GET_BOARDS,
          variables: { page, limit },
        });

        if (existingBoards) {
          cache.writeQuery({
            query: GET_BOARDS,
            variables: { page, limit },
            data: {
              boards: {
                ...existingBoards.boards,
                items: existingBoards.boards.items.filter((board) => board._id !== deleteBoard._id),
                totalCount: existingBoards.boards.totalCount - 1,
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
    if (boardsData?.boards?.hasMore) {
      fetchMoreBoards({
        variables: {
          page: page + 1,
          limit,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          setPage(page + 1);
          
          return {
            boards: {
              ...fetchMoreResult.boards,
              items: [
                ...prev.boards.items,
                ...fetchMoreResult.boards.items,
              ],
            },
          };
        },
      });
    }
  };

  return {
    boards: boardsData?.boards?.items || [],
    totalCount: boardsData?.boards?.totalCount || 0,
    hasMore: boardsData?.boards?.hasMore || false,
    boardsLoading,
    boardsError,
    getBoard,
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
