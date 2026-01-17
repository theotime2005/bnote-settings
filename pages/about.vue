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
    <h1 class="about-title">{{ t('about.title') }}</h1>
    <p class="about-text">{{ t('about.message1') }}</p>

    <section class="about-section">
      <h2 class="section-title">{{ t('about.contribution') }}</h2>
      <p class="about-text">{{ t('about.message2') }}</p>
      <a :href="links.github.repos" class="about-link">{{ t('about.github') }}</a>
    </section>

    <section class="about-section">
      <h2 class="section-title">{{ t('about.feature-bug') }}</h2>
      <p class="about-text">{{ t('about.message3') }}</p>
      <div class="link-container">
        <a :href="links.github.issues.feature" target="_blank" class="about-link">{{ t('about.feature') }}</a>
        <a :href="links.github.issues.report" target="_blank" class="about-link">{{ t('about.bug_report') }}</a>
      </div>
    </section>
  </div>
  <ReportContactForm/>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.about-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: inherit;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: inherit;
}

.about-text {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.about-section {
  margin-top: 1.5rem;
}

.link-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
}

.about-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: rgb(74, 222, 128);
  border: 1px solid rgb(74, 222, 128);
  border-radius: 0.25rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.about-link:hover {
  background-color: rgb(74, 222, 128);
  color: black;
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .link-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .about-link {
    width: fit-content;
  }
}
</style>
