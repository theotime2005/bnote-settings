import { vi } from "vitest";

vi.mock("@/utils/send-log-message-script.js", () => ({
  sendLog: vi.fn(),
}));

import { createMailBodyService } from "@/server/email/create-mail-body-service.js";
import { sendLog } from "@/utils/send-log-message-script.js";

describe("server | createMailBodyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("converts markdown to HTML", async () => {
    // when
    const result = await createMailBodyService("# Hello World");

    // then
    expect(result).toContain("<h1");
    expect(result).toContain("Hello World");
  });

  it("replaces simple placeholders before converting to HTML", async () => {
    // given
    const body = "Hello {{name}} and **{{thing}}**";

    // when
    const result = await createMailBodyService(body, { name: "Alice", thing: "bold" });

    // then
    expect(result).toContain("Hello Alice");
    expect(result).toContain("<strong>bold</strong>");
  });

  it("replaces a placeholder whose key contains regex-special characters", async () => {
    // given
    const key = "a.b[c]*+?^$()|";
    const body = `Special {{${key}}} end`;

    // when
    const result = await createMailBodyService(body, { [key]: "X" });

    // then
    expect(result).toContain("Special X end");
  });

  it("does not modify placeholders when replaceElements is not provided", async () => {
    // given
    const body = "Keep {{missing}}";

    // when
    const result = await createMailBodyService(body);

    // then
    expect(result).toContain("{{missing}}");
  });

  it("logs an error and rethrows when processing fails", async () => {
    // then
    await expect(createMailBodyService(null)).rejects.toBeDefined();
    expect(sendLog).toHaveBeenCalled();
    expect(sendLog).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: "create mail body",
        functionName: "createMailBody",
        type: "error",
        log: expect.stringContaining("Error creating body"),
      }),
    );
  });
});

