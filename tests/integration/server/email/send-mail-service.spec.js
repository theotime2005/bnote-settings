import nodemailer from "nodemailer";
import { beforeEach, describe, expect, it } from "vitest";

import { config } from "@/server/config.js";
import { sendMailService } from "@/server/email/send-mail-service.js";

describe("Integration | Shared | Services | Email | Send Mail", () => {
  beforeEach(() => {
    config.email.enabled = true;
    config.email.testAccount = true;
  });

  it("should send email and log url to visualize", async () => {
    // given
    vi.spyOn(console, "log");
    const req = {
      to: "john.doe@example.net",
      subject: "The subject",
      text: "This is the text",
    };

    // when
    const result = await sendMailService(req);

    // then
    const url = nodemailer.getTestMessageUrl(result);
    expect(console.log).toHaveBeenCalledWith(`Email available on ${url}`);
  });
});
