import { mount } from "@vue/test-utils";
import { vi } from "vitest";

import UploadFileComponent from "@/components/UploadFileComponent.vue";
import i18n from "@/tests/helpers/i18n.js";

const { t } = i18n.global;
const mockLoadSettings = vi.fn();
const mockNotifications = {
  notifications: { value: [] },
  addNotification: vi.fn(),
  removeNotification: vi.fn(),
  clearAll: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

vi.mock("@/stores/settingsStore.js", () => ({
  useSettingsStore: () => ({
    loadSettings: mockLoadSettings,
  }),
}));

vi.mock("@/composables/useNotifications.js", () => ({
  useNotifications: () => mockNotifications,
}));

describe("UploadFileComponent.vue", () => {
  let wrapper;
  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(UploadFileComponent, {
      global: {
        plugins: [i18n],
      },
    });
  });

  it("should handle file selection correctly", async () => {
    // given
    const file = new File(["test content"], "test.bnote", { type: "text/plain" });
    const input = wrapper.find("input[type='file']");

    // when
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");

    // then
    expect(wrapper.vm.fileInput.name).toBe(file.name);
  });

  it("should handle drag and drop correctly", async () => {
    // given
    const file = new File(["test content"], "test.bnote", { type: "text/plain" });
    const dropZone = wrapper.find(".file-input-wrapper");

    // when
    await dropZone.trigger("dragenter");
    expect(wrapper.vm.isDragOver).toBe(true);

    // Simulate drop event with files
    await dropZone.trigger("drop", {
      dataTransfer: {
        files: [file],
      },
    });

    // then
    expect(wrapper.vm.isDragOver).toBe(false);
    expect(wrapper.vm.fileInput.name).toBe(file.name);
  });

  it("should remove file correctly", async () => {
    // given
    const file = new File(["test content"], "test.bnote", { type: "text/plain" });
    wrapper.vm.fileInput = file;
    await wrapper.vm.$nextTick();

    // when
    const removeButton = wrapper.find(".file-remove");
    await removeButton.trigger("click");

    // then
    expect(wrapper.vm.fileInput).toBe(null);
  });

  it("should format file size correctly", () => {
    // given

    // then
    expect(wrapper.vm.formatFileSize(0)).toBe("0 B");
    expect(wrapper.vm.formatFileSize(1024)).toBe("1 KB");
    expect(wrapper.vm.formatFileSize(1048576)).toBe("1 MB");
  });

  it("should display an alert if the file format is incorrect", async () => {
    // given
    window.alert = vi.fn();
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    wrapper.vm.fileInput = file;

    // when
    wrapper.vm.uploadFile();

    // then
    expect(window.alert).toHaveBeenCalledWith(t("uploadFile.incorrectFormatFile"));
  });

  it("should display notification for invalid JSON content", async () => {
    // given
    window.alert = vi.fn();
    const fileContent = "invalid json content";
    const file = new File([fileContent], "settings.bnote", { type: "text/plain" });
    const mockFileReader = { readAsText: vi.fn(), onloadend: null };
    window.FileReader = vi.fn(() => mockFileReader);
    wrapper.vm.fileInput = file;

    // when
    wrapper.vm.uploadFile();
    mockFileReader.onloadend({ target: { result: fileContent } });
    await new Promise(resolve => setTimeout(resolve, 0));

    // then
    expect(window.alert).toHaveBeenCalledWith(t("uploadFile.invalidFileContent"));
  });

  it("should read file content and emit 'file-uploaded'", async () => {
    // given
    const fileContent = JSON.stringify({ theme: "dark" });
    const file = new File([fileContent], "settings.bnote", { type: "text/plain" });
    const mockFileReader = { readAsText: vi.fn(), onloadend: null };
    window.FileReader = vi.fn(() => mockFileReader);
    wrapper.vm.fileInput = file;

    // when
    wrapper.vm.uploadFile();
    mockFileReader.onloadend({ target: { result: fileContent } });
    await new Promise(resolve => setTimeout(resolve, 0));

    // then
    expect(mockLoadSettings).toHaveBeenCalledWith(JSON.parse(fileContent), "settings");
    expect(wrapper.emitted("file-uploaded")).toBeTruthy();
  });
});
