<script>
export default {
  name: 'DownloadDesktopComponent',
  data() {
    return {
      versionInformation: null
    }
  },
  methods: {
    async get_information() {
      try {
        const request = await fetch(
          'https://api.github.com/repos/theotime2005/bnote-settings/releases'
        )
        const response = await request.json()
        for (let i = 0; i < response.length; i++) {
          // Rajouter le filtrage du pre release ici
          this.versionInformation = response[i]
          break
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  mounted() {
    this.get_information()
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">{{ $t('desktop.title') }}</h2>
    <p class="text-lg mb-6">{{ $t('desktop.message') }}</p>

    <!-- Order Mac/arm, Mac:x, Windows -->
    <article class="space-y-6">
      <div v-if="versionInformation" class="border border-gray-200 p-4 rounded-lg">
        <h3 class="text-xl font-medium mb-2">{{ $t('desktop.macArm64') }}</h3>
        <a
            :href="versionInformation.assets[0].browser_download_url"
            class="text-blue-600 hover:underline"
        >
          {{ $t("desktop.downloadMacArm64", { version: versionInformation.tag_name }) }}
        </a>
      </div>

      <div v-if="versionInformation" class="border border-gray-200 p-4 rounded-lg">
        <h3 class="text-xl font-medium mb-2">{{ $t('desktop.macX64') }}</h3>
        <a
            :href="versionInformation.assets[1].browser_download_url"
            class="text-blue-600 hover:underline"
        >
          {{ $t("desktop.downloadMacX64", { version: versionInformation.tag_name }) }}
        </a>
      </div>

      <div v-if="versionInformation" class="border border-gray-200 p-4 rounded-lg">
        <h3 class="text-xl font-medium mb-2">{{ $t('desktop.windowsX64') }}</h3>
        <a
            :href="versionInformation.assets[2].browser_download_url"
            class="text-blue-600 hover:underline"
        >
          {{ $t("desktop.downloadWindowsX64", { version: versionInformation.tag_name }) }}
        </a>
      </div>

      <a
          href="https://github.com/theotime2005/bnote-settings/releases"
          class="text-blue-500 hover:underline"
          target="_blank"
      >
        {{$t('desktop.githubReleases')}}
      </a>
    </article>
  </div>
</template>

<style scoped></style>
