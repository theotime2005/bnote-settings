import LanguageComponent from "@/components/LanguageComponent.vue";
import { render } from "@/tests/components/helpers.js";

describe("LanguageComponent", () => {
  it("should set current language on mount", () => {
    // given
    const wrapper = render(LanguageComponent);

    // when
    const select = wrapper.find("select");

    // then
    expect(select.element.value).toBe("fr");
  });

  it("should change language when new language is selected", async () => {
    // given
    const wrapper = render(LanguageComponent);
    const select = wrapper.find("select");

    // when
    await select.setValue("en");

    // then
    expect(document.documentElement.lang).toBe("en");
  });

  it("should display language options correctly", () => {
    // given
    const wrapper = render(LanguageComponent);

    // when
    const options = wrapper.findAll("option");

    // then
    expect(options.length).toBe(4); // fr, en, it, es
    const optionTexts = options.map(option => option.text());
    expect(optionTexts).toContain("languages.en");
    expect(optionTexts).toContain("languages.fr");
  });
});
