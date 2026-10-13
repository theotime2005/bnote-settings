import { mount } from "@vue/test-utils";

import FooterComponent from "@/components/FooterComponent.vue";
import LanguageComponent from "@/components/LanguageComponent.vue";
import i18n from "@/tests/helpers/i18n.js";

const { t } = i18n.global;
describe("FooterComponent", () => {
  let wrapper;

  beforeEach(function() {
    wrapper = mount(FooterComponent, {
      global: {
        plugins: [i18n],
        components: {
          LanguageComponent,
        },
      },
    });
  });
  it("renders footer messages correctly", () => {
    expect(wrapper.text()).toContain(t("footer.message1"));
    expect(wrapper.text()).toContain(t("footer.message2"));
  });

  it("renders the version info", () => {
    expect(wrapper.text()).toContain(t("footer.version"));
  });

  it("renders the GitHub link correctly", () => {
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("https://github.com/theotime2005/bnote-settings");
    expect(link.text()).toBe(t("footer.code"));
  });

  it("contains LanguageComponent", () => {
    expect(wrapper.findComponent({ name: "LanguageComponent" }).exists()).toBe(true);
  });

  it("reserves the bold width of every wordmark letter", () => {
    const glyphs = wrapper.findAll(".wordmark-glyph");
    expect(glyphs.map((glyph) => glyph.attributes("data-glyph")).join("")).toBe("B.note");
    glyphs.forEach((glyph) => {
      expect(glyph.find(".wordmark-face").text()).toBe(glyph.attributes("data-glyph"));
    });
  });

  it("does not duplicate the site navigation", () => {
    const hrefs = wrapper.findAll("a").map((link) => link.attributes("href"));
    expect(hrefs).toEqual(["https://github.com/theotime2005/bnote-settings"]);
  });
});
