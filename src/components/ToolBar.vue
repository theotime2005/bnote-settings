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
  gap: var(--space-2);
  padding: var(--space-2);
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
}

.toolbar button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-gray-300);
  background-color: var(--color-white);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  font-family: var(--font-family);
}

.toolbar button:hover {
  background-color: var(--color-gray-100);
}

.toolbar button:focus {
  outline: 2px solid var(--color-blue-500);
  outline-offset: 2px;
}
</style>
