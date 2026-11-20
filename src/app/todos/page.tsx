import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";

export const metadata = {
  title: "Todo App",
  description: "A simple todo application",
};

async function getTodosData() {
  try {
    return await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return null;
  }
}

async function TodosContainer() {
  const todos = await getTodosData();

  if (!todos) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
        <p className="text-sm text-yellow-800">
          Unable to load todos. Please ensure the database is running and configured.
        </p>
      </div>
    );
  }

  return <TodoList todos={todos} />;
}

export default function TodosPage() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">📝 Todo App</h1>
          <p className="mt-2 text-sm text-gray-500">
            Keep track of your tasks
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <AddTodoForm />
          <Suspense
            fallback={
              <div className="py-6 text-center">
                <p className="text-sm text-gray-400">Loading todos...</p>
              </div>
            }
          >
            <TodosContainer />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
