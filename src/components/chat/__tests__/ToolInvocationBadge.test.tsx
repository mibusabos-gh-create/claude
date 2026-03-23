import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "result"
): ToolInvocation {
  const base = { toolCallId: "test-id", toolName, args };
  if (state === "result") {
    return { ...base, state: "result", result: "ok" };
  }
  return { ...base, state: "call" };
}

// str_replace_editor labels
test("shows 'Creating' for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/components/Button.tsx" })}
    />
  );
  expect(screen.getByText("Editing /components/Button.tsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/utils.ts" })}
    />
  );
  expect(screen.getByText("Editing /utils.ts")).toBeDefined();
});

test("shows 'Reading' for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/index.tsx" })}
    />
  );
  expect(screen.getByText("Reading /index.tsx")).toBeDefined();
});

test("shows fallback label for unknown str_replace_editor command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Working on /App.jsx")).toBeDefined();
});

// file_manager labels
test("shows rename label for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/old.tsx", new_path: "/new.tsx" })}
    />
  );
  expect(screen.getByText("Renaming /old.tsx to /new.tsx")).toBeDefined();
});

test("shows delete label for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/unused.tsx" })}
    />
  );
  expect(screen.getByText("Deleting /unused.tsx")).toBeDefined();
});

// Unknown tool falls back to tool name
test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("some_other_tool", { command: "do_something" })}
    />
  );
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

// State indicators
test("shows green dot when tool call is complete", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result")}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("shows spinner when tool call is in progress", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "call")}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
