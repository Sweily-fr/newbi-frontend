import { gql } from '@apollo/client';
import { BOARD_FRAGMENT, COLUMN_FRAGMENT, TASK_FRAGMENT, COMMENT_FRAGMENT } from './queries';

// Mutation pour créer un tableau Kanban
export const CREATE_BOARD = gql`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour mettre à jour un tableau Kanban
export const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: ID!, $input: UpdateBoardInput!) {
    updateBoard(id: $id, input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour supprimer un tableau Kanban
export const DELETE_BOARD = gql`
  mutation DeleteBoard($id: ID!) {
    deleteBoard(id: $id) {
      _id
      success
    }
  }
`;

// Mutation pour créer une colonne
export const CREATE_COLUMN = gql`
  mutation CreateColumn($input: CreateColumnInput!) {
    createColumn(input: $input) {
      ...ColumnFragment
    }
  }
  ${COLUMN_FRAGMENT}
`;

// Mutation pour mettre à jour une colonne
export const UPDATE_COLUMN = gql`
  mutation UpdateColumn($input: UpdateColumnInput!) {
    updateColumn(input: $input) {
      ...ColumnFragment
    }
  }
  ${COLUMN_FRAGMENT}
`;

// Mutation pour supprimer une colonne
export const DELETE_COLUMN = gql`
  mutation DeleteColumn($boardId: ID!, $columnId: ID!) {
    deleteColumn(boardId: $boardId, columnId: $columnId) {
      _id
      success
    }
  }
`;

// Mutation pour réordonner les colonnes
export const REORDER_COLUMNS = gql`
  mutation ReorderColumns($input: ReorderColumnsInput!) {
    reorderColumns(input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour créer une tâche
export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;

// Mutation pour mettre à jour une tâche
export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;

// Mutation pour supprimer une tâche
export const DELETE_TASK = gql`
  mutation DeleteTask($boardId: ID!, $columnId: ID!, $taskId: ID!) {
    deleteTask(boardId: $boardId, columnId: $columnId, taskId: $taskId) {
      _id
      success
    }
  }
`;

// Mutation pour déplacer une tâche
export const MOVE_TASK = gql`
  mutation MoveTask($input: MoveTaskInput!) {
    moveTask(input: $input) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Mutation pour ajouter un commentaire à une tâche
export const ADD_COMMENT = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Mutation pour supprimer un commentaire
export const DELETE_COMMENT = gql`
  mutation DeleteComment($boardId: ID!, $columnId: ID!, $taskId: ID!, $commentId: ID!) {
    deleteComment(boardId: $boardId, columnId: $columnId, taskId: $taskId, commentId: $commentId) {
      _id
      success
    }
  }
`;
