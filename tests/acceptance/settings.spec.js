import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import LoadingSpinner from "@/components/LoadingSpinner.vue";
import NotificationToast from "@/components/NotificationToast.vue";
import SettingComponent from "@/components/SettingComponent.vue";
import ToolBar from "@/components/ToolBar.vue";
import UploadFileComponent from "@/components/UploadFileComponent.vue";
import SettingsView from "@/pages/settings.vue";
import i18n from "@/tests/i18n.js";

const { t } = i18n.global;

vi.mock("@unhead/vue", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useHead: vi.fn(),
  };
});

vi.mock("@/composables/useNotifications.js", () => ({
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

function mountSettingsView(initialState = {}) {
  return mount(SettingsView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState,
        }),
        i18n,
      ],
      components: {
        LoadingSpinner,
        NotificationToast,
        SettingComponent,
        ToolBar,
        UploadFileComponent,
      },
    },
  });
}

function findButtonByText(wrapper, text) {
  const buttons = wrapper.findAll("button");
  for (const btn of buttons) {
    if (btn.text().trim() === text) {
      return btn;
    }
  }
  return null;
}

describe("Acceptance | SettingsView", () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = mountSettingsView();
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
      const defaultButton = findButtonByText(wrapper, t("settings.page.create"));

      // then
      expect(defaultButton).not.toBe(null);
      await defaultButton.trigger("click");
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 600));
      const fileTitle = wrapper.find("h2").text();
      expect(fileTitle).toBe(t("settings.page.defaultName"));
    });
  });

  describe("when a file is uploaded", () => {
    beforeEach(async () => {
      const defaultButton = findButtonByText(wrapper, t("settings.page.create"));
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
        const resetButton = findButtonByText(wrapper, t("settings.page.openOther"));
        expect(resetButton).not.toBe(null);

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
        const downloadButton = findButtonByText(wrapper, t("settings.page.download"));
        expect(downloadButton).not.toBe(null);

        // when
        await downloadButton.trigger("click");
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
        expect(sectionButtons.length).toBeGreaterThan(1);

        const firstSectionButton = sectionButtons[0];
        const secondSectionButton = sectionButtons[1];

        const firstSectionId = firstSectionButton.attributes("aria-controls");
        const secondSectionId = secondSectionButton.attributes("aria-controls");

        const firstSection = wrapper.find(`#${firstSectionId}`);
        const secondSection = wrapper.find(`#${secondSectionId}`);

        // when
        await firstSectionButton.trigger("click");
        await wrapper.vm.$nextTick();

        // then
        expect(firstSectionButton.classes()).toContain("active");
        expect(firstSection.classes()).toContain("active");
        expect(firstSection.attributes("aria-hidden")).toBe("false");
        expect(secondSection.attributes("aria-hidden")).toBe("true");
        expect(findButtonByText(wrapper, t("settings.page.download"))).not.toBe(null);
        expect(findButtonByText(wrapper, t("settings.page.openOther"))).not.toBe(null);
        const firstSectionSettings = firstSection.findAll(".settings-grid > *");
        expect(firstSectionSettings.length).toBeGreaterThan(0);
        await secondSectionButton.trigger("click");
        await wrapper.vm.$nextTick();
        expect(firstSectionButton.classes()).not.toContain("active");
        expect(secondSectionButton.classes()).toContain("active");
        expect(firstSection.classes()).not.toContain("active");
        expect(secondSection.classes()).toContain("active");
        expect(firstSection.attributes("aria-hidden")).toBe("true");
        expect(secondSection.attributes("aria-hidden")).toBe("false");
        expect(findButtonByText(wrapper, t("settings.page.download"))).not.toBe(null);
        expect(findButtonByText(wrapper, t("settings.page.openOther"))).not.toBe(null);
        const secondSectionSettings = secondSection.findAll(".settings-grid > *");
        expect(secondSectionSettings.length).toBeGreaterThan(0);
      });

      it("should handle rapid section switching without losing content or buttons", async () => {
        // given
        const sectionButtons = wrapper.findAll(".settings-nav-button");
        expect(sectionButtons.length).toBeGreaterThan(2);

        // when
        for (let i = 0; i < 3; i++) {
          await sectionButtons[i].trigger("click");
          await wrapper.vm.$nextTick();

          // then
          const activeSection = wrapper.find(".settings-section.active");
          expect(activeSection.exists()).toBe(true);
          const sectionSettings = activeSection.findAll(".settings-grid > *");
          expect(sectionSettings.length).toBeGreaterThan(0);
          expect(findButtonByText(wrapper, t("settings.page.download"))).not.toBe(null);
          expect(findButtonByText(wrapper, t("settings.page.openOther"))).not.toBe(null);
        }
      });

      it("should maintain correct active state after multiple switches", async () => {
        // given
        const sectionButtons = wrapper.findAll(".settings-nav-button");

        // when
        await sectionButtons[0].trigger("click");
        await wrapper.vm.$nextTick();

        // then
        expect(sectionButtons[0].classes()).toContain("active");
        expect(sectionButtons[1].classes()).not.toContain("active");

        // when
        await sectionButtons[1].trigger("click");
        await wrapper.vm.$nextTick();

        // then
        expect(sectionButtons[0].classes()).not.toContain("active");
        expect(sectionButtons[1].classes()).toContain("active");

        // when - switch back to first section
        await sectionButtons[0].trigger("click");
        await wrapper.vm.$nextTick();

        // then
        expect(sectionButtons[0].classes()).toContain("active");
        expect(sectionButtons[1].classes()).not.toContain("active");
      });
    });
  });
});
