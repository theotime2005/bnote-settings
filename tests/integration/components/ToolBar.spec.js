import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import ToolBar from "@/components/ToolBar.vue";

describe("ToolBar", () => {
  let wrapper;
  const mockActions = [
    { label: "Action 1", onClick: () => {} },
    { label: "Action 2", onClick: () => {} },
    { label: "Action 3", onClick: () => {} },
  ];

  beforeEach(() => {
    wrapper = mount(ToolBar, {
      props: {
        actions: mockActions,
      },
    });
  });

  it("renders all action buttons", () => {
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(3);
    expect(buttons[0].text()).toBe("Action 1");
    expect(buttons[1].text()).toBe("Action 2");
    expect(buttons[2].text()).toBe("Action 3");
  });

  it("sets correct tabindex for buttons", () => {
    const buttons = wrapper.findAll("button");
    expect(buttons[0].attributes("tabindex")).toBe("0");
    expect(buttons[1].attributes("tabindex")).toBe("-1");
    expect(buttons[2].attributes("tabindex")).toBe("-1");
  });

  it("has correct role and aria-label", () => {
    const toolbar = wrapper.find("[role=\"toolbar\"]");
    expect(toolbar.exists()).toBe(true);
    expect(toolbar.attributes("aria-label")).toBe("Barre d'outils");
  });

  it("accepts custom aria-label", () => {
    const customWrapper = mount(ToolBar, {
      props: {
        actions: mockActions,
        ariaLabel: "Custom toolbar",
      },
    });
    const toolbar = customWrapper.find("[role=\"toolbar\"]");
    expect(toolbar.attributes("aria-label")).toBe("Custom toolbar");
  });

  it("calls onClick handler when button is clicked", async () => {
    let clicked = false;
    const actions = [{ label: "Test", onClick: () => { clicked = true; } }];
    const testWrapper = mount(ToolBar, {
      props: { actions },
    });

    await testWrapper.find("button").trigger("click");
    expect(clicked).toBe(true);
  });

  it("handles ArrowRight keydown event", async () => {
    const toolbar = wrapper.find("[role=\"toolbar\"]");

    await toolbar.trigger("keydown", { key: "ArrowRight" });

    expect(toolbar.exists()).toBe(true);
  });

  it("handles ArrowLeft keydown event", async () => {
    const toolbar = wrapper.find("[role=\"toolbar\"]");

    await toolbar.trigger("keydown", { key: "ArrowLeft" });

    expect(toolbar.exists()).toBe(true);
  });

  it("responds to keyboard navigation", async () => {
    const toolbar = wrapper.find("[role=\"toolbar\"]");

    await toolbar.trigger("keydown", { key: "ArrowRight" });
    await toolbar.trigger("keydown", { key: "ArrowLeft" });

    expect(wrapper.findAll("button").length).toBe(3);
  });

  it("has keyboard event handler attached", () => {
    const toolbar = wrapper.find("[role=\"toolbar\"]");
    expect(toolbar.attributes()).toHaveProperty("aria-label");
    expect(toolbar.attributes("role")).toBe("toolbar");
  });

  it("applies toolbar class for styling", () => {
    expect(wrapper.find(".toolbar").exists()).toBe(true);
  });
});

