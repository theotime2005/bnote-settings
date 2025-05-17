<script>
import { sendLog } from "@/scripts/send-log-message-script.js";
import { useSettingsStore } from "@/stores/settingsStore.js";
export default {
  name: "UploadFileComponent",
  emits: ["file-uploaded"],
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
  <div class="upload-container">
    <h2 class="upload-title">{{ $t('uploadFile.title') }}</h2>
    <form class="upload-form" @submit.prevent="uploadFile">
      <label for="select" class="file-label">{{ $t('uploadFile.select') }}</label>
      <div class="file-input-wrapper">
        <input id="select" type="file" accept=".bnote" required @change="handleFileUpload" />
      </div>
      <button type="submit" class="upload-button">{{ $t('uploadFile.show') }}</button>
    </form>
  </div>
</template>

<style scoped>
.upload-container {
  width: fit-content;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: inherit;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-label {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.file-input-wrapper {
  position: relative;
}

.file-input-wrapper input[type="file"] {
  padding: 0.5rem;
  border: 1px dashed rgba(74, 222, 128, 0.6);
  border-radius: 0.25rem;
  background-color: rgba(74, 222, 128, 0.05);
  width: 100%;
  cursor: pointer;
  color: inherit;
}

.file-input-wrapper input[type="file"]:hover {
  border-color: rgb(74, 222, 128);
  background-color: rgba(74, 222, 128, 0.1);
}

.upload-button {
  width: fit-content;
  padding: 0.5rem 1rem;
  margin-top: 0.75rem;
  background-color: rgb(21, 128, 61);
  color: white;
  border: 1px solid rgb(21, 128, 61);
  border-radius: 0.25rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.upload-button:hover {
  background-color: transparent;
  color: rgb(134, 239, 172);
  border-color: rgb(134, 239, 172);
  transform: scale(0.98);
}

.upload-button:focus {
  outline: 2px solid rgb(134, 239, 172);
  outline-offset: 2px;
}
</style>
