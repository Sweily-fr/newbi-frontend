import { gql } from '@apollo/client';

// Fragment pour les données de base d'un utilisateur
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
  }
`;

// Fragment pour les commentaires
export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    content
    createdAt
  }
`;

// Fragment pour les pièces jointes
export const ATTACHMENT_FRAGMENT = gql`
  fragment AttachmentFragment on Attachment {
    id
    name
    url
    type
  }
`;

// Fragment pour les tâches
export const TASK_FRAGMENT = gql`
  fragment TaskFragment on Task {
    id
    title
    description
    status
    order
    dueDate
    labels
    assignedTo {
      ...UserFragment
    }
    comments {
      ...CommentFragment
    }
    attachments {
      ...AttachmentFragment
    }
    createdAt
  }
  ${USER_FRAGMENT}
  ${COMMENT_FRAGMENT}
  ${ATTACHMENT_FRAGMENT}
`;

// Fragment pour les colonnes
export const COLUMN_FRAGMENT = gql`
  fragment ColumnFragment on Column {
    id
    title
    order
    tasks {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;

// Fragment pour les tableaux Kanban
export const BOARD_FRAGMENT = gql`
  fragment BoardFragment on KanbanBoard {
    id
    title
    description
    columns {
      ...ColumnFragment
    }
    members {
      ...UserFragment
    }
    createdAt
  }
  ${COLUMN_FRAGMENT}
  ${USER_FRAGMENT}
`;

// Requête pour récupérer un tableau Kanban spécifique
export const GET_BOARD = gql`
  query GetBoard($id: ID!) {
    kanbanBoard(id: $id) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Requête pour récupérer tous les tableaux Kanban avec pagination
export const GET_BOARDS = gql`
  query GetBoards($page: Int, $limit: Int) {
    kanbanBoards(page: $page, limit: $limit) {
      boards {
        ...BoardFragment
      }
      totalCount
      hasNextPage
    }
  }
  ${BOARD_FRAGMENT}
`;

// Requête pour récupérer une tâche spécifique
export const GET_TASK = gql`
  query GetTask($boardId: ID!, $columnId: ID!, $taskId: ID!) {
    task(boardId: $boardId, columnId: $columnId, taskId: $taskId) {
      ...TaskFragment
    }
  }
  ${TASK_FRAGMENT}
`;
