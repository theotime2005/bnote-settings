<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import ReportContactForm from "@/components/ReportContactForm.vue";
import { useHead } from "#imports";

const { t, availableLocales } = useI18n();

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

const MIN_WEIGHT = 200;
const MAX_WEIGHT = 800;
const INFLUENCE_RADIUS = 280;
const COUNT_DURATION = 1400;

const heroRef = ref(null);
const statsRef = ref(null);
const isPointerActive = ref(false);
const stats = ref([
  { key: "year", value: 2024, display: 2024, suffix: "" },
  { key: "languages", value: availableLocales.length, display: availableLocales.length, suffix: "" },
  { key: "openSource", value: 100, display: 100, suffix: "%" },
]);

const titleWords = computed(() => t("about.title").split(" ").map((word) => word.split("")));

let letterElements = [];
let frame = null;
let observer = null;

function updateWeights(event) {
  isPointerActive.value = true;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    letterElements.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
      const proximity = Math.max(0, 1 - distance / INFLUENCE_RADIUS);
      letter.style.setProperty("--wght", Math.round(MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * proximity));
      letter.style.setProperty("--proximity", proximity.toFixed(3));
    });
  });
}

function resetWeights() {
  isPointerActive.value = false;
  cancelAnimationFrame(frame);
  letterElements.forEach((letter) => {
    letter.style.removeProperty("--wght");
    letter.style.removeProperty("--proximity");
  });
}

function countUp() {
  const start = performance.now();
  function step(now) {
    const progress = Math.min(1, (now - start) / COUNT_DURATION);
    const eased = 1 - Math.pow(1 - progress, 3);
    stats.value.forEach((stat) => {
      const from = stat.key === "year" ? 1990 : 0;
      stat.display = Math.round(from + (stat.value - from) * eased);
    });
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function handleSpotlight(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

onMounted(() => {
  letterElements = Array.from(heroRef.value?.querySelectorAll(".about-letter") || []);
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || typeof IntersectionObserver === "undefined") return;
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    countUp();
    observer.disconnect();
  }, { threshold: 0.4 });
  observer.observe(statsRef.value);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
});
</script>

<template>
  <div class="about-container">
    <section
      ref="heroRef"
      class="about-hero on-inverse"
      :class="{ 'about-hero--active': isPointerActive }"
      @pointermove="updateWeights"
      @pointerleave="resetWeights"
    >
      <div class="about-hero-inner container">
        <p class="about-hero-meta index-label reveal">
          <span aria-hidden="true">(05)</span>
          <span>Open source</span>
        </p>
        <h1 class="about-title" :aria-label="t('about.title')">
          <span class="about-title-letters" aria-hidden="true">
            <template v-for="(word, wordIndex) in titleWords" :key="wordIndex">
              <span class="about-word">
                <span
                  v-for="(letter, letterIndex) in word"
                  :key="letterIndex"
                  class="about-letter"
                  :style="{ '--i': wordIndex * 6 + letterIndex }"
                >{{ letter }}</span>
              </span>
              <template v-if="wordIndex < titleWords.length - 1">{{ " " }}</template>
            </template>
          </span>
        </h1>
        <div class="about-hero-footer reveal" style="--reveal-index: 3">
          <div class="about-intro">
            <p class="about-text">{{ t('about.message1') }}</p>
            <p class="about-credit">{{ t('about.redesign') }}</p>
          </div>
          <p class="about-hint index-label" aria-hidden="true">{{ t("about.hint") }}</p>
        </div>
      </div>
    </section>

    <dl ref="statsRef" class="about-stats container">
      <div v-for="stat in stats" :key="stat.key" class="about-stat" data-reveal>
        <dt class="about-stat-label">{{ t(`about.stats.${stat.key}`) }}</dt>
        <dd class="about-stat-value numeral">{{ stat.display }}{{ stat.suffix }}</dd>
      </div>
    </dl>

    <div class="about-grid page container">
      <section class="about-section" data-reveal @pointermove="handleSpotlight">
        <span class="about-section-index numeral" aria-hidden="true">A</span>
        <h2 class="section-title">{{ t('about.contribution') }}</h2>
        <p class="about-text">{{ t('about.message2') }}</p>
        <div class="about-actions">
          <a :href="links.github.repos" class="about-link btn btn--primary" data-magnetic>{{ t('about.github') }}</a>
        </div>
      </section>

      <section class="about-section" data-reveal @pointermove="handleSpotlight">
        <span class="about-section-index numeral" aria-hidden="true">B</span>
        <h2 class="section-title">{{ t('about.feature-bug') }}</h2>
        <p class="about-text">{{ t('about.message3') }}</p>
        <div class="link-container">
          <a :href="links.github.issues.feature" target="_blank" class="about-link link-arrow">{{ t('about.feature') }}</a>
          <a :href="links.github.issues.report" target="_blank" class="about-link link-arrow">{{ t('about.bug_report') }}</a>
        </div>
      </section>
    </div>

    <div class="about-contact container">
      <ReportContactForm />
    </div>
  </div>
</template>

<style scoped>
.about-hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  animation: heroWipe 0.9s var(--ease-in-out) both;
}

.about-hero::before {
  content: "";
  position: absolute;
  inset: -20%;
  z-index: -1;
  background: conic-gradient(from 180deg at 70% 60%, transparent, color-mix(in srgb, var(--accent-vivid) 18%, transparent), transparent 40%);
  filter: blur(40px);
  animation: slowSpin 24s linear infinite;
}

.about-hero-inner {
  display: grid;
  align-content: end;
  gap: clamp(2rem, 5vw, 3.5rem);
  min-height: clamp(34rem, 88vh, 54rem);
  padding-top: calc(var(--header-height) + clamp(3rem, 8vh, 5rem));
  padding-bottom: clamp(2.5rem, 6vw, 4.5rem);
}

.about-hero-meta {
  display: flex;
  gap: var(--space-6);
  color: var(--text-muted);
}

.about-title {
  font-size: clamp(3.5rem, 1rem + 9.5vw, 12rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: var(--text);
}

.about-word {
  display: inline-block;
  white-space: nowrap;
}

.about-letter {
  --wght: 700;
  --proximity: 0;
  display: inline-block;
  font-weight: var(--wght);
  color: color-mix(in srgb, var(--accent-vivid) calc(var(--proximity) * 100%), var(--text));
  transition: font-weight 0.35s var(--ease-out), color 0.35s var(--ease-out);
  animation: weightWave 2.4s var(--ease-in-out) both;
  animation-delay: calc(var(--intro-delay) + var(--i) * 45ms);
}

.about-hero--active .about-letter {
  --wght: 200;
  animation: none;
}

.about-hero-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-6);
}

.about-hero .about-text {
  max-width: 34rem;
  font-size: 1.25rem;
  color: var(--text-muted);
}

.about-intro {
  display: grid;
  gap: var(--space-3);
}

.about-credit {
  max-width: 34rem;
  font-size: 1rem;
  color: var(--text-muted);
}

.about-credit::before {
  content: "";
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: var(--space-3);
  vertical-align: middle;
  background: var(--accent-vivid);
  border-radius: 50%;
}

.about-hint {
  color: var(--text-muted);
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 auto;
  padding-block: clamp(3rem, 7vw, 6rem) 0;
}

.about-stat {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-6) 0 0;
  border-top: 1.5px solid var(--border-strong);
}

.about-stat + .about-stat {
  padding-left: var(--space-6);
  border-left: 1px solid var(--border);
}

.about-stat-label {
  color: var(--text-muted);
  font-weight: 600;
}

.about-stat-value {
  margin: 0;
  font-size: clamp(3rem, 1.5rem + 5vw, 7rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--text);
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.about-section {
  --mx: 50%;
  --my: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-height: clamp(22rem, 44vh, 30rem);
  padding: clamp(1.75rem, 4vw, 3.5rem);
  overflow: hidden;
  isolation: isolate;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.about-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent-vivid) 28%, transparent), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s var(--ease-out);
}

.about-section:hover::before {
  opacity: 1;
}

.about-section-index {
  margin-bottom: auto;
  padding-bottom: var(--space-8);
  font-size: clamp(3rem, 2rem + 3vw, 5rem);
  line-height: 0.8;
  color: var(--accent);
}

.section-title {
  font-size: clamp(2rem, 1.2rem + 2.4vw, 3.5rem);
  letter-spacing: -0.04em;
}

.about-section:first-child {
  --text: var(--inverse-text);
  --text-muted: var(--inverse-muted);
  --accent: var(--accent-vivid);
  --accent-strong: var(--inverse-text);
  --accent-contrast: var(--inverse-bg);
  --focus: var(--inverse-text);
  color: var(--text);
  background: var(--inverse-bg);
  border-color: var(--inverse-bg);
}

.about-section .about-text {
  flex: 0;
  color: var(--text-muted);
}

.about-actions,
.link-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-6);
  margin-top: var(--space-2);
}

.about-contact {
  padding-bottom: clamp(4rem, 10vw, 8rem);
}

@keyframes weightWave {
  0% {
    font-weight: 200;
  }

  45% {
    font-weight: 800;
  }

  100% {
    font-weight: 700;
  }
}

@keyframes heroWipe {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0 0); }
}

@keyframes slowSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (hover: none) {
  .about-hint {
    display: none;
  }

  .about-letter {
    animation: weightWave 3.2s var(--ease-in-out) infinite alternate;
    animation-delay: calc(var(--intro-delay) + var(--i) * 90ms);
  }
}

@media (max-width: 768px) {
  .about-grid,
  .about-stats {
    grid-template-columns: 1fr;
  }

  .about-stat + .about-stat {
    padding-left: 0;
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-hero,
  .about-letter,
  .about-hero::before {
    animation: none;
  }
}
</style>
