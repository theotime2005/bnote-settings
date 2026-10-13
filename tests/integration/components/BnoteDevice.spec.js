import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import BnoteDevice from "@/components/BnoteDevice.vue";

describe("Integration | Components | BnoteDevice", () => {
  let wrapper;

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = mount(BnoteDevice, { props: { words: ["open", "bnote"] }, attachTo: document.body });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.useRealTimers();
  });

  it("is hidden from assistive technologies", () => {
    // then
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("renders eight keys and a ten cell display", () => {
    // then
    expect(wrapper.findAll(".device-key").length).toBe(8);
    expect(wrapper.findAll(".braille-cell").length).toBe(10);
    expect(wrapper.vm.displayedText).toBe("open      ");
  });

  it("shows the next word when a key is pressed", async () => {
    // when
    await wrapper.findAll(".device-key")[2].trigger("pointerdown");

    // then
    expect(wrapper.vm.displayedText.trim()).toBe("bnote");
    expect(wrapper.findAll(".device-key")[2].classes()).toContain("device-key--pressed");
  });

  it("cycles through the words over time", async () => {
    // when
    vi.advanceTimersByTime(2400);
    await wrapper.vm.$nextTick();

    // then
    expect(wrapper.vm.wordIndex).toBe(1);
  });
});
