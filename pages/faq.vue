<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { sendLog } from "@/utils/send-log-message-script.js";
import { definePageMeta, useHead } from "#imports";

definePageMeta({ heroTone: "accent" });

const { t, locale } = useI18n();

useHead({
  title: () => `${t("faq.title")} | ${t("title")}`,
});

const faq = ref(null);
const query = ref("");

const normalizedQuery = computed(() => query.value.trim().toLowerCase());

const filteredFaq = computed(() => {
  if (!faq.value) return [];
  const items = faq.value.map((item, index) => ({ ...item, index }));
  if (!normalizedQuery.value) return items;
  return items.filter((item) => getSearchableText(item).includes(normalizedQuery.value));
});

function getAnswerElements(answer) {
  if (!answer) return [];
  return Array.isArray(answer) ? answer : Object.values(answer);
}

function getSearchableText(item) {
  return [item.question, ...getAnswerElements(item.answer).flat()].join(" ").toLowerCase();
}

function splitMatches(text) {
  if (!normalizedQuery.value) return [{ text, match: false }];
  const parts = [];
  const lowerText = text.toLowerCase();
  let cursor = 0;
  let found = lowerText.indexOf(normalizedQuery.value);
  while (found !== -1) {
    if (found > cursor) parts.push({ text: text.slice(cursor, found), match: false });
    parts.push({ text: text.slice(found, found + normalizedQuery.value.length), match: true });
    cursor = found + normalizedQuery.value.length;
    found = lowerText.indexOf(normalizedQuery.value, cursor);
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}

async function loadFaq() {
  faq.value = null;
  const fileName = `/faq/${locale.value}.json`;
  try {
    const request = await fetch(fileName);
    if (request.ok) {
      faq.value = await request.json();
    }
  } catch (e) {
    sendLog({ fileName: "FaqView", functionName: "loadFaq", type: "error", log: e });
  }
}

watch(locale, () => {
  loadFaq();
}, { immediate: true });

onMounted(() => {
  loadFaq();
});
</script>

<template>
  <div class="faq-container">
    <section class="faq-hero on-accent">
      <div class="faq-hero-inner container">
        <div class="faq-hero-top">
          <p class="index-label reveal">
            <span aria-hidden="true">(04)</span>
            <span>B.note</span>
          </p>
          <p v-if="faq && faq.length" class="faq-count reveal" aria-live="polite">
            <span class="faq-count-value numeral">{{ String(filteredFaq.length).padStart(2, "0") }}</span>
            <span>{{ t("faq.questions", filteredFaq.length) }}</span>
          </p>
        </div>

        <div class="faq-hero-main">
          <h1 class="faq-title">
            <span class="line-mask"><span class="line">{{ t('faq.title') }}</span></span>
          </h1>
          <div class="faq-hero-side reveal" style="--reveal-index: 3">
            <BrailleWord word="faq" size="large" class="faq-hero-braille" />
            <p class="faq-presentation">{{ t('faq.presentation') }}</p>
          </div>
        </div>

        <div v-if="faq && faq.length" class="faq-search reveal" style="--reveal-index: 4">
          <label for="faq-search" class="sr-only">{{ t("faq.search") }}</label>
          <svg class="faq-search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <input
            id="faq-search"
            v-model="query"
            type="search"
            class="faq-search-input"
            :placeholder="t('faq.searchPlaceholder')"
            autocomplete="off"
          />
        </div>
      </div>
    </section>

    <div v-if="faq && faq.length" class="faq-list page container">
      <details
        v-for="item in filteredFaq"
        :key="`faq-item-${item.index}`"
        class="faq-item"
        :open="Boolean(normalizedQuery)"
      >
        <summary class="faq-summary">
          <span class="faq-number numeral" aria-hidden="true">{{ String(item.index + 1).padStart(2, '0') }}</span>
          <h2 class="faq-question">
            <template v-for="(part, partIndex) in splitMatches(item.question)" :key="partIndex">
              <mark v-if="part.match" class="faq-match">{{ part.text }}</mark>
              <template v-else>{{ part.text }}</template>
            </template>
          </h2>
          <span class="faq-toggle" aria-hidden="true"></span>
        </summary>

        <div class="faq-body">
          <div
            v-for="(element, subIndex) in getAnswerElements(item.answer)"
            :key="`faq-answer-${item.index}-${subIndex}`"
            class="faq-answer-container"
          >
            <p v-if="typeof element === 'string'" class="faq-answer-text">
              <template v-for="(part, partIndex) in splitMatches(element)" :key="partIndex">
                <mark v-if="part.match" class="faq-match">{{ part.text }}</mark>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>

            <ol v-else-if="Array.isArray(element)" class="faq-answer-list">
              <li
                v-for="(subElement, subElemIndex) in element"
                :key="`faq-subelement-${item.index}-${subIndex}-${subElemIndex}`"
                class="faq-answer-list-item"
              >
                <template v-for="(part, partIndex) in splitMatches(subElement)" :key="partIndex">
                  <mark v-if="part.match" class="faq-match">{{ part.text }}</mark>
                  <template v-else>{{ part.text }}</template>
                </template>
              </li>
            </ol>
          </div>
        </div>
      </details>

      <p v-if="!filteredFaq.length" class="faq-no-result">{{ t("faq.noResult") }}</p>
    </div>

    <p v-else class="faq-empty page container">{{ t('faq.nofaq') }}</p>
  </div>
</template>

<style scoped>
.faq-container {
  overflow-x: clip;
}

.faq-hero {
  position: relative;
  overflow: hidden;
}

.faq-hero-inner {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  padding-top: calc(var(--header-height) + clamp(2rem, 5vh, 3.5rem));
  padding-bottom: clamp(2rem, 5vw, 4rem);
}

.faq-hero-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
}

.faq-hero-top .index-label {
  display: flex;
  gap: var(--space-6);
}

.faq-count {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-weight: 600;
}

.faq-count-value {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  line-height: 1;
}

.faq-hero-main {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: end;
  gap: clamp(1.5rem, 5vw, 5rem);
}

.faq-title {
  font-size: clamp(7rem, 3rem + 20vw, 22rem);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.07em;
  color: var(--text);
}

.faq-title .line-mask {
  padding-right: 0.12em;
  padding-bottom: 0.06em;
}

.faq-hero-side {
  display: grid;
  gap: var(--space-6);
  justify-items: start;
  max-width: 28rem;
  padding-bottom: 0.5rem;
}

.faq-hero-braille {
  --braille-color: var(--text);
  color: var(--text);
}

.faq-presentation {
  font-size: 1.1875rem;
  color: var(--text);
}

.faq-search {
  position: relative;
  display: flex;
  align-items: center;
  padding-inline: var(--space-3);
  border-bottom: 3px solid var(--text);
  border-radius: var(--radius-md, 0.5rem) var(--radius-md, 0.5rem) 0 0;
  transition: background-color 0.3s var(--ease-out);
}

.faq-search-icon {
  width: clamp(1.5rem, 1rem + 1.5vw, 2.5rem);
  height: clamp(1.5rem, 1rem + 1.5vw, 2.5rem);
  flex-shrink: 0;
}

.faq-search-input {
  flex: 1;
  min-width: 0;
  padding: var(--space-4) var(--space-4);
  font: inherit;
  font-size: clamp(1.375rem, 1rem + 1.8vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
  background: transparent;
  border: 0;
  outline: none;
}

.faq-search-input::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.faq-search-input::-webkit-search-cancel-button {
  appearance: none;
}

.faq-search:focus-within {
  background: color-mix(in srgb, #ffffff 22%, transparent);
  border-bottom-width: 6px;
}

.faq-list {
  display: grid;
  counter-reset: none;
}

.faq-item {
  border-top: 1px solid var(--border-strong);
}

.faq-item:last-of-type {
  border-bottom: 1px solid var(--border-strong);
}

.faq-summary {
  position: relative;
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 3vw, 2.5rem) var(--space-4);
  cursor: pointer;
  list-style: none;
  isolation: isolate;
}

.faq-summary::-webkit-details-marker {
  display: none;
}

.faq-summary::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--accent-vivid);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.5s var(--ease-in-out);
}

.faq-summary:hover::before,
.faq-summary:focus-visible::before {
  transform: scaleY(1);
  transform-origin: top;
}

.faq-summary:hover,
.faq-summary:focus-visible {
  color: var(--inverse-bg);
}

.faq-summary:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

.faq-number {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  color: var(--text-muted);
  transition: color 0.3s;
}

.faq-summary:hover .faq-number,
.faq-summary:focus-visible .faq-number {
  color: inherit;
}

.faq-question {
  font-size: clamp(1.375rem, 1rem + 1.4vw, 2.25rem);
  line-height: 1.15;
  letter-spacing: -0.035em;
  color: inherit;
  transition: transform 0.5s var(--ease-out);
}

.faq-summary:hover .faq-question {
  transform: translateX(0.75rem);
}

.faq-match {
  color: var(--inverse-bg);
  background: var(--accent-vivid);
  border-radius: 0.2em;
}

.faq-summary:hover .faq-match,
.faq-summary:focus-visible .faq-match {
  color: var(--accent-vivid);
  background: var(--inverse-bg);
}

.faq-toggle {
  position: relative;
  width: 3rem;
  height: 3rem;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  transition: transform 0.5s var(--ease-out), background-color 0.3s;
}

.faq-toggle::before,
.faq-toggle::after {
  content: "";
  position: absolute;
  inset: 50% auto auto 50%;
  width: 1rem;
  height: 2px;
  background: currentColor;
  transform: translate(-50%, -50%);
}

.faq-toggle::after {
  transform: translate(-50%, -50%) rotate(90deg);
  transition: transform 0.5s var(--ease-out);
}

.faq-item[open] .faq-toggle {
  transform: rotate(180deg);
}

.faq-item[open] .faq-toggle::after {
  transform: translate(-50%, -50%) rotate(0deg);
}

.faq-body {
  display: grid;
  gap: var(--space-4);
  max-width: 48rem;
  padding: 0 var(--space-4) clamp(2rem, 4vw, 3rem) calc(5rem + clamp(1rem, 3vw, 2.5rem) + var(--space-4));
  animation: answerIn 0.6s var(--ease-out) both;
}

.faq-answer-text {
  color: var(--text-muted);
  font-size: 1.125rem;
}

.faq-answer-list {
  display: grid;
  gap: var(--space-3);
  padding-left: 0;
  list-style: none;
  counter-reset: faq-step;
}

.faq-answer-list-item {
  position: relative;
  padding-left: 2.75rem;
  color: var(--text-muted);
  font-size: 1.0625rem;
  counter-increment: faq-step;
}

.faq-answer-list-item::before {
  content: counter(faq-step);
  position: absolute;
  left: 0;
  top: 0.05rem;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-contrast);
  background: var(--accent);
  border-radius: 50%;
}

.faq-no-result,
.faq-empty {
  padding-block: var(--space-8);
  color: var(--text-muted);
  font-size: 1.25rem;
}

@keyframes answerIn {
  from {
    opacity: 0;
    transform: translateY(-0.75rem);
  }
}

@media (max-width: 768px) {
  .faq-hero-main {
    grid-template-columns: 1fr;
  }

  .faq-summary {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .faq-number {
    grid-column: 1 / -1;
  }

  .faq-body {
    padding-left: var(--space-4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-body {
    animation: none;
  }
}
</style>
