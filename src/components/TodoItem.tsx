import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const TodoItem = ({
  id,
  title,
  completed,
  visibility,
  authorName,
  lastEditedAt,
  isAuthor,
  onToggleCompleted,
  onDelete,
  onEdit,
}: {
  id: string;
  title: string;
  completed: boolean;
  visibility: "public" | "private";
  authorId?: string;
  authorName?: string;
  lastEditedAt?: string;
  isAuthor: boolean;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newTitle: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleEditSave = () => {
    if (editTitle.trim() !== "" && onEdit) {
      onEdit(id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between bg-white p-3 rounded shadow w-full">
      <div className="flex flex-col gap-1 w-full">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          <p
            className={`font-medium break-words ${
              completed ? "line-through text-muted-foreground" : ""
            }`}
            onDoubleClick={() => isAuthor && setIsEditing(true)}
          >
            {title}
          </p>
        )}

        {visibility === "public" && (
          <p className="text-xs text-muted-foreground">
            By: {authorName ?? "Anonymous"} • Last edited:{" "}
            {lastEditedAt ? new Date(lastEditedAt).toLocaleString() : "Unknown"}
          </p>
        )}
      </div>

      <div className="flex gap-2 items-center ml-4 shrink-0">
        <Button size="sm" onClick={() => onToggleCompleted(id)}>
          {completed ? "Undo" : "Done"}
        </Button>
        {isAuthor && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(id)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
