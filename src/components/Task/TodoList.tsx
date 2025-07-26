import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TodoItem } from "@/components/task/TodoItem";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useTodos } from "@/hooks/todos/useTodo";
import { pb } from "@/lib/pocketbase";
import type { TodoVisibility } from "@/type/Todo";
// import toast from 'sonner' or 'react-hot-toast'
import { toast } from "sonner"; // Importing toast from sonner

const TODOS_PER_PAGE = 5;

export const TodoList = () => {
  const navigate = useNavigate();
  const userId = pb.authStore.model?.id;
  const isLoggedIn = !!userId;
  // use toast directly from 'sonner'
  // const { Toast } = toast(); // 👈 Get toast function

  const [newTodo, setNewTodo] = useState("");
  const [newVisibility, setNewVisibility] = useState<TodoVisibility>("public");
  const [viewFilter, setViewFilter] = useState<"all" | "public" | "private">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const { todos, createTodo, updateTodo, deleteTodo } = useTodos(userId);

  const handleAddTodo = () => {
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
          setNewTodo("");
        },
      }
    );
  };

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
          toast(`Todo marked as ${!todo.completed ? "completed" : "incomplete"}`);
        },
      }
    );
  };

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

  const handleDelete = (id: string) => {
    deleteTodo.mutate(id, {
      onSuccess: () => {
        toast("Todo deleted successfully!");
      },
    });
  };

  const handleLogout = () => {
    pb.authStore.clear();
    navigate({ to: "/login" });
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (viewFilter === "public") return todo.visibility === "public";
      if (viewFilter === "private") return todo.visibility === "private" && todo.authorId === userId;
      return true;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.created).getTime() - new Date(a.created).getTime()
        : new Date(a.created).getTime() - new Date(b.created).getTime();
    });

  const totalPages = Math.ceil(filteredTodos.length / TODOS_PER_PAGE);
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * TODOS_PER_PAGE,
    currentPage * TODOS_PER_PAGE
  );

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
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Todo List</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ New Todo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
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
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddTodo}>Add Todo</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 mb-4">
            <Input
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full"
            />
            <div className="flex gap-2">
              <select
                value={viewFilter}
                onChange={(e) => {
                  setViewFilter(e.target.value as "all" | "public" | "private");
                  setCurrentPage(1);
                }}
                className="rounded border px-2 py-1 text-sm flex-1"
              >
                <option value="all">All</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "newest" | "oldest");
                  setCurrentPage(1);
                }}
                className="rounded border px-2 py-1 text-sm flex-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {paginatedTodos.length === 0 ? (
              <p className="text-center text-muted-foreground">No todos found</p>
            ) : (
              paginatedTodos.map((todo) => (
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

          {filteredTodos.length > TODOS_PER_PAGE && (
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
