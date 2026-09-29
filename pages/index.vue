<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Changelog from "@/components/Changelog.vue";
import { useFlags } from "@/stores/flags-store.js";
import { useLocalePath } from "#i18n";
import { useHead } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();
const flagsStore = useFlags();
const displayChangelog = computed(() => flagsStore.getFlag("displayChangelog"));

const STEPS = ["import", "adjust", "load"];
const EXPLORE_LINKS = [
  { path: "/download", title: "download.title", text: "download.message2" },
  { path: "/faq", title: "faq.title", text: "faq.presentation" },
  { path: "/about", title: "about.title", text: "about.message1" },
];

useHead({
  title: () => `${t("home.title")} | ${t("title")}`,
});
</script>

<template>
  <div class="home">
    <section class="hero container" aria-labelledby="home-title">
      <div class="hero-content">
        <p class="eyebrow reveal">{{ t('home.hero.eyebrow') }}</p>
        <h1 id="home-title" class="home-title reveal" style="--reveal-index: 1">{{ t('home.hero.title') }}</h1>
        <p class="lead reveal" style="--reveal-index: 2">{{ t('home.message-1') }}</p>
        <div class="hero-actions reveal" style="--reveal-index: 3">
          <NuxtLink class="btn btn--primary home-link" :to="localePath('/settings')">{{ t('home.goto-settings') }}</NuxtLink>
          <NuxtLink class="btn" :to="localePath('/download')">{{ t('home.hero.secondary') }}</NuxtLink>
        </div>
      </div>

      <figure class="hero-visual reveal" style="--reveal-index: 2">
        <div class="hero-device">
          <div class="hero-device-keys" aria-hidden="true">
            <span v-for="key in 8" :key="key"></span>
          </div>
          <BrailleWord word="bnote" size="large" animated class="hero-braille" />
          <div class="hero-device-cells" aria-hidden="true">
            <span v-for="cell in 20" :key="cell"></span>
          </div>
        </div>
        <figcaption class="hero-caption">{{ t('home.hero.caption') }}</figcaption>
      </figure>
    </section>

    <section class="home-section home-intro container" aria-labelledby="home-intro-title">
      <h2 id="home-intro-title" class="home-subtitle">{{ t('home.title2') }}</h2>
      <p class="home-intro-text">{{ t('home.message2') }}</p>
    </section>

    <section class="home-section container" aria-labelledby="home-steps-title">
      <div class="section-heading">
        <p class="eyebrow">{{ t('settings.page.how') }}</p>
        <h2 id="home-steps-title" class="home-subtitle">{{ t('home.steps.title') }}</h2>
      </div>
      <ol class="steps">
        <li v-for="(step, index) in STEPS" :key="step" class="step">
          <span class="step-number" aria-hidden="true">0{{ index + 1 }}</span>
          <h3 class="step-title">{{ t(`home.steps.${step}.title`) }}</h3>
          <p class="step-text">{{ t(`home.steps.${step}.text`) }}</p>
        </li>
      </ol>
    </section>

    <section class="home-section container" aria-labelledby="home-explore-title">
      <div class="section-heading">
        <h2 id="home-explore-title" class="home-subtitle">{{ t('home.explore.title') }}</h2>
      </div>
      <ul class="explore">
        <li v-for="link in EXPLORE_LINKS" :key="link.path">
          <NuxtLink class="explore-tile" :to="localePath(link.path)">
            <span class="explore-title">{{ t(link.title) }}</span>
            <span class="explore-text">{{ t(link.text) }}</span>
            <span class="explore-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="displayChangelog" class="home-section container">
      <Changelog />
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: clamp(3rem, 8vw, 6rem);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  padding-top: clamp(3rem, 8vw, 7rem);
  padding-bottom: clamp(3rem, 8vw, 6rem);
}

.hero-content {
  display: grid;
  gap: var(--space-6);
  justify-items: start;
}

.home-title {
  font-size: clamp(2.5rem, 1.4rem + 4.2vw, 5rem);
  line-height: 1;
  letter-spacing: -0.045em;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.home-link::after {
  content: "→";
  transition: transform var(--transition-fast);
}

.home-link:hover::after {
  transform: translateX(4px);
}

.hero-visual {
  display: grid;
  gap: var(--space-3);
}

.hero-device {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 2.5rem);
  justify-items: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  color: var(--inverse-text);
  background:
    radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--accent-vivid) 22%, transparent), transparent 60%),
    var(--inverse-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.hero-device::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.06;
  pointer-events: none;
}

.hero-device-keys {
  display: flex;
  gap: var(--space-2);
  width: 100%;
  justify-content: space-between;
}

.hero-device-keys span {
  flex: 1;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background: var(--inverse-surface);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.hero-braille {
  --braille-color: var(--accent-vivid);
  color: var(--inverse-muted);
  padding-block: var(--space-4);
}

.hero-device-cells {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 3px;
  width: 100%;
}

.hero-device-cells span {
  height: 1.25rem;
  border-radius: 3px;
  background: var(--inverse-surface);
}

.hero-device-cells span:nth-child(-n + 5) {
  background: color-mix(in srgb, var(--accent-vivid) 35%, var(--inverse-surface));
}

.hero-caption {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
}

.home-section {
  padding-block: clamp(2.5rem, 6vw, 5rem);
  border-top: 1px solid var(--border);
}

.home-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(1.5rem, 4vw, 4rem);
}

.home-intro-text {
  font-size: clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.section-heading {
  display: grid;
  gap: var(--space-3);
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
  list-style: none;
}

.step {
  display: grid;
  align-content: start;
  gap: var(--space-3);
  padding: clamp(1.5rem, 3vw, 2rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.step-number {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: var(--space-6);
}

.step-title {
  font-size: 1.375rem;
}

.step-text {
  color: var(--text-muted);
}

.explore {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
  list-style: none;
}

.explore li {
  display: flex;
}

.explore-tile {
  position: relative;
  display: grid;
  align-content: start;
  gap: var(--space-3);
  width: 100%;
  padding: clamp(1.5rem, 3vw, 2rem);
  padding-bottom: var(--space-16);
  color: var(--text);
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-base), color var(--transition-base), border-color var(--transition-base);
}

.explore-tile:hover {
  color: var(--bg);
  background: var(--text);
  border-color: var(--text);
  text-decoration: none;
}

.explore-title {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.explore-text {
  color: inherit;
  opacity: 0.75;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.explore-arrow {
  position: absolute;
  right: clamp(1.5rem, 3vw, 2rem);
  bottom: var(--space-6);
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.125rem;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  transition: transform var(--transition-base);
}

.explore-tile:hover .explore-arrow {
  transform: rotate(-45deg);
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .home-intro {
    grid-template-columns: 1fr;
  }

  .steps,
  .explore {
    grid-template-columns: 1fr;
  }
}
</style>
