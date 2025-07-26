// src/hooks/useTodos.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import type { Todo } from "@/type/Todo";

export function useTodos(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
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
    mutationFn: (data: Partial<Todo>) =>
      pb.collection("todos").create({ ...data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateTodo = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Todo> }) =>
      pb.collection("todos").update(data.id, data.updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => pb.collection("todos").delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Realtime sync
  useEffect(() => {
    if (!userId) return;

    const subscribe = async () => {
      await pb.collection("todos").subscribe("*", () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      });
    };

    subscribe();

    return () => {
      pb.collection("todos").unsubscribe("*");
    };
  }, [userId, queryClient]);

  return {
    todos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
