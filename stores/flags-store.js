import { defineStore } from "pinia";

export const useFlags = defineStore("flags", {
  state: () => ({
    flags: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFlags() {
      if (this.flags !== null) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch("/api/flags");
        this.flags = response;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getFlag: (state) => (flagName) => {
      if (!state.flags) {
        return null;
      }
      if (state.flags[flagName]) {
        return state.flags[flagName].value;
      }
      return null;
    },
  },
});
