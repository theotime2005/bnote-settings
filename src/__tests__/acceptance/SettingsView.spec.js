import { render } from "@/__tests__/acceptance/helper.js";

describe("Acceptance | SettingsView", () => {
  let wrapper;
  beforeEach(async function() {
    wrapper = await render("/settings");
  });

  suite("when no file is uploaded", () => {
    it("should display the default page", () => {
      // when
      const mainTitle = wrapper.find("h1").text();
      const howTitle = wrapper.find("h2").text();
      const fileSelector = wrapper.find("input[type='file']");
      // then
      expect(mainTitle).toContain("settings.page.title");
      expect(howTitle).toContain("settings.page.how");
      expect(fileSelector.exists()).toBe(true);
    });

    it("should display the default model when clicking the default button", async function() {
      // when
      const defaultButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.create");

      // then
      await defaultButton.trigger("click");
      const fileTitle = wrapper.find("h2").text();
      expect(fileTitle).toBe("settings.page.defaultName");
    });
  });

  suite("when a file is uploaded", () => {
    beforeEach(async function() {
      const defaultButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.create");
      await defaultButton.trigger("click");
    });

    describe("test the dialogs box", () => {
      beforeEach(function() {
        vi.spyOn(window, "confirm").mockReturnValue(true);
      });

      afterEach(function() {
        vi.restoreAllMocks();
      });

      it("should displays dialog when you want open another file", async () => {
        // given
        const resetButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.openOther");

        // when
        await resetButton.trigger("click");

        // then
        expect(window.confirm).toHaveBeenCalledWith("settings.page.resetQuestion");
        expect(wrapper.find("h2").text()).toBe("settings.page.how");
      });

      it("should displays confirmation when click to download button", async () => {
        // given
        global.URL.createObjectURL = vi.fn(() => "blob:url");
        global.URL.revokeObjectURL = vi.fn();
        const downloadButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.download");

        // when
        await downloadButton.trigger("submit");

        // then
        expect(window.confirm).toHaveBeenCalledWith("settings.page.question");
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      });
    });

    describe("tests button to open or close sections", () => {
      it("should open section when clicks on the button", async () => {
        // given
        const button = wrapper.findAll("button").find((buton) => buton.text() === "settings.page.show");

        // when
        await button.trigger("click");

        // then
        const hideButton = wrapper.findAll("button").find((buton) => buton.text() === "settings.page.hide");
        expect(hideButton.exists()).toBe(true);
      });

      it("should close section when clicks on the button", async () => {
        // given
        const button = wrapper.findAll("button").find((buton) => buton.text() === "settings.page.show");
        await button.trigger("click");

        // when
        const hideButton = wrapper.findAll("button").find((buton) => buton.text() === "settings.page.hide");
        await hideButton.trigger("click");

        // then
        const showButton = wrapper.findAll("button").find((buton) => buton.text() === "settings.page.show");
        expect(showButton.exists()).toBe(true);
      });
    });
  });
});
