// src/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import type { Todo } from "@/type/Todo";

export function useTodos(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos", userId],
    queryFn: async (): Promise<Todo[]> => {
      const publicTodos = await pb.collection("todos").getFullList<Todo>({
        filter: 'visibility = "public"',
        sort: "-created",
      });

      const privateTodos = userId
        ? await pb.collection("todos").getFullList<Todo>({
            filter: `visibility = "private" && authorId = "${userId}"`,
            sort: "-created",
          })
        : [];

      return [...publicTodos, ...privateTodos];
    },
    enabled: !!userId,
  });

  const createTodo = useMutation({
    mutationFn: (data: Partial<Todo>) => {
      const user = pb.authStore.model;
      return pb.collection("todos").create({
        ...data,
        authorId: user?.id,
        authorName: user?.name || user?.username,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });

  const updateTodo = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Todo> }) =>
      pb.collection("todos").update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => pb.collection("todos").delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });

  return {
    todos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
