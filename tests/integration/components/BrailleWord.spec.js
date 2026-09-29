import { mount } from "@vue/test-utils";

import BrailleWord from "@/components/BrailleWord.vue";

function getRaisedDots(cell) {
  return cell.findAll(".braille-dot").map((dot) => dot.classes().includes("braille-dot--raised"));
}

describe("BrailleWord.vue", () => {
  it("renders one cell of six dots per letter", () => {
    const wrapper = mount(BrailleWord, {
      props: { word: "bnote" },
    });

    const cells = wrapper.findAll(".braille-cell");
    expect(cells).toHaveLength(5);
    cells.forEach((cell) => {
      expect(cell.findAll(".braille-dot")).toHaveLength(6);
    });
  });

  it("raises the dots matching the braille alphabet", () => {
    const wrapper = mount(BrailleWord, {
      props: { word: "bn" },
    });

    const [bCell, nCell] = wrapper.findAll(".braille-cell");
    expect(getRaisedDots(bCell)).toEqual([true, false, true, false, false, false]);
    expect(getRaisedDots(nCell)).toEqual([true, true, false, true, true, false]);
  });

  it("ignores the case of the word", () => {
    const wrapper = mount(BrailleWord, {
      props: { word: "B" },
    });

    expect(getRaisedDots(wrapper.find(".braille-cell"))).toEqual([true, false, true, false, false, false]);
  });

  it("renders an empty cell for unknown characters", () => {
    const wrapper = mount(BrailleWord, {
      props: { word: "." },
    });

    expect(wrapper.findAll(".braille-dot--raised")).toHaveLength(0);
  });

  it("is hidden from assistive technologies", () => {
    const wrapper = mount(BrailleWord, {
      props: { word: "a" },
    });

    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("applies size and animation modifiers", () => {
    const wrapper = mount(BrailleWord, {
      props: { word: "a", size: "large", animated: true },
    });

    expect(wrapper.classes()).toContain("braille-word--large");
    expect(wrapper.classes()).toContain("braille-word--animated");
  });
});
