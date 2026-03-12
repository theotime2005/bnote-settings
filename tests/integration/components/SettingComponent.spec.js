import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

import SettingComponent from "@/components/SettingComponent.vue";
import { useSettingsStore } from "@/stores/settingsStore.js";
import i18n from "@/tests/helpers/i18n.js";

describe("SettingComponent.vue", () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  const settingsStore = useSettingsStore();

  beforeEach(() => {
    settingsStore.updateSetting = vi.fn();
  });

  it("renders checkbox and updates store on change", async () => {
    settingsStore.getSetting = vi.fn().mockReturnValue(true);
    const wrapper = mount(SettingComponent, { global: { plugins: [pinia, i18n] }, props: {
      settingSection: "category",
      settingKey: "checkbox",
      setting: { type: "checkbox", default: false },
    } });

    const checkbox = wrapper.find(".setting-checkbox");
    expect(checkbox.exists()).toBe(true);
    expect(checkbox.element.checked).toBe(true);

    await checkbox.setChecked(false);
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "checkbox", false);
  });

  it("renders dropdown and updates store on selection", async () => {
    settingsStore.getSetting = vi.fn().mockReturnValue("option1");
    const wrapper = mount(SettingComponent, { global: { plugins: [pinia, i18n] }, props: {
      settingSection: "category",
      settingKey: "dropdown",
      setting: { type: "menu", values: ["option1", "option2"], default: "option1" },
    } });

    const select = wrapper.find(".setting-select");
    expect(select.exists()).toBe(true);
    expect(select.element.value).toBe("option1");
    await select.setValue("option2");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "dropdown", "option2");
    expect(select.element.value).toBe("option2");
  });

  it("renders range input and updates store on change", async () => {
    settingsStore.getSetting = vi.fn().mockReturnValue(6);
    const wrapper = mount(SettingComponent, { global: { plugins: [pinia, i18n] }, props: {
      settingSection: "category",
      settingKey: "number",
      setting: { type: "number", min: 1, max: 10, default: 6 },
    } });

    const numberInput = wrapper.find(".setting-range");
    expect(numberInput.exists()).toBe(true);
    expect(numberInput.element.value).toBe("6");
    await numberInput.setValue(7);
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "number", 7);
    expect(numberInput.element.value).toBe("7");
  });

  it("renders text input and updates store on change", async () => {
    settingsStore.getSetting = vi.fn().mockReturnValue("Hello");
    const wrapper = mount(SettingComponent, { global: { plugins: [pinia, i18n] }, props: {
      settingSection: "category",
      settingKey: "text",
      setting: { type: "text", default: "Hello" },
    } });

    const textInput = wrapper.find(".setting-input");
    expect(textInput.exists()).toBe(true);
    expect(textInput.element.value).toBe("Hello");
    await textInput.setValue("New Value");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "text", "New Value");
  });

  it("renders button and sets default value", async () => {
    settingsStore.getSetting = vi.fn().mockReturnValue(true);
    const wrapper = mount(SettingComponent, { global: { plugins: [pinia, i18n] }, props: {
      settingSection: "category",
      settingKey: "checkbox",
      setting: { type: "checkbox", default: false },
    } });

    const button = wrapper.find(".setting-default-button");
    expect(button.exists()).toBe(true);

    await button.trigger("click");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "checkbox", false);
  });
});
