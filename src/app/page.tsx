
import { Suspense } from "react";
import { sayHello } from "@/lib/greetings/greetings";

function GreetingForm() {
  return (
    <form action="/" method="GET" className="mt-6 flex gap-2">
      <input
          name="name"
          type="text"
          placeholder="Enter your name"
          required
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        Say Hi
      </button>
    </form>
  );
}

async function Greeting({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const params = await searchParams;
  const name = params.name?.trim();
  const message = name ? sayHello(name) : "Hello! Please enter a name.";

  return (
    <h1 className="text-xl font-semibold text-gray-800">
      {message}
    </h1>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Greeting App
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          Enter your name to receive a greeting.
        </p>

        <div className="rounded-lg bg-gray-50 p-4">
          <Suspense
            fallback={<p className="text-gray-500">Loading greeting...</p>}
          >
            <Greeting searchParams={searchParams} />
          </Suspense>
        </div>

        <GreetingForm />
      </div>
    </main>
  );
}
