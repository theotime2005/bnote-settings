import { describe, it, expect } from "vitest";
import SettingComponent from "@/components/SettingComponent.vue";
import { render } from "@/__tests__/helpers.js";

describe("SettingComponent.vue", () => {

  // Test pour l'input checkbox
  it("devrait rendre une checkbox et émettre l'événement 'setting-change' lors d'une modification", async () => {
    const wrapper = render(SettingComponent, {}, {
      name: "Test Checkbox",
      label_id: "category.checkbox",
      setting: { type: "checkbox" },
      setting_value: true,
    });

    // Vérifie que la checkbox est cochée initialement
    const checkbox = wrapper.find("input[type=\"checkbox\"]");
    expect(checkbox.element.checked).toBe(true);

    // Simule une modification de la checkbox
    await checkbox.setChecked(false);

    // Vérifie que la valeur de settingValue a été mise à jour
    expect(wrapper.vm.settingValue).toBe(false);

    // Vérifie que l'événement 'setting-change' a été émis
    expect(wrapper.emitted("setting-change")[0]).toEqual([false]);
  });

  // Test pour le dropdown (menu)
  describe("# Test du dropdown", () => {
    it("devrait rendre un menu déroulant et émettre l'événement 'setting-change' lors d'une modification avec traduction", async () => {
      const wrapper = render(SettingComponent, {}, {
        name: "Test Menu",
        label_id: "category.dropdownmenu",
        setting: { type: "menu", values: ["option1", "option2", "option3"] },
        setting_value: "option1",
      });
      // Vérifie que la valeur initiale est 'option1'
      const select = wrapper.find("select");
      expect(select.element.value).toBe("option1");
      // Vérifie que le texte est bien passé par la traduction
      expect(select.element[0].textContent).toBe("settings.values.option1");

      // Simule une sélection d'option
      await select.setValue("option2");

      // Vérifie que la valeur de settingValue a été mise à jour
      expect(wrapper.vm.settingValue).toBe("option2");

      // Vérifie que l'événement 'setting-change' a été émis
      expect(wrapper.emitted("setting-change")[0]).toEqual(["option2"]);
    });

    it("devrait rendre un menu déroulant et émettre l'événement 'setting-change' lors d'une modification sans traduction", async () => {
      const wrapper = render(SettingComponent, {}, {
        name: "Test Menu",
        label_id: "category.dropdownmenu",
        setting: { type: "menu", values: ["option1", "option2", "option3"], isTranslate: true },
        setting_value: "option1",
      });
      // Vérifie que la valeur initiale est 'option1'
      const select = wrapper.find("select");
      expect(select.element.value).toBe("option1");
      // Vérifie que le texte est bien passé par la traduction
      expect(select.element[0].textContent).toBe("option1");

      // Simule une sélection d'option
      await select.setValue("option2");

      // Vérifie que la valeur de settingValue a été mise à jour
      expect(wrapper.vm.settingValue).toBe("option2");

      // Vérifie que l'événement 'setting-change' a été émis
      expect(wrapper.emitted("setting-change")[0]).toEqual(["option2"]);
    });
  });

  // Test pour l'input number
  it("devrait rendre un champ number et émettre l'événement 'setting-change' lors d'une modification", async () => {
    const wrapper = render(SettingComponent, {}, {
      name: "Test Number",
      label_id: "category.editbox",
      setting: { type: "number", min: 1, max: 10 },
      setting_value: 5,
    });

    // Vérifie que la valeur initiale est '5'
    const numberInput = wrapper.find("input[type=\"number\"]");
    expect(numberInput.element.value).toBe("5");

    // Simule une modification de l'input number
    await numberInput.setValue(7);

    // Vérifie que la valeur de settingValue a été mise à jour
    expect(wrapper.vm.settingValue).toBe(7);

    // Vérifie que l'événement 'setting-change' a été émis
    expect(wrapper.emitted("setting-change")[0]).toEqual([7]);
  });

  it("Doit afficher le for du label passé en prop", () => {
    const wrapper=render(SettingComponent, {}, {
      name: "Test Checkbox",
      label_id: "category.checkbox",
      setting: { type: "checkbox" },
      setting_value: true,
    });
    expect(wrapper.find("label").attributes("for")).toBe("category.checkbox");
  });
});
