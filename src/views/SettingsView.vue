<script>
import UploadFileComponent from "@/components/UploadFileComponent.vue";
import all_settings from "@/settings.js";
import SettingComponent from "@/components/SettingComponent.vue";

export default {
  name: "SettingsView",
  components: {
    UploadFileComponent,
    SettingComponent,
  },
  data() {
    return {
      file_name: "",
      fileIsImported: false,
      settingsData: {},
      all_settings: all_settings,
      // menu variables
      display_menu: {
        system: false,
        main_menu: false,
        explorer: false,
        editor: false,
        music: false,
        speech: false,
        radio: false,
        agenda: false,
        braille_learning: false,
      },
    };
  },
  methods: {
    get_data() {
      this.settingsData = this.$refs.upload.fileData;
      const file_name = this.$refs.upload.fileInput.name;
      this.file_name = file_name.split(".")[0];
      this.fileIsImported = true;
      this.complete_empty_values();
    },
    clean_data() {
      const confirm = window.confirm("Voulez-vous vraiment effacer la configuration actuelle? Vous devrez importer un autre fichier.");
      if (confirm) {
        this.settingsData = {};
        this.fileIsImported = false;
      }
    },
    complete_empty_values() {
      // Check data and complete if there are not all values
      for (let section in this.all_settings) {
        for (let setting in this.all_settings[section]) {
          if (this.settingsData[section][setting] === undefined) {
            this.settingsData[section][setting] = this.all_settings[section][setting].default;
          }
        }
      }
    },
    createBasicData() {
      const data = {};
      for (let section in this.all_settings) {
        data[section] = {};
        for (let setting in this.all_settings[section]) {
          data[section][setting] = this.all_settings[section][setting].default;
        }
      }
      this.settingsData = data;
      this.file_name=this.$t("settingsPage.defaultName");
      this.fileIsImported = true;
    },
    togle_menu(key) {
      this.display_menu[key] = !this.display_menu[key];
    },
    save_new_value(section, key, new_value) {
      this.settingsData[section][key] = new_value;
    },
    save() {
      const question = window.confirm("Voulez-vous vraiment télécharger le fichier?");
      return question ? this.download_file() : null;
    },
    download_file() {
      const stringData = JSON.stringify(this.settingsData, null, 2);
      const blob_data = new Blob([stringData], { type: "application/json" });
      const url_object = URL.createObjectURL(blob_data);
      // Create link
      const link = document.createElement("a");
      link.href = url_object;
      const file_date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const file_name = this.$t("settingsPage.downloadName", { date: file_date })+".bnote";
      link.download = file_name;
      link.click();
      URL.revokeObjectURL(url_object);
    },
    // Méthode pour fermer tous les menus
    closeAllMenus() {
      for (let key in this.display_menu) {
        this.display_menu[key] = false;
      }
    },
    // Gestion de l'événement de touche "Escape"
    handleKeyPress(event) {
      if (event.key === "Escape") {
        this.closeAllMenus();
      }
    },
  },
  mounted() {
    // Ajoute l'écouteur pour détecter la touche "Escape"
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    // Retire l'écouteur lorsqu'on quitte le composant
    window.removeEventListener("keydown", this.handleKeyPress);
  },
};
</script>

<template>
  <div class="p-6 bg-gray-50">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ $t('settingsPage.title') }}</h1>

    <div v-if="!fileIsImported" class="bg-white p-4 rounded-md shadow-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ $t('settingsPage.how') }}</h2>
      <p class="text-gray-600 mb-4">{{ $t('settingsPage.explication') }}</p>
      <UploadFileComponent ref="upload" @file-uploaded="get_data" />
      <hr class="my-4 border-gray-300" />
      <button type="button" @click="createBasicData" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        {{ $t('settingsPage.create') }}
      </button>
    </div>

    <div v-if="fileIsImported" class="bg-white p-6 rounded-md shadow-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{file_name}}</h2>

      <form class="settings space-y-6" :aria-label="$t('settingsPage.title2')" @submit.prevent="save">
        <!-- system -->
        <div id="system" :aria-label="$t('settingsName.system')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.system') }}</h3>
          <button type="button" @click="togle_menu('system')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['system'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['system']">
            <SettingComponent v-for="setting in all_settings['system']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['system'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`system.${setting['id']}`"
                              @setting-change="save_new_value('system', setting['id'], $event)" />
          </div>
        </div>

        <!-- Explorer -->
        <div id="explorer" :aria-label="$t('settingsName.explorer')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.explorer') }}</h3>
          <button type="button" @click="togle_menu('explorer')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['explorer'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['explorer']">
            <SettingComponent v-for="setting in all_settings['explorer']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['explorer'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`explorer.${setting['id']}`"
                              @setting-change="save_new_value('explorer', setting['id'], $event)" />
          </div>
        </div>

        <!-- editor -->
        <div id="editor" :aria-label="$t('settingsName.editor')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.editor') }}</h3>
          <button type="button" @click="togle_menu('editor')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['editor'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['editor']">
            <SettingComponent v-for="setting in all_settings['editor']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['editor'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`editor.${setting['id']}`"
                              @setting-change="save_new_value('editor', setting['id'], $event)" />
          </div>
        </div>

        <!-- music -->
        <div id="music" :aria-label="$t('settingsName.music')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.music') }}</h3>
          <button type="button" @click="togle_menu('music')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['music'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div v-if="display_menu['music']">
            <h4 class="text-lg font-medium text-gray-600">{{ $t('settingsName.musicxml') }}</h4>
            <div class="setting">
              <SettingComponent v-for="setting in all_settings['music_xml']" :key="setting['id']"
                                :setting="setting"
                                :setting_value="settingsData['music_xml'][setting['id']]"
                                :name="$t(`settingsName.${setting['id']}`)"
                                :label_id="`music_xml.${setting['id']}`"
                                @setting-change="save_new_value('music_xml', setting['id'], $event)" />
            </div>
            <h4 class="text-lg font-medium text-gray-600 mt-4">{{ $t('settingsName.bxml') }}</h4>
            <div class="setting">
              <SettingComponent v-for="setting in all_settings['music_bxml']" :key="setting['id']"
                                :setting="setting"
                                :setting_value="settingsData['music_bxml'][setting['id']]"
                                :name="$t(`settingsName.${setting['id']}`)"
                                :label_id="`music_bxml.${setting['id']}`"
                                @setting-change="save_new_value('music_bxml', setting['id'], $event)" />
            </div>
          </div>
        </div>

        <div id="speech" :aria-label="$t('settingsName.speech')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.speech') }}</h3>
          <button type="button" @click="togle_menu('speech')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['speech'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['speech']">
            <SettingComponent v-for="setting in all_settings['speech']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['speech'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`speech.${setting['id']}`"
                              @setting-change="save_new_value('speech', setting['id'], $event)" />
          </div>
        </div>

        <!-- Audio -->
        <div id="audio" :aria-label="$t('settingsName.radio')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.radio') }}</h3>
          <button type="button" @click="togle_menu('radio')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['radio'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['radio']">
            <SettingComponent v-for="setting in all_settings['radio']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['radio'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`radio.${setting['id']}`"
                              @setting-change="save_new_value('radio', setting['id'], $event)" />
          </div>
        </div>

        <!-- Agenda -->
        <div id="agenda" :aria-label="$t('settingsName.agenda')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.agenda') }}</h3>
          <button type="button" @click="togle_menu('agenda')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['agenda'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['agenda']">
            <SettingComponent v-for="setting in all_settings['agenda']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['agenda'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`agenda.${setting['id']}`"
                              @setting-change="save_new_value('agenda', setting['id'], $event)" />
          </div>
        </div>

        <!-- Braille learning -->
        <div id="braille_learning" :aria-label="$t('settingsName.braille_learning')" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-700">{{ $t('settingsName.braille_learning') }}</h3>
          <button type="button" @click="togle_menu('braille_learning')" class="text-sm text-blue-500 hover:underline">
            {{ display_menu['braille_learning'] ? $t('settingsPage.hide') : $t('settingsPage.show') }}
          </button>
          <div class="setting" v-if="display_menu['braille_learning']">
            <SettingComponent v-for="setting in all_settings['braille_learning']" :key="setting['id']"
                              :setting="setting"
                              :setting_value="settingsData['braille_learning'][setting['id']]"
                              :name="$t(`settingsName.${setting['id']}`)"
                              :label_id="`braille_learning.${setting['id']}`"
                              @setting-change="save_new_value('braille_learning', setting['id'], $event)" />
          </div>
        </div>

        <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          {{ $t('settingsPage.download') }}
        </button>
      </form>

      <button type="button" @click="clean_data" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
        {{ $t('settingsPage.openOther') }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
