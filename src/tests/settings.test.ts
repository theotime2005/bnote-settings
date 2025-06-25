import { describe, it, expect } from "vitest";
import all_settings from "@/settings.json";
import type { Setting, Settings } from "@/types";

// Check the format of settings
describe("unit | Settings", () => {
  describe("# Check the format of settings", () => {
    it("should format of settings is correct", () => {
      function checkSettingsIntegrity(setting: Setting): boolean {
        switch (setting.type) {
        case "menu":
          if (!setting.values) {
            console.warn("No values");
            return false;
          } else if (!setting.values.includes(setting.default as string)) {
            console.warn("Default value is not in values");
            return false;
          }
          return true;
        case "checkbox":
          if (setting.default === undefined || typeof setting.default !== "boolean") {
            console.warn("Incorrect type of default value");
            return false;
          }
          return true;
        case "number":
          if (setting.min === undefined || setting.max === undefined) {
            console.warn("Min and max are absent");
            return false;
          } else if ((setting.default as number) > setting.max || (setting.default as number) < setting.min) {
            console.warn("Large value");
            return false;
          }
          return true;
        case "text":
          return true;
        default:
          return false;
        }
      }

      const settings = all_settings as Settings;
      for (const section in settings) {
        for (const key in settings[section]) {
          expect(checkSettingsIntegrity(settings[section][key])).toBe(true);
        }
      }
    });
  });
});