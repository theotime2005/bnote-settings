import all_settings from "~/settings.json";

// Check the format of settings
describe("unit | Settings", () => {
  describe("# Check the format of settings", () => {
    it("should format of settings is correct", () => {
      function checkSettingsIntegrity(setting) {
        switch (setting.type) {
        case "menu":
          if (!setting.values) {
            console.warn(setting.id, "No values");
            return false;
          } else if (!setting.values.includes(setting.default)) {
            console.warn(setting.id, "Default value is not in values");
            return false;
          }
          return true;
        case "checkbox":
          if (!setting.default && typeof setting.default != "boolean") {
            console.warn(setting.id, "Incorrect type of default value");
            return false;
          }
          return true;
        case "number":
          if (setting.min === undefined || !setting.max) {
            console.warn(setting.id, "Min and max are absent");
            return false;
          } else if (setting.default > setting.max || setting.default < setting.min) {
            console.warn(setting.id, "Large value");
            return false;
          }
          return true;
        case "text":
          return true;
        }
      }
      for (const section in all_settings) {
        for (const key in all_settings[section]) {
          expect(checkSettingsIntegrity(all_settings[section][key])).toBe(true);
        }
      }
    });
  });
});
