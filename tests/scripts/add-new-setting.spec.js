import fs from "fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises");
vi.mock("yargs/helpers", () => ({
  hideBin: vi.fn(() => []),
}));
vi.mock("yargs/yargs", () => ({
  default: vi.fn(() => ({
    option: vi.fn().mockReturnThis(),
    check: vi.fn().mockReturnThis(),
    help: vi.fn().mockReturnThis(),
    argv: {},
  })),
}));

const { AddNewSetting } = await import("~/scripts/add-new-setting.js");

describe("AddNewSetting", () => {
  let mockFs;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    mockFs = vi.mocked(fs);
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("readAndParseFile", () => {
    it("should read and parse JSON file correctly", async () => {
      const mockData = { general: { theme: "dark" } };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData));

      const addNewSetting = new AddNewSetting({ file: "test.json" });
      const result = await addNewSetting.readAndParseFile();

      expect(result).toEqual(mockData);
      expect(mockFs.readFile).toHaveBeenCalledWith("test.json", "utf-8");
    });

    it("should handle file read errors", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      const addNewSetting = new AddNewSetting({ file: "test.json" });

      await expect(addNewSetting.readAndParseFile()).rejects.toThrow("File not found");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should handle JSON parse errors", async () => {
      mockFs.readFile.mockResolvedValue("invalid json");

      const addNewSetting = new AddNewSetting({ file: "test.json" });

      await expect(addNewSetting.readAndParseFile()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("writeFile", () => {
    it("should write settings to file", async () => {
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({ file: "test.json" });
      addNewSetting.settings = { general: { theme: "dark" } };

      await addNewSetting.writeFile();

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "test.json",
        JSON.stringify({ general: { theme: "dark" } }, null, 2),
        "utf-8",
      );
      expect(consoleLogSpy).toHaveBeenCalledWith("File written successfully to test.json");
    });

    it("should handle write errors", async () => {
      mockFs.writeFile.mockRejectedValue(new Error("Write failed"));

      const addNewSetting = new AddNewSetting({ file: "test.json" });
      addNewSetting.settings = { general: { theme: "dark" } };

      await expect(addNewSetting.writeFile()).rejects.toThrow("Write failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("handle - checkbox setting", () => {
    it("should add checkbox setting to existing section", async () => {
      const existingSettings = { general: { theme: "dark" } };
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingSettings));
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "darkMode",
        type: "checkbox",
        defaultValue: "false",
        dryRun: false,
      });

      await addNewSetting.handle();

      expect(mockFs.writeFile).toHaveBeenCalled();
      expect(addNewSetting.settings.general.darkMode).toEqual({
        type: "checkbox",
        default: "false",
      });
    });

    it("should create new section if it doesn't exist", async () => {
      const existingSettings = { general: { theme: "dark" } };
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingSettings));
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "advanced",
        key: "debug",
        type: "checkbox",
        defaultValue: "false",
        dryRun: false,
      });

      await addNewSetting.handle();

      expect(addNewSetting.settings.advanced).toBeDefined();
      expect(addNewSetting.settings.advanced.debug).toEqual({
        type: "checkbox",
        default: "false",
      });
    });
  });

  describe("handle - menu setting", () => {
    it("should add menu setting with values", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify({}));
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "language",
        type: "menu",
        values: ["en", "fr", "de"],
        defaultValue: "en",
        dryRun: false,
      });

      await addNewSetting.handle();

      expect(addNewSetting.settings.general.language).toEqual({
        type: "menu",
        default: "en",
        values: ["en", "fr", "de"],
      });
    });
  });

  describe("handle - number setting", () => {
    it("should add number setting with min and max", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify({}));
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "fontSize",
        type: "number",
        min: 8,
        max: 24,
        defaultValue: "12",
        dryRun: false,
      });

      await addNewSetting.handle();

      expect(addNewSetting.settings.general.fontSize).toEqual({
        type: "number",
        default: "12",
        min: 8,
        max: 24,
      });
    });
  });

  describe("handle - dry run mode", () => {
    it("should not write file in dry run mode", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify({}));
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "theme",
        type: "text",
        defaultValue: "dark",
        dryRun: true,
      });

      await addNewSetting.handle();

      expect(mockFs.writeFile).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Dry run mode"),
      );
    });
  });

  describe("handle - force mode", () => {
    it("should not overwrite existing setting without force", async () => {
      const existingSettings = {
        general: { theme: { type: "text", default: "light" } },
      };
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingSettings));

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "theme",
        type: "text",
        defaultValue: "dark",
        force: false,
      });

      await addNewSetting.handle();

      expect(mockFs.writeFile).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("already exists"),
      );
    });

    it("should overwrite existing setting with force", async () => {
      const existingSettings = {
        general: { theme: { type: "text", default: "light" } },
      };
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingSettings));
      mockFs.writeFile.mockResolvedValue();

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "theme",
        type: "text",
        defaultValue: "dark",
        force: true,
      });

      await addNewSetting.handle();

      expect(mockFs.writeFile).toHaveBeenCalled();
      expect(addNewSetting.settings.general.theme.default).toBe("dark");
    });
  });

  describe("handle - error handling", () => {
    it("should handle file read errors gracefully", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      const addNewSetting = new AddNewSetting({
        file: "test.json",
        section: "general",
        key: "theme",
        type: "text",
        defaultValue: "dark",
      });

      await addNewSetting.handle();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error handling settings"),
      );
    });
  });
});
