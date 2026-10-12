import { describe, expect, it } from "vitest";
import { composeEnquiry, interests, programmes } from "@/lib/author-content";

describe("Client programme fees", () => {
  it("keeps the ten-week course at $1,000", () => expect(programmes[0].fee).toBe("$1,000"));
  it("keeps teacher training at $10,000", () => expect(programmes[1].fee).toBe("$10,000"));
  it("keeps teacher of teachers at $100,000", () => expect(programmes[2].fee).toBe("$100,000"));
});
describe("Email composer", () => {
  it("retains all five approved interest choices", () => {
    expect(interests).toEqual(["General enquiry", "Book enquiry", "The ten-week course", "Teaching the ten-week course", "Teacher of teachers programme"]);
  });
  it("addresses only Jeanie and URL-encodes visitor content", () => {
    const draft = composeEnquiry({ name: "A & B", email: "visitor@example.com", interest: "Book enquiry", message: "A question? & another # detail\nHello" });
    const url = new URL(draft.url);
    expect(url.pathname).toBe("calderjeanie@gmail.com");
    expect(url.searchParams.get("subject")).toBe("Book enquiry — A & B");
    expect(url.searchParams.get("body")).toContain("A question? & another # detail\nHello");
    expect(url.hash).toBe("");
    expect(url.searchParams.get("body")).toContain("Email: visitor@example.com");
  });
  it("keeps every programme’s enquiry choice distinct", () => {
    expect(programmes.map(programme => programme.interest)).toEqual(["The ten-week course", "Teaching the ten-week course", "Teacher of teachers programme"]);
  });
});