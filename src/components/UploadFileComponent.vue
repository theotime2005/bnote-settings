<script>
import { sendLog } from "@/scripts/send-error-message-script.js";
import { useSettingsStore } from "@/stores/settingsStore.js";
export default {
  name: "UploadFileComponent",
  data() {
    return {
      fileInput: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.fileInput = event.target.files[0];
    },
    uploadFile() {
      try {
        const extension = this.fileInput.name.split(".").pop();
        if (extension !== "bnote") {
          window.alert(this.$t("uploadFile.incorrectFormatFile"));
          return;
        }

        const file = new FileReader();
        file.readAsText(this.fileInput);

        file.onloadend = (e) => {
          useSettingsStore().loadSettings(JSON.parse(e.target.result), this.fileInput.name.split(".")[0]);

          this.$emit("file-uploaded");
        };
      } catch (error) {
        sendLog({ fileName: "UploadFileComponent", functionName: "uploadFile", type: "error", log: error });
      }
    },
  },
};
</script>

<template>
  <div class="w-fit">
    <h2 class="text-3xl">{{$t('uploadFile.title')}}</h2>
    <form @submit.prevent="uploadFile" class="flex flex-col">
      <label for="select">{{$t('uploadFile.select')}}</label>
      <input type="file" id="select" @change="handleFileUpload" accept=".bnote" required />
      <button type="submit" class="w-fit p-2 rounded mt-2 bg-green-700 hover:bg-transparent hover:text-green-300 hover:scale-95 hover:border-green-300 border border-green-700 transition-all duration-200">{{$t('uploadFile.show')}}</button>
    </form>
  </div>
</template>
