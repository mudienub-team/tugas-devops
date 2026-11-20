import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from "./actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock @/lib/prisma so tests never connect to the real database
jest.mock("@/lib/prisma", () => ({
  prisma: {
    todo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Todo Actions (Unit Tests with Mocks)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    it("should fetch all todos sorted by createdAt descending", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "First Task",
          isDone: false,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
      ];
      (prisma.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

      const result = await getTodos();

      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockTodos);
    });
  });

  describe("createTodo", () => {
    it("should return an error if title is empty or whitespace only", async () => {
      const formData = new FormData();
      formData.set("title", "   ");

      const result = await createTodo(formData);

      expect(result).toEqual({ error: "Title is required" });
      expect(prisma.todo.create).not.toHaveBeenCalled();
    });

    it("should return an error if title is shorter than 3 characters", async () => {
      const formData = new FormData();
      formData.set("title", "ab");

      const result = await createTodo(formData);

      expect(result).toEqual({ error: "Title must be at least 3 characters" });
      expect(prisma.todo.create).not.toHaveBeenCalled();
    });

    it("should return an error if title exceeds 255 characters", async () => {
      const formData = new FormData();
      formData.set("title", "a".repeat(256));

      const result = await createTodo(formData);

      expect(result).toEqual({ error: "Title must be at most 255 characters" });
      expect(prisma.todo.create).not.toHaveBeenCalled();
    });

    it("should trim the title and successfully create a todo", async () => {
      const formData = new FormData();
      formData.set("title", "  Learn DevOps and Prisma  ");

      (prisma.todo.create as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Learn DevOps and Prisma",
        isDone: false,
      });

      const result = await createTodo(formData);

      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: { title: "Learn DevOps and Prisma" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
      expect(result).toEqual({ success: true });
    });
  });

  describe("toggleTodo", () => {
    it("should return an error if todo does not exist", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await toggleTodo(999);

      expect(result).toEqual({ error: "Todo not found" });
      expect(prisma.todo.update).not.toHaveBeenCalled();
    });

    it("should toggle isDone from false to true and revalidate", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Test Task",
        isDone: false,
      });
      (prisma.todo.update as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Test Task",
        isDone: true,
      });

      const result = await toggleTodo(1);

      expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDone: true },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
      expect(result).toEqual({ success: true });
    });
  });

  describe("deleteTodo", () => {
    it("should return an error if todo does not exist", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await deleteTodo(999);

      expect(result).toEqual({ error: "Todo not found" });
      expect(prisma.todo.delete).not.toHaveBeenCalled();
    });

    it("should delete todo successfully if it exists", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Task to delete",
      });
      (prisma.todo.delete as jest.Mock).mockResolvedValue({
        id: 1,
      });

      const result = await deleteTodo(1);

      expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
      expect(result).toEqual({ success: true });
    });
  });

  describe("updateTodo", () => {
    it("should return validation error if updated title is invalid", async () => {
      const formData = new FormData();
      formData.set("title", "x");

      const result = await updateTodo(1, formData);

      expect(result).toEqual({ error: "Title must be at least 3 characters" });
      expect(prisma.todo.findUnique).not.toHaveBeenCalled();
      expect(prisma.todo.update).not.toHaveBeenCalled();
    });

    it("should return error if todo is not found", async () => {
      const formData = new FormData();
      formData.set("title", "Valid New Title");
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await updateTodo(999, formData);

      expect(result).toEqual({ error: "Todo not found" });
      expect(prisma.todo.update).not.toHaveBeenCalled();
    });

    it("should update todo title successfully and revalidate", async () => {
      const formData = new FormData();
      formData.set("title", "  Updated Title  ");

      (prisma.todo.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Old Title",
      });
      (prisma.todo.update as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Updated Title",
      });

      const result = await updateTodo(1, formData);

      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: "Updated Title" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/todos");
      expect(result).toEqual({ success: true });
    });
  });
});
