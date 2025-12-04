import { marked } from "marked";

import { sendLog } from "@/utils/send-log-message-script.js";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createMailBodyService(documentBody, replaceElements) {
  try {
    let mailBody = documentBody;

    if (replaceElements) {
      for (const [key, value] of Object.entries(replaceElements)) {
        const placeholder = `{{${escapeRegExp(key)}}}`;
        mailBody = mailBody.replace(new RegExp(placeholder, "g"), value);
      }
    }
    return marked(mailBody);
  } catch (error) {
    await sendLog({ fileName: "create mail body", functionName: "createMailBody", type: "error", log: `Error creating body ${error}` });
    throw error;
  }
}

export { createMailBodyService };
