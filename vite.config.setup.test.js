import { sendLog } from "@/scripts/send-error-message-script.js";
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({}));
