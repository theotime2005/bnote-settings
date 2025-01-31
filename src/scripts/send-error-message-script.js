/*
This file is used to send a notification on the discord server when an error occurs.
 */

async function sendLog({ fileName, functionName, type, log }) {
  const redColor = 16711680;
  // Create a message visible and readable
  const message = {
    type,
    where: `${fileName} > ${functionName}`,
    log,
  };
  // Log the message in the console for Vercel deployment
  console.log(message);
  const apiUrl = process.env.LOG_API_URL || null;
  if (!apiUrl) {
    return;
  }
  try {
    let textMessage = "```json\n"+JSON.stringify(message, null, 2)+"\n```";
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
