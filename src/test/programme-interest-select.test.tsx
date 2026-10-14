import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProgrammeInterestSelect } from "@/components/programme-interest-select";
import { composeEnquiry, interests, type Interest } from "@/lib/author-content";

afterEach(cleanup);
// Radix uses these browser APIs when focusing portal options; jsdom lacks them.
Element.prototype.scrollIntoView = () => {};
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

function SelectionForm({ initial = "General enquiry" }: { initial?: Interest }) {
  const [interest, setInterest] = useState<Interest>(initial);
  return (
    <form aria-label="Enquiry">
      <label id="interest-label" htmlFor="interest">
        Programme interest
      </label>
      <ProgrammeInterestSelect value={interest} onValueChange={setInterest} />
    </form>
  );
}

describe("Programme interest selection", () => {
  it("preserves a parent-selected programme in the submitted form data", () => {
    render(<SelectionForm initial="Teaching the ten-week course" />);
    const form = screen.getByRole("form", { name: "Enquiry" });
    expect(form).toBeInstanceOf(HTMLFormElement);
    if (!(form instanceof HTMLFormElement)) throw new Error("Expected enquiry form");
    expect(new FormData(form).get("interest")).toBe("Teaching the ten-week course");
  });

  it("updates the form value and encoded draft when a visitor selects a different programme", async () => {
    render(<SelectionForm />);
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Programme interest" }), {
      key: "Enter",
    });
    fireEvent.keyDown(
      await screen.findByRole("option", { name: "Teacher of teachers programme" }),
      { key: "Enter" },
    );
    const form = screen.getByRole("form", { name: "Enquiry" });
    if (!(form instanceof HTMLFormElement)) throw new Error("Expected enquiry form");
    await waitFor(() =>
      expect(new FormData(form).get("interest")).toBe("Teacher of teachers programme"),
    );
    const selected = interests.find((interest) => interest === new FormData(form).get("interest"));
    if (!selected) throw new Error("Expected a valid selected interest");
    const draft = composeEnquiry({
      name: "Visitor",
      email: "visitor@example.com",
      message: "A question",
      interest: selected,
    });
    expect(new URL(draft.url).searchParams.get("body")).toContain(
      "Interest: Teacher of teachers programme",
    );
  });
});
