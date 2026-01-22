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
  };
  if (config.environment === "test") {
    config.email.enabled = false;
    config.email.testAccount = false;
    config.baseUrl = "http://localhost/#/";
  }
  return config;
})();

export { configuration as config };
