async function sendLog({ fileName, functionName, type, log }) {
  const redColor = 16711680;
  const message = {
    type,
    where: `${fileName} > ${functionName}`,
    log,
  };
  console[type](message);

  // Get API URL: browser-safe lookup for client-side, process.env for server-side
  let apiUrl = "";
  if (typeof window !== "undefined" && window.__NUXT__) {
    // Client-side: use Nuxt runtime config
    apiUrl = window.__NUXT__.config?.public?.logApiUrl || "";
  } else if (typeof process !== "undefined" && process.env) {
    // Server-side: use process.env
    apiUrl = process.env.LOG_API_URL || "";
  }

  if (!apiUrl) {
    console.log("Message not sent, no API URL");
    return;
  }
  try {
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
    await fetch(apiUrl, request);
  } catch (e) {
    console.error(e);
  }
}

export { sendLog };
