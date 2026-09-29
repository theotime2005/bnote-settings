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
  <div class="about-container">
    <PageHero index="05" label="Open source" :title="t('about.title')" title-class="about-title" word="info">
      <p class="about-text">{{ t('about.message1') }}</p>
    </PageHero>

    <div class="about-grid page container">
      <section class="about-section" data-reveal>
        <h2 class="section-title">{{ t('about.contribution') }}</h2>
        <p class="about-text">{{ t('about.message2') }}</p>
        <div class="about-actions">
          <a :href="links.github.repos" class="about-link btn btn--primary">{{ t('about.github') }}</a>
        </div>
      </section>

      <section class="about-section" data-reveal>
        <h2 class="section-title">{{ t('about.feature-bug') }}</h2>
        <p class="about-text">{{ t('about.message3') }}</p>
        <div class="link-container">
          <a :href="links.github.issues.feature" target="_blank" class="about-link link-arrow">{{ t('about.feature') }}</a>
          <a :href="links.github.issues.report" target="_blank" class="about-link link-arrow">{{ t('about.bug_report') }}</a>
        </div>
      </section>
    </div>

    <div class="about-contact container">
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
  min-height: clamp(20rem, 40vh, 28rem);
  padding: clamp(1.75rem, 4vw, 3.5rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.section-title {
  font-size: clamp(2rem, 1.2rem + 2.4vw, 3.5rem);
  letter-spacing: -0.04em;
}

.about-section:first-child {
  --text: var(--inverse-text);
  --text-muted: var(--inverse-muted);
  --accent: var(--accent-vivid);
  --accent-strong: var(--inverse-text);
  --accent-contrast: var(--inverse-bg);
  --focus: var(--inverse-text);
  color: var(--text);
  background: var(--inverse-bg);
  border-color: var(--inverse-bg);
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
  padding-bottom: clamp(4rem, 10vw, 8rem);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
