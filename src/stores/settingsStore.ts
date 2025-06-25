import { defineStore } from "pinia";
import type { Settings } from '@/types';

interface SettingsState {
  settings: Settings;
  fileName: string;
}

export const useSettingsStore = defineStore("settingsStore", {
  state: (): SettingsState => ({
    settings: {},
    fileName: "",
  }),
  actions: {
    loadSettings(settingsObject: Settings, fileName: string): void {
      this.settings = settingsObject;
      this.fileName = fileName;
    },
    updateSetting(section: string, key: string, value: string | number | boolean): void {
      if (!this.settings[section]) {
        this.settings[section] = {};
      }
      this.settings[section][key] = {
        ...this.settings[section][key],
        default: value
      };
    },
    removeAll(): void {
      this.settings = {};
      this.fileName = "";
    },
  },
  getters: {
    getSetting: (state) => (section: string, key: string): string | number | boolean | null => {
      if (state.settings[section] === undefined) {
        return null;
      } else if (state.settings[section][key] === undefined) {
        return null;
      }
      return state.settings[section][key].default;
    },
    getAllSettings: (state): Settings | null => {
      if (Object.keys(state.settings).length === 0) {
        return null;
      }
      return state.settings;
    },
    getFileName(): string | null {
      return this.fileName || null;
    },
  },
});