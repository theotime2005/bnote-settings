import nodemailer from "nodemailer";
import { beforeEach, describe, expect, it } from "vitest";

import { config } from "@/server/config.js";
import { sendMailService } from "@/server/email/send-mail-service.js";

describe("Integration | Shared | Services | Email | Send Mail", () => {
  beforeEach(() => {
    config.email.enabled = true;
    config.email.host = "localhost";
    config.email.port = 1025;
    config.email.secure = false;
    config.email.auth = { user: undefined, pass: undefined };
  });

  describe("when email is disabled", () => {
    beforeEach(() => {
      config.email.enabled = false;
      vi.spyOn(console, "log");
    });

    it("should log email disabled message with mail options", async () => {
      // given
      const req = {
        to: "john.doe@example.net",
        subject: "Test Subject",
        text: "Test content",
      };

      // when
      await sendMailService(req);

      // then
      const expectedMailOptions = {
        from: undefined,
        to: "john.doe@example.net",
        subject: "Test Subject",
        text: "Test content",
      };
      expect(console.log).toHaveBeenCalledWith(
        "Email disabled. Mail not sent. Mail info:", expectedMailOptions);
    });
  });

  describe("with production email configuration", () => {
    beforeEach(() => {
      config.email.enabled = true;
      config.email.host = "smtp.gmail.com";
      config.email.port = 587;
      config.email.secure = false;
      config.email.auth = {
        user: "prod@example.com",
        pass: "password123",
      };
    });

    it("should create transporter with auth when credentials are provided", async () => {
      // given
      const sendMail = vi.fn().mockResolvedValue({ messageId: "test-id" });
      vi.spyOn(nodemailer, "createTransport").mockReturnValue({ sendMail });

      const req = {
        to: "john.doe@example.net",
        subject: "Production Test",
        text: "Production content",
      };

      // when
      await sendMailService(req);

      // then
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "prod@example.com",
          pass: "password123",
        },
      });
    });

    it("should use auth user as the from address", async () => {
      // given
      const sendMail = vi.fn().mockResolvedValue({ messageId: "test-id" });
      vi.spyOn(nodemailer, "createTransport").mockReturnValue({ sendMail });

      const req = {
        to: "john.doe@example.net",
        subject: "Production Test",
        text: "Production content",
      };

      // when
      await sendMailService(req);

      // then
      expect(sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: "prod@example.com" }),
      );
    });
  });

  describe("error logging", () => {
    beforeEach(() => {
      config.email.enabled = true;
      config.email.host = "localhost";
      config.email.port = 1025;
      config.email.secure = false;
      config.email.auth = { user: undefined, pass: undefined };
      vi.spyOn(console, "error");
    });

    it("should log error when sendMail fails", async () => {
      // given
      const error = new Error("SMTP server not responding");
      vi.spyOn(nodemailer, "createTransport").mockReturnValue({
        sendMail: vi.fn().mockRejectedValue(error),
      });

      const req = {
        to: "john.doe@example.net",
        subject: "Test Subject",
        text: "Test content",
      };

      // when
      await expect(sendMailService(req)).rejects.toBe(error);

      // then
      expect(console.error).toHaveBeenCalledWith({
        type: "error",
        where: "send-mail-service > sendMailService",
        log: "Error sending email: Error: SMTP server not responding",
      });
    });
  });
});
