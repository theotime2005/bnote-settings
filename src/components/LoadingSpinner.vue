<template>
  <div class="loading-spinner" :class="{ 'loading-spinner--small': size === 'small', 'loading-spinner--large': size === 'large' }">
    <div class="loading-spinner__circle"></div>
    <span v-if="text" class="loading-spinner__text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

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
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-blue-500);
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
  font-size: 0.875rem;
  color: var(--color-gray-600);
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>