import { render, t } from "@/__tests__/components/helpers.js";
import UploadFileComponent from "@/components/UploadFileComponent.vue";

describe("UploadFileComponent.vue", () => {
  // Test to verify file selection handling
  it("should handle file selection correctly", async () => {
    const wrapper = render(UploadFileComponent);

    // Simulate a file change event
    const file = new File(["test content"], "test.bnote", { type: "text/plain" });
    const input = wrapper.find("input[type=\"file\"]");

    // Manually trigger the `change` event
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");

    // Verify that fileInput has received the file
    await wrapper.vm.handleFileUpload({ target: { files: [file] } });
    expect(wrapper.vm.fileInput).toBe(file);
  });
  // Test to verify alert when file format is incorrect
  it("should display an alert if the file format is incorrect", async () => {
    const wrapper = render(UploadFileComponent);

    window.alert = vi.fn(); // Mock window.alert

    // Simulate selecting a file with an incorrect extension
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = wrapper.find("input[type=\"file\"]");

    // Manually trigger the `change` event
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");

    await wrapper.vm.handleFileUpload({ target: { files: [file] } });
    // Simulate file submission with incorrect format
    wrapper.vm.uploadFile();

    // Verify that the alert is displayed
    expect(window.alert).toHaveBeenCalledWith(t("uploadFile.incorrectFormatFile"));
  });

  // Test to verify file reading and event emission
  it("should read file content and emit the \"file-uploaded\" event", async () => {
    const wrapper = render(UploadFileComponent);

    const fileContent = JSON.stringify({ message: "hello world" });
    const file = new File([fileContent], "test.bnote", { type: "text/plain" });

    // Mock FileReader and its behavior
    const mockFileReader = {
      readAsText: vi.fn(),
      onloadend: null, // onloadend will be defined later
    };

    // Mock global FileReader
    window.FileReader = vi.fn(() => mockFileReader);

    // Manually trigger the `change` event
    const input = wrapper.find("input[type=\"file\"]");
    Object.defineProperty(input.element, "files", { value: [file] });
    await input.trigger("change");
    // Simulate file selection
    await wrapper.vm.handleFileUpload({ target: { files: [file] } });

    // Define `onloadend` as a function and simulate the end of file reading event
    mockFileReader.onloadend = vi.fn((e) => {
      e.target = { result: fileContent }; // Simulate file content being read
      wrapper.vm.fileData = JSON.parse(e.target.result); // Update fileData
      wrapper.$emit("file-uploaded"); // Emit the event after reading
    });

    // Simulate file submission
    wrapper.vm.uploadFile();

    // Call onloadend to simulate the end of file reading
    mockFileReader.onloadend({ target: { result: fileContent } });

    // Verify that fileData has been updated
    expect(wrapper.vm.fileData).toEqual(JSON.parse(fileContent));

    // Verify that the "file-uploaded" event has been emitted
    expect(wrapper.emitted("file-uploaded")).toBeTruthy();
  });
});
