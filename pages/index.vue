<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Changelog from "@/components/Changelog.vue";
import { useFlags } from "@/stores/flags-store.js";
import { toBrailleUnicode } from "@/utils/braille.js";
import { useLocalePath } from "#i18n";
import { useHead } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();
const flagsStore = useFlags();
const displayChangelog = computed(() => flagsStore.getFlag("displayChangelog"));

const STEPS = ["import", "adjust", "load"];
const EXPLORE_LINKS = [
  { path: "/settings", title: "header.nav.settings", text: "home.goto-settings" },
  { path: "/download", title: "download.title", text: "download.message2" },
  { path: "/faq", title: "faq.title", text: "faq.presentation" },
  { path: "/about", title: "about.title", text: "about.message1" },
];
const MARQUEE_WORDS = ["bnote", "braille", "eurobraille", "settings"];
const EUROBRAILLE_URL = "https://www.eurobraille.fr/";

const manifestoWords = computed(() => t("home.message2").split(" "));
const marqueeItems = computed(() => MARQUEE_WORDS.map((word) => ({ word, braille: toBrailleUnicode(word) })));

useHead({
  title: () => `${t("home.title")} | ${t("title")}`,
});
</script>

<template>
  <div class="home">
    <section class="hero on-inverse" aria-labelledby="home-title">
      <PinField word="bnote" />
      <div class="hero-inner container">
        <div class="hero-meta index-label reveal">
          <span aria-hidden="true">(01)</span>
          <span>{{ t('home.hero.eyebrow') }}</span>
          <EurobrailleLogo class="hero-logo" />
        </div>

        <h1 id="home-title" class="home-title">
          <span class="line-mask"><span class="line">{{ t('home.hero.title-start') }}</span></span>
          <span class="line-mask home-title-accent-line"><span class="line" style="--line-index: 1"><span class="highlight home-title-accent">{{ t('home.hero.title-accent') }}</span></span></span>
          <span class="line-mask"><span class="line" style="--line-index: 2">{{ t('home.hero.title-end') }}</span></span>
        </h1>

        <div class="hero-bottom">
          <p class="hero-lead reveal" style="--reveal-index: 4">{{ t('home.message-1') }}</p>
          <div class="hero-actions reveal" style="--reveal-index: 5">
            <NuxtLink class="btn btn--primary home-link" :to="localePath('/settings')" data-magnetic>{{ t('home.goto-settings') }}</NuxtLink>
            <NuxtLink class="btn" :to="localePath('/download')" data-magnetic>{{ t('home.hero.secondary') }}</NuxtLink>
          </div>
        </div>

        <span class="hero-scroll index-label reveal" style="--reveal-index: 6" aria-hidden="true">
          {{ t('home.hero.scroll') }}
          <span class="hero-scroll-line"></span>
        </span>
      </div>
    </section>

    <div class="marquee-stack" aria-hidden="true">
      <div class="marquee marquee--back">
        <div class="marquee-track">
          <template v-for="group in 2" :key="group">
            <span v-for="item in marqueeItems" :key="`${group}-${item.word}`" class="marquee-item">
              <span class="marquee-word">{{ item.word }}</span>
              <span class="marquee-braille">{{ item.braille }}</span>
            </span>
          </template>
        </div>
      </div>
      <div class="marquee marquee--front">
        <div class="marquee-track">
          <template v-for="group in 2" :key="group">
            <span v-for="item in marqueeItems" :key="`${group}-${item.word}`" class="marquee-item">
              <EurobrailleLogo v-if="item.word === 'eurobraille'" decorative class="marquee-logo" />
              <span v-else class="marquee-word">{{ item.word }}</span>
              <span class="marquee-braille">{{ item.braille }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>

    <section class="manifesto container" aria-labelledby="home-intro-title">
      <div class="manifesto-heading">
        <h2 id="home-intro-title" class="section-label index-label">
          <span aria-hidden="true">(02)</span>
          {{ t('home.title2') }}
        </h2>
        <a class="manifesto-logo" :href="EUROBRAILLE_URL" target="_blank" rel="noopener">
          <EurobrailleLogo />
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p class="manifesto-text">
        <span class="sr-only">{{ t('home.message2') }}</span>
        <span aria-hidden="true">
          <span v-for="(word, index) in manifestoWords" :key="index" class="manifesto-word">{{ `${word} ` }}</span>
        </span>
      </p>
    </section>

    <section class="steps-section container" aria-labelledby="home-steps-title">
      <div class="steps-heading">
        <p class="section-label index-label"><span aria-hidden="true">(03)</span> {{ t('settings.page.how') }}</p>
        <h2 id="home-steps-title" class="display-title">{{ t('home.steps.title') }}</h2>
      </div>
      <ol class="steps">
        <li v-for="(step, index) in STEPS" :key="step" class="step" :style="{ '--step-index': index }">
          <span class="step-number numeral" aria-hidden="true">0{{ index + 1 }}</span>
          <div class="step-body">
            <h3 class="step-title">{{ t(`home.steps.${step}.title`) }}</h3>
            <p class="step-text">{{ t(`home.steps.${step}.text`) }}</p>
          </div>
          <BrailleWord :word="String.fromCharCode(97 + index)" size="large" class="step-braille" />
        </li>
      </ol>
    </section>

    <div class="translator-section">
      <div class="container" data-reveal>
        <BrailleTranslator />
      </div>
    </div>

    <section class="explore-section container" aria-labelledby="home-explore-title">
      <p class="section-label index-label"><span aria-hidden="true">(04)</span> {{ t('home.explore.title') }}</p>
      <h2 id="home-explore-title" class="sr-only">{{ t('home.explore.title') }}</h2>
      <ul class="explore">
        <li v-for="(link, index) in EXPLORE_LINKS" :key="link.path">
          <NuxtLink class="explore-row" :to="localePath(link.path)">
            <span class="explore-index index-label" aria-hidden="true">0{{ index + 1 }}</span>
            <span class="explore-title">{{ t(link.title) }}</span>
            <span class="explore-text">{{ t(link.text) }}</span>
            <span class="explore-arrow" aria-hidden="true">↗</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="displayChangelog" class="changelog-section container">
      <Changelog />
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: clamp(2rem, 5vh, 4rem);
  padding-top: calc(var(--header-height) + clamp(2rem, 6vh, 4rem));
  padding-bottom: calc(clamp(2rem, 5vh, 3rem) + var(--band-overlap) + 5vw);
  pointer-events: none;
}

.hero-inner a,
.hero-inner p {
  pointer-events: auto;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-6);
  color: var(--text-muted);
}

.hero-logo {
  --logo-height: 2.25rem;
  padding-left: var(--space-6);
  border-left: 1px solid var(--border);
}

.home-title {
  align-self: end;
  font-size: clamp(3rem, 1rem + 8.2vw, 10.5rem);
  line-height: 0.9;
  letter-spacing: -0.055em;
  color: var(--text);
}

.home-title-accent-line {
  padding-block: 0.07em 0.1em;
  margin-block: 0.16em 0.04em;
}

.home-title-accent {
  padding: 0 0.14em 0.02em;
  margin-left: -0.08em;
  color: var(--inverse-bg);
  border-radius: 0.06em;
}

.hero-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-8);
}

.hero-lead {
  max-width: 34rem;
  font-size: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
  line-height: 1.55;
  color: var(--text-muted);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.hero-actions .btn {
  min-height: 3.5rem;
  padding-inline: var(--space-8);
  border-radius: var(--radius-full);
}

.home-link::after {
  content: "→";
  transition: transform var(--transition-fast);
}

.home-link:hover::after {
  transform: translateX(4px);
}

.hero-scroll {
  position: absolute;
  right: clamp(1rem, 4vw, 2.5rem);
  top: 50%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-muted);
  writing-mode: vertical-rl;
}

.hero-scroll-line {
  position: relative;
  width: 1px;
  height: 4rem;
  overflow: hidden;
  background: var(--border);
}

.hero-scroll-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--accent);
  animation: scrollHint 2s var(--ease-in-out) infinite;
}

@keyframes scrollHint {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}

.home {
  --band-overlap: clamp(2.25rem, 1.5rem + 2vw, 3.5rem);
  overflow-x: clip;
}

.marquee-stack {
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--band-overlap));
}

.marquee {
  width: 110%;
  margin-left: -5%;
  overflow: hidden;
  padding-block: var(--space-5);
}

.marquee--front {
  position: relative;
  color: var(--text);
  background: var(--surface);
  border-block: 2px solid var(--border-strong);
  box-shadow: 0 1.5rem 3rem -1.5rem rgba(0, 0, 0, 0.45);
  transform: rotate(-2deg);
}

.marquee--back {
  position: absolute;
  top: 50%;
  left: 0;
  color: var(--inverse-bg);
  background: var(--accent-vivid);
  border-block: 2px solid var(--inverse-bg);
  transform: translateY(-50%) rotate(4.5deg);
}

.marquee--back .marquee-track {
  animation-direction: reverse;
  animation-duration: 55s;
}

.marquee--back .marquee-item {
  font-size: clamp(1.25rem, 0.8rem + 2vw, 2.5rem);
}

.marquee--back .marquee-braille {
  color: inherit;
  opacity: 0.6;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-6);
  padding-right: var(--space-12);
  font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.marquee-logo {
  --logo-height: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
}

.marquee-braille {
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--accent);
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

.section-label {
  display: flex;
  gap: var(--space-4);
  color: var(--text-muted);
}

.manifesto {
  display: grid;
  gap: var(--space-10);
  padding-block: clamp(3.5rem, 7vw, 6.5rem) clamp(5rem, 12vw, 10rem);
}

.manifesto-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.manifesto-logo {
  --logo-height: 3rem;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-5) var(--space-2) var(--space-2);
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  transition: border-color var(--transition-fast), transform 0.4s var(--ease-out);
}

.manifesto-logo:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.manifesto-text {
  max-width: 62rem;
  font-size: clamp(1.5rem, 0.9rem + 2.4vw, 3.25rem);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: var(--text);
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .manifesto-word {
      animation: wordIn linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 40%;
    }
  }
}

@keyframes wordIn {
  from { opacity: 0.15; }
  to { opacity: 1; }
}

.steps-section {
  display: grid;
  gap: var(--space-12);
  padding-bottom: clamp(5rem, 12vw, 10rem);
}

.steps-heading {
  display: grid;
  gap: var(--space-6);
}

.display-title {
  max-width: 14ch;
  font-size: clamp(2.5rem, 1.2rem + 5vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.steps {
  display: grid;
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  --braille-color: var(--accent);
  position: sticky;
  top: calc(var(--header-height) + 1.5rem + var(--step-index) * 1.25rem);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
  min-height: clamp(16rem, 38vh, 22rem);
  padding: clamp(1.75rem, 4vw, 3.5rem);
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.step:nth-child(2) {
  --text: var(--inverse-text);
  --text-muted: var(--inverse-muted);
  --braille-color: var(--accent-vivid);
  background: var(--inverse-bg);
  border-color: var(--inverse-bg);
}

.step:nth-child(3) {
  --text: var(--inverse-bg);
  --text-muted: var(--inverse-bg);
  --braille-color: var(--inverse-bg);
  background: var(--accent-vivid);
  border-color: var(--accent-vivid);
}

:root[data-color-scheme="blue-yellow"] .step:nth-child(3) {
  border: 2px solid var(--inverse-bg);
}

.step-number {
  align-self: start;
  font-size: clamp(4rem, 2rem + 8vw, 10rem);
  line-height: 0.8;
  color: var(--text);
}

.step-body {
  display: grid;
  gap: var(--space-4);
  max-width: 36rem;
}

.step-title {
  font-size: clamp(1.75rem, 1rem + 2.5vw, 3rem);
  letter-spacing: -0.035em;
  color: var(--text);
}

.step-text {
  font-size: 1.125rem;
  color: var(--text-muted);
}

.step-braille {
  color: var(--text-muted);
}

.translator-section {
  padding-block: clamp(5rem, 12vw, 10rem);
  background: var(--surface-2);
  border-block: 1px solid var(--border);
}

.explore-section {
  display: grid;
  gap: var(--space-10);
  padding-block: clamp(5rem, 12vw, 10rem);
}

.explore {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--border-strong);
}

.explore li {
  border-bottom: 1px solid var(--border-strong);
}

.explore-row {
  position: relative;
  display: grid;
  grid-template-columns: 4rem minmax(0, 1.2fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-6);
  padding: clamp(1.5rem, 3vw, 2.5rem) var(--space-4);
  color: var(--text);
  text-decoration: none;
  isolation: isolate;
  overflow: hidden;
  transition: color 0.4s var(--ease-out);
}

.explore-row::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--inverse-bg);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.5s var(--ease-out);
}

.explore-row:hover,
.explore-row:focus-visible {
  --text-muted: var(--inverse-muted);
  color: var(--inverse-text);
  text-decoration: none;
}

.explore-row:hover::before,
.explore-row:focus-visible::before {
  transform: scaleY(1);
}

.explore-index {
  color: var(--text-muted);
}

.explore-title {
  font-size: clamp(2rem, 1rem + 4vw, 5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.045em;
  transition: transform 0.5s var(--ease-out);
}

.explore-row:hover .explore-title {
  transform: translateX(1rem);
}

.explore-text {
  display: -webkit-box;
  overflow: hidden;
  font-size: 1rem;
  color: var(--text-muted);
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.explore-arrow {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.5rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  transition: transform 0.5s var(--ease-out), background 0.3s, color 0.3s;
}

.explore-row:hover .explore-arrow {
  color: var(--inverse-bg);
  background: var(--accent-vivid);
  border-color: var(--accent-vivid);
  transform: rotate(45deg);
}

.changelog-section {
  padding-bottom: clamp(3rem, 8vw, 6rem);
}

@media (max-width: 860px) {
  .hero-scroll {
    display: none;
  }

  .step {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }

  .step-braille {
    display: none;
  }

  .explore-row {
    grid-template-columns: 2.5rem minmax(0, 1fr) auto;
  }

  .explore-text {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
