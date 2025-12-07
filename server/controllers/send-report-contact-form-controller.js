
import { config } from "@/server/config.js";
import { createMailBodyService } from "@/server/email/create-mail-body-service.js";
import { sendMailService } from "@/server/email/send-mail-service.js";
import { sendLog } from "@/utils/send-log-message-script.js";

const FILE_NAME = "report-contact-form";

/**
 * Send the contact form
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} reportType
 * @param {string} subject
 * @param {string} message
 * @param {string} language
 * @param {function} sendMail
 * @param {function} createMailBody
 * @returns {Promise<boolean>}
 */
async function sendReportContactFormController({
  firstname,
  lastname,
  email,
  reportType,
  subject,
  message,
  language,
  sendMail = sendMailService,
  createMailBody = createMailBodyService,
}) {
  try {
    const finalDocument = await createMailBody(FILE_NAME, {
      firstname,
      lastname,
      email,
      subject,
      message,
      reportType,
      language,
    });
    await sendMail({
      to: config.email.auth.user,
      from: email,
      subject,
      html: finalDocument,
    });
    return true;
  } catch (err) {
    sendLog({
      fileName: "send-report",
      functionName: "controller",
      type: "error",
      log: `Error sending report contact form email: ${err.message}`,
    });
    return false;
  }
}

export { sendReportContactFormController };
