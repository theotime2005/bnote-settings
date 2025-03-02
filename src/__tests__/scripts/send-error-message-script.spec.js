import { sendLog } from "@/scripts/send-error-message-script.js";

describe("scripts | sendLog", () => {
  let fetch;
  let console;
  beforeEach(() => {
    fetch = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });
    process.env.VUE_APP_LOG_API_URL = "http://example.net";
    console = { log: vi.spyOn(global.console, "log"), error: vi.spyOn(global.console, "error") };
  });

  afterEach(function() {
    fetch.mockReset();
    console.log.mockRestore;
  });

  describe("Send a log", () => {
    it("send a basic log", async () => {
      // when
      await sendLog({ fileName: "testFile", functionName: "testFunction", type: "info", log: "Hello World" });

      // then
      expect(fetch).toHaveBeenCalledWith("http://example.net", expect.any(Object));
      expect(console.log).toHaveBeenCalled;
    });
  });

  describe("Send a log with different types", () => {
    it("send an error log", async () => {
      // when
      await sendLog({ fileName: "testFile", functionName: "testFunction", type: "error", log: "Error occurred" });

      // then
      expect(fetch).toHaveBeenCalledWith("http://example.net", expect.objectContaining({
        body: expect.stringContaining("\\\"type\\\": \\\"error\\\""),
      }));
    });

    it("send a warning log", async () => {
      // when
      await sendLog({ fileName: "testFile", functionName: "testFunction", type: "warning", log: "Warning issued" });

      // then
      expect(fetch).toHaveBeenCalledWith("http://example.net", expect.objectContaining({
        body: expect.stringContaining("\\\"type\\\": \\\"warning\\\""),
      }));
    });

    it("send an info log", async () => {
      await sendLog({ fileName: "testFile", functionName: "testFunction", type: "info", log: "Information" });

      // then
      expect(fetch).toHaveBeenCalledWith("http://example.net", expect.objectContaining({
        body: expect.stringContaining("\\\"type\\\": \\\"info\\\""),
      }));
    });
  });

  describe("Send a log with missing or invalid URL", () => {
    it("does not send a log if LOG_API_URL is missing", async () => {
      // given
      delete process.env.VUE_APP_LOG_API_URL;

      // when
      await sendLog({ fileName: "testFile", functionName: "testFunction", type: "error", log: "Error occurred" });

      // then
      expect(fetch).not.toHaveBeenCalled();
    });

    it("does not send a log if LOG_API_URL is invalid", async () => {
      // given
      process.env.VUE_APP_LOG_API_URL = "";

      // when
      await sendLog({ fileName: "testFile", functionName: "testFunction", type: "error", log: "Error occurred" });

      // then
      expect(fetch).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled;
    });
  });
});
