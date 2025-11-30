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
  <div class="download-container">
    <div class="download-section">
      <h1 class="download-title">{{ t("download.title") }}</h1>
      <p>{{ t('download.message-1') }}
        <a :href="links.eurobraille.github" target="_blank" class="download-link">GitHub</a>.
      </p>
    </div>

    <div class="download-section">
      <h2 class="download-title">{{ t("download.eurobrailleTitle") }}</h2>
      <p>{{ t("download.message2") }}</p>
      <a
        class="download-link"
        :href="links.eurobraille.download"
        target="_blank"
      >{{ t("download.downloadEurobraille") }}</a>
    </div>

    <div class="download-section">
      <h2 class="download-title">{{ t('download.otherTitle') }}</h2>
      <p class="download-description">{{ t('download.message3') }}
        <a :href="links.theotime.github" target="_blank" class="download-link">{{ t('download.message-3-1') }}</a>
        {{ t('download.message-3-2') }}
      </p>
      <a
        v-if="lastVersion['file']"
        class="download-link"
        :href="lastVersion['file']"
      >
        {{ t('download.downloadOtherLast', { version: lastVersion['tag'] }) }}
      </a>
      <a class="download-link" :href="links.theotime.releases" target="_blank">
        {{ t("download.releases") }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.download-container {
  padding: 0.75rem;
  max-width: 800px;
  margin: 0 auto;
}

.download-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.download-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: inherit;
}

.download-description {
  margin-bottom: 0.75rem;
}

.download-link {
  color: rgb(74, 222, 128);
  transition: all 0.2s ease;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.download-link:hover {
  color: rgb(134, 239, 172);
  text-decoration: underline;
}
</style>
