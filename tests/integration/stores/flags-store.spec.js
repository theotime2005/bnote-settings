import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { createError } from "h3";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFlags } from "@/stores/flags-store.js";

describe("useFlags Store", function() {
  let store;

  beforeEach(function() {
    setActivePinia(createPinia());
    store = useFlags();
  });

  describe("#fetchFlags", function() {
    it("should fetch flags successfully", async function() {
      // given
      const mockFlags = { showContactForm: { value: true } };
      registerEndpoint("/api/flags", function() {
        return mockFlags;
      });

      // when
      await store.fetchFlags();

      // then
      expect(store.flags).toEqual(mockFlags);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should handle API errors gracefully", async function() {
      // given
      registerEndpoint("/api/flags", function() {
        throw createError({ statusCode: 500, statusMessage: "Flags error" });
      });

      // when
      await store.fetchFlags();

      // then
      expect(store.flags).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toContain("Flags error");
    });

    it("should not refetch flags if they are already loaded", async function() {
      // given
      const mockFlags = { showContactForm: { value: true } };
      const handler = vi.fn(function() {
        return mockFlags;
      });
      registerEndpoint("/api/flags", handler);
      await store.fetchFlags();
      const firstCallCount = handler.mock.calls.length;

      // when
      await store.fetchFlags();
      const secondCallCount = handler.mock.calls.length;

      // then
      expect(firstCallCount).toBe(1);
      expect(secondCallCount).toBe(firstCallCount);
    });

    it("should track loading state during fetch", async function() {
      // given
      let resolveFetch;
      const pendingResponse = new Promise(function(resolve) {
        resolveFetch = resolve;
      });
      registerEndpoint("/api/flags", function() {
        return pendingResponse;
      });

      // when
      const fetchCall = store.fetchFlags();

      // then
      expect(store.loading).toBe(true);

      // when
      resolveFetch({ showContactForm: { value: true } });
      await fetchCall;

      // then
      expect(store.loading).toBe(false);
    });
  });

  describe("getFlag Getter", function() {
    it("should return a specific flag value", function() {
      // given
      store.flags = { showContactForm: { value: true }, anotherFlag: { value: false } };

      // when
      const contactFormFlag = store.getFlag("showContactForm");
      const anotherFlag = store.getFlag("anotherFlag");

      // then
      expect(contactFormFlag).toBe(true);
      expect(anotherFlag).toBe(false);
    });

    it("should return null if flag does not exist", function() {
      // given
      store.flags = { showContactForm: { value: true } };

      // when
      const result = store.getFlag("nonExistentFlag");

      // then
      expect(result).toBeNull();
    });

    it("should return null if flags are not loaded", function() {
      // when
      const result = store.getFlag("anyFlag");

      // then
      expect(result).toBeNull();
    });
  });
});
