/**
 * Validation utilities for B.note parameters
 */

export const ValidationRules = {
  /**
   * Validates a parameter based on its type and constraints
   * @param {*} value - The value to validate
   * @param {Object} setting - The parameter configuration
   * @returns {Object} - { isValid: boolean, error: string }
   */
  validateSetting(value, setting) {
    switch (setting.type) {
    case "checkbox":
      return this.validateBoolean(value);
    case "number":
      return this.validateNumber(value, setting.min, setting.max);
    case "text":
      return this.validateText(value, setting.maxLength);
    case "menu":
      return this.validateMenu(value, setting.values);
    default:
      return { isValid: true, error: null };
    }
  },

  /**
   * Valide une valeur booléenne
   */
  validateBoolean(value) {
    if (typeof value !== "boolean") {
      return { isValid: false, error: "La valeur doit être un booléen" };
    }
    return { isValid: true, error: null };
  },

  /**
   * Valide un nombre avec des contraintes min/max
   */
  validateNumber(value, min, max) {
    if (typeof value !== "number" || isNaN(value)) {
      return { isValid: false, error: "La valeur doit être un nombre" };
    }
    if (min !== undefined && value < min) {
      return { isValid: false, error: `La valeur doit être supérieure ou égale à ${min}` };
    }
    if (max !== undefined && value > max) {
      return { isValid: false, error: `La valeur doit être inférieure ou égale à ${max}` };
    }
    return { isValid: true, error: null };
  },

  /**
   * Valide un texte avec une longueur maximale
   */
  validateText(value, maxLength = 255) {
    if (typeof value !== "string") {
      return { isValid: false, error: "La valeur doit être une chaîne de caractères" };
    }
    if (value.length > maxLength) {
      return { isValid: false, error: `Le texte ne peut pas dépasser ${maxLength} caractères` };
    }
    return { isValid: true, error: null };
  },

  /**
   * Valide qu'une valeur fait partie des options autorisées
   */
  validateMenu(value, allowedValues) {
    if (!allowedValues.includes(value)) {
      return { isValid: false, error: `La valeur doit être l'une des suivantes: ${allowedValues.join(", ")}` };
    }
    return { isValid: true, error: null };
  },

  /**
   * Valide un objet de configuration complet
   */
  validateConfiguration(config, settingsSchema) {
    const errors = {};
    let isValid = true;

    for (const [section, settings] of Object.entries(settingsSchema)) {
      if (!config[section]) {
        errors[section] = "Section manquante";
        isValid = false;
        continue;
      }

      for (const [key, setting] of Object.entries(settings)) {
        const value = config[section][key];
        const validation = this.validateSetting(value, setting);

        if (!validation.isValid) {
          if (!errors[section]) errors[section] = {};
          errors[section][key] = validation.error;
          isValid = false;
        }
      }
    }

    return { isValid, errors };
  },
};

/**
 * Sanitise une valeur selon son type
 */
export const Sanitizer = {
  sanitizeValue(value, type) {
    switch (type) {
    case "number":
      return Number(value);
    case "text":
      return String(value).trim();
    case "checkbox":
      return Boolean(value);
    default:
      return value;
    }
  },

  sanitizeConfiguration(config, settingsSchema) {
    const sanitized = {};

    for (const [section, settings] of Object.entries(settingsSchema)) {
      sanitized[section] = {};

      for (const [key, setting] of Object.entries(settings)) {
        const value = config[section]?.[key];
        if (value !== undefined) {
          sanitized[section][key] = this.sanitizeValue(value, setting.type);
        } else {
          sanitized[section][key] = setting.default;
        }
      }
    }

    return sanitized;
  },
};