<script setup>
defineProps({
  index: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleClass: {
    type: String,
    default: "",
  },
  word: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <section class="page-hero on-inverse">
    <PinField :word="word" />
    <div class="page-hero-inner container">
      <p class="page-hero-meta index-label reveal">
        <span aria-hidden="true">({{ index }})</span>
        <span>{{ label }}</span>
      </p>
      <h1 class="page-hero-title" :class="titleClass">
        <span class="line-mask"><span class="line">{{ title }}</span></span>
      </h1>
      <div v-if="$slots.default" class="page-hero-content reveal" style="--reveal-index: 3">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  animation: heroWipe 0.9s var(--ease-in-out) both;
}

.page-hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-8);
  min-height: clamp(26rem, 62vh, 40rem);
  align-content: end;
  padding-top: calc(var(--header-height) + clamp(3rem, 8vh, 5rem));
  padding-bottom: clamp(2.5rem, 6vw, 4.5rem);
  pointer-events: none;
}

.page-hero-inner :deep(a),
.page-hero-inner :deep(button),
.page-hero-content {
  pointer-events: auto;
}

.page-hero-meta {
  display: flex;
  gap: var(--space-6);
  color: var(--text-muted);
}

.page-hero-title {
  max-width: 12ch;
  font-size: clamp(2.75rem, 1rem + 6vw, 7.5rem);
  line-height: 0.9;
  letter-spacing: -0.055em;
  color: var(--text);
}

.page-hero-content {
  display: grid;
  gap: var(--space-4);
  max-width: 44rem;
  font-size: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
  color: var(--text-muted);
}

@keyframes heroWipe {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0 0); }
}

:root[data-visited] .page-hero {
  animation-duration: 0.7s;
}
</style>
