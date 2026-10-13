<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const WORD = "bnote";
const NAME = [
  { character: "B", letterIndex: 0 },
  { character: ".", letterIndex: null },
  { character: "n", letterIndex: 1 },
  { character: "o", letterIndex: 2 },
  { character: "t", letterIndex: 3 },
  { character: "e", letterIndex: 4 },
];
const FRAME_DURATION = 260;
const IDLE_READ_INTERVAL = 8000;

const route = useRoute();
const rootRef = ref(null);
const offset = ref(0);
const isReading = ref(false);
let timer = null;
let idleTimer = null;
let host = null;
let loop = false;

const displayedWord = computed(() => `${WORD} `.slice(offset.value, offset.value + 2).padEnd(2, " "));

function isActiveLetter(letterIndex) {
  return isReading.value && letterIndex !== null && letterIndex >= offset.value && letterIndex < offset.value + 2;
}

function stop() {
  clearInterval(timer);
  timer = null;
  isReading.value = false;
  offset.value = 0;
}

function read(shouldLoop) {
  loop = shouldLoop;
  if (timer !== null || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  isReading.value = true;
  timer = setInterval(() => {
    const next = (offset.value + 1) % WORD.length;
    if (next === 0 && !loop) {
      stop();
      return;
    }
    offset.value = next;
  }, FRAME_DURATION);
}

function startLoop() {
  read(true);
}

function finishLoop() {
  loop = false;
}

function readWhenIdle() {
  if (document.visibilityState === "hidden") return;
  read(false);
}

onMounted(() => {
  host = rootRef.value?.parentElement;
  host?.addEventListener("pointerenter", startLoop);
  host?.addEventListener("focus", startLoop);
  host?.addEventListener("pointerleave", finishLoop);
  host?.addEventListener("blur", finishLoop);
  idleTimer = setInterval(readWhenIdle, IDLE_READ_INTERVAL);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(idleTimer);
  host?.removeEventListener("pointerenter", startLoop);
  host?.removeEventListener("focus", startLoop);
  host?.removeEventListener("pointerleave", finishLoop);
  host?.removeEventListener("blur", finishLoop);
});

watch(() => route?.path, () => read(false));

defineExpose({ offset, isReading, read });
</script>

<template>
  <span ref="rootRef" class="brand-mark" :class="{ 'brand-mark--reading': isReading }">
    <BrailleWord :word="displayedWord" size="small" class="brand-mark-cells" />
    <span class="sr-only">B.note</span>
    <span class="brand-mark-name" aria-hidden="true">
      <span
        v-for="(item, index) in NAME"
        :key="index"
        class="brand-mark-letter"
        :class="{ 'brand-mark-letter--active': isActiveLetter(item.letterIndex) }"
      >{{ item.character }}</span>
    </span>
  </span>
</template>

<style scoped>
.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-mark-cells {
  --braille-color: var(--accent);
  padding: var(--space-2);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-sm);
  transition: transform 0.4s var(--ease-out), background-color 0.3s var(--ease-out);
}

.brand-mark--reading .brand-mark-cells {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  transform: rotate(-6deg) scale(1.08);
}

.brand-mark-name {
  display: inline-flex;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.brand-mark-letter {
  display: inline-block;
  transition: transform 0.25s var(--ease-out), color 0.2s var(--ease-out);
}

.brand-mark-letter--active {
  color: var(--accent);
  transform: translateY(-3px);
}

@media (max-width: 480px) {
  .brand-mark-cells {
    display: none;
  }
}
</style>
