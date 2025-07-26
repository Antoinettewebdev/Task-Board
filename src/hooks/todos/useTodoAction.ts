// src/hooks/todos/useTodoActions.ts
import { toast } from "sonner"; // Using sonner for notifications
import { pb } from "@/lib/pocketbase";
import type { TodoVisibility } from "@/type/Todo";
import { useTodos } from "@/hooks/todos/useTodo";

// This hook separates your todo action logic from the UI
export const useTodoAction = () => {
  // Get the current user ID (used throughout these mutations)
  const userId = pb.authStore.model?.id;
  // Get the todos and the associated mutation functions
  const { todos, createTodo, updateTodo, deleteTodo } = useTodos(userId);

  // Add a new todo (calls toast on success)
  const handleAddTodo = (
    newTodo: string,
    newVisibility: TodoVisibility,
    resetFn: () => void
  ) => {
    if (!newTodo.trim()) return;
    createTodo.mutate(
      {
        title: newTodo.trim(),
        visibility: newVisibility,
        completed: false,
        authorId: userId,
        authorName: pb.authStore.model?.email,
        lastEditedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          toast("Todo created successfully!");
          resetFn();
        },
      }
    );
  };

  // Toggle the completed state (shows a toast)
  const handleToggleCompleted = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    updateTodo.mutate(
      {
        id,
        updates: {
          completed: !todo.completed,
          lastEditedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast(
            `Todo marked as ${
              !todo.completed ? "completed" : "incomplete"
            }`
          );
        },
      }
    );
  };

  // Edit/update a todo (shows a toast)
  const handleEdit = (id: string, newTitle: string) => {
    updateTodo.mutate(
      {
        id,
        updates: {
          title: newTitle,
          lastEditedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast("Todo updated successfully!");
        },
      }
    );
  };

  // Delete a todo (shows a toast)
  const handleDelete = (id: string) => {
    deleteTodo.mutate(id, {
      onSuccess: () => {
        toast("Todo deleted successfully!");
      },
    });
  };

  return {
    todos,
    handleAddTodo,
    handleToggleCompleted,
    handleEdit,
    handleDelete,
  };
};
