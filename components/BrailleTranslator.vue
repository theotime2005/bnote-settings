<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { isBrailleLetter, toBrailleUnicode } from "@/utils/braille.js";

const MAX_LENGTH = 12;

const { t } = useI18n();
const text = ref("");

const displayedWord = computed(() => (text.value || t("home.translator.placeholder")).slice(0, MAX_LENGTH));
const letters = computed(() => displayedWord.value.split("").map((character) => (isBrailleLetter(character) ? character : " ")));
const unicode = computed(() => toBrailleUnicode(displayedWord.value));
</script>

<template>
  <section class="translator" aria-labelledby="translator-title">
    <h2 id="translator-title" class="translator-title">
      {{ t('home.translator.title-start') }}
      <span class="translator-accent">{{ t('home.translator.title-accent') }}</span>
    </h2>

    <div class="translator-field">
      <label for="translator-input" class="translator-label index-label">{{ t('home.translator.label') }}</label>
      <input
        id="translator-input"
        v-model="text"
        class="translator-input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        :maxlength="MAX_LENGTH"
        :placeholder="t('home.translator.placeholder')"
        aria-describedby="translator-hint"
      />
      <p id="translator-hint" class="translator-hint">{{ t('home.translator.hint') }}</p>
    </div>

    <div class="translator-output">
      <div class="translator-cells" aria-hidden="true">
        <div v-for="(letter, index) in letters" :key="`${index}-${letter}`" class="translator-cell">
          <BrailleWord :word="letter" size="large" class="translator-braille" />
          <span class="translator-letter">{{ letter.trim() || "·" }}</span>
        </div>
      </div>
      <p class="translator-unicode" aria-live="polite">
        <span class="sr-only">{{ t('home.translator.output') }} : </span>{{ unicode }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.translator {
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
}

.translator-title {
  max-width: 16ch;
  font-size: clamp(2.5rem, 1.2rem + 5vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.translator-accent {
  display: block;
  font-weight: 300;
  color: var(--accent);
}

.translator-field {
  display: grid;
  gap: var(--space-3);
  max-width: 40rem;
}

.translator-label {
  color: var(--text-muted);
}

.translator-input {
  width: 100%;
  padding: 0 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: clamp(2rem, 1rem + 4vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text);
  background: transparent;
  border: 0;
  border-bottom: 2px solid var(--border-strong);
  border-radius: 0;
  transition: border-color var(--transition-fast);
}

.translator-input::placeholder {
  color: var(--text-muted);
  opacity: 0.45;
}

.translator-input:focus {
  outline: none;
  border-bottom-color: var(--accent);
}

.translator-input:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 6px;
}

.translator-hint {
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.translator-output {
  display: grid;
  gap: var(--space-5);
  min-width: 0;
}

.translator-cells {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1rem, 3vw, 2.5rem);
  min-height: 9rem;
}

.translator-cell {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  animation: cellIn 0.5s var(--ease-out) both;
}

.translator-braille {
  --braille-color: var(--accent);
}

.translator-letter {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.translator-unicode {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  word-break: break-all;
}

@media (min-width: 1024px) {
  .translator {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    column-gap: clamp(3rem, 6vw, 6rem);
  }

  .translator-title {
    grid-row: span 2;
  }
}

@keyframes cellIn {
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to { opacity: 1; transform: none; }
}
</style>
