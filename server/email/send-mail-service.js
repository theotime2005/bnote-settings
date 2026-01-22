import nodemailer from "nodemailer";

import { config } from "@/server/config.js";
import { sendLog } from "@/utils/send-log-message-script.js";

const { email } = config;

async function sendMailService(req) {
  if (!req.to) {
    throw new Error("Recipient email address is required");
  }

  const mailOptions = {
    from: email.auth.user,
    to: req.to,
    subject: req.subject || "No Subject",
  };

  if (req.text) {
    mailOptions.text = req.text;
  } else if (req.html) {
    mailOptions.html = req.html;
  }

  if (!email.enabled) {
    console.log(`Email disabled. Mail not sent. Mail info: ${JSON.stringify(mailOptions)}`);
    return {
      info: "Email sending disabled",
      data: mailOptions,
    };
  }
  let transporter, testAccount;

  if (email.testAccount) {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: email.host,
      port: email.port,
      secure: email.secure,
      auth: email.auth,
    });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    if (email.testAccount) {
      console.log(`Email available on ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    sendLog({
      fileName: "send-mail-service",
      functionName: "sendMailService",
      type: "error",
      log: `Error sending email: ${error}`,
    });
    throw error;
  }
}

export { sendMailService };
