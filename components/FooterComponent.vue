<script setup>
import { useI18n } from "vue-i18n";

import packageInfo from "@/package.json";

const { t } = useI18n();
const currentYear = new Date().getFullYear();
const WORDMARK = ["B", ".", "n", "o", "t", "e"];
</script>

<template>
  <footer class="footer-container on-inverse" :aria-label="t('footer.label')">
    <div class="container footer-inner">
      <div class="footer-top">
        <div class="footer-messages">
          <p>{{ t('footer.message1') }}</p>
          <p>{{ t('footer.message2') }}</p>
        </div>
        <a class="footer-link" href="https://github.com/theotime2005/bnote-settings">{{ t('footer.code') }}</a>
      </div>

      <div class="footer-bottom">
        <LanguageComponent />
        <p class="footer-meta">{{ t('footer.version', { version: packageInfo.version }) }} · © {{ currentYear }}</p>
      </div>
    </div>

    <div class="footer-wordmark container" aria-hidden="true">
      <span v-for="(letter, index) in WORDMARK" :key="index" class="wordmark-letter">
        <BrailleWord :word="letter" size="large" class="wordmark-braille" />
        <span class="wordmark-glyph" :data-glyph="letter"><span class="wordmark-face">{{ letter }}</span></span>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer-container {
  position: relative;
  overflow: hidden;
  padding-top: clamp(4rem, 10vw, 8rem);
}

.footer-inner {
  display: grid;
  gap: clamp(3rem, 7vw, 5rem);
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-6);
}

.footer-messages {
  display: grid;
  gap: var(--space-2);
  max-width: 36rem;
  font-size: 1.125rem;
  color: var(--text-muted);
}

.footer-messages p:first-child {
  color: var(--text);
}

.footer-link {
  font-weight: 600;
  color: var(--text);
}

.footer-link::after {
  content: " ↗";
}

.footer-link:hover {
  color: var(--accent);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4) var(--space-8);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--border);
  font-size: 0.9375rem;
}

.footer-meta {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.footer-wordmark {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: clamp(3rem, 8vw, 6rem);
  padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
  user-select: none;
}

.wordmark-letter {
  display: grid;
  justify-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  cursor: default;
}

.wordmark-braille {
  --braille-color: var(--accent);
  opacity: 0;
  transform: translateY(1rem) scale(0.8);
  transition: opacity 0.35s var(--ease-out), transform 0.5s var(--ease-out);
}

.wordmark-glyph {
  display: grid;
  font-size: min(27vw, 25rem);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.06em;
}

.wordmark-glyph::before {
  grid-area: 1 / 1;
  visibility: hidden;
  content: attr(data-glyph);
}

.wordmark-face {
  grid-area: 1 / 1;
  justify-self: center;
  color: var(--text);
  transition: font-weight 0.5s var(--ease-out), color 0.3s var(--ease-out);
}

.wordmark-letter:hover .wordmark-braille {
  opacity: 1;
  transform: none;
}

.wordmark-letter:hover .wordmark-face {
  font-weight: 250;
  color: var(--accent);
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

}
</style>
