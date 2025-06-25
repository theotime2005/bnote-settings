import fs from "fs/promises";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import type { Settings, Setting } from '@/types';

interface AddNewSettingOptions {
  file: string;
  section: string;
  key: string;
  type: 'menu' | 'text' | 'checkbox' | 'number';
  values?: string[];
  defaultValue: string | number | boolean;
  min?: number;
  max?: number;
  dryRun: boolean;
  force: boolean;
}

export class AddNewSetting {
  private file: string;
  private section: string;
  private key: string;
  private type: 'menu' | 'text' | 'checkbox' | 'number';
  private values?: string[];
  private default: string | number | boolean;
  private min?: number;
  private max?: number;
  private dryRun: boolean;
  private force: boolean;
  private settings: Settings = {};

  constructor(options: AddNewSettingOptions) {
    const { file, section, key, type, values, defaultValue, min, max, dryRun, force } = options;
    this.file = file;
    this.section = section;
    this.key = key;
    this.type = type;
    this.values = values;
    this.default = defaultValue;
    this.min = min;
    this.max = max;
    this.dryRun = dryRun;
    this.force = force;
  }

  async readAndParseFile(filePath: string = this.file): Promise<Settings> {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as Settings;
    } catch (error) {
      console.error(`Error reading or parsing file: ${error}`);
      throw error;
    }
  }

  async writeFile(filePath: string = this.file): Promise<void> {
    try {
      const data = JSON.stringify(this.settings, null, 2);
      await fs.writeFile(filePath, data, "utf-8");
      console.log(`File written successfully to ${filePath}`);
    } catch (error) {
      console.error(`Error writing file: ${error}`);
      throw error;
    }
  }

  async handle(): Promise<void> {
    try {
      this.settings = await this.readAndParseFile();
      const section = this.settings[this.section] || {};
      const setting = section[this.key];

      if (setting && !this.force) {
        console.log(`Setting ${this.key} already exists in section ${this.section}. Use --force to overwrite.`);
        return;
      }

      const newSetting: Setting = {
        type: this.type,
        default: this.default,
        ...(this.type === "menu" && { values: this.values }),
        ...(this.type === "number" && { min: this.min, max: this.max }),
      };

      section[this.key] = newSetting;
      this.settings[this.section] = section;

      if (!this.dryRun) {
        await this.writeFile();
        console.log(`The setting ${this.key} has been added to the ${this.section} with these params: ${JSON.stringify(section[this.key], null, 2)}`);
      } else {
        console.log("Dry run mode. No changes made., but the following changes would be made:");
        console.log(`the setting ${this.key} will be added to the ${this.section} with this params: ${JSON.stringify(section[this.key], null, 2)}`);
      }
    } catch (error) {
      console.error(`Error handling settings: ${error}`);
    }
  }
}

const argv = yargs(hideBin(process.argv))
  .option("file", {
    type: "string",
    description: "The path to the settings file",
    demandOption: true,
  })
  .option("section", {
    alias: "s",
    type: "string",
    description: "The section to add the setting to",
    demandOption: true,
  })
  .option("key", {
    alias: "k",
    type: "string",
    description: "The key of the setting",
    demandOption: true,
  })
  .option("type", {
    alias: "t",
    type: "string",
    description: "The type of the setting",
    choices: ["menu", "text", "checkbox", "number"] as const,
    demandOption: true,
  })
  .option("values", {
    alias: "v",
    type: "array",
    description: "The values for the setting (for menu type)",
  })
  .option("defaultValue", {
    alias: "d",
    type: "string",
    description: "The default value for the setting",
    demandOption: true,
  })
  .option("min", {
    alias: "m",
    type: "number",
    description: "The minimum value for the setting (for number type)",
  })
  .option("max", {
    alias: "x",
    type: "number",
    description: "The maximum value for the setting (for number type)",
  })
  .option("dryRun", {
    type: "boolean",
    description: "Run the script without making any changes",
    default: false,
  })
  .option("force", {
    type: "boolean",
    description: "Force the script to run even if it might overwrite existing settings",
    default: false,
  })
  .check((argv) => {
    if (argv.type === "menu" && !argv.values) {
      throw new Error("Values are required when type is 'menu'");
    }
    if (argv.type === "number") {
      if (typeof argv.min !== "number") {
        throw new Error("Min is required when type is 'number'");
      }
      if (typeof argv.max !== "number") {
        throw new Error("Max is required when type is 'number'");
      }
    }
    return true;
  })
  .help()
  .parseSync() as AddNewSettingOptions;

new AddNewSetting(argv).handle();