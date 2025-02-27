import cookies from "js-cookie";

import { useLocaleCookie } from "@/scripts/useLocaleCookie";

describe("useLocaleCookie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets the locale cookie with the correct value and expiration", () => {
    // given
    const locale = "en";
    vi.spyOn(cookies, "set");

    // when
    useLocaleCookie.setLocaleCookie(locale);

    // then
    expect(cookies.set).toHaveBeenCalledWith("locale", locale, { expires: 365 });
  });

  it("gets the locale cookie value", () => {
    // given
    const locale = "en";
    cookies.get = vi.fn().mockReturnValue(locale);

    // when
    const result = useLocaleCookie.getLocaleCookie();

    // then
    expect(result).toBe(locale);
    expect(cookies.get).toHaveBeenCalledWith("locale");
  });

  it("returns undefined if the locale cookie is not set", () => {
    // given
    cookies.get = vi.fn().mockReturnValue(undefined);

    // when
    const result = useLocaleCookie.getLocaleCookie();

    // then
    expect(result).toBeUndefined();
    expect(cookies.get).toHaveBeenCalledWith("locale");
  });
});
