/**
 * Types pour la fonctionnalité Kanban
 */

export interface KanbanUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface KanbanComment {
  _id: string;
  content: string;
  creator: KanbanUser;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanAttachment {
  _id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  creator: KanbanUser;
  createdAt: string;
}

export interface KanbanLabel {
  name: string;
  color: string;
}

export interface KanbanTask {
  _id: string;
  title: string;
  description?: string;
  status: string;
  order: number;
  dueDate?: string;
  labels: KanbanLabel[];
  assignedTo?: KanbanUser;
  comments: KanbanComment[];
  attachments: KanbanAttachment[];
  creator: KanbanUser;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  _id: string;
  title: string;
  order: number;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  _id: string;
  title: string;
  description?: string;
  columns: KanbanColumn[];
  members: KanbanUser[];
  creator: KanbanUser;
  createdAt: string;
  updatedAt: string;
}

// Types pour les inputs de mutation
export interface CreateBoardInput {
  title: string;
  description?: string;
  members?: string[];
}

export interface UpdateBoardInput {
  title?: string;
  description?: string;
  members?: string[];
}

export interface CreateColumnInput {
  boardId: string;
  title: string;
}

export interface UpdateColumnInput {
  boardId: string;
  columnId: string;
  title: string;
}

export interface ReorderColumnsInput {
  boardId: string;
  columnIds: string[];
}

export interface CreateTaskInput {
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels?: { name: string; color: string }[];
  assignedTo?: string;
}

export interface UpdateTaskInput {
  boardId: string;
  columnId: string;
  taskId: string;
  title?: string;
  description?: string;
  dueDate?: string;
  labels?: { name: string; color: string }[];
  assignedTo?: string;
}

export interface MoveTaskInput {
  boardId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  taskId: string;
  newOrder: number;
}

export interface AddCommentInput {
  boardId: string;
  columnId: string;
  taskId: string;
  content: string;
}

// Types pour les réponses de queries et mutations
export interface BoardsResponse {
  boards: {
    items: KanbanBoard[];
    totalCount: number;
    hasMore: boolean;
  };
}

export interface BoardResponse {
  board: KanbanBoard;
}

export interface TaskResponse {
  task: KanbanTask;
}

export interface ColumnResponse {
  column: KanbanColumn;
}

export interface CommentResponse {
  comment: KanbanComment;
}

export interface AttachmentResponse {
  attachment: KanbanAttachment;
}
