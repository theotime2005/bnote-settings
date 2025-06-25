import cookies from "js-cookie";

export const useLocaleCookie = {
  setLocaleCookie(locale: string): void {
    cookies.set("locale", locale, { expires: 365 });
  },

  getLocaleCookie(): string | undefined {
    return cookies.get("locale");
  },

  removeCookie(): void {
    cookies.remove("locale");
  },
};