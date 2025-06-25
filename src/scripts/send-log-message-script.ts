import type { LogMessage } from '@/types';

/*
This file is used to send a notification on the discord server when an error occurs.
 */

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
}

interface DiscordMessage {
  embeds: DiscordEmbed[];
}

async function sendLog({ fileName, functionName, type, log, environment = true }: LogMessage): Promise<void> {
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
    const request: RequestInit = {
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
      } as DiscordMessage),
    };
    await fetch(apiUrl, request);
  } catch (e) {
    console.error(e);
  }
}

export { sendLog };