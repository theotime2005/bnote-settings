import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import SettingComponent from "@/components/SettingComponent.vue";
import { useSettingsStore } from "@/stores/settingsStore";
import { render } from "@/tests/components/helpers";
import type { Setting } from "@/types";

describe("SettingComponent.vue", () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  let settingsStore: ReturnType<typeof useSettingsStore>;

  beforeEach(() => {
    settingsStore = useSettingsStore();
    settingsStore.getSetting = vi.fn().mockImplementation(() => {
      return true;
    });
    settingsStore.updateSetting = vi.fn();
  });

  it("renders checkbox and updates store on change", async () => {
    const setting: Setting = { type: "checkbox", default: false };
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "checkbox",
      setting,
    });

    const checkbox = wrapper.find("input[type='checkbox']");
    expect(checkbox.exists()).toBe(true);
    expect((checkbox.element as HTMLInputElement).checked).toBe(true); // Valeur retournée par getSetting

    await checkbox.setChecked(false);
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "checkbox", false);
  });

  it("renders dropdown and updates store on selection", async () => {
    const setting: Setting = { type: "menu", values: ["option1", "option2"], default: "option1" };
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "dropdown",
      setting,
    });

    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    await select.setValue("option2");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "dropdown", "option2");
  });

  it("renders range input and updates store on change", async () => {
    const setting: Setting = { type: "number", min: 1, max: 10, default: 5 };
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "number",
      setting,
    });

    const numberInput = wrapper.find("input[type='range']");
    expect(numberInput.exists()).toBe(true);
    await numberInput.setValue(7);
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "number", 7);
  });

  it("renders text input and updates store on change", async () => {
    const setting: Setting = { type: "text", default: "Hello" };
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "text",
      setting,
    });

    const textInput = wrapper.find("input[type='text']");
    expect(textInput.exists()).toBe(true);
    await textInput.setValue("New Value");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "text", "New Value");
  });

  it("renders button and sets default value", async () => {
    const setting: Setting = { type: "checkbox", default: false };
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "checkbox",
      setting,
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);

    await button.trigger("click");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "checkbox", false);
  });
});