<script setup>
import { useI18n } from "vue-i18n";

import packageInfo from "@/package.json";

const { t } = useI18n();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer-container" :aria-label="t('footer.label')">
    <div class="container footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <BrailleWord word="bnote" class="footer-braille" />
          <p class="footer-name">B.note</p>
        </div>
        <div class="footer-messages">
          <p>{{ t('footer.message1') }}</p>
          <p>{{ t('footer.message2') }}</p>
        </div>
      </div>

      <div class="footer-bottom">
        <LanguageComponent />
        <a class="footer-link" href="https://github.com/theotime2005/bnote-settings">{{ t('footer.code') }}</a>
        <p class="footer-meta">{{ t('footer.version', { version: packageInfo.version }) }} · © {{ currentYear }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-container {
  --focus: var(--inverse-text);
  color: var(--inverse-text);
  background: var(--inverse-bg);
  padding-block: clamp(3rem, 7vw, 5rem) var(--space-8);
}

.footer-inner {
  display: grid;
  gap: clamp(2.5rem, 6vw, 4rem);
}

.footer-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: var(--space-8);
  align-items: end;
}

.footer-brand {
  display: grid;
  gap: var(--space-4);
}

.footer-braille {
  --braille-color: var(--accent-vivid);
  color: var(--inverse-muted);
}

.footer-name {
  font-size: clamp(3rem, 2rem + 5vw, 6.5rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.05em;
}

.footer-messages {
  display: grid;
  gap: var(--space-2);
  font-size: 1.125rem;
  color: var(--inverse-muted);
  max-width: 34rem;
  justify-self: end;
}

.footer-messages p:first-child {
  color: var(--inverse-text);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4) var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid color-mix(in srgb, var(--inverse-text) 18%, transparent);
  font-size: 0.9375rem;
}

.footer-link {
  font-weight: 600;
  color: var(--inverse-text);
}

.footer-link::after {
  content: " ↗";
}

.footer-link:hover {
  color: var(--accent-vivid);
}

.footer-meta {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--inverse-muted);
}

:root[data-color-scheme="blue-yellow"] .footer-link:hover {
  color: var(--inverse-muted);
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
  }

  .footer-messages {
    justify-self: start;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
