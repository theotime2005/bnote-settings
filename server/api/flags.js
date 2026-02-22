import { flagsClient } from "@vercel/flags-core";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const showReportContactForm = await flagsClient.evaluate("show-report-contact-form", false);
  return {
    showReportContactForm,
  };
});

async function _getFlagType(flagName, flagDefault) {
  const returningFlag = config.useVercelFlags ? await flagsClient.evaluate(flagName, flagDefault) : config.flags[flagName];
  return returningFlag;
}
