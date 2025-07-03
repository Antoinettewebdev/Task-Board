export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  visibility: TodoVisibility;

  authorId: string;
  authorName?: string;
  lastEditedAt?: string;
};

export type CreateTodoInput = {
  title: string;
  visibility: TodoVisibility;
};

export type UpdateTodoInput = {
  id: string;
  title?: string;
  completed?: boolean;
};

export type TodoVisibility = "private" | "public";