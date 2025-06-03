/**
 * Types pour la fonctionnalité Kanban
 */

/**
 * Types aligned with backend schema
 */

// Renamed from KanbanUser to match backend schema
export interface KanbanUser {
  id: string; // Changed from _id to id
  // name field removed as it doesn't exist in the backend schema
  email: string;
  // avatar field removed as it doesn't exist in the backend schema
}

// Renamed from KanbanComment to match backend schema
export interface KanbanComment {
  id: string; // Changed from _id to id
  content: string;
  // creator field removed as it doesn't exist in the backend schema
  createdAt: string;
  // updatedAt field removed as it doesn't exist in the backend schema
}

// Updated to match backend Attachment type
export interface KanbanAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

// No changes needed
export interface KanbanLabel {
  name: string;
  color: string;
}

// Updated to match backend Task type
export interface KanbanTask {
  id: string; // Changed from _id to id
  title: string;
  description?: string;
  status: string;
  order: number;
  dueDate?: string;
  labels: string[]; // Changed from KanbanLabel[] to string[] to match backend schema
  assignedTo?: KanbanUser;
  comments: KanbanComment[];
  attachments: KanbanAttachment[];
  // creator field removed as it doesn't exist in the backend schema
  createdAt: string;
  // updatedAt field removed as it doesn't exist in the backend schema
}

// Updated to match backend Column type
export interface KanbanColumn {
  id: string; // Changed from _id to id
  title: string;
  order: number;
  tasks: KanbanTask[];
}

// Updated to match backend Board type
export interface KanbanBoard {
  id: string; // Changed from _id to id
  title: string;
  description?: string;
  columns: KanbanColumn[];
  members: KanbanUser[];
  // creator field removed as it doesn't exist in the backend schema
  createdAt: string;
  // updatedAt field removed as it doesn't exist in the backend schema
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
