<script setup>
import { ref } from "vue";

defineProps({
  actions: { type: Array, required: true },
  ariaLabel: { type: String, default: "Barre d'outils" },
});

const toolbarRef = ref(null);

function onKeyDown(e) {
  const buttons = toolbarRef.value?.querySelectorAll("button");
  if (!buttons) return;

  const currentIndex = Array.from(buttons).indexOf(document.activeElement);

  if (e.key === "ArrowRight") {
    const next = (currentIndex + 1) % buttons.length;
    buttons[next].focus();
    e.preventDefault();
  }

  if (e.key === "ArrowLeft") {
    const prev = (currentIndex - 1 + buttons.length) % buttons.length;
    buttons[prev].focus();
    e.preventDefault();
  }
}
</script>

<template>
  <div
    ref="toolbarRef"
    role="toolbar"
    class="toolbar"
    :aria-label="ariaLabel"
    @keydown="onKeyDown"
  >
    <button
      v-for="(action, i) in actions"
      :key="action.label"
      :tabindex="i === 0 ? 0 : -1"
      @click="action.onClick()"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.toolbar button {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 var(--space-5);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text);
  background: transparent;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.toolbar button:hover {
  color: var(--bg);
  background: var(--text);
}

.toolbar button:first-child {
  color: var(--accent-contrast);
  background: var(--accent);
  border-color: var(--accent);
}

.toolbar button:first-child:hover {
  background: var(--accent-strong);
  border-color: var(--accent-strong);
}

.toolbar button:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}
</style>
