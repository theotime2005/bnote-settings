/**
 * This script is used to update translation files with new keys from a source file.
 */
import fs from "fs/promises";
import translatte from "translatte";

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

async function loadFile(file: string): Promise<TranslationObject> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as TranslationObject;
  } catch (e) {
    console.error(`Error when reading ${file}`);
    console.error(e);
    return {};
  }
}

async function writeFile(file: string, data: TranslationObject): Promise<void> {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 4), "utf8");
  } catch (e) {
    console.error(`Error when writing ${file}`);
    console.error(e);
  }
}

async function getTranslation(text: string, language: string): Promise<string> {
  try {
    const translation = await translatte(text, { to: language });
    return translation.text;
  } catch (e) {
    console.error(`Error during translation of "${text}" to ${language}`);
    console.error(e);
    return text;
  }
}

async function checkAndUpdate(objStart: TranslationObject, otherObj: TranslationObject, language: string): Promise<TranslationObject> {
  for (const key in objStart) {
    if (typeof objStart[key] === "object" && objStart[key] !== null) {
      otherObj[key] = await checkAndUpdate(
        objStart[key] as TranslationObject,
        (otherObj[key] as TranslationObject) || {},
        language,
      );
    } else {
      if (!otherObj[key]) {
        console.log(`New key found : ${key}`);
        otherObj[key] = `*${await getTranslation(objStart[key] as string, language)}`;
      }
    }
  }
  return otherObj;
}

function clearOldValues(objStart: TranslationObject, otherObj: TranslationObject): TranslationObject {
  for (const key in otherObj) {
    if (typeof otherObj[key] === "object" && otherObj[key] !== null) {
      otherObj[key] = clearOldValues(objStart[key] as TranslationObject, otherObj[key] as TranslationObject);
    }
    if (!objStart[key]) {
      console.log(`Old key : ${key}`);
      delete otherObj[key];
    }
  }
  return otherObj;
}

async function main(): Promise<void> {
  const sourceFile = process.argv[2];
  const otherFiles = process.argv.slice(3);

  if (!sourceFile) {
    console.error("Please provide a source file");
    process.exit(1);
  }

  // Charger le fichier source
  const source = await loadFile(sourceFile);

  // Actualiser les autres fichiers
  for (const file of otherFiles) {
    console.log(`actualizing ${file}`);
    const other = await loadFile(file);
    const languageFile = file.split("/").pop()?.split(".")[0];
    if (!languageFile) {
      console.error(`Could not determine language from file: ${file}`);
      continue;
    }
    const updated = await checkAndUpdate(source, other, languageFile);
    const cleared = clearOldValues(source, updated);
    await writeFile(file, cleared);
  }
}

main().catch((e) => {
  console.error("An error occured");
  console.error(e);
});

export { checkAndUpdate, clearOldValues, getTranslation, loadFile, writeFile };