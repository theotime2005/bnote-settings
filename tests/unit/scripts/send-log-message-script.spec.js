import { sendLog } from "@/utils/send-log-message-script.js";

describe("scripts | sendLog", () => {
  let fetch;
  let console;
  beforeEach(() => {
    fetch = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });
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
        "/api/send-log",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.stringContaining("testFile"),
        }),
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
        "/api/send-log",
        expect.objectContaining({
          body: expect.stringContaining("error"),
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
        "/api/send-log",
        expect.objectContaining({
          body: expect.stringContaining("warn"),
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
        "/api/send-log",
        expect.objectContaining({
          body: expect.stringContaining("log"),
        }),
      );
    });
  });

  describe("Send a log with error handling", function() {
    it("handles fetch errors gracefully", async () => {
      // given
      fetch.mockRejectedValue(new Error("Network error"));

      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetch).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled;
    });
  });
});
