import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TodoItem } from "@/components/task/TodoItem";
import type { Todo, TodoVisibility } from "@/type/Todo";
import { pb } from "@/lib/pocketbase";
import { useNavigate } from "@tanstack/react-router";

export const TodoList = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!pb.authStore.token;
  const userId = pb.authStore.record?.id;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newVisibility, setNewVisibility] = useState<TodoVisibility>("public");
  const [viewFilter, setViewFilter] = useState<"all" | "public" | "private">(
    "all"
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
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

        setTodos([...publicTodos, ...privateTodos]);
      } catch (err) {
        console.error("Fetch failed", err);
        setTodos([]);
      }
    };

    fetchTodos();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let unsubscribe: () => void;

    const subscribeToTodos = async () => {
      unsubscribe = await pb.collection("todos").subscribe("*", (e) => {
        const record = e.record as unknown as Todo;

        const isUserPrivate =
          record.visibility === "private" && record.authorId === userId;
        const isPublic = record.visibility === "public";

        if (!isPublic && !isUserPrivate) return;

        setTodos((prev) => {
          if (e.action === "create") {
            const exists = prev.some((t) => t.id === record.id);
            return exists ? prev : [record, ...prev];
          }

          if (e.action === "update") {
            return prev.map((t) => (t.id === record.id ? record : t));
          }

          if (e.action === "delete") {
            return prev.filter((t) => t.id !== record.id);
          }

          return prev;
        });
      });
    };

    subscribeToTodos();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await pb.collection("todos").create({
        title: newTodo.trim(),
        visibility: newVisibility,
        completed: false,
        authorId: userId,
        authorName: pb.authStore.record?.email,
        lastEditedAt: new Date().toISOString(),
      });

      setNewTodo(""); // Let realtime handle UI update
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleToggleCompleted = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await pb.collection("todos").update(id, {
        completed: !todo.completed,
        lastEditedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleEdit = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    try {
      await pb.collection("todos").update(id, {
        title: newTitle,
        lastEditedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("todos").delete(id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    navigate({ to: "/login" });
  };

  const filteredTodos = todos.filter((todo) => {
    if (viewFilter === "all") return true;
    if (viewFilter === "public") return todo.visibility === "public";
    if (viewFilter === "private")
      return todo.visibility === "private" && todo.authorId === userId;
    return false;
  });

  return (
    <div className="flex flex-col items-center h-screen bg-muted px-4">
      <nav className="w-full flex justify-between items-center py-4 px-4 shadow bg-white fixed top-0 left-0 z-10">
        <span className="text-xl font-bold text-indigo-700">TaskBoard</span>
        {isLoggedIn && (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </nav>

      <div className="h-20" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Enter a task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <select
              className="rounded border px-2 py-1 text-sm"
              value={newVisibility}
              onChange={(e) =>
                setNewVisibility(e.target.value as TodoVisibility)
              }
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <Button onClick={handleAddTodo}>Add</Button>
          </div>

          <div className="flex justify-end mb-4">
            <select
              className="rounded border px-2 py-1 text-sm"
              value={viewFilter}
              onChange={(e) =>
                setViewFilter(e.target.value as "all" | "public" | "private")
              }
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-muted-foreground">No todos yet</p>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  {...todo}
                  created={todo.created}
                  isAuthor={todo.authorId === userId}
                  onToggleCompleted={handleToggleCompleted}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
