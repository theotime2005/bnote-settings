<script>
import { sendLog } from "@/scripts/send-log-message-script.js";

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
  <div class="faq-container">
    <h1 class="faq-title">{{ $t('faq.title') }}</h1>
    <p class="faq-presentation">{{ $t('faq.presentation') }}</p>

    <div v-if="faq && faq.length">
      <article
        v-for="(item, index) in faq"
        :key="`faq-item-${index}`"
        class="faq-item"
      >
        <h2 class="faq-question">{{ item.question }}</h2>

        <div
          v-for="(element, subIndex) in item.answer"
          :key="`faq-answer-${index}-${subIndex}`"
          class="faq-answer-container"
        >
          <p v-if="typeof element === 'string'" class="faq-answer-text">{{ element }}</p>

          <ol v-else-if="Array.isArray(element)" class="faq-answer-list">
            <li v-for="(subElement, subElemIndex) in element"
                :key="`faq-subelement-${index}-${subIndex}-${subElemIndex}`"
                class="faq-answer-list-item">
              {{ subElement }}
            </li>
          </ol>
        </div>
      </article>
    </div>

    <p v-else class="faq-empty">{{ $t('faq.nofaq') }}</p>
  </div>
</template>

<style scoped>
.faq-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.faq-title {
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: inherit;
}

.faq-presentation {
  font-size: 1.125rem;
  color: #4b5563;
  text-align: center;
  margin-bottom: 2rem;
}

.faq-item {
  border-bottom: 1px solid #e5e7eb;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.faq-question {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.faq-answer-container {
  margin-left: 1rem;
}

.faq-answer-text {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.faq-answer-list {
  list-style-type: decimal;
  list-style-position: inside;
  margin-left: 1.5rem;
}

.faq-answer-list-item {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

.faq-empty {
  text-align: center;
  color: #6b7280;
}
</style>
