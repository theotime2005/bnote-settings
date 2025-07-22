import { render } from "@/tests/acceptance/helper.js";

// Mock des composables et utilitaires
vi.mock("@/composables/useNotifications.js", () => ({
  useNotifications: () => ({
    notifications: { value: [] },
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

describe("Acceptance | SettingsView", () => {
  let wrapper;
  beforeEach(async () => {
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

    it("should display the default model when clicking the default button", async () => {
      // when
      const defaultButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.create");

      // then
      await defaultButton.trigger("click");
      await wrapper.vm.$nextTick();
      // Attendre que le loading soit terminé
      await new Promise(resolve => setTimeout(resolve, 600));
      const fileTitle = wrapper.find("h2").text();
      expect(fileTitle).toBe("settings.page.defaultName");
    });
  });

  suite("when a file is uploaded", () => {
    beforeEach(async () => {
      const defaultButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.create");
      await defaultButton.trigger("click");
      await wrapper.vm.$nextTick();
      // Attendre que le loading soit terminé
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    describe("test the dialogs box", () => {
      beforeEach(() => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it("should displays dialog when you want open another file", async () => {
        // given
        const resetButton = wrapper.findAll("button").find((button) => button.text() === "settings.page.openOther");

        // when
        await resetButton.trigger("click");
        await wrapper.vm.$nextTick();
        // Attendre que le loading soit terminé
        await new Promise(resolve => setTimeout(resolve, 600));

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
        await wrapper.vm.$nextTick();

        // then
        expect(window.confirm).toHaveBeenCalledWith("settings.page.question");
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      });
    });

    describe("tests button to open or close sections", () => {
      it("should open a section when click on navigation button", async () => {
        // given
        const firstSectionButton = wrapper.find(".settings-nav-button");
        const sectionId = firstSectionButton.attributes("aria-controls");
        const section = wrapper.find(`#${sectionId}`);
        expect(firstSectionButton.classes()).not.toContain("active");
        expect(section.classes()).not.toContain("active");
        expect(firstSectionButton.attributes("aria-expanded")).toBe("false");
        expect(section.attributes("aria-hidden")).toBe("true");

        // when
        await firstSectionButton.trigger("click");
        await wrapper.vm.$nextTick();

        // then
        expect(firstSectionButton.classes()).toContain("active");
        expect(section.classes()).toContain("active");
        expect(firstSectionButton.attributes("aria-expanded")).toBe("true");
        expect(section.attributes("aria-hidden")).toBe("false");
      });
    });
  });
});
