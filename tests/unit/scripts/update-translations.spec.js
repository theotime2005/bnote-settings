import fs from "fs/promises";
import translatte from "translatte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises");
vi.mock("translatte");
vi.mock("yargs/helpers", () => ({
  hideBin: vi.fn(() => []),
}));
vi.mock("yargs/yargs", () => ({
  default: vi.fn(() => ({
    scriptName: vi.fn().mockReturnThis(),
    usage: vi.fn().mockReturnThis(),
    describe: vi.fn().mockReturnThis(),
    option: vi.fn().mockReturnThis(),
    help: vi.fn().mockReturnThis(),
    argv: {},
  })),
}));

const mockFs = vi.mocked(fs);
const mockTranslatte = vi.mocked(translatte);

const { UpdateTranslations } = await import("@/scripts/update-translations.js");

describe("Script | Update translations", () => {
  beforeEach(function() {
    vi.clearAllMocks();
    mockTranslatte.mockImplementation(function(text, options) {
      return Promise.resolve({ text: `${text}-${options.to}` });
    });
  });

  afterEach(function() {
    mockTranslatte.mockRestore();
  });

  describe("#constructor", () => {
    it("should initialize with source and targets", () => {
      // given
      const options = { source: "source.json", targets: ["target1.json", "target2.json"] };

      // when
      const updater = new UpdateTranslations(options);

      // then
      expect(updater.source).toBe("source.json");
      expect(updater.targets).toEqual(["target1.json", "target2.json"]);
      expect(updater.sourceData).toEqual({});
      expect(updater.updateData).toEqual({});
    });
  });

  describe("#loadFile", () => {
    it("should return a json file", async () => {
      // given
      const mockData = { a: 1, b: 2 };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData));

      // when
      const result = await new UpdateTranslations({}).loadFile("test.json");

      // then
      expect(result).toEqual(mockData);
      expect(mockFs.readFile).toHaveBeenCalledWith("test.json", "utf8");
    });

    it("should return empty object on error", async () => {
      // given
      mockFs.readFile.mockRejectedValue(new Error("File not found"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // when
      const result = await new UpdateTranslations({}).loadFile("missing.json");

      // then
      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("#writeFile", () => {
    it("should write JSON data to file", async () => {
      // given
      mockFs.writeFile.mockResolvedValue();
      const data = { key: "value" };

      // when
      await new UpdateTranslations({}).writeFile("test.json", data);

      // then
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "test.json",
        JSON.stringify(data, null, 4),
        "utf8",
      );
    });

    it("should handle write errors", async () => {
      // given
      mockFs.writeFile.mockRejectedValue(new Error("Write failed"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // when
      await new UpdateTranslations({}).writeFile("test.json", {});

      // then
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("#_getTranslation", () => {
    it("should return translated text", async () => {
      // given
      const updater = new UpdateTranslations({});

      // when
      const result = await updater._getTranslation("hello", "fr");

      // then
      expect(result).toBe("hello-fr");
      expect(mockTranslatte).toHaveBeenCalledWith("hello", { to: "fr" });
    });

    it("should return original text on translation error", async () => {
      // given
      mockTranslatte.mockRejectedValue(new Error("Translation failed"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const updater = new UpdateTranslations({});

      // when
      const result = await updater._getTranslation("hello", "fr");

      // then
      expect(result).toBe("hello");
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("#checkAndUpdate", () => {
    it("should add missing keys with translation", async () => {
      // given
      const updater = new UpdateTranslations({});
      const objStart = { greeting: "hello", farewell: "goodbye" };
      const otherObj = { greeting: "bonjour" };
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // when
      const result = await updater.checkAndUpdate(objStart, otherObj, "fr");

      // then
      expect(result).toEqual({
        greeting: "bonjour",
        farewell: "*goodbye-fr",
      });
      expect(consoleSpy).toHaveBeenCalledWith("New key found : farewell");
      consoleSpy.mockRestore();
    });

    it("should handle nested objects", async () => {
      // given
      const updater = new UpdateTranslations({});
      const objStart = {
        level1: {
          level2: "deep value",
        },
      };
      const otherObj = {};

      // when
      const result = await updater.checkAndUpdate(objStart, otherObj, "es");

      // then
      expect(result).toEqual({
        level1: {
          level2: "*deep value-es",
        },
      });
    });

    it("should not overwrite existing keys", async () => {
      // given
      const updater = new UpdateTranslations({});
      const objStart = { key: "new value" };
      const otherObj = { key: "existing value" };

      // when
      const result = await updater.checkAndUpdate(objStart, otherObj, "fr");

      // then
      expect(result).toEqual({ key: "existing value" });
    });
  });

  describe("#clearOldValues", () => {
    it("should remove keys not in source", () => {
      // given
      const updater = new UpdateTranslations({});
      const objStart = { key1: "value1" };
      const otherObj = { key1: "value1", key2: "value2" };
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // when
      const result = updater.clearOldValues(objStart, otherObj);

      // then
      expect(result).toEqual({ key1: "value1" });
      expect(consoleSpy).toHaveBeenCalledWith("Old key : key2");
      consoleSpy.mockRestore();
    });

    it("should handle nested objects", () => {
      // given
      const updater = new UpdateTranslations({});
      const objStart = {
        level1: {
          keep: "this",
        },
      };
      const otherObj = {
        level1: {
          keep: "this",
          remove: "that",
        },
      };

      // when
      const result = updater.clearOldValues(objStart, otherObj);

      // then
      expect(result).toEqual({
        level1: {
          keep: "this",
        },
      });
    });

    it("should not fail when source key doesn't exist", () => {
      // given
      const updater = new UpdateTranslations({});
      const objStart = {};
      const otherObj = { oldKey: "oldValue" };

      // when
      const result = updater.clearOldValues(objStart, otherObj);

      // then
      expect(result).toEqual({});
    });
  });

  describe("#handle", () => {
    it("should process all target files", async () => {
      // given
      const sourceData = { key1: "value1" };
      mockFs.readFile.mockResolvedValue(JSON.stringify(sourceData));
      mockFs.writeFile.mockResolvedValue();
      const updater = new UpdateTranslations({
        source: "locales/en.json",
        targets: ["locales/es.json"],
      });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // when
      await updater.handle();

      // then
      expect(mockFs.readFile).toHaveBeenCalledWith("locales/en.json", "utf8");
      expect(mockFs.readFile).toHaveBeenCalledWith("locales/es.json", "utf8");
      expect(mockFs.writeFile).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("Finished writing files");
      consoleSpy.mockRestore();
    });

    it("should process multiple target files sequentially", async () => {
      // given
      mockFs.readFile.mockResolvedValue(JSON.stringify({ key: "value" }));
      mockFs.writeFile.mockResolvedValue();
      const updater = new UpdateTranslations({
        source: "locales/en.json",
        targets: ["locales/es.json", "locales/fr.json", "locales/it.json"],
      });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // when
      await updater.handle();

      // then
      expect(mockFs.readFile).toHaveBeenCalledTimes(4);
      expect(mockFs.writeFile).toHaveBeenCalledTimes(3);
      consoleSpy.mockRestore();
    });
  });
});
