import { flagsClient } from "@vercel/flags-core";
import { defineEventHandler } from "h3";

import { config } from "@/server/config.js";

export default defineEventHandler(async () => {
  return {
    "show-contact-form": await _getFlagType("show-contact-form", false),
  };
});

async function _getFlagType(flagName, flagDefault) {
  const returningFlag = config.useVercelFlags
    ? await flagsClient.evaluate(flagName, flagDefault)
    : (config.flags[flagName] === undefined ? flagDefault : config.flags[flagName]);
  return returningFlag;
}
