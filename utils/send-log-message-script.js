const DISCORD_EMBED_COLOR = 16711680;

async function sendLog({ fileName, functionName, type, log }) {
  const message = {
    type,
    where: `${fileName} > ${functionName}`,
    log,
  };
  console[type](message);

  try {
    const isServer = typeof window === "undefined";

    if (isServer) {
      const apiUrl = process.env.LOG_API_URL || "";
      if (!apiUrl) {
        console.log("Message not sent, no API URL");
        return;
      }

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
              color: DISCORD_EMBED_COLOR,
            },
          ],
        }),
      };
      await fetch(apiUrl, request);
    } else {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          functionName,
          type,
          log,
        }),
      };
      await fetch("/api/send-log", request);
    }
  } catch (e) {
    console.error(e);
  }
}

export { sendLog };
