<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  words: {
    type: Array,
    default: () => ["bnote"],
  },
});

const CELL_COUNT = 10;
const WORD_DURATION = 2400;
const MAX_TILT = 14;

const deviceRef = ref(null);
const wordIndex = ref(0);
const pressedKey = ref(null);
let timer = null;
let host = null;

const displayedText = computed(() => (props.words[wordIndex.value] || "").padEnd(CELL_COUNT, " ").slice(0, CELL_COUNT));

function setTilt(x, y) {
  deviceRef.value?.style.setProperty("--tilt-x", `${x}deg`);
  deviceRef.value?.style.setProperty("--tilt-y", `${y}deg`);
}

function handlePointerMove(event) {
  const rect = host.getBoundingClientRect();
  const ratioX = (event.clientX - rect.left) / rect.width - 0.5;
  const ratioY = (event.clientY - rect.top) / rect.height - 0.5;
  setTilt(-ratioY * MAX_TILT, ratioX * MAX_TILT);
}

function handlePointerLeave() {
  setTilt(0, 0);
}

function pressKey(key) {
  pressedKey.value = key;
  wordIndex.value = (wordIndex.value + 1) % props.words.length;
}

onMounted(() => {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  host = deviceRef.value?.parentElement;
  host?.addEventListener("pointermove", handlePointerMove);
  host?.addEventListener("pointerleave", handlePointerLeave);
  timer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % props.words.length;
  }, WORD_DURATION);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  host?.removeEventListener("pointermove", handlePointerMove);
  host?.removeEventListener("pointerleave", handlePointerLeave);
});

defineExpose({ wordIndex, displayedText });
</script>

<template>
  <div ref="deviceRef" class="device" aria-hidden="true">
    <div class="device-body">
      <div class="device-keys">
        <span
          v-for="key in 8"
          :key="key"
          class="device-key"
          :class="{ 'device-key--pressed': pressedKey === key }"
          @pointerdown="pressKey(key)"
          @pointerup="pressedKey = null"
          @pointerleave="pressedKey = null"
        ></span>
      </div>
      <div class="device-display">
        <BrailleWord :word="displayedText" class="device-braille" />
      </div>
      <div class="device-footer">
        <span class="device-brand">B.note</span>
        <span class="device-leds">
          <span></span>
          <span></span>
        </span>
      </div>
    </div>
    <div class="device-shadow"></div>
  </div>
</template>

<style scoped>
.device {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  position: relative;
  perspective: 1400px;
  width: 100%;
  max-width: 40rem;
}

.device-body {
  position: relative;
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  padding: clamp(1.25rem, 3vw, 2.25rem);
  color: var(--inverse-muted);
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--inverse-text) 10%, transparent), transparent 40%),
    var(--inverse-bg);
  border-radius: clamp(1.25rem, 3vw, 2rem);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--inverse-text) 12%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--inverse-text) 18%, transparent),
    inset 0 -6px 0 color-mix(in srgb, #000000 40%, transparent),
    0 40px 80px -30px rgba(0, 0, 0, 0.55);
  transform: rotateX(calc(18deg + var(--tilt-x))) rotateY(var(--tilt-y)) rotateZ(-4deg);
  transform-style: preserve-3d;
  transition: transform 0.6s var(--ease-out);
}

.device-keys {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: clamp(0.4rem, 1vw, 0.75rem);
}

.device-key {
  height: clamp(1.5rem, 3vw, 2.25rem);
  background: var(--inverse-surface);
  border-radius: 0.5rem;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 color-mix(in srgb, var(--inverse-text) 12%, transparent);
  cursor: pointer;
  transition: transform 0.15s var(--ease-out), box-shadow 0.15s var(--ease-out), background-color 0.2s;
}

.device-key:hover {
  background: color-mix(in srgb, var(--accent-vivid) 30%, var(--inverse-surface));
}

.device-key--pressed {
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.45);
  transform: translateY(3px);
}

.device-display {
  display: flex;
  justify-content: center;
  padding: clamp(0.75rem, 2vw, 1.25rem);
  overflow: hidden;
  background: #0b0d0c;
  border-radius: 0.75rem;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
}

.device-display .device-braille {
  --braille-color: var(--accent-vivid);
  --dot: clamp(0.3rem, 0.8vw, 0.5rem);
  --dot-gap: clamp(0.2rem, 0.5vw, 0.3rem);
  --cell-gap: clamp(0.45rem, 1.2vw, 0.8rem);
  color: var(--inverse-muted);
}

.device-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.device-brand {
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--inverse-text);
}

.device-leds {
  display: flex;
  gap: 0.4rem;
}

.device-leds span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--accent-vivid);
  box-shadow: 0 0 12px var(--accent-vivid);
  animation: blink 2.4s steps(2) infinite;
}

.device-leds span + span {
  background: var(--inverse-muted);
  box-shadow: none;
  animation: none;
}

.device-shadow {
  position: absolute;
  inset: auto 8% -12% 8%;
  z-index: -1;
  height: 30%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.35), transparent);
  filter: blur(12px);
}

@keyframes blink {
  50% { opacity: 0.3; }
}
</style>
