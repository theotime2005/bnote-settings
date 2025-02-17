import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    settings: {},
    fileName: "",
  }),
  actions: {
    loadSettings (settingsObject, fileName) {
      this.settings = settingsObject;
      this.fileName = fileName;
    },
    updateSetting(section, key, value) {
      if (!this.settings[section]) {
        this.settings[section] = {};
      }
      this.settings[section][key] = value;
    },
    removeAll() {
      this.settings = {};
      this.fileName = "";
    },
  },
  getters: {
    getSetting: (state) => (section, key) => {
      if (state.settings[section] === undefined) {
        return null;
      } else if (state.settings[section][key] === undefined) {
        return null;
      }
      return state.settings[section][key];
    },
    getAllSettings: (state) => {
      if (Object.keys(state.settings).length === 0) {
        return null;
      }
      return state.settings;
    },
    getFileName() {
      return this.fileName || null;
    },
  },
});
