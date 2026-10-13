import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthorWebsite } from "@/components/author-website";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    disconnect() {}
    unobserve() {}
  });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Author enquiry preselection after clean-up", () => {
  for (const [action, interest] of [
    ["Enquire about the course", "The ten-week course"],
    ["Ask about teacher training", "Teaching the ten-week course"],
    ["Discuss the programme", "Teacher of teachers programme"],
  ] as const) {
    it(`${action} selects ${interest} for the email draft`, () => {
      render(<AuthorWebsite />);
      fireEvent.click(screen.getByRole("link", { name: action }));
      const nameField = screen.getByLabelText("Name");
      if (!(nameField instanceof HTMLInputElement) || !nameField.form) throw new Error("Expected contact form");
      expect(new FormData(nameField.form).get("interest")).toBe(interest);
    });
  }
});