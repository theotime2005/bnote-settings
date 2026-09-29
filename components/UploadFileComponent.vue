<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useSettingsStore } from "@/stores/settingsStore.js";
import { sendLog } from "@/utils/send-log-message-script.js";

const emit = defineEmits(["file-uploaded"]);
const inputRef = ref(null);
const selectedFile = ref(null);
const isDragOver = ref(false);
const { t } = useI18n();

function handleFileUpload(event) {
  const files = event.target.files;
  selectedFile.value = files && files.length ? files[0] : null;
}

function handleDrop(event) {
  isDragOver.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
}

function removeFile() {
  selectedFile.value = null;
  if (inputRef.value) {
    try {
      inputRef.value.value = "";
    } catch {
      if (inputRef.value && inputRef.value.parentNode) {
        const clone = inputRef.value.cloneNode(true);
        inputRef.value.parentNode.replaceChild(clone, inputRef.value);
      }
    }
  }
}

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function uploadFile() {
  try {
    if (!selectedFile.value) return;
    const extension = selectedFile.value.name.split(".").pop();
    if (extension !== "bnote") {
      window.alert(t("uploadFile.incorrectFormatFile"));
      return;
    }

    const reader = new FileReader();
    reader.readAsText(selectedFile.value);

    reader.onloadend = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        useSettingsStore().loadSettings(config, selectedFile.value.name.split(".")[0]);
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
          ref="inputRef"
          type="file"
          accept=".bnote"
          required
          class="file-input focus-ring"
          @change="handleFileUpload"
        />
        <div class="file-drop-zone">
          <svg class="file-drop-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
            <path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="file-drop-text">{{ t('uploadFile.dragDrop') }}</p>
          <p class="file-drop-subtext">{{ t('uploadFile.orClick') }}</p>
        </div>
      </div>
      <div v-if="selectedFile" class="file-preview">
        <div class="file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
        </div>
        <button type="button" class="file-remove" :aria-label="t('uploadFile.remove')" @click="removeFile">×</button>
      </div>
      <button type="submit" class="btn btn--primary upload-button focus-ring" :disabled="!selectedFile">
        {{ t('uploadFile.show') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.upload-container {
  display: grid;
  gap: var(--space-4);
  padding: clamp(1.5rem, 3vw, 2rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.upload-title {
  font-size: 1.5rem;
}

.upload-form {
  display: grid;
  gap: var(--space-4);
}

.file-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-muted);
}

.file-input-wrapper {
  position: relative;
  padding: clamp(1.5rem, 4vw, 2.5rem) var(--space-4);
  background: var(--surface-2);
  border: 1.5px dashed var(--text-muted);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.file-input-wrapper:hover,
.file-input-wrapper.drag-over {
  border-color: var(--accent);
  border-style: solid;
  background: var(--accent-soft);
}

.file-input-wrapper:focus-within {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}

.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-drop-zone {
  display: grid;
  justify-items: center;
  gap: var(--space-1);
  text-align: center;
  pointer-events: none;
}

.file-drop-icon {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.875rem;
  margin-bottom: var(--space-2);
  color: var(--accent-contrast);
  background: var(--accent);
  border-radius: 50%;
}

.file-drop-text {
  font-weight: 600;
}

.file-drop-subtext {
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.file-info {
  display: grid;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  overflow-wrap: anywhere;
}

.file-size {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.file-remove {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.file-remove:hover {
  color: #ffffff;
  background: var(--danger);
  border-color: var(--danger);
}

.upload-button {
  justify-self: start;
}

@media (max-width: 640px) {
  .upload-button {
    justify-self: stretch;
  }
}
</style>
