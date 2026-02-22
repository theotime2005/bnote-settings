import "dotenv/config";

/**
 * @param {string} numberAsString
 * @param {number} defaultIntNumber
 */
function _getNumber(numberAsString, defaultIntNumber) {
  const number = parseInt(numberAsString, 10);
  return isNaN(number) ? defaultIntNumber : number;
}


function toBoolean(value) {
  if (value === undefined) return false;
  return value.toLowerCase() === "true";
}

/**
 * This is a helper function to be used in Vercel's feature flags. It returns an object with a "value" property set to the provided flag value.
 * @param flag - The value of the feature flag to be returned in the object.
 */
function getToFlag(flag) {
  return { value: flag };
}

const configuration = (function() {
  const config = {
    environment: process.env.MODE || "development",
    email: {
      enabled: toBoolean(process.env.MAILING_ENABLED),
      testAccount: toBoolean(process.env.MAILING_TEST_ACCOUNT_ENABLED),
      host: process.env.MAILING_HOST,
      port: _getNumber(process.env.MAILING_PORT, 587),
      secure: toBoolean(process.env.MAILING_SECURE),
      auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASSWORD,
      },
    },
    useVercelFlags: toBoolean(process.env.USE_VERCEL_FLAGS),
    flags: {
      "show-contact-form": getToFlag(toBoolean(process.env.FLAG_SHOW_CONTACT_FORM)),
    },
  };
  if (config.environment === "test") {
    config.email.enabled = false;
    config.email.testAccount = false;
    config.baseUrl = "http://localhost/#/";
  }
  return config;
})();

export { configuration as config };
