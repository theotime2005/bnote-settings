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
  if (req.html) {
    mailOptions.html = req.html;
  } else if (req.text) {
    mailOptions.text = req.text;
  } else {
    throw new Error("Email content is required");
  }

  if (!email.enabled) {
    console.log("Email disabled. Mail not sent. Mail info:", mailOptions);
    return {
      info: "Email sending disabled",
      data: mailOptions,
    };
  }
  const transporter = nodemailer.createTransport({
    host: email.host,
    port: email.port,
    secure: email.secure,
    auth: email.auth || {},
  });

  try {
    const info = await transporter.sendMail(mailOptions);
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
