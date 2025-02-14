import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    settings: {},
  }),
  actions: {
    loadSettings (settingsObject) {
      this.settings = settingsObject;
    },
    updateSetting(section, key, value) {
      if (!this.settings[section]) {
        this.settings[section] = {};
      }
      this.settings[section][key] = value;
    },
    removeAll() {
      this.settings = {};
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
      return state.settings;
    },
  },
});
