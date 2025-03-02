/**
 * This script is used to update translation files with new keys from a source file.
 */
import fs from "fs/promises";
import translatte from "translatte";

async function loadFile(file) {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error when reading ${file}`);
    console.error(e);
    return {};
  }
}

async function writeFile(file, data) {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 4), "utf8");
  } catch (e) {
    console.error(`Error when writing ${file}`);
    console.error(e);
  }
}

async function getTranslation(text, language) {
  try {
    const translation = await translatte(text, { to: language });
    return translation.text;
  } catch (e) {
    console.error(`Error during translation of "${text}" to ${language}`);
    console.error(e);
    return text;
  }
}

async function checkAndUpdate(objStart, otherObj, language) {
  for (const key in objStart) {
    if (typeof objStart[key] === "object" && objStart[key] !== null) {
      otherObj[key] = await checkAndUpdate(
        objStart[key],
        otherObj[key] || {},
        language,
      );
    } else {
      if (!otherObj[key]) {
        console.log(`New key found : ${key}`);
        otherObj[key] = `*${await getTranslation(objStart[key], language)}`;
      }
    }
  }
  return otherObj;
}

function clearOldValues(objStart, otherObj) {
  for (const key in otherObj) {
    if (typeof otherObj[key] === "object" && otherObj[key] !== null) {
      otherObj[key] = clearOldValues(objStart[key], otherObj[key]);
    }
    if (!objStart[key]) {
      console.log(`Old key : ${key}`);
      delete otherObj[key];
    }
  }
  return otherObj;
}

async function main() {
  const sourceFile = process.argv[2];
  const otherFiles = process.argv.slice(3);

  // Charger le fichier source
  const source = await loadFile(sourceFile);

  // Actualiser les autres fichiers
  for (const file of otherFiles) {
    console.log(`actualizing ${file}`);
    const other = await loadFile(file);
    const languageFile = file.split("/").pop().split(".")[0];
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
