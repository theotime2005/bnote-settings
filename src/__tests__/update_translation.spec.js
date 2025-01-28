import fs from "fs/promises";
import translatte from "translatte";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import {
  checkAndUpdate,
  clearOldValues,
  getTranslation,
  loadFile,
  writeFile,
} from "../../locales/update_translation.js";

vi.mock("fs/promises");
vi.mock("translatte");

const mockFs = vi.mocked(fs);
const mockTranslatte = vi.mocked(translatte);

describe("Translation Script", () => {
  beforeAll(() => {
    mockTranslatte.mockImplementation((text, options) => {
      return Promise.resolve({ text: `${text}-${options.to}` });
    });
  });

  afterAll(() => {
    mockTranslatte.mockRestore();
  });

  it("should load a JSON file", async () => {
    const mockData = { key: "value" };
    mockFs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const data = await loadFile("test.json");
    expect(data).toEqual(mockData);
    expect(mockFs.readFile).toHaveBeenCalledWith("test.json", "utf8");
  });

  it("should handle file read errors", async () => {
    mockFs.readFile.mockRejectedValue(new Error("File not found"));

    const data = await loadFile("test.json");
    expect(data).toEqual({});
  });

  it("should write a JSON file", async () => {
    const mockData = { key: "value" };

    await writeFile("test.json", mockData);
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      "test.json",
      JSON.stringify(mockData, null, 4),
      "utf8",
    );
  });

  it("should handle file write errors", async () => {
    mockFs.writeFile.mockRejectedValue(new Error("Cannot write file"));

    await expect(writeFile("test.json", { key: "value" })).resolves.toBeUndefined();
    expect(mockFs.writeFile).toHaveBeenCalled(); // Make sure it was at least called.
  });

  it("should translate a text", async () => {
    const text = "Hello";
    const language = "fr";

    const translation = await getTranslation(text, language);

    expect(translation).toBe(`${text}-${language}`);
    expect(mockTranslatte).toHaveBeenCalledWith(text, { to: language });
  });

  it("should handle translation errors", async () => {
    mockTranslatte.mockRejectedValue(new Error("Translation failed"));
    const text = "Hello";
    const language = "fr";

    const translation = await getTranslation(text, language);

    expect(translation).toBe(text); // Should return the original text on error
    mockTranslatte.mockRestore();
  });

  it("should check and update translations recursively", async () => {
    const source = {
      nested: { key1: "value1", key2: "value2" },
      key3: "value3",
    };
    const other = { nested: { key1: "oldValue" } };
    const language = "fr";

    const updated = await checkAndUpdate(source, other, language);

    expect(updated).toEqual({
      nested: { key1: "oldValue", key2: "*value2" },
      key3: "*value3",
    });
  });

  it("should clear old keys", () => {
    const source = { key1: "value1" };
    const other = { key1: "value1", key2: "oldValue" };

    const cleared = clearOldValues(source, other);

    expect(cleared).toEqual({ key1: "value1" });
  });

  it("should clear old keys recursively", () => {
    const source = { nested: { key1: "value1" } };
    const other = { nested: { key1: "value1", key2: "oldValue" }, key3: "oldValue" };

    const cleared = clearOldValues(source, other);

    expect(cleared).toEqual({ nested: { key1: "value1" } });
  });
});
