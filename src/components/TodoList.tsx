import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TodoItem } from "@/components/TodoItem";
import type { Todo, TodoVisibility } from "@/Types/Todo";
import { pb } from "@/lib/PocketBase";
import { useNavigate } from "@tanstack/react-router";

export const TodoList = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!pb.authStore.token;
  const userId = pb.authStore.record?.id;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newVisibility, setNewVisibility] = useState<TodoVisibility>("public");

  // ✅ Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const publicTodos = await pb
          .collection("todos")
          .getFullList<Todo>({ filter: 'visibility = "public"', sort: "-created" });

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

  // ✅ PocketBase realtime updates (public + user's private todos)
  useEffect(() => {
    let unsubscribe: () => void;

    const subscribeToTodos = async () => {
      unsubscribe = await pb.collection("todos").subscribe("*", (e) => {
        const record = e.record as unknown as Todo;

        const isUserPrivate = record.visibility === "private" && record.authorId === userId;
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
        authorName: pb.authStore.record?.email ?? "Anonymous",
        lastEditedAt: new Date().toISOString(),
      });

      setNewTodo(""); // Let realtime handle the UI
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleToggleCompleted = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = {
      completed: !todo.completed,
      lastEditedAt: new Date().toISOString(),
    };

    try {
      await pb.collection("todos").update(id, updated);
      // No local update needed, realtime handles it
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
      // No local update needed, realtime handles it
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("todos").delete(id);
      // No local update needed, realtime handles it
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-col items-center h-screen bg-muted px-4">
      {/* Top NavBar */}
      <nav className="w-full flex justify-between items-center py-4 px-4 shadow bg-white fixed top-0 left-0 z-10">
        <span className="text-xl font-bold text-indigo-700">TaskBoard</span>
        {isLoggedIn && (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-20" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <Input
              placeholder="Enter a task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <select
              className="rounded border px-2 py-1"
              value={newVisibility}
              onChange={(e) => setNewVisibility(e.target.value as TodoVisibility)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <Button onClick={handleAddTodo}>Add</Button>
          </div>

          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-center text-muted-foreground">No todos yet</p>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  {...todo}
                  isAuthor={todo.authorId === userId}
                  onToggleCompleted={handleToggleCompleted}
                  onDelete={handleDelete}
                  onEdit={handleEdit} // ✅ FIX: edit handler passed
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};