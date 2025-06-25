import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendLog } from "@/scripts/send-log-message-script";

describe("scripts | sendLog", () => {
  let fetchSpy: any;
  let consoleSpy: { log: any; error: any };
  
  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true } as Response);
    process.env.VUE_APP_LOG_API_URL = "http://example.net";
    consoleSpy = { 
      log: vi.spyOn(global.console, "log"), 
      error: vi.spyOn(global.console, "error") 
    };
  });

  describe("Send a log", () => {
    it("send a basic log", async () => {
      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "info",
        log: "Hello World",
      });

      // then
      expect(fetchSpy).toHaveBeenCalledWith(
        "http://example.net",
        expect.any(Object),
      );
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe("Send a log with different types", () => {
    it("send an error log", async () => {
      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetchSpy).toHaveBeenCalledWith(
        "http://example.net",
        expect.objectContaining({
          body: expect.stringContaining("\"type\": \"error\""),
        }),
      );
    });

    it("send a warning log", async () => {
      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "warning",
        log: "Warning issued",
      });

      // then
      expect(fetchSpy).toHaveBeenCalledWith(
        "http://example.net",
        expect.objectContaining({
          body: expect.stringContaining("\"type\": \"warning\""),
        }),
      );
    });

    it("send an info log", async () => {
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "info",
        log: "Information",
      });

      // then
      expect(fetchSpy).toHaveBeenCalledWith(
        "http://example.net",
        expect.objectContaining({
          body: expect.stringContaining("\"type\": \"info\""),
        }),
      );
    });
  });

  describe("Send a log with missing or invalid URL", () => {
    it("does not send a log if LOG_API_URL is missing", async () => {
      // given
      delete process.env.VUE_APP_LOG_API_URL;

      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("does not send a log if LOG_API_URL is invalid", async () => {
      // given
      process.env.VUE_APP_LOG_API_URL = "";

      // when
      await sendLog({
        fileName: "testFile",
        functionName: "testFunction",
        type: "error",
        log: "Error occurred",
      });

      // then
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });
});