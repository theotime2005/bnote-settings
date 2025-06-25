import { describe, it, expect, vi } from "vitest";
import UploadFileComponent from "@/components/UploadFileComponent.vue";
import { render, t } from "@/tests/components/helpers";

const mockLoadSettings = vi.fn();

vi.mock("@/stores/settingsStore", () => ({
  useSettingsStore: () => ({
    loadSettings: mockLoadSettings,
  }),
}));

describe("UploadFileComponent.vue", () => {
  it("should handle file selection correctly", async () => {
    // given
    const wrapper = render(UploadFileComponent);
    const file = new File(["test content"], "test.bnote", { type: "text/plain" });
    const input = wrapper.find("input[type='file']");

    // when
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");

    // then
    expect(wrapper.vm.fileInput).toBe(file);
  });

  it("should display an alert if the file format is incorrect", async () => {
    // given
    const wrapper = render(UploadFileComponent);
    window.alert = vi.fn();
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = wrapper.find("input[type='file']");

    // when
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");
    wrapper.vm.uploadFile();

    // then
    expect(window.alert).toHaveBeenCalledWith(t("uploadFile.incorrectFormatFile"));
  });

  it("should read file content and emit 'file-uploaded'", async () => {
    // given
    const wrapper = render(UploadFileComponent);
    const fileContent = JSON.stringify({ theme: "dark" });
    const file = new File([fileContent], "settings.bnote", { type: "text/plain" });
    const mockFileReader = { 
      readAsText: vi.fn(), 
      onloadend: null as ((event: ProgressEvent<FileReader>) => void) | null,
      result: fileContent
    };
    window.FileReader = vi.fn(() => mockFileReader as any);
    const input = wrapper.find("input[type='file']");

    // when
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");
    wrapper.vm.uploadFile();
    
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend({ target: { result: fileContent } } as any);
    }
    await new Promise(resolve => setTimeout(resolve, 0));

    // then
    expect(mockLoadSettings).toHaveBeenCalledWith(JSON.parse(fileContent), wrapper.vm.fileInput?.name.split(".")[0]);
    expect(wrapper.emitted("file-uploaded")).toBeTruthy();
  });
});