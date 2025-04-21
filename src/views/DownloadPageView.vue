<script>
import { sendLog } from "@/scripts/send-log-message-script.js";

export default {
  name: "DownloadPageView",
  data() {
    return {
      links: {
        eurobraille: {
          download: "https://www.eurobraille.fr/supports-et-telechargements/produits-braille/b-note/",
          github: "https://github.com/devel-erb/bnote",
          sdcard: "https://www.eurobraille.fr/download/telecharger-le-fichier-image-de-la-carte-sd-3-3-0-b-note/",
        },
        theotime: {
          github: "https://github.com/theotime2005/bnote",
          releases: "https://github.com/theotime2005/bnote/releases",
        },
      },
      last_version: {},
    };
  },
  methods: {
    async get_last_version() {
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
        this.last_version["tag"] = version["tag_name"];
        this.last_version["file"] = version["assets"][0]["browser_download_url"];
      } catch (e) {
        sendLog({ fileName: "DownloadPage", functionName: "get_last_version", type: "error", log: e });
      }
    },
  },
  mounted() {
    this.get_last_version();
  },
};
</script>

<template>
  <div class="p-3">
    <div class="flex flex-col mb-3">
      <h1 class="text-3xl">{{ $t("download.title") }}</h1>
      <p>{{$t('download.message-1')}}
        <a :href="links.eurobraille.github" target="_blank">GitHub</a>.
      </p>

    </div>

    <div class="flex flex-col mt-3">
      <h2 class="text-3xl">{{ $t("download.eurobrailleTitle") }}</h2>
      <p>{{ $t("download.message2") }}</p>
      <a
        class="text-green-400 duration-200 transition-all hover:underline hover:text-green-300"
        :href="links.eurobraille.download"
        target="_blank"
        >{{ $t("download.downloadEurobraille") }}</a
      >
    </div>

        <div class="flex flex-col mt-3">
          <h2 class="text-3xl">{{$t('download.otherTitle')}}</h2>
          <p class="mb-3">{{$t('download.message3')}}
            <a :href="links.theotime.github" target="_blank">{{$t('download.message-3-1')}}</a>
            {{$t('download.message-3-2')}}
          </p>
          <a class="text-green-400 duration-200 transition-all hover:underline hover:text-green-300" :href="last_version['file']">{{$t('download.downloadOtherLast', {version: last_version['tag']})}}</a>
          <a class="text-green-400 duration-200 transition-all hover:underline hover:text-green-300" :href="links.theotime.releases" target="_blank">{{$t("download.releases")}}</a>
        </div>
  </div>
</template>
