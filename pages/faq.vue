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
  <div class="faq-container">
    <PageHero index="04" label="B.note" :title="t('faq.title')" title-class="faq-title" word="faq">
      <p class="faq-presentation">{{ t('faq.presentation') }}</p>
    </PageHero>

    <div v-if="faq && faq.length" class="faq-list page container">
      <article
        v-for="(item, index) in faq"
        :key="`faq-item-${index}`"
        class="faq-item"
        data-reveal
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

    <p v-else class="faq-empty page container">{{ t('faq.nofaq') }}</p>
  </div>
</template>

<style scoped>
.faq-list {
  display: grid;
}

.faq-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(1rem, 4vw, 4rem);
  padding-block: clamp(2rem, 5vw, 4rem);
  border-top: 1px solid var(--border-strong);
}

.faq-number {
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 2rem + 5vw, 7rem);
  font-style: italic;
  line-height: 0.8;
  color: var(--accent);
}

.faq-body {
  display: grid;
  gap: var(--space-4);
}

.faq-question {
  font-size: clamp(1.5rem, 1rem + 1.8vw, 2.5rem);
  line-height: 1.1;
  letter-spacing: -0.035em;
  margin-bottom: var(--space-2);
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

.faq-empty {
  color: var(--text-muted);
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .faq-item {
    grid-template-columns: 1fr;
  }
}
</style>
