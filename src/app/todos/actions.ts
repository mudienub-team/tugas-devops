"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTodos() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return todos;
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  if (title.trim().length < 3) {
    return { error: "Title must be at least 3 characters" };
  }

  if (title.trim().length > 255) {
    return { error: "Title must be at most 255 characters" };
  }

  await prisma.todo.create({
    data: { title: title.trim() },
  });

  revalidatePath("/todos");
  return { success: true };
}

export async function toggleTodo(id: number) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return { error: "Todo not found" };
  }

  await prisma.todo.update({
    where: { id },
    data: { isDone: !todo.isDone },
  });

  revalidatePath("/todos");
  return { success: true };
}

export async function deleteTodo(id: number) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return { error: "Todo not found" };
  }

  await prisma.todo.delete({ where: { id } });

  revalidatePath("/todos");
  return { success: true };
}

export async function updateTodo(id: number, formData: FormData) {
  const title = formData.get("title") as string;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  if (title.trim().length < 3) {
    return { error: "Title must be at least 3 characters" };
  }

  if (title.trim().length > 255) {
    return { error: "Title must be at most 255 characters" };
  }

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return { error: "Todo not found" };
  }

  await prisma.todo.update({
    where: { id },
    data: { title: title.trim() },
  });

  revalidatePath("/todos");
  return { success: true };
}
