import { defineEventHandler, setHeader, setResponseStatus } from "h3";
import { marked } from "marked";
const GITHUB_API_URL = "https://api.github.com/repos/theotime2005/bnote-settings/releases/latest";
export default defineEventHandler(async (event) => {
  try {
    const request = await fetch(GITHUB_API_URL);
    if (!request.ok) {
      throw new Error(`GitHub API request failed with status ${request.status}`);
    }
    const data = await request.json();
    setHeader(event, "content-type", "text/html; charset=utf-8");
    return marked(data.body);
  } catch {
    setHeader(event, "content-type", "text/html; charset=utf-8");
    setResponseStatus(event, 502);
    return "Unable to fetch changelog from GitHub. Please retry later.";
  }
});
