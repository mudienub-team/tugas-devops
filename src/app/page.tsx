import { Suspense } from "react";
import { sayHello } from "@/lib/greetings/greetings";

function GreetingForm() {
  return (
    <form action="/" method="GET">
      <input name="name" type="text" placeholder="Enter name" required />
      <button type="submit" className="border py-1 px-2 rounded-md">
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
  const name = params.name;
  const message = name ? sayHello(name) : "Hello! Please enter a name.";

  return <h1>{message}</h1>;
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  return (
    <main style={{ padding: "20px" }}>
      <Suspense fallback={<h1>Loading greeting...</h1>}>
        <Greeting searchParams={searchParams} />
      </Suspense>

      <GreetingForm />
    </main>
  );
}
