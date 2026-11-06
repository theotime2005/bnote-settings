<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "info",
    validator: (value) => ["success", "error", "warning", "info"].includes(value),
  },
  title: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    required: true,
  },
  dismissible: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(["close"]);

const icon = computed(() => {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  };
  return icons[props.type] || icons.info;
});

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      emit("close");
    }, props.duration);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="props.visible"
        class="toast"
        :class="[`toast--${type}`, { 'toast--dismissible': dismissible }]"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <span class="toast__icon" aria-hidden="true">{{ icon }}</span>
        <div class="toast__content">
          <h4 v-if="props.title" class="toast__title">{{ props.title }}</h4>
          <p class="toast__message">{{ props.message }}</p>
        </div>
        <button
          v-if="props.dismissible"
          class="toast__close"
          :aria-label="t('common.close')"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  --toast-color: var(--info);
  position: fixed;
  right: var(--space-6);
  bottom: var(--space-6);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  max-width: 26rem;
  padding: var(--space-4);
  color: var(--inverse-text);
  background: var(--inverse-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.toast--success {
  --toast-color: var(--accent-vivid);
}

.toast--error {
  --toast-color: #ff8a7a;
}

.toast--warning {
  --toast-color: #ffb86b;
}

.toast--info {
  --toast-color: #8ab4ff;
}

:root[data-color-scheme="blue-yellow"] .toast {
  --toast-color: var(--inverse-text);
}

.toast__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--inverse-bg);
  background: var(--toast-color);
  border-radius: 50%;
}

.toast__content {
  flex: 1;
  padding-top: 0.125rem;
}

.toast__title {
  margin-bottom: var(--space-1);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--inverse-text);
}

.toast__message {
  font-size: 0.9375rem;
  line-height: 1.45;
  color: var(--inverse-muted);
}

.toast__close {
  --focus: var(--inverse-text);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--inverse-muted);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.toast__close:hover {
  color: var(--inverse-text);
  background: var(--inverse-surface);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

@media (max-width: 768px) {
  .toast {
    left: var(--space-4);
    right: var(--space-4);
    bottom: var(--space-4);
    max-width: none;
  }
}
</style>
