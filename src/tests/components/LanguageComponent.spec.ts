import { describe, it, expect } from "vitest";
import LanguageComponent from "@/components/LanguageComponent.vue";
import { render } from "@/tests/components/helpers";

interface MockI18n {
  locale: string;
  availableLocales: string[];
}

describe("LanguageComponent", () => {
  it("devrait définir la langue actuelle au montage", () => {
    const $i18n: MockI18n = { locale: "en", availableLocales: ["en", "fr"] };
    const wrapper = render(LanguageComponent, {
      mocks: {
        $i18n,
      },
    });
    expect(wrapper.vm.current_language).toBe($i18n.locale);
  });

  it("devrait changer la langue quand une nouvelle langue est sélectionnée", async () => {
    const $i18n: MockI18n = { locale: "en", availableLocales: ["en", "fr"] };
    const wrapper = render(LanguageComponent, {
      mocks: {
        $i18n,
      },
    });

    const select = wrapper.find("select");
    await select.setValue("fr");

    expect(wrapper.vm.current_language).toBe("fr");
    expect($i18n.locale).toBe("fr");
    expect(document.documentElement.lang).toBe("fr");
  });

  it("devrait afficher les options de langues correctement", () => {
    const $i18n: MockI18n = { locale: "en", availableLocales: ["en", "fr"] };
    const wrapper = render(LanguageComponent, {
      mocks: {
        $i18n,
      },
    });

    const options = wrapper.findAll("option");
    expect(options.length).toBe(2);
    expect(options[0].text()).toBe("languages.en");
    expect(options[1].text()).toBe("languages.fr");
  });
});