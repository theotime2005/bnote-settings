import { flagsClient } from "@vercel/flags-core";
import { defineEventHandler } from "h3";

import { config } from "@/server/config.js";

export default defineEventHandler(async () => {
  return {
    displayChangelog: await _getFlagType("displayChangelog", false),
    useAccountSystem: await _getFlagType("useAccountSystem", false),
  };
});


async function _getFlagType(flagName, flagDefault) {
  const returningFlag = config.useVercelFlags
    ? await flagsClient.evaluate(flagName, flagDefault)
    : { value: (config.flags[flagName] === undefined ? flagDefault : config.flags[flagName]) };
  return returningFlag;
}
