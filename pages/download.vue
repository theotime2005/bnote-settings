<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { sendLog } from "@/utils/send-log-message-script.js";
import { definePageMeta, useHead } from "#imports";

definePageMeta({ heroTone: "light" });

const { t } = useI18n();

useHead({
  title: () => `${t("download.title")} | ${t("title")}`,
});

const links = ref({
  eurobraille: {
    download: "https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/",
    github: "https://github.com/devel-erb/bnote",
    sdcard: "https://www.eurobraille.fr/download/telecharger-le-fichier-image-de-la-carte-sd-3-3-0-b-note/",
  },
  theotime: {
    github: "https://github.com/theotime2005/bnote",
    releases: "https://github.com/theotime2005/bnote/releases",
  },
});
const lastVersion = ref({});

async function getLastVersion() {
  try {
    const request = await fetch("https://api.github.com/repos/theotime2005/bnote/releases");
    const response = await request.json();
    let version = null;
    for (let i = 0; i < response.length; i++) {
      if (response[i]["prerelease"] === false) {
        version = response[i];
        break;
      }
    }
    lastVersion.value["tag"] = version["tag_name"];
    lastVersion.value["file"] = version["assets"][0]["browser_download_url"];
  } catch (e) {
    sendLog({ fileName: "DownloadPage", functionName: "get_last_version", type: "error", log: e });
  }
}

onMounted(function() {
  getLastVersion();
});
</script>

<template>
  <div class="download-container">
    <section class="download-hero container">
      <div class="download-hero-text">
        <p class="index-label reveal">
          <span aria-hidden="true">(02)</span>
          <span>{{ t("header.nav.download") }}</span>
        </p>
        <h1 class="download-hero-title">
          <span class="line-mask"><span class="line">{{ t("download.title") }}</span></span>
        </h1>
        <p class="download-lead reveal" style="--reveal-index: 3">{{ t('download.message-1') }}
          <a :href="links.eurobraille.github" target="_blank" class="download-link">GitHub</a>.
        </p>
      </div>
      <BnoteDevice class="download-device" :words="['open', 'source', 'bnote', 'v3']" />
    </section>

    <div class="download-paths">
      <section class="download-section download-path on-inverse">
        <div class="download-path-head">
          <span class="numeral" aria-hidden="true">01</span>
          <EurobrailleLogo class="download-path-logo" decorative />
        </div>
        <h2 class="download-title">{{ t("download.eurobrailleTitle") }}</h2>
        <p class="download-description">{{ t("download.message2") }}</p>
        <div class="download-actions">
          <a
            class="btn btn--primary"
            :href="links.eurobraille.download"
            target="_blank"
            data-magnetic
          >{{ t("download.downloadEurobraille") }}</a>
        </div>
        <BrailleWord word="erb" class="download-path-mark" />
      </section>

      <section class="download-section download-path on-accent">
        <div class="download-path-head">
          <span class="numeral" aria-hidden="true">02</span>
          <span class="download-version numeral" aria-hidden="true">{{ lastVersion['tag'] || "v—" }}</span>
        </div>
        <h2 class="download-title">{{ t('download.otherTitle') }}</h2>
        <p class="download-description">{{ t('download.message3') }}
          <a :href="links.theotime.github" target="_blank" class="download-link">{{ t('download.message-3-1') }}</a>
          {{ t('download.message-3-2') }}
        </p>
        <div class="download-actions">
          <a
            v-if="lastVersion['file']"
            class="btn btn--primary"
            :href="lastVersion['file']"
            data-magnetic
          >
            {{ t('download.downloadOtherLast', { version: lastVersion['tag'] }) }}
          </a>
          <a class="link-arrow" :href="links.theotime.releases" target="_blank">
            {{ t("download.releases") }}
          </a>
        </div>
        <BrailleWord word="git" class="download-path-mark" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.download-container {
  overflow-x: clip;
}

.download-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(2rem, 4vw, 4rem);
  min-height: clamp(38rem, 92vh, 58rem);
  padding-top: calc(var(--header-height) + clamp(2rem, 6vh, 4rem));
  padding-bottom: clamp(3rem, 8vh, 5rem);
}

.download-hero::before {
  content: "";
  position: absolute;
  inset: 0 calc(50% - 50vw);
  z-index: -1;
  background-image: radial-gradient(circle, var(--border) 1.5px, transparent 2px);
  background-size: 22px 22px;
  mask-image: radial-gradient(70% 60% at 70% 50%, #000000, transparent);
}

.download-hero-text {
  display: grid;
  gap: var(--space-8);
}

.download-hero-text .index-label {
  display: flex;
  gap: var(--space-6);
  color: var(--text-muted);
}

.download-hero-title {
  font-size: clamp(2.75rem, 0.5rem + 5vw, 6rem);
  hyphens: auto;
  line-height: 0.88;
  letter-spacing: -0.06em;
  color: var(--text);
}

.download-lead {
  max-width: 30rem;
  font-size: 1.25rem;
  color: var(--text-muted);
}

.download-device {
  justify-self: center;
  animation: deviceIn 1.2s var(--ease-out) both;
  animation-delay: calc(var(--intro-delay) + 0.2s);
}

.download-paths {
  display: flex;
  min-height: clamp(34rem, 80vh, 48rem);
}

.download-path {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 0;
  padding: clamp(2rem, 5vw, 5rem);
  overflow: hidden;
  transition: flex-grow 0.8s var(--ease-in-out);
}

.download-path:hover,
.download-path:focus-within {
  flex-grow: 1.5;
}

.download-path-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: auto;
  padding-bottom: var(--space-12);
  font-size: 1.125rem;
}

.download-path-logo {
  --logo-height: clamp(2.25rem, 4vw, 3.5rem);
}

.download-version {
  flex-basis: 100%;
  font-size: clamp(2.5rem, 0.5rem + 5vw, 6rem);
  white-space: nowrap;
  line-height: 0.8;
  letter-spacing: -0.06em;
}

.download-title {
  max-width: 14ch;
  font-size: clamp(2.25rem, 1.2rem + 3vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: var(--text);
}

.download-description {
  max-width: 34rem;
  font-size: 1.125rem;
  color: var(--text-muted);
}

.download-link {
  font-weight: 700;
  color: inherit;
}

.download-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-6);
  margin-top: var(--space-2);
}

.on-inverse .btn--primary {
  color: var(--inverse-bg);
  background: var(--accent-vivid);
  border-color: var(--accent-vivid);
}

.on-inverse .btn--primary:hover {
  background: var(--inverse-text);
  border-color: var(--inverse-text);
}

.download-path .download-path-mark {
  --dot: clamp(0.75rem, 1.8vw, 1.5rem);
  --dot-gap: clamp(0.4rem, 0.9vw, 0.75rem);
  --cell-gap: clamp(1rem, 2.2vw, 1.75rem);
  position: absolute;
  top: clamp(8rem, 30%, 14rem);
  right: clamp(1.5rem, 4vw, 4rem);
  opacity: 0.18;
  transition: opacity 0.6s var(--ease-out), transform 0.8s var(--ease-out);
}

.download-path:hover .download-path-mark,
.download-path:focus-within .download-path-mark {
  opacity: 0.45;
  transform: translateY(-0.5rem) rotate(-6deg);
}

@keyframes deviceIn {
  from {
    opacity: 0;
    transform: translateY(3rem) scale(0.94);
  }
}

@media (max-width: 900px) {
  .download-hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .download-paths {
    flex-direction: column;
  }

  .download-path {
    min-height: 32rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .download-device {
    animation: none;
  }
}
</style>
