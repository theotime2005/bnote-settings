import { defineEventHandler, readBody, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const requestBody = await readBody(event);
    const { fileName, functionName, type, log } = requestBody;

    const apiUrl = process.env.LOG_API_URL || "";

    if (!apiUrl) {
      return { success: false, message: "No API URL configured" };
    }

    const redColor = 16711680;
    const message = {
      type,
      where: `${fileName} > ${functionName}`,
      log,
    };

    const textMessage = "```json\n" + JSON.stringify(message, null, 2) + "\n```";
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "New message in log",
            description: textMessage,
            color: redColor,
          },
        ],
      }),
    };

    const response = await fetch(apiUrl, request);
    if (!response.ok) {
      setResponseStatus(event, 500);
      return { success: false, error: `Discord API returned status ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    setResponseStatus(event, 500);
    return { success: false, error: String(err) };
  }
});
