/**
 * This script is used to update translation files with new keys from a source file.
 */

import fs from "fs/promises";
import translatte from "translatte";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

export class UpdateTranslations {
  constructor(options = {}) {
    const { source = "", targets = [] } = options;
    this.source = source;
    this.targets = targets;
    this.translationsSource = {};
    this.targetTranslations = {};
  }

  async handle() {
    this.translationsSource = await this.loadFile(this.source);
    for (const file of this.targets) {
      console.log("Reading file :", file);
      this.targetTranslations = await this.loadFile(file);
      console.log("Translating file:", file);
      this.targetTranslations = await this.checkAndUpdate(
        this.translationsSource,
        this.targetTranslations,
        file.split(".").slice(-2, -1)[0],
      );
      console.log("Clearing old values in file:", file);
      this.targetTranslations = this.clearOldValues(this.translationsSource, this.targetTranslations);
      console.log("Writing file:", file);
      await this.writeFile(file, this.targetTranslations);
    }
    console.log("Finished writing files");
  }

  async loadFile(file) {
    try {
      const data = await fs.readFile(file, "utf8");
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error when reading ${file}`);
      console.error(e);
      return {};
    }
  }

  async writeFile(file, data) {
    try {
      await fs.writeFile(file, JSON.stringify(data, null, 4), "utf8");
    } catch (e) {
      console.error(`Error when writing ${file}`);
      console.error(e);
    }
  }

  async _getTranslation(text, language) {
    try {
      const translation = await translatte(text, { to: language });
      return translation.text;
    } catch (e) {
      console.error(`Error during translation of "${text}" to ${language}`);
      console.error(e);
      return text;
    }
  }

  async checkAndUpdate(objStart, otherObj, language) {
    const result = {};
    for (const key in objStart) {
      if (typeof objStart[key] === "object" && objStart[key] !== null) {
        result[key] = await this.checkAndUpdate(
          objStart[key],
          (otherObj && otherObj[key]) || {},
          language,
        );
      } else {
        if (!otherObj || !otherObj[key]) {
          console.log(`New key found : ${key}`);
          result[key] = `*${await this._getTranslation(objStart[key], language)}`;
        } else {
          result[key] = otherObj[key];
        }
      }
    }
    return result;
  }

  clearOldValues(objStart, otherObj) {
    const result = {};
    for (const key in objStart) {
      if (Object.prototype.hasOwnProperty.call(otherObj, key)) {
        if (typeof otherObj[key] === "object" && otherObj[key] !== null && typeof objStart[key] === "object" && objStart[key] !== null) {
          result[key] = this.clearOldValues(objStart[key], otherObj[key]);
        } else {
          result[key] = otherObj[key];
        }
      }
    }
    // Optionally, log old keys that are being removed
    for (const key in otherObj) {
      if (!Object.prototype.hasOwnProperty.call(objStart, key)) {
        console.log(`Old key : ${key}`);
      }
    }
    return result;
  }
}

const argv = yargs(hideBin(process.argv))
  .scriptName("update-translations")
  .usage("Usage: $0 --source <source> --targets <target1> <target2> ...")
  .describe("This script updates translation files with new keys from a source file.")
  .option("source", {
    type: "string",
    description: "Source translation file",
    demandOption: true,
  })
  .option("targets", {
    type: "array",
    description: "Target translation files to update",
    demandOption: true,
  })
  .help()
  .argv;

(async () => {
  try {
    await new UpdateTranslations(argv).handle();
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
})();
