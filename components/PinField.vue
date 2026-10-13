<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import { getBrailleDots } from "@/utils/braille.js";

const props = defineProps({
  word: {
    type: String,
    default: "",
  },
  align: {
    type: String,
    default: "right",
    validator: (value) => ["right", "center"].includes(value),
  },
  spacing: {
    type: Number,
    default: 18,
  },
  introDelay: {
    type: Number,
    default: 0,
  },
});

const POINTER_RADIUS = 150;
const LEVELS = 6;
const PRELOADER_DURATION = 1500;
const MOBILE_WIDTH = 640;

const canvasRef = ref(null);
let context = null;
let pins = [];
let width = 0;
let height = 0;
let pointer = null;
let lastPointerMove = 0;
let frame = null;
let isVisible = false;
let startTime = 0;
let introOffset = 0;
let colors = { base: "#888", accent: "#3ddc84" };
let reducedMotion = false;
let resizeObserver = null;
let intersectionObserver = null;
let themeObserver = null;
let host = null;

function readColors() {
  const styles = getComputedStyle(canvasRef.value);
  colors = {
    base: styles.getPropertyValue("--pin-base").trim() || colors.base,
    accent: styles.getPropertyValue("--pin-accent").trim() || colors.accent,
  };
}

function computeBrailleDots() {
  const letters = props.word.split("");
  if (!letters.length) {
    return { centers: [], radius: 0 };
  }
  const count = letters.length;
  const cellGapRatio = 1.9;
  const isCentered = props.align === "center" || width < MOBILE_WIDTH;
  const maxWidth = width * (isCentered ? 0.86 : 0.4);
  const pitchFromWidth = maxWidth / (count + cellGapRatio * (count - 1) + 0.8);
  const pitchFromHeight = (height * 0.46) / 2.8;
  const pitch = Math.min(pitchFromWidth, pitchFromHeight);
  const radius = pitch * 0.4;
  const totalWidth = pitch * (count + cellGapRatio * (count - 1)) + radius * 2;
  const originX = isCentered ? (width - totalWidth) / 2 : width - totalWidth - width * 0.05;
  const verticalPosition = props.align === "center" ? 0.5 : 0.3;
  const originY = height * verticalPosition - pitch - radius;
  const centers = [];

  letters.forEach((letter, cellIndex) => {
    const raised = getBrailleDots(letter);
    for (let dot = 1; dot <= 6; dot++) {
      const column = dot > 3 ? 1 : 0;
      const row = (dot - 1) % 3;
      centers.push({
        x: originX + radius + cellIndex * pitch * (1 + cellGapRatio) + column * pitch,
        y: originY + radius + row * pitch,
        raised: raised.includes(dot),
        delay: cellIndex * 140 + row * 45 + column * 25,
      });
    }
  });

  return { centers, radius };
}

function buildPins() {
  const { centers, radius } = computeBrailleDots();
  const spacing = width < MOBILE_WIDTH ? props.spacing * 0.6 : props.spacing;
  const columns = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);
  const offsetX = (width - (columns - 1) * spacing) / 2;
  const offsetY = (height - (rows - 1) * spacing) / 2;
  pins = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = offsetX + column * spacing;
      const y = offsetY + row * spacing;
      let mask = 0;
      let delay = 0;
      for (const center of centers) {
        const distance = Math.hypot(center.x - x, center.y - y);
        if (distance < radius) {
          mask = center.raised ? 1 : 0.14;
          delay = center.delay;
          break;
        }
      }
      pins.push({ x, y, mask, delay, value: reducedMotion ? mask : 0 });
    }
  }
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas || !context) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  buildPins();
  draw(performance.now());
}

function targetFor(pin, elapsed, now) {
  let target = elapsed > pin.delay ? pin.mask : 0;

  if (pointer) {
    const distance = Math.hypot(pointer.x - pin.x, pointer.y - pin.y);
    if (distance < POINTER_RADIUS) {
      const falloff = 1 - distance / POINTER_RADIUS;
      target = Math.max(target, falloff * falloff * 1.1);
    }
  } else if (now - lastPointerMove > 1500) {
    const cycle = (now / 1000) % 6;
    const ringRadius = cycle * Math.max(width, height) * 0.3;
    const distance = Math.hypot(pin.x - width * 0.2, pin.y - height * 0.85);
    const ring = 1 - Math.abs(distance - ringRadius) / 50;
    if (ring > 0) {
      target = Math.max(target, ring * 0.45);
    }
  }

  return target;
}

function draw(now) {
  if (!context) return;
  const elapsed = now - startTime - props.introDelay - introOffset;
  const buckets = Array.from({ length: LEVELS }, () => []);

  for (const pin of pins) {
    if (!reducedMotion) {
      const target = targetFor(pin, elapsed, now);
      pin.value += (target - pin.value) * (target > pin.value ? 0.22 : 0.07);
    }
    const level = pin.value < 0.04 ? 0 : Math.min(LEVELS - 1, 1 + Math.floor(pin.value * (LEVELS - 1)));
    buckets[level].push(pin);
  }

  context.clearRect(0, 0, width, height);
  const baseRadius = 1.1;
  const maxRadius = Math.max(3.2, (width < MOBILE_WIDTH ? props.spacing * 0.6 : props.spacing) * 0.32);

  buckets.forEach((bucket, level) => {
    if (!bucket.length) return;
    const intensity = level / (LEVELS - 1);
    context.fillStyle = level === 0 ? colors.base : colors.accent;
    context.globalAlpha = level === 0 ? 0.28 : 0.3 + intensity * 0.7;
    context.beginPath();
    const radius = baseRadius + intensity * (maxRadius - baseRadius);
    for (const pin of bucket) {
      context.moveTo(pin.x + radius, pin.y);
      context.arc(pin.x, pin.y, radius, 0, Math.PI * 2);
    }
    context.fill();
  });
  context.globalAlpha = 1;
}

function loop(now) {
  draw(now);
  frame = isVisible && !document.hidden ? requestAnimationFrame(loop) : null;
}

function start() {
  if (reducedMotion || frame !== null) return;
  frame = requestAnimationFrame(loop);
}

function handlePointerMove(event) {
  const rect = canvasRef.value.getBoundingClientRect();
  pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  lastPointerMove = performance.now();
}

function handlePointerLeave() {
  pointer = null;
  lastPointerMove = performance.now();
}

function handleVisibilityChange() {
  if (!document.hidden && isVisible) start();
}

onMounted(() => {
  const canvas = canvasRef.value;
  context = canvas?.getContext?.("2d") || null;
  if (!context) return;

  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  startTime = performance.now();
  introOffset = document.documentElement.dataset.visited ? 0 : Math.max(0, PRELOADER_DURATION - startTime);
  host = canvas.parentElement;
  readColors();
  resize();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) start();
  });
  intersectionObserver.observe(canvas);

  themeObserver = new MutationObserver(() => {
    readColors();
    draw(performance.now());
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme", "data-contrast"] });

  host.addEventListener("pointermove", handlePointerMove);
  host.addEventListener("pointerleave", handlePointerLeave);
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  if (frame !== null) cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  themeObserver?.disconnect();
  host?.removeEventListener("pointermove", handlePointerMove);
  host?.removeEventListener("pointerleave", handlePointerLeave);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

watch(() => props.word, () => {
  startTime = performance.now();
  introOffset = 0;
  buildPins();
});
</script>

<template>
  <canvas ref="canvasRef" class="pin-field" aria-hidden="true"></canvas>
</template>

<style scoped>
.pin-field {
  --pin-base: var(--inverse-muted);
  --pin-accent: var(--accent-vivid);
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
