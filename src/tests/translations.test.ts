import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const localesDir = path.resolve(__dirname, "../../locales");
const baseLang = "fr";

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

function loadTranslations(lang: string): TranslationObject {
  const filePath = path.join(localesDir, `${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as TranslationObject;
}

function checkTranslations(baseTranslations: TranslationObject, targetTranslations: TranslationObject, lang: string): boolean {
  for (const key in baseTranslations) {
    if (!Object.prototype.hasOwnProperty.call(targetTranslations, key)) {
      console.log(`Missing key '${key}' in ${lang}`);
      return false;
    }
    if (typeof baseTranslations[key] === "object") {
      if (!checkTranslations(baseTranslations[key] as TranslationObject, targetTranslations[key] as TranslationObject, lang)) {
        return false;
      }
    } else {
      const targetValue = targetTranslations[key] as string;
      if (targetValue.startsWith("*")) {
        console.log(`Untranslated key '${key}' in ${lang}`);
        return false;
      }
    }
  }
  return true;
}

describe("Translation files", () => {
  const baseTranslations = loadTranslations(baseLang);
  const files = fs
    .readdirSync(localesDir)
    .filter((file) => file.endsWith(".json") && file !== `${baseLang}.json`);

  files.forEach((file) => {
    const lang = path.basename(file, ".json");
    it(`should have up-to-date translations for ${lang}`, () => {
      const targetTranslations = loadTranslations(lang);
      expect(checkTranslations(baseTranslations, targetTranslations, lang)).toBe(true);
    });
  });
});