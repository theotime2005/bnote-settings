import { createPinia, setActivePinia } from "pinia";

import { useSettingsStore } from "~/stores/settingsStore.js";

describe("Settings Store", () => {
  const fileName = "settings";
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("loads settings correctly", () => {
    // given
    const store = useSettingsStore();
    const settingsObject = { general: { theme: "dark" } };

    // when
    store.loadSettings(settingsObject, fileName);

    // then
    expect(store.settings).toEqual(settingsObject);
    expect(store.fileName).toBe(fileName);
  });

  it("updates a setting correctly", () => {
    // given
    const store = useSettingsStore();
    store.loadSettings({ general: { theme: "dark" } }, fileName);

    // when
    store.updateSetting("general", "theme", "light");

    // then
    expect(store.settings.general.theme).toBe("light");
  });

  it("gets a setting correctly", () => {
    // given
    const store = useSettingsStore();
    store.loadSettings({ general: { theme: "dark" } }, fileName);

    // when
    const theme = store.getSetting("general", "theme");

    // then
    expect(theme).toBe("dark");
  });

  it("gets all settings correctly", () => {
    // given
    const store = useSettingsStore();
    const settingsObject = { general: { theme: "dark" } };
    store.loadSettings(settingsObject, fileName);

    // when
    const allSettings = store.getAllSettings;

    // then
    expect(allSettings).toEqual(settingsObject);
  });

  it("handles updating a non-existent section gracefully", () => {
    // given
    const settingsObject = { general: { theme: "dark" } };
    const store = useSettingsStore();
    store.loadSettings(settingsObject, fileName);

    // when
    store.updateSetting("nonExistentSection", "key", "value");

    // then
    expect(store.settings.nonExistentSection.key).toBe("value");
  });

  it("handles getting a setting from a non-existent section gracefully", () => {
    // given
    const settingsObject = { general: { theme: "dark" } };
    const store = useSettingsStore();
    store.loadSettings(settingsObject, fileName);

    // when
    const value = store.getSetting("nonExistentSection", "key");

    // then
    expect(value).toBe(null);
  });
});
