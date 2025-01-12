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

const source = loadFile(process.argv[2]);
const otherFile = loadFile(process.argv[3]);

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

const tmp = checkAndUpdate(source, otherFile);
const newFile = clearOldValues(source, tmp);

writeFile(process.argv[3], newFile);
