import { gql } from '@apollo/client';
import { BOARD_FRAGMENT, TASK_FRAGMENT } from './queries';

// Mutation pour créer un tableau Kanban
export const CREATE_BOARD = gql`
  mutation CreateBoard($input: KanbanBoardInput!) {
    createKanbanBoard(input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour mettre à jour un tableau Kanban
export const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: ID!, $input: KanbanBoardUpdateInput!) {
    updateKanbanBoard(id: $id, input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour supprimer un tableau Kanban
export const DELETE_BOARD = gql`
  mutation DeleteBoard($id: ID!) {
    deleteKanbanBoard(id: $id)
  }
`;

// Mutation pour créer une colonne
export const CREATE_COLUMN = gql`
  mutation CreateColumn($boardId: ID!, $input: ColumnInput!) {
    addKanbanColumn(boardId: $boardId, input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour mettre à jour une colonne
export const UPDATE_COLUMN = gql`
  mutation UpdateColumn($boardId: ID!, $columnId: ID!, $input: ColumnUpdateInput!) {
    updateKanbanColumn(boardId: $boardId, columnId: $columnId, input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour supprimer une colonne
export const DELETE_COLUMN = gql`
  mutation DeleteColumn($boardId: ID!, $columnId: ID!) {
    deleteKanbanColumn(boardId: $boardId, columnId: $columnId) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour réordonner les colonnes
export const REORDER_COLUMNS = gql`
  mutation ReorderColumns($boardId: ID!, $columnIds: [ID!]!) {
    reorderKanbanColumns(boardId: $boardId, columnIds: $columnIds) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour créer une tâche
export const CREATE_TASK = gql`
  mutation CreateTask($boardId: ID!, $columnId: ID!, $input: TaskInput!) {
    addKanbanTask(boardId: $boardId, columnId: $columnId, input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour mettre à jour une tâche
export const UPDATE_TASK = gql`
  mutation UpdateTask($boardId: ID!, $taskId: ID!, $input: TaskUpdateInput!) {
    updateKanbanTask(boardId: $boardId, taskId: $taskId, input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour supprimer une tâche
export const DELETE_TASK = gql`
  mutation DeleteTask($boardId: ID!, $taskId: ID!) {
    deleteKanbanTask(boardId: $boardId, taskId: $taskId) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour déplacer une tâche
export const MOVE_TASK = gql`
  mutation MoveTask($boardId: ID!, $taskId: ID!, $sourceColumnId: ID!, $targetColumnId: ID!, $order: Int!) {
    moveKanbanTask(boardId: $boardId, taskId: $taskId, sourceColumnId: $sourceColumnId, targetColumnId: $targetColumnId, order: $order) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour ajouter un commentaire à une tâche
export const ADD_COMMENT = gql`
  mutation AddComment($boardId: ID!, $taskId: ID!, $input: CommentInput!) {
    addKanbanTaskComment(boardId: $boardId, taskId: $taskId, input: $input) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;

// Mutation pour supprimer un commentaire
export const DELETE_COMMENT = gql`
  mutation DeleteComment($boardId: ID!, $taskId: ID!, $commentId: ID!) {
    deleteKanbanTaskComment(boardId: $boardId, taskId: $taskId, commentId: $commentId) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;
