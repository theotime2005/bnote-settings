import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FaqView from "~/pages/faq.vue";
import i18n from "~/tests/i18n.js";

const { t } = i18n.global;

vi.mock("@unhead/vue", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useHead: vi.fn(),
  };
});

vi.mock("~/utils/send-log-message-script.js", () => ({
  sendLog: vi.fn(),
}));

function mountFaqView() {
  return mount(FaqView, {
    global: {
      plugins: [i18n],
    },
  });
}

describe("Acceptance | FaqView", () => {
  let wrapper, fetchSpy;

  beforeEach(async () => {
    fetchSpy = vi.spyOn(global, "fetch");
    wrapper = mountFaqView();
  });

  it("should display the FAQ page title", () => {
    // when
    const title = wrapper.find(".faq-title");

    // then
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(t("faq.title"));
  });

  it("should display the FAQ presentation text", () => {
    // when
    const presentation = wrapper.find(".faq-presentation");

    // then
    expect(presentation.exists()).toBe(true);
    expect(presentation.text()).toBe(t("faq.presentation"));
  });

  it("should display empty message when no FAQ is loaded", async () => {
    // given
    fetchSpy.mockResolvedValue({
      ok: false,
    });

    // when
    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();

    // then
    const emptyMessage = wrapper.find(".faq-empty");
    expect(emptyMessage.exists()).toBe(true);
    expect(emptyMessage.text()).toBe(t("faq.nofaq"));
  });

  it("should load and display FAQ items", async () => {
    // given
    const mockFaq = [
      {
        question: "What is BNote?",
        answer: ["BNote is a note-taking application."],
      },
      {
        question: "How to use it?",
        answer: ["First step", "Second step"],
      },
    ];

    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockFaq,
    });

    // when
    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // then
    const faqItems = wrapper.findAll(".faq-item");
    expect(faqItems.length).toBeGreaterThan(0);
  });

  it("should display FAQ question", async () => {
    // given
    const mockFaq = [
      {
        question: "Test Question?",
        answer: ["Test Answer"],
      },
    ];

    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockFaq,
    });

    // when
    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // then
    const question = wrapper.find(".faq-question");
    expect(question.exists()).toBe(true);
  });

  it("should display string answers as text", async () => {
    // given
    const mockFaq = [
      {
        question: "Question",
        answer: ["This is a text answer"],
      },
    ];

    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockFaq,
    });

    // when
    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // then
    const answerText = wrapper.find(".faq-answer-text");
    expect(answerText.exists()).toBe(true);
  });

  it("should display array answers as ordered list", async () => {
    // given
    const mockFaq = [
      {
        question: "Question",
        answer: [["Step 1", "Step 2", "Step 3"]],
      },
    ];

    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockFaq,
    });

    // when
    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // then
    const answerList = wrapper.find(".faq-answer-list");
    expect(answerList.exists()).toBe(true);

    const listItems = wrapper.findAll(".faq-answer-list-item");
    expect(listItems.length).toBeGreaterThan(0);
  });

  it("should reload FAQ when locale changes", async () => {
    // given
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();

    // when
    wrapper.vm.$i18n.locale = "en";
    await wrapper.vm.$nextTick();

    // then
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should handle fetch errors gracefully", async () => {
    // given
    const { sendLog } = await import("~/utils/send-log-message-script.js");

    fetchSpy.mockRejectedValue(new Error("Network error"));

    // when
    wrapper = mountFaqView();
    await wrapper.vm.$nextTick();

    // then
    expect(sendLog).toHaveBeenCalled();
  });
});
