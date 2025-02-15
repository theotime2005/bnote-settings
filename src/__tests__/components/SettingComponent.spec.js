import { createTestingPinia } from "@pinia/testing";

import { render } from "@/__tests__/components/helpers.js";
import SettingComponent from "@/components/SettingComponent.vue";
import { useSettingsStore } from "@/stores/settingsStore.js";

describe("SettingComponent.vue", () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  const settingsStore = useSettingsStore();

  beforeEach(() => {
    settingsStore.getSetting = vi.fn().mockImplementation(() => {
      return true;
    });
    settingsStore.updateSetting = vi.fn();
  });

  it("renders checkbox and updates store on change", async () => {
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "checkbox",
      setting: { type: "checkbox", default: false },
    });

    const checkbox = wrapper.find("input[type='checkbox']");
    expect(checkbox.exists()).toBe(true);
    expect(checkbox.element.checked).toBe(true); // Valeur retournée par getSetting

    await checkbox.setChecked(false);
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "checkbox", false);
  });

  it("renders dropdown and updates store on selection", async () => {
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "dropdown",
      setting: { type: "menu", values: ["option1", "option2"], default: "option1" },
    });

    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    await select.setValue("option2");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "dropdown", "option2");
  });

  it("renders number input and updates store on change", async () => {
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "number",
      setting: { type: "number", min: 1, max: 10, default: 5 },
    });

    const numberInput = wrapper.find("input[type='number']");
    expect(numberInput.exists()).toBe(true);
    await numberInput.setValue(7);
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "number", 7);
  });

  it("renders text input and updates store on change", async () => {
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "text",
      setting: { type: "text", default: "Hello" },
    });

    const textInput = wrapper.find("input[type='text']");
    expect(textInput.exists()).toBe(true);
    await textInput.setValue("New Value");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "text", "New Value");
  });

  it("renders button and sets default value", async () => {
    const wrapper = render(SettingComponent, { global: { plugins: [pinia] } }, {
      settingSection: "category",
      settingKey: "checkbox",
      setting: { type: "checkbox", default: false },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);

    await button.trigger("click");
    expect(settingsStore.updateSetting).toHaveBeenCalledWith("category", "checkbox", false);
  });
});
