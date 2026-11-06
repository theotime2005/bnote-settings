import { describe, expect, it } from "vitest";

import { getBrailleDots, isBrailleLetter, toBrailleUnicode } from "@/utils/braille.js";

describe("Unit | Utils | Braille", () => {
  describe("getBrailleDots", () => {
    it("should return the raised dots of a letter", () => {
      // when
      const dots = getBrailleDots("n");

      // then
      expect(dots).toEqual([1, 3, 4, 5]);
    });

    it("should ignore the case", () => {
      // when
      const dots = getBrailleDots("B");

      // then
      expect(dots).toEqual([1, 2]);
    });

    it("should return no dot for an unknown character", () => {
      // when
      const dots = getBrailleDots("é");

      // then
      expect(dots).toEqual([]);
    });
  });

  describe("isBrailleLetter", () => {
    it("should accept latin letters", () => {
      expect(isBrailleLetter("z")).toBe(true);
    });

    it("should reject other characters", () => {
      expect(isBrailleLetter("1")).toBe(false);
    });
  });

  describe("toBrailleUnicode", () => {
    it("should convert a word to unicode braille patterns", () => {
      // when
      const result = toBrailleUnicode("bnote");

      // then
      expect(result).toBe("⠃⠝⠕⠞⠑");
    });

    it("should convert spaces and unknown characters to blank cells", () => {
      // when
      const result = toBrailleUnicode("a 1");

      // then
      expect(result).toBe("⠁⠀⠀");
    });
  });
});
