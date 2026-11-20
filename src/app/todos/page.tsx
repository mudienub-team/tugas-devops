import { prisma } from "@/lib/prisma";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";

export const metadata = {
  title: "Todo App",
  description: "A simple todo application",
};

export default async function TodosPage() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

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
          <TodoList todos={todos} />
        </div>
      </div>
    </main>
  );
}
