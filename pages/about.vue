<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import ReportContactForm from "@/components/ReportContactForm.vue";
import { useHead } from "#imports";

const { t } = useI18n();

useHead({
  title: () => `${t("about.title")} | ${t("title")}`,
});

const links = ref({
  github: {
    issues: {
      feature: "https://github.com/theotime2005/bnote-settings/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=",
      report: "https://github.com/theotime2005/bnote-settings/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=",
    },
    repos: "https://github.com/theotime2005/bnote-settings",
  },
});
</script>

<template>
  <div class="about-container page container">
    <header class="page-header">
      <p class="eyebrow reveal">B.note · Open source</p>
      <h1 class="about-title reveal" style="--reveal-index: 1">{{ t('about.title') }}</h1>
      <p class="about-text lead reveal" style="--reveal-index: 2">{{ t('about.message1') }}</p>
    </header>

    <div class="about-grid">
      <section class="about-section reveal" style="--reveal-index: 3">
        <h2 class="section-title">{{ t('about.contribution') }}</h2>
        <p class="about-text">{{ t('about.message2') }}</p>
        <div class="about-actions">
          <a :href="links.github.repos" class="about-link btn btn--primary">{{ t('about.github') }}</a>
        </div>
      </section>

      <section class="about-section reveal" style="--reveal-index: 4">
        <h2 class="section-title">{{ t('about.feature-bug') }}</h2>
        <p class="about-text">{{ t('about.message3') }}</p>
        <div class="link-container">
          <a :href="links.github.issues.feature" target="_blank" class="about-link link-arrow">{{ t('about.feature') }}</a>
          <a :href="links.github.issues.report" target="_blank" class="about-link link-arrow">{{ t('about.bug_report') }}</a>
        </div>
      </section>
    </div>

    <div class="about-contact">
      <ReportContactForm />
    </div>
  </div>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.section-title {
  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
}

.about-section .about-text {
  flex: 1;
  color: var(--text-muted);
}

.about-actions,
.link-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-6);
  margin-top: var(--space-2);
}

.about-contact {
  margin-top: clamp(3rem, 8vw, 6rem);
  padding-top: clamp(2.5rem, 6vw, 4rem);
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
