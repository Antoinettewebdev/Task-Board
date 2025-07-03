import { Button } from "@/components/ui/button";

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
}) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded shadow">
      <div>
        <p
          className={`font-medium ${completed ? "line-through text-muted-foreground" : ""}`}
        >
          {title}
        </p>
        {visibility === "public" && (
          <p className="text-xs text-muted-foreground">
            By: {authorName ?? "Anonymous"} • Last edited:{" "}
            {lastEditedAt ? new Date(lastEditedAt).toLocaleString() : "N/A"}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onToggleCompleted(id)}>
          {completed ? "Undo" : "Done"}
        </Button>
        {isAuthor && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};