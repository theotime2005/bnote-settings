/*
This file is used to send a notification on the discord server when an error occurs.
 */

async function sendLog({ fileName, functionName, type, log, environment = true }) {
  const redColor = 16711680;
  // Create a message visible and readable
  const message = {
    type,
    where: `${fileName} > ${functionName}`,
    log,
  };
  // Log the message in the console for Vercel deployment
  console.log(message);
  const apiUrl = environment ? import.meta.env.VUE_APP_LOG_API_URL : process.env.VUE_APP_LOG_API_URL;
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
