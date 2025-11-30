<script setup>
import { useI18n } from "vue-i18n";

import packageInfo from "@/package.json";

const { t } = useI18n();
</script>

<template>
  <footer class="footer-container" :aria-label="t('footer.label')">
    <div class="footer-content">
      <div class="footer-messages">
        <p>{{ t('footer.message1') }}</p>
        <p>{{ t('footer.message2') }}</p>
      </div>
    </div>
    <LanguageComponent />
    <a class="footer-link" href="https://github.com/theotime2005/bnote-settings">{{ t('footer.code') }}</a>
    <p>{{ t('footer.version', { version: packageInfo.version }) }}</p>
  </footer>
</template>

<style scoped>
.footer-container {
  background-color: rgb(15, 23, 42);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border-top: 1px solid rgb(71, 85, 105);
}

.footer-content {
  display: flex;
}

.footer-messages {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer-link {
  color: rgb(74, 222, 128);
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: rgb(134, 239, 172);
  text-decoration: underline;
}
</style>
