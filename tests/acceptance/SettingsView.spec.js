import { render, t } from "../acceptance/helper.js";

// Mock des composables et utilitaires
vi.mock("../../composables/useNotifications.js", () => ({
  useNotifications: () => ({
    notifications: { value: [] },
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAll: vi.fn(),
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
      expect(mainTitle).toContain(t("settings.page.title"));
      expect(howTitle).toContain(t("settings.page.how"));
      expect(fileSelector.exists()).toBe(true);
    });

    it("should display the default model when clicking the default button", async () => {
      // when
      const defaultButton = wrapper.findAll("button").find((button) => button.text() === t("settings.page.create"));

      // then
      await defaultButton.trigger("click");
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 600));
      const fileTitle = wrapper.find("h2").text();
      expect(fileTitle).toBe(t("settings.page.defaultName"));
    });
  });

  describe("when a file is uploaded", () => {
    beforeEach(async () => {
      const defaultButton = wrapper.findAll("button").find((button) => button.text() === t("settings.page.create"));
      await defaultButton.trigger("click");
      await wrapper.vm.$nextTick();
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
        const resetButton = wrapper.findAll("button").find((button) => button.text() === t("settings.page.openOther"));

        // when
        await resetButton.trigger("click");
        await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 600));

        // then
        expect(window.confirm).toHaveBeenCalledWith(t("settings.page.resetQuestion"));
        expect(wrapper.find("h2").text()).toBe(t("settings.page.how"));
      });

      it("should displays confirmation when click to download button", async () => {
        // given
        global.URL.createObjectURL = vi.fn(() => "blob:url");
        global.URL.revokeObjectURL = vi.fn();
        const downloadButton = wrapper.findAll("button").find((button) => button.text() === t("settings.page.download"));

        // when
        await downloadButton.trigger("submit");
        await wrapper.vm.$nextTick();

        // then
        expect(window.confirm).toHaveBeenCalledWith(t("settings.page.question"));
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

      it("should switch between sections correctly and keep action buttons visible", async () => {
        // given
        const sectionButtons = wrapper.findAll(".settings-nav-button");
        expect(sectionButtons.length).toBeGreaterThan(1); // Need at least 2 sections to test switching

        const firstSectionButton = sectionButtons[0];
        const secondSectionButton = sectionButtons[1];

        const firstSectionId = firstSectionButton.attributes("aria-controls");
        const secondSectionId = secondSectionButton.attributes("aria-controls");

        const firstSection = wrapper.find(`#${firstSectionId}`);
        const secondSection = wrapper.find(`#${secondSectionId}`);

        // Verify action buttons are initially visible
        const downloadButton = wrapper.find("button[type='submit']");
        const resetButton = wrapper.find("button[type='button']");
        expect(downloadButton.exists()).toBe(true);
        expect(resetButton.exists()).toBe(true);

        // when - open first section
        await firstSectionButton.trigger("click");
        await wrapper.vm.$nextTick();

        // then - first section should be open
        expect(firstSectionButton.classes()).toContain("active");
        expect(firstSection.classes()).toContain("active");
        expect(firstSection.attributes("aria-hidden")).toBe("false");
        expect(secondSection.attributes("aria-hidden")).toBe("true");

        // Action buttons should still be visible
        expect(wrapper.find("button[type='submit']").exists()).toBe(true);
        expect(wrapper.find("button[type='button']").exists()).toBe(true);

        // The first section should have content (settings)
        const firstSectionSettings = firstSection.findAll(".settings-grid > *");
        expect(firstSectionSettings.length).toBeGreaterThan(0);

        // when - switch to second section
        await secondSectionButton.trigger("click");
        await wrapper.vm.$nextTick();

        // then - second section should be open and first should be closed
        expect(firstSectionButton.classes()).not.toContain("active");
        expect(secondSectionButton.classes()).toContain("active");
        expect(firstSection.classes()).not.toContain("active");
        expect(secondSection.classes()).toContain("active");
        expect(firstSection.attributes("aria-hidden")).toBe("true");
        expect(secondSection.attributes("aria-hidden")).toBe("false");

        // CRITICAL: Action buttons should STILL be visible after switching sections
        expect(wrapper.find("button[type='submit']").exists()).toBe(true);
        expect(wrapper.find("button[type='button']").exists()).toBe(true);

        // CRITICAL: The second section should have content (not be empty)
        const secondSectionSettings = secondSection.findAll(".settings-grid > *");
        expect(secondSectionSettings.length).toBeGreaterThan(0);
      });

      it("should handle rapid section switching without losing content or buttons", async () => {
        // given
        const sectionButtons = wrapper.findAll(".settings-nav-button");
        expect(sectionButtons.length).toBeGreaterThan(2); // Need at least 3 sections for rapid switching

        // when - rapidly switch between multiple sections
        for (let i = 0; i < 3; i++) {
          await sectionButtons[i].trigger("click");
          await wrapper.vm.$nextTick();

          // then - verify each section works correctly
          const activeSection = wrapper.find(".settings-section.active");
          expect(activeSection.exists()).toBe(true);

          // Verify the section has content
          const sectionSettings = activeSection.findAll(".settings-grid > *");
          expect(sectionSettings.length).toBeGreaterThan(0);

          // Verify action buttons are still visible
          expect(wrapper.find("button[type='submit']").exists()).toBe(true);
          expect(wrapper.find("button[type='button']").exists()).toBe(true);
        }
      });

      it("should maintain correct active state after multiple switches", async () => {
        // given
        const sectionButtons = wrapper.findAll(".settings-nav-button");

        // when - switch to first section
        await sectionButtons[0].trigger("click");
        await wrapper.vm.$nextTick();

        // then - verify only first section is active
        expect(sectionButtons[0].classes()).toContain("active");
        expect(sectionButtons[1].classes()).not.toContain("active");

        // when - switch to second section
        await sectionButtons[1].trigger("click");
        await wrapper.vm.$nextTick();

        // then - verify only second section is active
        expect(sectionButtons[0].classes()).not.toContain("active");
        expect(sectionButtons[1].classes()).toContain("active");

        // when - switch back to first section
        await sectionButtons[0].trigger("click");
        await wrapper.vm.$nextTick();

        // then - verify only first section is active again
        expect(sectionButtons[0].classes()).toContain("active");
        expect(sectionButtons[1].classes()).not.toContain("active");
      });
    });
  });
});
