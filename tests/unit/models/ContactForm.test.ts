import { describe, expect, it } from "vitest";
import { ContactFormSchema } from "../../../src/models/ContactForm";

describe("ContactFormSchema", () => {
  it("accepts valid data", () => {
    const result = ContactFormSchema.safeParse({
      name: "Mark Hazleton",
      email: "mark@example.com",
      message: "Hello there, this is a valid test message.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid data", () => {
    const result = ContactFormSchema.safeParse({
      name: "M",
      email: "bad-email",
      message: "short",
    });

    expect(result.success).toBe(false);
  });
});
