import { flagsClient } from "@vercel/flags-core";
import { defineEventHandler } from "h3";

import { config } from "@/server/config.js";

export default defineEventHandler(async () => {
  return {
  };
});

// eslint-disable-next-line no-unused-vars
async function _getFlagType(flagName, flagDefault) {
  const returningFlag = config.useVercelFlags
    ? await flagsClient.evaluate(flagName, flagDefault)
    : (config.flags[flagName] === undefined ? flagDefault : config.flags[flagName]);
  return returningFlag;
}
