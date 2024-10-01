import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import i18n from "@/i18n.js";
import FooterComponent from "@/components/FooterComponent.vue";
import packageInfo from "../../../package.json";

const t = i18n.global.t;
describe("FooterComponent", () => {
  it("renders footer messages correctly", () => {
    const wrapper = mount(FooterComponent, {
      global: {
        mocks: {
          $t: (msg) => t(msg),
          $i18n: i18n,
        },
      },
    });
    expect(wrapper.text()).toContain(t("footer.message1"));
    expect(wrapper.text()).toContain(t("footer.message2"));
  });

  it("renders the correct version from package.json", () => {
    const wrapper = mount(FooterComponent, {
      global: {
        mocks: {
          $t: (msg, option) => {
            if (msg==="footer.version") {
              return t("footer.version", { version: option });
            } else {
              return t(msg);
            }
          },
          $i18n: i18n,
        },
      },
    });
    expect(wrapper.text()).toContain(packageInfo.version);
  });

  it("renders the GitHub link correctly", () => {
    const wrapper = mount(FooterComponent, {
      global: {
        mocks: {
          $t: (msg) => msg,
          $i18n: i18n,
        },
      },
    });
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("https://github.com/theotime2005/bnote-settings");
    expect(link.text()).toBe("footer.code");
  });

  it("contains LanguageComponent", () => {
    const wrapper = mount(FooterComponent, {
      global: {
        mocks: {
          $t: (msg) => t(msg),
          $i18n: i18n,
        },
      },
    });
    expect(wrapper.findComponent({ name: "LanguageComponent" }).exists()).toBe(true);
  });
});
