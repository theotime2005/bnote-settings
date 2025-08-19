import LanguageComponent from "@/components/LanguageComponent.vue";
import { render } from "@/tests/components/helpers.js";

describe("LanguageComponent", () => {
  it("should defined language when mounted", () => {
    // when
    const wrapper = render(LanguageComponent);
    // then
    expect(wrapper.vm.current_language).toBe(wrapper.vm.$i18n.locale);
  });

  it("should change language when another language is selected", async () => {
    // given
    const wrapper = render(LanguageComponent);

    // when
    const select = wrapper.find("select");
    await select.setValue("en");

    // then
    expect(wrapper.vm.current_language).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("should display correctly language options", () => {
    // wiven
    const wrapper = render(LanguageComponent);

    // then
    const options = wrapper.findAll("option");
    expect(options.length).toBe(4); // fr, en, it, es from i18n.js

    // availableLocales returns languages in alphabetical order
    expect(options[0].attributes("value")).toBe("en");
    expect(options[0].text()).toBeTruthy(); // Language name in current locale

    expect(options[1].attributes("value")).toBe("es");
    expect(options[1].text()).toBeTruthy();

    expect(options[2].attributes("value")).toBe("fr");
    expect(options[2].text()).toBeTruthy();

    expect(options[3].attributes("value")).toBe("it");
    expect(options[3].text()).toBeTruthy();
  });
});
