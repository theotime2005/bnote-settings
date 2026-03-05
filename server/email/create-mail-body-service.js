import { marked } from "marked";

import { useStorage } from "#imports";

const MAIL_FOLDER = "email-templates";
const FOOTER_FILE_NAME = "footer.md";

/**
 * Escapes special characters in a string to be used in a regular expression.
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Creates the mail body by reading a markdown file and replacing placeholders with provided values.
 * @param {string} documentName - Name of the markdown file (without extension) to read from the email-templates folder
 * @param {object} replaceElements - An object containing key-value pairs where keys are placeholders in the markdown file (enclosed in {{}}) and values are the strings to replace them with
 * @returns {Promise<string>} The processed markdown converted to HTML
 */
async function createMailBodyService(documentName, replaceElements) {
  try {
    const storage = useStorage(`assets:${MAIL_FOLDER}`);
    const documentBody = await storage.getItem(`${documentName}.md`);

    if (!documentBody) {
      throw new Error(
        `Template not found: ${MAIL_FOLDER}/${documentName}.md`,
      );
    }

    const footerBody = await storage.getItem(`${FOOTER_FILE_NAME}`);

    if (!footerBody) {
      throw new Error(
        `Footer not found: ${MAIL_FOLDER}/${FOOTER_FILE_NAME}`,
      );
    }
    let mailBody = documentBody;

    if (replaceElements) {
      for (const [key, value] of Object.entries(replaceElements)) {
        const placeholder = `{{${key}}}`;
        mailBody = mailBody.replace(new RegExp(escapeRegExp(placeholder), "g"), value);
      }
    }

    mailBody += footerBody;
    return marked(mailBody);
  } catch (error) {
    console.error("Error creating mail body", error);
    throw error;
  }
}

export { createMailBodyService };
