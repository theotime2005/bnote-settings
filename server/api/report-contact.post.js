import { defineEventHandler, readBody, setResponseStatus } from "h3";

import { sendReportContactFormController } from "@/server/controllers/send-report-contact-form-controller.js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      firstname,
      lastname,
      email,
      reportType,
      subject,
      message,
      language,
    } = body;


    const result = await sendReportContactFormController({
      firstname,
      lastname,
      email,
      reportType,
      subject,
      message,
      language,
    });

    if (result) {
      return { success: true };
    }

    setResponseStatus(event, 500);
    return { success: false };
  } catch (err) {
    setResponseStatus(event, 500);
    return { success: false, error: err?.message || String(err) };
  }
});
