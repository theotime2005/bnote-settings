<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div class="changelog">
    <h2 class="changelog-title">{{ t("changelog.title") }}</h2>
    <iframe class="changelog-frame" src="/api/changelog" width="100%" height="600px" frameborder="0" :title="t('changelog.aria')" sandbox="allow-same-origin"></iframe>
  </div>
</template>

<style scoped>
.changelog {
  display: grid;
  gap: var(--space-6);
}

.changelog-frame {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
</style>
