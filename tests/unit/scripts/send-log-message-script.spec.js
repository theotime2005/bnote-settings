import { sendLog } from "@/utils/send-log-message-script.js";

describe("scripts | sendLog", () => {
  let fetch;
  let console;
  beforeEach(() => {
    fetch = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });
    process.env.LOG_API_URL = "http://example.net";
    console = { log: vi.spyOn(global.console, "log"), error: vi.spyOn(global.console, "error") };
  });

  describe("Send a log", function() {
    it("send a basic log", async function() {
      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "log",
        log: "Hello World",
      });

      // then
      expect(fetch).toHaveBeenCalledWith(
        "http://example.net",
        expect.any(Object),
      );
      expect(console.log).toHaveBeenCalled;
    });
  });

  describe("Send a log with different types", function() {
    it("send an error log", async function() {
      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetch).toHaveBeenCalledWith(
        "http://example.net",
        expect.objectContaining({
          body: expect.stringContaining("\\\"type\\\": \\\"error\\\""),
        }),
      );
    });

    it("send a warning log", async function() {
      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "warn",
        log: "Warning issued",
      });

      // then
      expect(fetch).toHaveBeenCalledWith(
        "http://example.net",
        expect.objectContaining({
          body: expect.stringContaining("\\\"type\\\": \\\"warn\\\""),
        }),
      );
    });

    it("send an info log", async function() {
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "log",
        log: "Information",
      });

      // then
      expect(fetch).toHaveBeenCalledWith(
        "http://example.net",
        expect.objectContaining({
          body: expect.stringContaining("\\\"type\\\": \\\"log\\\""),
        }),
      );
    });
  });

  describe("Send a log with missing or invalid URL", function() {
    it("does not send a log if environment variable is missing", async () => {
      // given
      delete process.env.LOG_API_URL;

      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetch).not.toHaveBeenCalled();
    });

    it("does not send a log if LOG_API_URL is invalid", async () => {
      // given
      process.env.LOG_API_URL = "";

      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetch).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled;
    });
  });
});
