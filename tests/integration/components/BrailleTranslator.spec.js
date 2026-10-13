import { mount } from "@vue/test-utils";

import BrailleTranslator from "@/components/BrailleTranslator.vue";
import i18n from "@/tests/helpers/i18n.js";

const { t } = i18n.global;

describe("Integration | Components | BrailleTranslator", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BrailleTranslator, {
      global: {
        plugins: [i18n],
      },
    });
  });

  it("renders a labelled input", () => {
    // when
    const label = wrapper.find("label");
    const input = wrapper.find("input");

    // then
    expect(label.text()).toBe(t("home.translator.label"));
    expect(label.attributes("for")).toBe(input.attributes("id"));
    expect(input.attributes("aria-describedby")).toBe("translator-hint");
  });

  it("transcribes the placeholder while the input is empty", () => {
    // when
    const cells = wrapper.findAll(".translator-cell");

    // then
    expect(cells).toHaveLength(t("home.translator.placeholder").length);
  });

  it("transcribes the typed word", async () => {
    // when
    await wrapper.find("input").setValue("bnote");

    // then
    expect(wrapper.findAll(".translator-cell")).toHaveLength(5);
    expect(wrapper.find(".translator-unicode").text()).toContain("⠃⠝⠕⠞⠑");
    expect(wrapper.find(".translator-unicode").attributes("aria-live")).toBe("polite");
  });

  it("renders unknown characters as blank cells", async () => {
    // when
    await wrapper.find("input").setValue("a1");

    // then
    const letters = wrapper.findAll(".translator-letter").map((letter) => letter.text());
    expect(letters).toEqual(["a", "·"]);
  });
});
