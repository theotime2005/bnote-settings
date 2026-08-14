import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  exportConfigReport,
  exportToCSV,
  exportToJSON,
  generateConfigReport,
} from "@/utils/export.js";

describe("Export utilities", () => {
  let mockLink;
  let createdBlob;

  beforeEach(() => {
    mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    };

    createdBlob = null;

    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") {
        return mockLink;
      }

      return document.createElement(tagName);
    });

    vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
    vi.spyOn(document.body, "removeChild").mockImplementation(() => {});

    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      createdBlob = blob;
      return "blob:mock-url";
    });

    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("exportToJSON", () => {
    it("should export configuration to JSON file", async () => {
      const config = {
        general: {
          theme: "dark",
        },
      };

      const result = exportToJSON(config, "test-settings");

      expect(result).toBe(true);

      expect(createdBlob).toBeInstanceOf(Blob);

      const content = await createdBlob.text();

      expect(content).toBe(JSON.stringify(config, null, 2));

      expect(mockLink.download).toBe("test-settings.bnote");
      expect(mockLink.click).toHaveBeenCalled();

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should use default filename if not provided", () => {
      exportToJSON({});

      expect(mockLink.download).toBe("bnote-settings.bnote");
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
        throw new Error("Blob error");
      });

      const result = exportToJSON({});

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
    });
  });

  describe("exportToCSV", () => {
    it("should export configuration to CSV file", async () => {
      const config = {
        general: {
          theme: "dark",
          fontSize: 12,
        },
        advanced: {
          debug: true,
        },
      };

      const result = exportToCSV(config, "test-analysis");

      expect(result).toBe(true);

      expect(createdBlob).toBeInstanceOf(Blob);
      expect(mockLink.download).toBe("test-analysis.csv");
      expect(mockLink.click).toHaveBeenCalled();
    });

    it("should generate CSV content", async () => {
      exportToCSV({
        section: {
          key: "value with \"quotes\"",
        },
      });

      const csvContent = await createdBlob.text();

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
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
        throw new Error("Blob error");
      });

      const result = exportToCSV({});

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
    });
  });

  describe("generateConfigReport", () => {
    it("should generate a complete config report", () => {
      const config = {
        general: {
          theme: "dark",
          fontSize: 14,
        },
      };

      const schema = {
        general: {
          theme: {
            type: "menu",
            values: ["dark", "light"],
            default: "light",
          },
          fontSize: {
            type: "number",
            min: 8,
            max: 24,
            default: 12,
          },
        },
      };

      const translations = {
        "settings.id.general": "Général",
        "settings.id.theme": "Thème",
        "settings.id.fontSize": "Taille de police",
      };

      const report = generateConfigReport(
        config,
        schema,
        translations,
      );

      expect(report.metadata.totalSections).toBe(1);
      expect(report.metadata.totalSettings).toBe(2);

      expect(report.sections["Général"]).toBeDefined();

      expect(
        report.sections["Général"].settings["Thème"].value,
      ).toBe("dark");

      expect(
        report.sections["Général"].settings["Taille de police"].value,
      ).toBe(14);
    });

    it("should handle missing translations", () => {
      const report = generateConfigReport(
        {
          general: {
            theme: "dark",
          },
        },
        {
          general: {
            theme: {
              type: "menu",
              default: "light",
            },
          },
        },
      );

      expect(report.sections.general).toBeDefined();
      expect(report.sections.general.settings.theme).toBeDefined();
    });

    it("should identify default values correctly", () => {
      const report = generateConfigReport(
        {
          general: {
            theme: "light",
          },
        },
        {
          general: {
            theme: {
              type: "menu",
              default: "light",
            },
          },
        },
      );

      expect(
        report.sections.general.settings.theme.isDefault,
      ).toBe(true);
    });
  });

  describe("exportConfigReport", () => {
    it("should export configuration report to text file", async () => {
      const result = exportConfigReport(
        {
          general: {
            theme: "dark",
          },
        },
        {
          general: {
            theme: {
              type: "menu",
              default: "light",
            },
          },
        },
        {},
        "test-report",
      );

      expect(result).toBe(true);

      expect(createdBlob).toBeInstanceOf(Blob);
      expect(mockLink.download).toBe("test-report.txt");
      expect(mockLink.click).toHaveBeenCalled();
    });

    it("should include report content", async () => {
      exportConfigReport(
        {
          general: {
            theme: "dark",
          },
        },
        {
          general: {
            theme: {
              type: "menu",
              default: "light",
            },
          },
        },
        {},
      );

      const content = await createdBlob.text();

      expect(content).toContain("# Rapport de Configuration B.note");
      expect(content).toContain("Généré le:");
      expect(content).toContain("Sections:");
      expect(content).toContain("Paramètres:");
    });

    it("should use default filename if not provided", () => {
      exportConfigReport({}, {}, {});

      expect(mockLink.download).toBe("bnote-config-report.txt");
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
        throw new Error("Blob error");
      });

      const result = exportConfigReport({}, {}, {});

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
    });
  });
});
