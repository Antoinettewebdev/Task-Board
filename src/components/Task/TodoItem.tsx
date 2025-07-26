import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Circle, CheckCircle2 } from "lucide-react";

export const TodoItem = ({
  id,
  title,
  completed,
  visibility,
  authorName,
  lastEditedAt,
  created,
  isAuthor,
  onToggleCompleted,
  onDelete,
  onEdit,
}: {
  id: string;
  title: string;
  completed: boolean;
  visibility: "public" | "private";
  authorName?: string;
  lastEditedAt?: string;
  created: string;
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

  const isEdited =
    lastEditedAt &&
    new Date(lastEditedAt).toISOString() !== new Date(created).toISOString();

  return (
    <div className="flex items-start justify-between bg-white p-3 rounded shadow w-full">
      {/* Completion Icon */}
      <div className="flex items-start gap-3 w-full">
        <button onClick={() => onToggleCompleted(id)} className="mt-1">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
        </button>

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
              className={`font-medium break-words cursor-pointer ${
                completed ? "line-through text-muted-foreground" : ""
              }`}
              onDoubleClick={() => isAuthor && setIsEditing(true)}
            >
              {title}
            </p>
          )}

          {visibility === "public" && (
            <>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(created).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                By: {authorName}
                {isEdited && (
                  <> • Last edited: {new Date(lastEditedAt!).toLocaleString()}</>
                )}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isAuthor && (
        <div className="flex gap-2 items-center ml-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
          >
            <Trash className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      )}
    </div>
  );
};
