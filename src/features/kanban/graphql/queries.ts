import { gql } from '@apollo/client';

// Fragment pour les données de base d'un utilisateur
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    _id
    name
    email
    avatar
  }
`;

// Fragment pour les commentaires
export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on KanbanComment {
    _id
    content
    creator {
      ...UserFragment
    }
    createdAt
    updatedAt
  }
  ${USER_FRAGMENT}
`;

// Fragment pour les pièces jointes
export const ATTACHMENT_FRAGMENT = gql`
  fragment AttachmentFragment on KanbanAttachment {
    _id
    filename
    url
    mimetype
    size
    creator {
      ...UserFragment
    }
    createdAt
  }
  ${USER_FRAGMENT}
`;

// Fragment pour les tâches
export const TASK_FRAGMENT = gql`
  fragment TaskFragment on KanbanTask {
    _id
    title
    description
    status
    order
    dueDate
    labels {
      name
      color
    }
    assignedTo {
      ...UserFragment
    }
    comments {
      ...CommentFragment
    }
    attachments {
      ...AttachmentFragment
    }
    creator {
      ...UserFragment
    }
    createdAt
    updatedAt
  }
  ${USER_FRAGMENT}
  ${COMMENT_FRAGMENT}
  ${ATTACHMENT_FRAGMENT}
`;

// Fragment pour les colonnes
export const COLUMN_FRAGMENT = gql`
  fragment ColumnFragment on KanbanColumn {
    _id
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
    _id
    title
    description
    columns {
      ...ColumnFragment
    }
    members {
      ...UserFragment
    }
    creator {
      ...UserFragment
    }
    createdAt
    updatedAt
  }
  ${COLUMN_FRAGMENT}
  ${USER_FRAGMENT}
`;

// Requête pour récupérer un tableau Kanban spécifique
export const GET_BOARD = gql`
  query GetBoard($id: ID!) {
    board(id: $id) {
      ...BoardFragment
    }
  }
  ${BOARD_FRAGMENT}
`;

// Requête pour récupérer tous les tableaux Kanban avec pagination
export const GET_BOARDS = gql`
  query GetBoards($page: Int, $limit: Int) {
    boards(page: $page, limit: $limit) {
      items {
        ...BoardFragment
      }
      totalCount
      hasMore
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
