import { describe, expect, it } from "vitest";

import { Sanitizer, ValidationRules } from "@/utils/validation.js";

describe("ValidationRules", () => {
  describe("validateBoolean", () => {
    it("should validate true boolean", () => {
      // when
      const result = ValidationRules.validateBoolean(true);

      // then
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should validate false boolean", () => {
      // when
      const result = ValidationRules.validateBoolean(false);

      // then
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should reject non-boolean values", () => {
      // when
      const result = ValidationRules.validateBoolean("true");

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("La valeur doit être un booléen");
    });
  });

  describe("validateNumber", () => {
    it("should validate a valid number", () => {
      // when
      const result = ValidationRules.validateNumber(5, 0, 10);

      // then
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should validate number at minimum boundary", () => {
      // when
      const result = ValidationRules.validateNumber(0, 0, 10);

      // then
      expect(result.isValid).toBe(true);
    });

    it("should validate number at maximum boundary", () => {
      // when
      const result = ValidationRules.validateNumber(10, 0, 10);

      // then
      expect(result.isValid).toBe(true);
    });

    it("should reject number below minimum", () => {
      // when
      const result = ValidationRules.validateNumber(-1, 0, 10);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("La valeur doit être supérieure ou égale à 0");
    });

    it("should reject number above maximum", () => {
      // when
      const result = ValidationRules.validateNumber(11, 0, 10);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("La valeur doit être inférieure ou égale à 10");
    });

    it("should reject non-number values", () => {
      // when
      const result = ValidationRules.validateNumber("5", 0, 10);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("La valeur doit être un nombre");
    });

    it("should reject NaN", () => {
      // when
      const result = ValidationRules.validateNumber(NaN, 0, 10);

      // then
      expect(result.isValid).toBe(false);
    });

    it("should validate number without min constraint", () => {
      // when
      const result = ValidationRules.validateNumber(5, undefined, 10);

      // then
      expect(result.isValid).toBe(true);
    });

    it("should validate number without max constraint", () => {
      // when
      const result = ValidationRules.validateNumber(5, 0, undefined);

      // then
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateText", () => {
    it("should validate text within length limit", () => {
      // when
      const result = ValidationRules.validateText("Hello", 10);

      // then
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should validate empty string", () => {
      // when
      const result = ValidationRules.validateText("", 10);

      // then
      expect(result.isValid).toBe(true);
    });

    it("should reject text exceeding length limit", () => {
      // when
      const result = ValidationRules.validateText("Hello World!", 5);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Le texte ne peut pas dépasser 5 caractères");
    });

    it("should use default max length of 255", () => {
      // given
      const longText = "a".repeat(256);

      // when
      const result = ValidationRules.validateText(longText);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Le texte ne peut pas dépasser 255 caractères");
    });

    it("should reject non-string values", () => {
      // when
      const result = ValidationRules.validateText(123, 10);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("La valeur doit être une chaîne de caractères");
    });
  });

  describe("validateMenu", () => {
    it("should validate value in allowed values", () => {
      // when
      const result = ValidationRules.validateMenu("option1", ["option1", "option2", "option3"]);

      // then
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should reject value not in allowed values", () => {
      // when
      const result = ValidationRules.validateMenu("option4", ["option1", "option2", "option3"]);

      // then
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("La valeur doit être l'une des suivantes: option1, option2, option3");
    });
  });

  describe("validateSetting", () => {
    it("should validate checkbox setting", () => {
      // when
      const result = ValidationRules.validateSetting(true, { type: "checkbox" });

      // then
      expect(result.isValid).toBe(true);
    });

    it("should validate number setting", () => {
      // when
      const result = ValidationRules.validateSetting(5, { type: "number", min: 0, max: 10 });

      // then
      expect(result.isValid).toBe(true);
    });

    it("should validate text setting", () => {
      // when
      const result = ValidationRules.validateSetting("Hello", { type: "text", maxLength: 10 });

      // then
      expect(result.isValid).toBe(true);
    });

    it("should validate menu setting", () => {
      // when
      const result = ValidationRules.validateSetting("option1", { type: "menu", values: ["option1", "option2"] });

      // then
      expect(result.isValid).toBe(true);
    });

    it("should handle unknown setting types", () => {
      // when
      const result = ValidationRules.validateSetting("value", { type: "unknown" });

      // then
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateConfiguration", () => {
    it("should validate complete configuration", () => {
      // given
      const config = {
        general: { theme: "dark", fontSize: 12 },
        advanced: { debug: false },
      };
      const schema = {
        general: {
          theme: { type: "menu", values: ["dark", "light"], default: "light" },
          fontSize: { type: "number", min: 8, max: 24, default: 12 },
        },
        advanced: {
          debug: { type: "checkbox", default: false },
        },
      };

      // when
      const result = ValidationRules.validateConfiguration(config, schema);

      // then
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should detect missing section", () => {
      // given
      const config = {
        general: { theme: "dark" },
      };
      const schema = {
        general: { theme: { type: "menu", values: ["dark", "light"], default: "light" } },
        advanced: { debug: { type: "checkbox", default: false } },
      };

      // when
      const result = ValidationRules.validateConfiguration(config, schema);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors.advanced).toBe("Section manquante");
    });

    it("should detect invalid setting values", () => {
      // given
      const config = {
        general: { fontSize: 30 },
      };
      const schema = {
        general: { fontSize: { type: "number", min: 8, max: 24, default: 12 } },
      };

      // when
      const result = ValidationRules.validateConfiguration(config, schema);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors.general.fontSize).toBe("La valeur doit être inférieure ou égale à 24");
    });
  });
});

describe("Sanitizer", () => {
  describe("sanitizeValue", () => {
    it("should sanitize number type", () => {
      // when
      const result = Sanitizer.sanitizeValue("123", "number");

      // then
      expect(result).toBe(123);
      expect(typeof result).toBe("number");
    });

    it("should sanitize text type", () => {
      // when
      const result = Sanitizer.sanitizeValue("  Hello  ", "text");

      // then
      expect(result).toBe("Hello");
    });

    it("should sanitize checkbox type", () => {
      // then
      expect(Sanitizer.sanitizeValue("true", "checkbox")).toBe(true);
      expect(Sanitizer.sanitizeValue("", "checkbox")).toBe(false);
      expect(Sanitizer.sanitizeValue(1, "checkbox")).toBe(true);
    });

    it("should return value as-is for unknown types", () => {
      // given
      const obj = { key: "value" };

      // when
      const result = Sanitizer.sanitizeValue(obj, "unknown");

      // then
      expect(result).toBe(obj);
    });
  });

  describe("sanitizeConfiguration", () => {
    it("should sanitize complete configuration", () => {
      // given
      const config = {
        general: { theme: "dark", fontSize: "12" },
        advanced: { debug: "true" },
      };
      const schema = {
        general: {
          theme: { type: "text", default: "light" },
          fontSize: { type: "number", default: 12 },
        },
        advanced: {
          debug: { type: "checkbox", default: false },
        },
      };

      // when
      const result = Sanitizer.sanitizeConfiguration(config, schema);

      // then
      expect(result.general.theme).toBe("dark");
      expect(result.general.fontSize).toBe(12);
      expect(typeof result.general.fontSize).toBe("number");
      expect(result.advanced.debug).toBe(true);
      expect(typeof result.advanced.debug).toBe("boolean");
    });

    it("should use default values for missing settings", () => {
      // given
      const config = {
        general: {},
      };
      const schema = {
        general: {
          theme: { type: "text", default: "light" },
          fontSize: { type: "number", default: 12 },
        },
      };

      // when
      const result = Sanitizer.sanitizeConfiguration(config, schema);

      // then
      expect(result.general.theme).toBe("light");
      expect(result.general.fontSize).toBe(12);
    });

    it("should handle missing sections", () => {
      // given
      const config = {};
      const schema = {
        general: {
          theme: { type: "text", default: "light" },
        },
      };

      // when
      const result = Sanitizer.sanitizeConfiguration(config, schema);

      // then
      expect(result.general.theme).toBe("light");
    });
  });
});
