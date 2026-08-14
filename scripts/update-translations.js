/**
 * This script is used to update translation files with new keys from a source file.
 */

import { useLogger } from "@nuxt/kit";
import { translate } from "@vitalets/google-translate-api";
import fs from "fs/promises";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const LOGGER = useLogger("update-translation");
export class UpdateTranslations {
  constructor(options = {}, logger = LOGGER) {
    const { source = "", targets = [] } = options;
    this.logger = logger;
    this.source = source;
    this.targets = targets;
    this.sourceData = {};
    this.updateData = {};
  }

  async handle() {
    this.sourceData = await this.loadFile(this.source);
    for (const file of this.targets) {
      this.logger.info("Reading file :", file);
      this.updateData = await this.loadFile(file);
      this.logger.info("Translating file:", file);
      this.updateData = await this.checkAndUpdate(
        this.sourceData,
        this.updateData,
        this.#_getLanguageFromFileName(file),
      );
      this.logger.info("Clearing old values in file:", file);
      this.updateData = this.clearOldValues(this.sourceData, this.updateData);
      this.logger.info("Writing file:", file);
      await this.writeFile(file, this.updateData);
    }
    this.logger.info("Finished writing files");
  }

  async loadFile(file) {
    try {
      const data = await fs.readFile(file, "utf8");
      return JSON.parse(data);
    } catch (e) {
      this.logger.error(`Error when reading ${file}`);
      this.logger.error(e);
      return {};
    }
  }

  async writeFile(file, data) {
    try {
      await fs.writeFile(file, JSON.stringify(data, null, 4), "utf8");
    } catch (e) {
      this.logger.error(`Error when writing ${file}`);
      this.logger.error(e);
    }
  }

  async _getTranslation(text, language) {
    try {
      const result = await translate(text, { to: language });
      return result.text;
    } catch (e) {
      this.logger.error(`Error during translation of "${text}" to ${language}`);
      this.logger.error(e);
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
          this.logger.info(`New key found : ${key}`);
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
        this.logger.warn(`Old key : ${key}`);
      }
    }
    return result;
  }

  #_getLanguageFromFileName(fileName) {
    return fileName.split("/").pop().split(".")[0];
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
    this.logger.error("An error occurred:", error);
    process.exit(1);
  }
})();
