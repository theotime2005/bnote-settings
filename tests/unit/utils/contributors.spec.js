import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import { contributors } from "@/utils/contributors.js";

describe("Unit | Utils | Contributors", () => {
  it("should load file and return an array of contributors", async () => {
    // given
    registerEndpoint("/contributors.txt", function() {
      return "Albert Einstein\nMarie Curie\nIsaac Newton\n\nAda Lovelace\nNikola Tesla\n";
    });

    // when
    const result = await contributors();

    // then
    expect(result).toEqual([
      "Albert Einstein",
      "Marie Curie",
      "Isaac Newton",
      "Ada Lovelace",
      "Nikola Tesla",
    ]);
  });
});
