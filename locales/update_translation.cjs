/**
 * This script actualizes translation in locales folder
 */
const fs = require("fs");

function loadFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`Error reading file ${file}`);
    console.error(e);
    return {};
  }
}

function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 4), "utf8");
}

const otherFile = loadFile(process.argv[2]);
const fr = loadFile("fr.json");

function checkAndUpdate(objStart, otherObj) {
  for (let key in objStart) {
    if (!otherObj.hasOwnProperty.call(key)) {
      otherObj[key] = objStart[key];
    } else if (typeof objStart[key] === "object" && !Array.isArray(objStart[key])) {
      checkAndUpdate(objStart[key], otherObj[key]);
    }
  }
  return otherObj;
}

const newFile = checkAndUpdate(fr, otherFile);

writeFile(process.argv[2], newFile);
