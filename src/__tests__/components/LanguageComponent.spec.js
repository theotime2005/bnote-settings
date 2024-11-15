import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import LanguageComponent from "@/components/LanguageComponent.vue";

describe("LanguageComponent", () => {
  it("devrait définir la langue actuelle au montage", () => {
    const $i18n = { locale: "en", availableLocales: ["en", "fr"] };
    const wrapper = mount(LanguageComponent, {
      global: {
        mocks: {
          $i18n,
          $t: (msg) => msg,
          $route: {
            params: { lang: "en" },
            path: "/en/path",
          },
        },
      },
    });

    expect(wrapper.vm.current_language).toBe("en");
  });

  it("devrait changer la langue quand une nouvelle langue est sélectionnée", async () => {
    const $i18n = { locale: "en", availableLocales: ["en", "fr"] };
    const wrapper = mount(LanguageComponent, {
      global: {
        mocks: {
          $i18n,
          $t: (msg) => msg,
          $route: {
            params: { lang: "en" },
            path: "/en/path",
          },
          $router: {
            push: (path) => path,
          },
        },
      },
    });

    const select = wrapper.find("select");
    await select.setValue("fr");

    expect(wrapper.vm.current_language).toBe("fr");
    expect($i18n.locale).toBe("fr");
    expect(document.documentElement.lang).toBe("fr");
  });

  it("devrait afficher les options de langues correctement", () => {
    const $i18n = { locale: "en", availableLocales: ["en", "fr"] };
    const wrapper = mount(LanguageComponent, {
      global: {
        mocks: { $i18n, $t: (msg) => msg },
      },
    });

    const options = wrapper.findAll("option");
    expect(options.length).toBe(2);
    expect(options[0].text()).toBe("languages.en"); // Vous pouvez remplacer par la traduction correspondante
    expect(options[1].text()).toBe("languages.fr");
  });
});
