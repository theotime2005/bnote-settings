<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="loading-spinner" :class="{ 'loading-spinner--small': size === 'small', 'loading-spinner--large': size === 'large' }">
    <div class="loading-spinner__circle"></div>
    <span v-if="props.text" class="loading-spinner__text">{{ props.text }}</span>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.loading-spinner__circle {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner--small .loading-spinner__circle {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-spinner--large .loading-spinner__circle {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.loading-spinner__text {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-muted);
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
