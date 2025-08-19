import FooterComponent from "@/components/FooterComponent.vue";
import { render, t } from "@/tests/components/helpers.js";

describe("FooterComponent", () => {
  it("renders footer messages correctly", () => {
    const wrapper = render(FooterComponent, {
    });
    expect(wrapper.text()).toContain(t("footer.message1"));
    expect(wrapper.text()).toContain(t("footer.message2"));
  });

  it("renders the version info", () => {
    const wrapper = render(FooterComponent, {
    });
    expect(wrapper.text()).toContain(t("footer.version"));
  });

  it("renders the GitHub link correctly", () => {
    const wrapper = render(FooterComponent, {
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("https://github.com/theotime2005/bnote-settings");
    expect(link.text()).toBe("footer.code");
  });

  it("contains LanguageComponent", () => {
    const wrapper = render(FooterComponent, {
    });
    expect(wrapper.findComponent({ name: "LanguageComponent" }).exists()).toBe(true);
  });
});
