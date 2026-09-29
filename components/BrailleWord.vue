<script setup>
import { computed } from "vue";

const BRAILLE_DOTS = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5],
  f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
  k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5],
  p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
};

// Cells are drawn as a 2x3 grid filled row by row, so dots are ordered 1-4 / 2-5 / 3-6.
const GRID_ORDER = [1, 4, 2, 5, 3, 6];

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  animated: {
    type: Boolean,
    default: false,
  },
});

const cells = computed(() => props.word
  .toLowerCase()
  .split("")
  .map((letter) => {
    const dots = BRAILLE_DOTS[letter] || [];
    return GRID_ORDER.map((dot) => dots.includes(dot));
  }));
</script>

<template>
  <span
    class="braille-word"
    :class="[`braille-word--${size}`, { 'braille-word--animated': animated }]"
    aria-hidden="true"
  >
    <span v-for="(cell, cellIndex) in cells" :key="cellIndex" class="braille-cell">
      <span
        v-for="(raised, dotIndex) in cell"
        :key="dotIndex"
        class="braille-dot"
        :class="{ 'braille-dot--raised': raised }"
        :style="{ '--dot-index': cellIndex * 6 + dotIndex }"
      ></span>
    </span>
  </span>
</template>

<style scoped>
.braille-word {
  --dot: 0.5rem;
  --dot-gap: 0.3rem;
  --cell-gap: 0.75rem;
  display: inline-flex;
  gap: var(--cell-gap);
}

.braille-word--small {
  --dot: 0.3125rem;
  --dot-gap: 0.1875rem;
  --cell-gap: 0.375rem;
}

.braille-word--large {
  --dot: clamp(0.75rem, 1.5vw, 1.25rem);
  --dot-gap: clamp(0.375rem, 0.8vw, 0.625rem);
  --cell-gap: clamp(1rem, 2.2vw, 1.75rem);
}

.braille-cell {
  display: grid;
  grid-template-columns: repeat(2, var(--dot));
  grid-template-rows: repeat(3, var(--dot));
  gap: var(--dot-gap);
}

.braille-dot {
  width: var(--dot);
  height: var(--dot);
  border-radius: 50%;
  background: currentColor;
  opacity: 0.14;
}

.braille-dot--raised {
  opacity: 1;
  background: var(--braille-color, currentColor);
}

.braille-word--animated .braille-dot--raised {
  animation: raise 0.7s var(--ease-out) both;
  animation-delay: calc(var(--dot-index) * 35ms + 200ms);
}

@keyframes raise {
  from {
    opacity: 0.14;
    transform: scale(0.4);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
