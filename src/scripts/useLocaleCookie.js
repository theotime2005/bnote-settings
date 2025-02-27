import cookies from "js-cookie";

export const useLocaleCookie = {
  setLocaleCookie(locale) {
    cookies.set("locale", locale, { expires: 365 });
  },

  getLocaleCookie() {
    return cookies.get("locale");
  },
};
