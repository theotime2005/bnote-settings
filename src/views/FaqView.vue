<script>
import { sendLog } from "@/scripts/send-error-message-script.js";

export default {
  name: "FaqView",
  data() {
    return {
      faq: null,
    };
  },
  methods: {
    async loadFaq() {
      this.faq = null;
      const file_name = `faq/${this.$i18n.locale}.json`;
      try {
        const request = await fetch(file_name);
        if (request.ok) {
          this.faq = await request.json();
        }
      } catch (e) {
        sendLog({ fileName: "FaqView", functionName: "loadFaq", type: "error", log: e });
      }
    },
  },
  mounted() {
    this.loadFaq();
  },
  watch: {
    "$i18n.locale": {
      immediate: true,
      handler() {
        this.loadFaq();
      },
    },
  },
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-6">{{ $t("faq.title") }}</h1>
    <p class="text-lg text-gray-600 text-center mb-8">{{ $t("faq.presentation") }}</p>

    <div v-if="faq && faq.length">
      <article
        v-for="(item, index) in faq"
        :key="`faq-item-${index}`"
        class="border-b border-gray-200 py-4"
      >
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">{{ item.question }}</h2>

        <div
          v-for="(element, subIndex) in item.answer"
          :key="`faq-answer-${index}-${subIndex}`"
          class="ml-4"
        >
          <p v-if="typeof element === 'string'" class="text-base text-gray-700 mb-2">
            {{ element }}
          </p>

          <ol v-else-if="Array.isArray(element)" class="list-decimal list-inside ml-6">
            <li
              v-for="(subElement, subElemIndex) in element"
              :key="`faq-subelement-${index}-${subIndex}-${subElemIndex}`"
              class="text-base text-gray-700 mb-1"
            >
              {{ subElement }}
            </li>
          </ol>
        </div>
      </article>
    </div>

    <p v-else class="text-center text-gray-500">{{ $t("faq.nofaq") }}</p>
  </div>
</template>

<style scoped></style>
