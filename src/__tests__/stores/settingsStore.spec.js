import { createPinia, setActivePinia } from "pinia";

import { useSettingsStore } from "@/stores/settingsStore";

describe("Settings Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("loads settings correctly", () => {
    // given
    const store = useSettingsStore();
    const settingsObject = { general: { theme: "dark" } };

    // when
    store.loadSettings(settingsObject);

    // then
    expect(store.settings).toEqual(settingsObject);
  });

  it("updates a setting correctly", () => {
    // given
    const store = useSettingsStore();
    store.loadSettings({ general: { theme: "dark" } });

    // when
    store.updateSetting("general", "theme", "light");

    // then
    expect(store.settings.general.theme).toBe("light");
  });

  it("gets a setting correctly", () => {
    // given
    const store = useSettingsStore();
    store.loadSettings({ general: { theme: "dark" } });

    // when
    const theme = store.getSetting("general", "theme");

    // then
    expect(theme).toBe("dark");
  });

  it("gets all settings correctly", () => {
    // given
    const store = useSettingsStore();
    const settingsObject = { general: { theme: "dark" } };
    store.loadSettings(settingsObject);

    // when
    const allSettings = store.getAllSettings;

    // then
    expect(allSettings).toEqual(settingsObject);
  });

  it("handles updating a non-existent section gracefully", () => {
    // given
    const settingsObject = { general: { theme: "dark" } };
    const store = useSettingsStore();
    store.loadSettings(settingsObject);

    // when
    store.updateSetting("nonExistentSection", "key", "value");

    // then
    expect(store.settings.nonExistentSection.key).toBe("value");
  });

  it("handles getting a setting from a non-existent section gracefully", () => {
    // given
    const settingsObject = { general: { theme: "dark" } };
    const store = useSettingsStore();
    store.loadSettings(settingsObject);

    // when
    const value = store.getSetting("nonExistentSection", "key");

    // then
    expect(value).toBe(null);
  });
});
