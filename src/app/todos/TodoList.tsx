"use client";

import { useState, useTransition } from "react";
import { toggleTodo, deleteTodo, updateTodo } from "./actions";

type Todo = {
  id: number;
  title: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [error, setError] = useState("");

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleTodo(todo.id);
      if (result.error) setError(result.error);
    });
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    startTransition(async () => {
      const result = await deleteTodo(todo.id);
      if (result.error) setError(result.error);
    });
  }

  function handleEdit() {
    setIsEditing(true);
    setEditTitle(todo.title);
    setError("");
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditTitle(todo.title);
    setError("");
  }

  function handleSaveEdit(formData: FormData) {
    startTransition(async () => {
      const result = await updateTodo(todo.id, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        setError("");
      }
    });
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border p-4 transition ${
        todo.isDone
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      } ${isPending ? "opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={handleToggle}
        disabled={isPending}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form action={handleSaveEdit} className="flex gap-2">
            <input
              name="title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              autoFocus
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <p
              className={`text-sm font-medium ${
                todo.isDone ? "text-gray-400 line-through" : "text-gray-900"
              }`}
            >
              {todo.title}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Created: {new Date(todo.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {todo.updatedAt > todo.createdAt && (
                <>
                  {" · "}Updated: {new Date(todo.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
            </p>
          </>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {!isEditing && (
        <div className="flex gap-1">
          <button
            onClick={handleEdit}
            disabled={isPending}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-50"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
        <p className="text-gray-400 text-sm">No todos yet. Add one above!</p>
      </div>
    );
  }

  const done = todos.filter((t) => t.isDone).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
        <span>
          {done} of {todos.length} completed
        </span>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
