import { render } from "@/__tests__/components/helpers.js";
import SettingComponent from "@/components/SettingComponent.vue";

describe("SettingComponent.vue", () => {

  // Test for the checkbox input
  it("should render a checkbox and emit the 'setting-change' event upon modification", async () => {
    const wrapper = render(SettingComponent, {}, {
      name: "Test Checkbox",
      label_id: "category.checkbox",
      setting: { type: "checkbox" },
      setting_value: true,
    });

    // Verify that the checkbox is initially checked
    const checkbox = wrapper.find("input[type=\"checkbox\"]");
    expect(checkbox.element.checked).toBe(true);

    // Simulate a checkbox modification
    await checkbox.setChecked(false);

    // Verify that the settingValue has been updated
    expect(wrapper.vm.settingValue).toBe(false);

    // Verify that the 'setting-change' event has been emitted
    expect(wrapper.emitted("setting-change")[0]).toEqual([false]);
  });

  // Test for the dropdown (menu)
  describe("# Dropdown Test", () => {
    it("should render a dropdown menu and emit the 'setting-change' event upon modification with translation", async () => {
      const wrapper = render(SettingComponent, {}, {
        name: "Test Menu",
        label_id: "category.dropdownmenu",
        setting: { type: "menu", values: ["option1", "option2", "option3"] },
        setting_value: "option1",
      });

      // Verify that the initial value is "option1"
      const select = wrapper.find("select");
      expect(select.element.value).toBe("option1");

      // Verify that the text has been translated
      expect(select.element[0].textContent).toBe("settings.values.option1");

      // Simulate an option selection
      await select.setValue("option2");

      // Verify that the settingValue has been updated
      expect(wrapper.vm.settingValue).toBe("option2");

      // Verify that the 'setting-change' event has been emitted
      expect(wrapper.emitted("setting-change")[0]).toEqual(["option2"]);
    });

    it("should render a dropdown menu and emit the 'setting-change' event upon modification without translation", async () => {
      const wrapper = render(SettingComponent, {}, {
        name: "Test Menu",
        label_id: "category.dropdownmenu",
        setting: { type: "menu", values: ["option1", "option2", "option3"], isTranslate: true },
        setting_value: "option1",
      });

      // Verify that the initial value is "option1"
      const select = wrapper.find("select");
      expect(select.element.value).toBe("option1");

      // Verify that the text has not been translated
      expect(select.element[0].textContent).toBe("option1");

      // Simulate an option selection
      await select.setValue("option2");

      // Verify that the settingValue has been updated
      expect(wrapper.vm.settingValue).toBe("option2");

      // Verify that the 'setting-change' event has been emitted
      expect(wrapper.emitted("setting-change")[0]).toEqual(["option2"]);
    });
  });

  // Test for the number input
  it("should render a number input and emit the 'setting-change' event upon modification", async () => {
    const wrapper = render(SettingComponent, {}, {
      name: "Test Number",
      label_id: "category.editbox",
      setting: { type: "number", min: 1, max: 10 },
      setting_value: 5,
    });

    // Verify that the initial value is "5"
    const numberInput = wrapper.find("input[type=\"number\"]");
    expect(numberInput.element.value).toBe("5");

    // Simulate a number input modification
    await numberInput.setValue(7);

    // Verify that the settingValue has been updated
    expect(wrapper.vm.settingValue).toBe(7);

    // Verify that the 'setting-change' event has been emitted
    expect(wrapper.emitted("setting-change")[0]).toEqual([7]);
  });

  it("should display the 'for' attribute of the label passed in props", () => {
    const wrapper = render(SettingComponent, {}, {
      name: "Test Checkbox",
      label_id: "category.checkbox",
      setting: { type: "checkbox" },
      setting_value: true,
    });
    expect(wrapper.find("label").attributes("for")).toBe("category.checkbox");
  });
});
