<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useSettingsStore } from "~/stores/settingsStore.js";
import { sendLog } from "~/utils/send-log-message-script.js";

const emit = defineEmits(["file-uploaded"]);
const fileInput = ref(null);
const isDragOver = ref(false);
const { t } = useI18n();

function handleFileUpload(event) {
  fileInput.value = event.target.files[0];
}

function handleDrop(event) {
  isDragOver.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    fileInput.value = files[0];
  }
}

function removeFile() {
  fileInput.value = null;
  const fileInputElement = document.getElementById("select");
  if (fileInputElement) {
    const clone = fileInputElement.cloneNode(true);
    fileInputElement.parentNode.replaceChild(clone, fileInputElement);
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function uploadFile() {
  try {
    const extension = fileInput.value.name.split(".").pop();
    if (extension !== "bnote") {
      window.alert(t("uploadFile.incorrectFormatFile"));
      return;
    }

    const file = new FileReader();
    file.readAsText(fileInput.value);

    file.onloadend = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        useSettingsStore().loadSettings(config, fileInput.value.name.split(".")[0]);
        emit("file-uploaded");
      } catch (parseError) {
        window.alert(t("uploadFile.invalidFileContent"));
        sendLog({ fileName: "UploadFileComponent", functionName: "uploadFile", type: "error", log: parseError });
      }
    };
  } catch (error) {
    sendLog({ fileName: "UploadFileComponent", functionName: "uploadFile", type: "error", log: error });
  }
}
</script>

<template>
  <div class="upload-container">
    <h2 class="upload-title">{{ t('uploadFile.title') }}</h2>
    <form class="upload-form" @submit.prevent="uploadFile" @dragover.prevent @drop.prevent="handleDrop">
      <label for="select" class="file-label">{{ t('uploadFile.select') }}</label>
      <div class="file-input-wrapper" :class="{ 'drag-over': isDragOver }" @dragenter="isDragOver = true" @dragleave="isDragOver = false">
        <input
          id="select"
          :ref="fileInput"
          type="file"
          accept=".bnote"
          required
          class="file-input focus-ring"
          @change="handleFileUpload"
        />
        <div class="file-drop-zone">
          <div class="file-drop-icon">📁</div>
          <p class="file-drop-text">{{ t('uploadFile.dragDrop') }}</p>
          <p class="file-drop-subtext">{{ t('uploadFile.orClick') }}</p>
        </div>
      </div>
      <div v-if="fileInput" class="file-preview">
        <div class="file-info">
          <span class="file-name">{{ fileInput.name }}</span>
          <span class="file-size">{{ formatFileSize(fileInput.size) }}</span>
        </div>
        <button type="button" class="file-remove" :title="t('common.remove')" @click="removeFile">×</button>
      </div>
      <button type="submit" class="upload-button focus-ring" :disabled="!fileInput">
        {{ t('uploadFile.show') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.upload-container {
  width: fit-content;
  min-width: 300px;
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
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: 2rem;
  transition: var(--transition-base);
  background: var(--color-gray-50);
}

.file-input-wrapper input[type="file"] {
  padding: 0.5rem;
  width: 100%;
  cursor: pointer;
  color: inherit;
}

.file-input-wrapper input[type="file"]:hover {
  border-color: rgb(74, 222, 128);
  background-color: rgba(74, 222, 128, 0.1);
  font-weight: 500;
}

.file-input-wrapper.drag-over {
  border-color: var(--color-blue-500);
  background: var(--color-blue-50);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-drop-zone {
  pointer-events: none;
  text-align: center;
}

.file-drop-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.file-drop-text {
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 0.25rem;
}

.file-drop-subtext {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 500;
  color: var(--color-gray-800);
}

.file-size {
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

.file-remove {
  background: var(--color-red-500);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: var(--transition-base);
}

.file-remove:hover {
  background: var(--color-red-600);
  transform: scale(1.1);
}

.upload-button {
  width: fit-content;
  align-self: center;
  padding: 0.75rem 1.5rem;
  background-color: rgb(21, 128, 61);
  color: white;
  border: 2px solid rgb(21, 128, 61);
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-button:hover {
  background-color: transparent;
  color: rgb(134, 239, 172);
  border-color: rgb(134, 239, 172);
  transform: scale(0.98);
}

.upload-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.upload-button:disabled:hover {
  background-color: rgb(21, 128, 61);
  color: white;
  border-color: rgb(21, 128, 61);
}

.upload-button:focus {
  outline: 2px solid rgb(134, 239, 172);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .upload-container {
    min-width: auto;
    width: 100%;
  }

  .file-input-wrapper {
    padding: 1.5rem;
  }

  .upload-button {
    width: 100%;
  }
}
</style>
