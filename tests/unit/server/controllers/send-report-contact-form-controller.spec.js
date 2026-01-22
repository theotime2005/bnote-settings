import { vi } from "vitest";

vi.mock("@/utils/send-log-message-script.js", () => ({
  sendLog: vi.fn(),
}));

import { config } from "@/server/config.js";
import { sendReportContactFormController } from "@/server/controllers/send-report-contact-form-controller.js";
import { sendLog } from "@/utils/send-log-message-script.js";

describe("Unit | Server | Controllers | Send report contact form controller", () => {
  let sendMail;
  let createMailBody;
  const payload = {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.net",
    reportType: "bug",
    subject: "Hello world",
    body: "This is the message",
    language: "fr",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sendMail = vi.fn();
    createMailBody = vi.fn();
  });

  it("should call the createMailBodyService function", async () => {
    // given

    // when
    await sendReportContactFormController({
      ...payload,
      sendMail,
      createMailBody,
    });

    // then
    expect(createMailBody).toHaveBeenCalledWith("report-contact-form", payload);
  });

  it("should call the sendMailService", async () => {
    // given
    config.email.auth.user = "test@example.net";
    createMailBody.mockResolvedValue("This is a body");

    // when
    const result = await sendReportContactFormController({
      ...payload,
      sendMail,
      createMailBody,
    });

    // then
    expect(createMailBody).toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalledWith({
      to: config.email.auth.user,
      from: payload.email,
      subject: payload.subject,
      html: "This is a body",
    });
    expect(result).toBe(true);
  });

  describe("error cases", () => {
    it("should call sendLog when mail sending failed", async () => {
      // given
      createMailBody.mockReturnValue("This is a body");
      const mailError = new Error("Mail sending failed");
      sendMail = vi.fn().mockRejectedValue(mailError);

      const errorMessage = {
        fileName: "send-report",
        functionName: "controller",
        type: "error",
      };

      // when
      await sendReportContactFormController({
        ...payload,
        sendMail,
        createMailBody,
      });

      // then
      expect(sendLog).toHaveBeenCalledWith(expect.objectContaining(errorMessage));
    });
  });
});
