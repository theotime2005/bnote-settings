<script>
import packageInfo from "@/../package.json";
import LanguageComponent from "@/components/LanguageComponent.vue";

export default {
  name: "FooterComponent",
  components: { LanguageComponent },
  data() {
    return {
      version: packageInfo.version,
    };
  },
};
</script>

<template>
  <footer class="footer-container" :aria-label="$t('footer.label')">
    <div class="footer-content">
      <div class="footer-messages">
        <p>{{ $t('footer.message1') }}</p>
        <p>{{ $t('footer.message2') }}</p>
      </div>
    </div>
    <LanguageComponent />
    <a class="footer-link" href="https://github.com/theotime2005/bnote-settings">{{ $t('footer.code') }}</a>
    <p>{{ $t('footer.version', {version: version}) }}</p>
  </footer>
</template>

<style scoped>
.footer-container {
  background-color: rgb(15, 23, 42); /* bg-slate-900 */
  padding: 0.5rem; /* p-2 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border-top: 1px solid rgb(71, 85, 105); /* border-t border-t-slate-600 */
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
  color: rgb(74, 222, 128); /* text-green-400 */
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: rgb(134, 239, 172); /* hover:text-green-300 */
  text-decoration: underline;
}
</style>
