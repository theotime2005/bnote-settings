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

function checkAndUpdate(objStart, otherObj) {
  for (let key in objStart) {
    if (typeof objStart[key] === "object") {
      otherObj[key] = checkAndUpdate(objStart[key], otherObj[key] || {});
    } else {
      if (!otherObj[key]) {
        console.log(`New key found: ${key}`);
        otherObj[key] = `*${objStart[key]}`;
      }
    }
  }
  return otherObj;
}

function clearOldValues(obj_start, other_obj) {
  for (let key in other_obj) {
    if (!obj_start[key]) {
      console.log("Old key", key);
      delete other_obj[key];
    }
  }
  return other_obj;
}

const source_file = process.argv[2];
const other_files = process.argv.slice(3);

// load source file
const source = loadFile(source_file);

// Actualize other files
other_files.forEach((file) => {
  console.log("Actualizing", file);
  const other = loadFile(file);
  const updated = checkAndUpdate(source, other);
  const cleared = clearOldValues(source, updated);
  writeFile(file, cleared);
});
