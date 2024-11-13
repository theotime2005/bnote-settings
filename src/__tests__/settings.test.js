import { describe, it, expect } from "vitest"
import all_settings from "@/settings.js"

// Test unitaire pour vérifier les valeurs par défaut
describe("unit | Settings", () => {
  describe("# Check the format of settings", () => {
    it("should format of settings is correct", () => {
      function checkSettingsIntegrity(setting) {
        if (!setting.id) {
          return false
        }
        switch (setting.type) {
          case "menu":
            if (!setting.values) {
              console.warn(setting.id, "No values")
              return false
            } else if (!setting.values.includes(setting.default)) {
              console.warn(setting.id, "Default value is not in values")
              return false
            }
            return true
          case "checkbox":
            if (!setting.default === undefined || typeof setting.default != "boolean") {
              console.warn(setting.id, "Incorrect type of default value")
              return false
            }
            return true
          case "number":
            if (setting.min === undefined || !setting.max) {
              console.warn(setting.id, "Min and max are absent")
              return false
            } else if (setting.default > setting.max || setting.default < setting.min) {
              console.warn(setting.id, "Large value")
              return false
            }
            return true
          case "text":
            return true
        }
      }
      for (let section in all_settings) {
        for (let key in all_settings[section]) {
          expect(checkSettingsIntegrity(all_settings[section][key])).toBe(true)
        }
      }
    })
  })
})
