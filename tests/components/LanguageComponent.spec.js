import { mount } from "@vue/test-utils";

import LanguageComponent from "@/components/LanguageComponent.vue";
import i18n from "@/i18n.js";

describe("LanguageComponent", () => {
  let wrapper;

  beforeEach(function() {
    wrapper = mount(LanguageComponent, {
      global: {
        plugins: [i18n],
      },
    });
  });
  it("should set current language on mount", () => {
    // when
    const select = wrapper.find("select");

    // then
    expect(select.element.value).toBe("fr");
  });

  it("should change language when new language is selected", async () => {
    // given
    const select = wrapper.find("select");

    // when
    await select.setValue("en");

    // then
    expect(document.documentElement.lang).toBe("en");
  });

  it("should display language options correctly", () => {
    // when
    const options = wrapper.findAll("option");

    // then
    expect(options.length).toBe(i18n.global.availableLocales.length);
  });
});
