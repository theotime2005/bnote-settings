import { describe, it, expect } from "vitest";
import all_settings from "@/settings.js";

// Test unitaire pour vérifier les valeurs par défaut
describe("unit | Settings", () => {
  describe("# Check default values", () => {
    it("Should be check default values", () => {
      // Test des paramètres système
      expect(all_settings.system.braille_type.default).toBe("dot-8");
      expect(all_settings.system.auto_sync_date.default).toBe(false);
      expect(all_settings.system.spaces_in_label.default).toBe(false);
      expect(all_settings.system.shortcuts_visible.default).toBe(false);
      expect(all_settings.system.app_explorer.default).toBe("main_apps_menu");
      expect(all_settings.system.app_settings.default).toBe("main_apps_menu");

      // Test des paramètres de l'explorateur
      expect(all_settings.explorer.empty_bluetooth_shutdown.default).toBe(false);
      expect(all_settings.explorer.number_recent_files.default).toBe(10);

      // Test des paramètres de l'éditeur
      expect(all_settings.editor.braille_type.default).toBe("dot-8");
      expect(all_settings.editor.line_length.default).toBe(80);
      expect(all_settings.editor.dot78_visible.default).toBe(true);
      expect(all_settings.editor.cursor_visible.default).toBe(true);

      // Test des paramètres mathématiques
      expect(all_settings.math.angle.default).toBe("radian");
      expect(all_settings.math.precision.default).toBe(2);
      expect(all_settings.math.format.default).toBe("scientific");

      // Test des paramètres musicaux (music_xml)
      expect(all_settings.music_xml.edit_mode.default).toBe("read");
      expect(all_settings.music_xml.braille_type.default).toBe("dot-8");
      expect(all_settings.music_xml.clef.default).toBe(true);

      // Test des paramètres de synthèse vocale (speech)
      expect(all_settings.speech.volume_headphone.default).toBe(50);
      expect(all_settings.speech.speed.default).toBe(100);
      expect(all_settings.speech.synthesis.default).toBe("cerence");

      // Test des paramètres de l'agenda
      expect(all_settings.agenda.default_presentation.default).toBe("standard");
      expect(all_settings.agenda.remember.default).toBe("no");

      // Test des paramètres de l'apprentissage du braille
      expect(all_settings.braille_learning.use_vocal.default).toBe("auto");
      expect(all_settings.braille_learning.keep_spaces.default).toBe(false);
      expect(all_settings.braille_learning.write_all.default).toBe(false);
    });
  });
  describe("# Check the format of settings", () => {
    it("should format of settings is correct", () => {
      function checkSettingsIntegrity(setting) {
        if (!setting.id) {
          return false;
        }
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
          if (!setting.default === undefined || typeof setting.default != "boolean") {
            console.warn(setting.id, "Incorrect type of default value");
            return false;
          }
          return true;
        case "number":
          if (setting.min===undefined || !setting.max) {
            console.warn(setting.id, "Min and max are absent");
            return false;
          } else if (setting.default > setting.max || setting.default < setting.min) {
            console.warn(setting.id, "Large value");
            return false;
          }
          return true;
        }
      }
      for (let section in all_settings) {
        for (let key in all_settings[section]) {
          expect(checkSettingsIntegrity(all_settings[section][key])).toBe(true);
        }
      }
    });
  });
});
