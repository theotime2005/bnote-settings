import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMailBodyService } from "@/server/email/create-mail-body-service.js";

const mockGetItem = vi.fn();

vi.mock("#imports", () => ({
  useStorage: vi.fn(() => ({
    getItem: mockGetItem,
  })),
}));

describe("Unit | shared | Create mail body", () => {
  beforeEach(() => {
    mockGetItem.mockClear();
  });

  it("should replace placeholders and add footer", async () => {
    // given
    mockGetItem
      .mockResolvedValueOnce("Hello {{name}}, welcome!")
      .mockResolvedValueOnce("\n-- Footer --");

    const replaceElements = { name: "John" };

    // when
    const result = await createMailBodyService("test", replaceElements);

    // then
    expect(mockGetItem).toHaveBeenCalledWith("test.md");
    expect(mockGetItem).toHaveBeenCalledWith("footer.md");
    expect(result).toContain("Hello John, welcome!");
    expect(result).toContain("-- Footer --");
  });

  it("should return content without placeholder", async () => {
    // given
    mockGetItem
      .mockResolvedValueOnce("Simple content")
      .mockResolvedValueOnce("\n-- Footer --");

    // when
    const result = await createMailBodyService("test");

    // then
    expect(mockGetItem).toHaveBeenCalledWith("test.md");
    expect(mockGetItem).toHaveBeenCalledWith("footer.md");
    expect(result).toContain("Simple content");
    expect(result).toContain("-- Footer --");
  });

  it("should throw an error if template is not found", async () => {
    // given
    mockGetItem.mockResolvedValue(null);

    // when // then
    await expect(createMailBodyService("unknown")).rejects.toThrow(
      "Template not found: email-templates/unknown.md",
    );
    expect(mockGetItem).toHaveBeenCalledWith("unknown.md");
  });

  it("should throw an error if footer is not found", async () => {
    // given
    mockGetItem
      .mockResolvedValueOnce("Some content")
      .mockResolvedValueOnce(null);

    // when // then
    await expect(createMailBodyService("test")).rejects.toThrow(
      "Footer not found: email-templates/footer.md",
    );
    expect(mockGetItem).toHaveBeenCalledWith("test.md");
    expect(mockGetItem).toHaveBeenCalledWith("footer.md");
  });
});
