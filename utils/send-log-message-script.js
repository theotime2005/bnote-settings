async function sendLog({ fileName, functionName, type, log, environment = true }) {
  const redColor = 16711680;
  const message = {
    type,
    where: `${fileName} > ${functionName}`,
    log,
  };
  console.log(message);
  let apiUrl = "";
  if (environment) {
    try {
      if (typeof window !== "undefined" && window.__NUXT__) {
        apiUrl = window.__NUXT__.config?.public?.logApiUrl || "";
      }
    } catch {
      apiUrl = "";
    }
  } else {
    apiUrl = process.env.VUE_APP_LOG_API_URL || "";
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
