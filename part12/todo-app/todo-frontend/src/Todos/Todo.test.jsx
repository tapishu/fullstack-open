import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import Todo from "./Todo";
import userEvent from "@testing-library/user-event";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

test("undone Todo and check if the button works", async () => {
  const sampleTodo = { text: "Hello sample", done: false };
  const mockDelete = vi.fn();
  const mockComplete = vi.fn();

  render(
    <Todo
      todo={sampleTodo}
      deleteTodo={mockDelete}
      completeTodo={mockComplete}
    />,
  );

  expect(screen.getByText("Title: Hello sample")).toBeDefined();
  expect(screen.getByText("This todo is not done")).toBeDefined();
  expect(screen.getByText("Delete")).toBeDefined();
  expect(screen.getByText("Set as done")).toBeDefined();

  const completeButton = screen.getByText("Set as done");
  await userEvent.click(completeButton);
  expect(mockComplete).toHaveBeenCalledWith(sampleTodo);

  const deleteButton = screen.getByText("Delete");
  await userEvent.click(deleteButton);
  expect(mockDelete).toHaveBeenCalledWith(sampleTodo);
});

test("Done Todo and check if the button works", () => {
  const sampleTodo = { text: "Hello sample Done", done: true };
  const mockDelete = vi.fn();
  const mockComplete = vi.fn();

  render(
    <Todo
      todo={sampleTodo}
      deleteTodo={mockDelete}
      completeTodo={mockComplete}
    />,
  );

  expect(screen.getByText("Title: Hello sample Done")).toBeDefined();
  expect(screen.getByText("This todo is done")).toBeDefined();
  // const deleteButton = screen.getByRole("button", { name: /delete/i });
  // expect(deleteButton).toBeDefined();
  expect(screen.getByText("Delete")).toBeDefined();
});
