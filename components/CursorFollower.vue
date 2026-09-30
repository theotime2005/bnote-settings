<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const INTERACTIVE_SELECTOR = "a, button, input, select, textarea, label, summary, [role='button']";
const MAGNETIC_SELECTOR = "[data-magnetic]";
const MAGNETIC_STRENGTH = 0.3;

const isEnabled = ref(false);
const isHovering = ref(false);
const isPressed = ref(false);
const isVisible = ref(false);
const cursorRef = ref(null);

let target = { x: 0, y: 0 };
let position = { x: 0, y: 0 };
let frame = null;
let magneticElement = null;

function render() {
  position.x += (target.x - position.x) * 0.2;
  position.y += (target.y - position.y) * 0.2;
  if (cursorRef.value) {
    cursorRef.value.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
  }
  frame = requestAnimationFrame(render);
}

function releaseMagnetic() {
  if (magneticElement) {
    magneticElement.style.translate = "";
    magneticElement = null;
  }
}

function updateMagnetic(event) {
  const element = event.target.closest?.(MAGNETIC_SELECTOR);
  if (element !== magneticElement) {
    releaseMagnetic();
    magneticElement = element;
  }
  if (!magneticElement) return;
  const rect = magneticElement.getBoundingClientRect();
  const offsetX = (event.clientX - rect.left - rect.width / 2) * MAGNETIC_STRENGTH;
  const offsetY = (event.clientY - rect.top - rect.height / 2) * MAGNETIC_STRENGTH;
  magneticElement.style.translate = `${offsetX}px ${offsetY}px`;
}

function handlePointerMove(event) {
  if (event.pointerType !== "mouse") return;
  target = { x: event.clientX, y: event.clientY };
  if (!isVisible.value) {
    position = { ...target };
    isVisible.value = true;
  }
  isHovering.value = Boolean(event.target.closest?.(INTERACTIVE_SELECTOR));
  updateMagnetic(event);
}

function handlePointerDown() {
  isPressed.value = true;
}

function handlePointerUp() {
  isPressed.value = false;
}

function handlePointerLeave() {
  isVisible.value = false;
  releaseMagnetic();
}

onMounted(() => {
  const canHover = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || reducedMotion) return;

  isEnabled.value = true;
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointerup", handlePointerUp);
  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  frame = requestAnimationFrame(render);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  releaseMagnetic();
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerdown", handlePointerDown);
  window.removeEventListener("pointerup", handlePointerUp);
  document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
});

defineExpose({ isEnabled, isHovering });
</script>

<template>
  <div
    v-if="isEnabled"
    ref="cursorRef"
    class="cursor"
    :class="{
      'cursor--visible': isVisible,
      'cursor--hover': isHovering,
      'cursor--pressed': isPressed,
    }"
    aria-hidden="true"
  >
    <span class="cursor-ring">
      <span v-for="dot in 6" :key="dot" class="cursor-dot" :style="{ '--dot-index': dot }"></span>
    </span>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9500;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s var(--ease-out);
}

.cursor--visible {
  opacity: 1;
}

.cursor-ring {
  position: absolute;
  top: -1.25rem;
  left: -1.25rem;
  display: grid;
  grid-template-columns: repeat(2, 0.3rem);
  grid-template-rows: repeat(3, 0.3rem);
  grid-auto-flow: column;
  place-content: center;
  gap: 0.2rem;
  width: 2.5rem;
  height: 2.5rem;
  border: 1.5px solid var(--text);
  border-radius: 50%;
  transform: scale(0.45);
  transition: transform 0.45s var(--ease-out), background-color 0.3s var(--ease-out), border-color 0.3s var(--ease-out);
}

.cursor-dot {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s var(--ease-out), transform 0.3s var(--ease-out);
  transition-delay: calc(var(--dot-index) * 30ms);
}

.cursor--hover .cursor-ring {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  border-color: var(--accent);
  transform: scale(1.35);
}

.cursor--hover .cursor-dot {
  opacity: 1;
  transform: scale(1);
}

.cursor--pressed .cursor-ring {
  transform: scale(0.9);
}

:root[data-contrast="high"] .cursor {
  display: none;
}
</style>
