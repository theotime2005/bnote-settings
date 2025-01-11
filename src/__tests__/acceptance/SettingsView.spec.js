import { render } from "@/__tests__/acceptance/helper.js";

describe("Acceptance | SettingsView", () => {
  let wrapper;
  beforeEach(async function() {
    wrapper = await render("/settings");
  });

  it("should display the page when no file is uploaded", () => {
    // when
    const mainTitle = wrapper.find("h1").text();
    const howTitle = wrapper.find("h2").text();
    const fileSelector = wrapper.find("input[type='file']");
    // then
    expect(mainTitle).toContain("settings.page.title");
    expect(howTitle).toContain("settings.page.how");
    expect(fileSelector.exists()).toBe(true);
  });

  it("should display the default model when clicking the default button", async function () {
    // when
    const defaultButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.create");

    // then
    await defaultButton.trigger("click");
    const fileTitle = wrapper.find("h2").text();
    expect(fileTitle).toBe("settings.page.defaultName");
  });
});
