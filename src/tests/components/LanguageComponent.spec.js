import LanguageComponent from "@/components/LanguageComponent.vue";
import { render } from "@/tests/components/helpers.js";

describe("LanguageComponent", () => {
  it("devrait définir la langue actuelle au montage", () => {
    const wrapper = render(LanguageComponent);

    // Instead of checking internal state, check that the select has the default value
    const select = wrapper.find("select");
    expect(select.element.value).toBe("fr");
  });

  it("devrait changer la langue quand une nouvelle langue est sélectionnée", async () => {
    const wrapper = render(LanguageComponent);

    const select = wrapper.find("select");
    await select.setValue("en");

    // The change event should be triggered - just check that document lang was set
    expect(document.documentElement.lang).toBe("en");
  });

  it("devrait afficher les options de langues correctement", () => {
    const wrapper = render(LanguageComponent);

    const options = wrapper.findAll("option");
    expect(options.length).toBe(4); // fr, en, it, es

    // Check that options contain the expected languages (using mocked $t which returns keys)
    const optionTexts = options.map(option => option.text());
    expect(optionTexts).toContain("languages.en");
    expect(optionTexts).toContain("languages.fr");
  });
});
