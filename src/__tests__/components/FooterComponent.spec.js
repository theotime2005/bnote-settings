import i18n from "@/i18n.js";
import FooterComponent from "@/components/FooterComponent.vue";
import { render, t } from "./helpers.js";

describe("FooterComponent", () => {
  it("renders footer messages correctly", () => {
    const wrapper = render(FooterComponent, {
      mocks: {
        $i18n: i18n,
      },
    });
    expect(wrapper.text()).toContain(t("footer.message1"));
    expect(wrapper.text()).toContain(t("footer.message2"));
  });

  it("renders the version info", () => {
    const wrapper = render(FooterComponent, {
      mocks: {
        $i18n: i18n,
      },
    });
    expect(wrapper.text()).toContain(t("footer.version"));
  });

  it("renders the GitHub link correctly", () => {
    const wrapper = render(FooterComponent, {
      mocks: {
        $i18n: i18n,
      },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("https://github.com/theotime2005/bnote-settings");
    expect(link.text()).toBe("footer.code");
  });

  it("contains LanguageComponent", () => {
    const wrapper = render(FooterComponent, {
      mocks: {
        $i18n: i18n,
      },
    });
    expect(wrapper.findComponent({ name: "LanguageComponent" }).exists()).toBe(true);
  });
});
