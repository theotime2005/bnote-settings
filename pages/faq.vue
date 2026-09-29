<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { sendLog } from "@/utils/send-log-message-script.js";
import { useHead } from "#imports";

const { t, locale } = useI18n();

useHead({
  title: () => `${t("faq.title")} | ${t("title")}`,
});

const faq = ref(null);

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
  <div class="faq-container page container">
    <header class="faq-header">
      <p class="eyebrow reveal">B.note</p>
      <h1 class="faq-title reveal" style="--reveal-index: 1">{{ t('faq.title') }}</h1>
      <p class="faq-presentation reveal" style="--reveal-index: 2">{{ t('faq.presentation') }}</p>
    </header>

    <div v-if="faq && faq.length" class="faq-list">
      <article
        v-for="(item, index) in faq"
        :key="`faq-item-${index}`"
        class="faq-item"
      >
        <span class="faq-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="faq-body">
          <h2 class="faq-question">{{ item.question }}</h2>

          <div
            v-for="(element, subIndex) in item.answer"
            :key="`faq-answer-${index}-${subIndex}`"
            class="faq-answer-container"
          >
            <p v-if="typeof element === 'string'" class="faq-answer-text">{{ element }}</p>

            <ol v-else-if="Array.isArray(element)" class="faq-answer-list">
              <li
                v-for="(subElement, subElemIndex) in element"
                :key="`faq-subelement-${index}-${subIndex}-${subElemIndex}`"
                class="faq-answer-list-item"
              >
                {{ subElement }}
              </li>
            </ol>
          </div>
        </div>
      </article>
    </div>

    <p v-else class="faq-empty">{{ t('faq.nofaq') }}</p>
  </div>
</template>

<style scoped>
.faq-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
}

.faq-header {
  position: sticky;
  top: calc(var(--header-height) + var(--space-8));
  display: grid;
  gap: var(--space-4);
}

.faq-title {
  font-size: clamp(3rem, 2rem + 4vw, 5.5rem);
  line-height: 0.95;
}

.faq-presentation {
  font-size: 1.125rem;
  color: var(--text-muted);
}

.faq-list {
  border-top: 1.5px solid var(--border-strong);
}

.faq-item {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: var(--space-4);
  padding-block: clamp(1.5rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--border);
}

.faq-number {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
  padding-top: 0.35rem;
}

.faq-body {
  display: grid;
  gap: var(--space-3);
}

.faq-question {
  font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem);
  margin-bottom: var(--space-1);
}

.faq-answer-text {
  color: var(--text-muted);
  font-size: 1.0625rem;
}

.faq-answer-list {
  display: grid;
  gap: var(--space-2);
  padding-left: 0;
  list-style: none;
  counter-reset: faq-step;
}

.faq-answer-list-item {
  position: relative;
  padding-left: 2.5rem;
  color: var(--text-muted);
  counter-increment: faq-step;
}

.faq-answer-list-item::before {
  content: counter(faq-step);
  position: absolute;
  left: 0;
  top: 0.1rem;
  display: grid;
  place-items: center;
  width: 1.625rem;
  height: 1.625rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-contrast);
  background: var(--accent);
  border-radius: 50%;
}

.faq-empty {
  padding: var(--space-8);
  color: var(--text-muted);
  text-align: center;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
}

@media (max-width: 960px) {
  .faq-container {
    grid-template-columns: 1fr;
  }

  .faq-header {
    position: static;
  }
}

@media (max-width: 480px) {
  .faq-item {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
