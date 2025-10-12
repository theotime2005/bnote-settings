import { beforeEach, describe, expect, it, vi } from "vitest";

import { exportConfigReport, exportToCSV, exportToJSON, generateConfigReport } from "@/utils/export.js";

describe("Export utilities", () => {
  let mockLink;
  let mockBlob;
  let mockURL;

  beforeEach(() => {
    mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    };
    document.createElement = vi.fn(() => mockLink);
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();

    mockBlob = {};
    global.Blob = vi.fn((content, options) => {
      mockBlob.content = content;
      mockBlob.options = options;
      return mockBlob;
    });

    mockURL = {
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    };
    global.URL = mockURL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("exportToJSON", () => {
    it("should export configuration to JSON file", () => {
      const config = { general: { theme: "dark" } };
      const result = exportToJSON(config, "test-settings");

      expect(result).toBe(true);
      expect(global.Blob).toHaveBeenCalledWith(
        [JSON.stringify(config, null, 2)],
        { type: "application/json" },
      );
      expect(mockLink.download).toBe("test-settings.bnote");
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should use default filename if not provided", () => {
      const config = { general: { theme: "dark" } };
      exportToJSON(config);

      expect(mockLink.download).toBe("bnote-settings.bnote");
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      global.Blob = vi.fn(() => {
        throw new Error("Blob error");
      });

      const result = exportToJSON({});

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe("exportToCSV", () => {
    it("should export configuration to CSV file", () => {
      const config = {
        general: { theme: "dark", fontSize: 12 },
        advanced: { debug: true },
      };

      const result = exportToCSV(config, "test-analysis");

      expect(result).toBe(true);
      expect(global.Blob).toHaveBeenCalledWith(
        expect.any(Array),
        { type: "text/csv;charset=utf-8;" },
      );
      expect(mockLink.download).toBe("test-analysis.csv");
      expect(mockLink.click).toHaveBeenCalled();
    });

    it("should format CSV correctly with proper escaping", () => {
      const config = {
        section: { key: "value with \"quotes\"" },
      };

      exportToCSV(config);

      const csvContent = mockBlob.content[0];
      expect(csvContent).toContain("Section");
      expect(csvContent).toContain("Paramètre");
      expect(csvContent).toContain("Valeur");
      expect(csvContent).toContain("Type");
    });

    it("should use default filename if not provided", () => {
      exportToCSV({});
      expect(mockLink.download).toBe("bnote-settings-analysis.csv");
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      global.Blob = vi.fn(() => {
        throw new Error("Blob error");
      });

      const result = exportToCSV({});

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe("generateConfigReport", () => {
    it("should generate a complete config report", () => {
      const config = {
        general: { theme: "dark", fontSize: 14 },
      };
      const schema = {
        general: {
          theme: { type: "menu", values: ["dark", "light"], default: "light" },
          fontSize: { type: "number", min: 8, max: 24, default: 12 },
        },
      };
      const translations = {
        "settings.id.general": "Général",
        "settings.id.theme": "Thème",
        "settings.id.fontSize": "Taille de police",
      };

      const report = generateConfigReport(config, schema, translations);

      expect(report.metadata).toBeDefined();
      expect(report.metadata.totalSections).toBe(1);
      expect(report.metadata.totalSettings).toBe(2);
      expect(report.sections["Général"]).toBeDefined();
      expect(report.sections["Général"].settings["Thème"].value).toBe("dark");
      expect(report.sections["Général"].settings["Thème"].isDefault).toBe(false);
      expect(report.sections["Général"].settings["Taille de police"].value).toBe(14);
      expect(report.sections["Général"].settings["Taille de police"].isDefault).toBe(false);
    });

    it("should handle missing translations", () => {
      const config = {
        general: { theme: "dark" },
      };
      const schema = {
        general: {
          theme: { type: "menu", default: "light" },
        },
      };

      const report = generateConfigReport(config, schema);

      expect(report.sections.general).toBeDefined();
      expect(report.sections.general.settings.theme).toBeDefined();
    });

    it("should identify default values correctly", () => {
      const config = {
        general: { theme: "light" },
      };
      const schema = {
        general: {
          theme: { type: "menu", default: "light" },
        },
      };

      const report = generateConfigReport(config, schema);

      expect(report.sections.general.settings.theme.isDefault).toBe(true);
    });
  });

  describe("exportConfigReport", () => {
    it("should export configuration report to text file", () => {
      const config = {
        general: { theme: "dark" },
      };
      const schema = {
        general: {
          theme: { type: "menu", default: "light" },
        },
      };

      const result = exportConfigReport(config, schema, {}, "test-report");

      expect(result).toBe(true);
      expect(global.Blob).toHaveBeenCalledWith(
        expect.any(Array),
        { type: "text/plain;charset=utf-8;" },
      );
      expect(mockLink.download).toBe("test-report.txt");
      expect(mockLink.click).toHaveBeenCalled();
    });

    it("should include report content", () => {
      const config = {
        general: { theme: "dark" },
      };
      const schema = {
        general: {
          theme: { type: "menu", default: "light" },
        },
      };

      exportConfigReport(config, schema, {});

      const textContent = mockBlob.content[0];
      expect(textContent).toContain("# Rapport de Configuration B.note");
      expect(textContent).toContain("Généré le:");
      expect(textContent).toContain("Sections:");
      expect(textContent).toContain("Paramètres:");
    });

    it("should use default filename if not provided", () => {
      exportConfigReport({}, {}, {});
      expect(mockLink.download).toBe("bnote-config-report.txt");
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      global.Blob = vi.fn(() => {
        throw new Error("Blob error");
      });

      const result = exportConfigReport({}, {}, {});

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });
});
