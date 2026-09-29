<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { sendLog } from "@/utils/send-log-message-script.js";
import { useHead } from "#imports";

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
  <div class="download-container page container">
    <header class="download-section page-header">
      <p class="eyebrow reveal">B.note · Open source</p>
      <h1 class="download-title reveal" style="--reveal-index: 1">{{ t("download.title") }}</h1>
      <p class="lead reveal" style="--reveal-index: 2">{{ t('download.message-1') }}
        <a :href="links.eurobraille.github" target="_blank" class="download-link">GitHub</a>.
      </p>
    </header>

    <div class="download-grid">
      <section class="download-section download-card download-card--featured reveal" style="--reveal-index: 3">
        <span class="download-index" aria-hidden="true">01</span>
        <h2 class="download-title">{{ t("download.eurobrailleTitle") }}</h2>
        <p class="download-description">{{ t("download.message2") }}</p>
        <div class="download-actions">
          <a
            class="btn btn--primary"
            :href="links.eurobraille.download"
            target="_blank"
          >{{ t("download.downloadEurobraille") }}</a>
        </div>
      </section>

      <section class="download-section download-card reveal" style="--reveal-index: 4">
        <span class="download-index" aria-hidden="true">02</span>
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
          >
            {{ t('download.downloadOtherLast', { version: lastVersion['tag'] }) }}
          </a>
          <a class="link-arrow" :href="links.theotime.releases" target="_blank">
            {{ t("download.releases") }}
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.download-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.download-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.download-card--featured {
  --focus: var(--inverse-text);
  color: var(--inverse-text);
  background:
    radial-gradient(90% 70% at 100% 0%, color-mix(in srgb, var(--accent-vivid) 20%, transparent), transparent 60%),
    var(--inverse-bg);
  border-color: var(--inverse-bg);
}

.download-card--featured .download-title {
  color: var(--inverse-text);
}

.download-card--featured .download-description {
  color: var(--inverse-muted);
}

.download-card--featured .btn--primary {
  color: var(--inverse-bg);
  background: var(--inverse-text);
  border-color: var(--inverse-text);
}

.download-card--featured .btn--primary:hover {
  background: var(--accent-vivid);
  border-color: var(--accent-vivid);
}

:root[data-color-scheme="blue-yellow"] .download-card--featured .btn--primary:hover {
  background: var(--inverse-muted);
  border-color: var(--inverse-muted);
}

.download-index {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: var(--space-8);
}

.download-card--featured .download-index {
  color: var(--accent-vivid);
}

:root[data-color-scheme="blue-yellow"] .download-card--featured .download-index {
  color: var(--inverse-text);
}

.download-title {
  color: var(--text);
}

.download-card .download-title {
  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
}

.download-description {
  color: var(--text-muted);
  flex: 1;
}

.download-link {
  font-weight: 600;
}

.download-card--featured .download-link {
  color: var(--inverse-text);
}

.download-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-6);
  margin-top: var(--space-4);
}

@media (max-width: 768px) {
  .download-grid {
    grid-template-columns: 1fr;
  }
}
</style>
