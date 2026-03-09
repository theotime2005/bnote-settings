<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div>
    <h2>{{ t("changelog.title") }}</h2>
    <iframe src="/api/changelog" width="100%" height="600px" frameborder="0" :title="t('changelog.aria')" sandbox="allow-same-origin"></iframe>
  </div>
</template>

<style scoped></style>
