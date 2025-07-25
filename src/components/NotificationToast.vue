<script>
export default {
  name: "NotificationToast",
  props: {
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
  },
  emits: ["close"],
  computed: {
    iconComponent() {
      const icons = {
        success: "CheckIcon",
        error: "XIcon",
        warning: "ExclamationIcon",
        info: "InfoIcon",
      };
      return icons[this.type] || "InfoIcon";
    },
  },
  mounted() {
    if (this.duration > 0) {
      setTimeout(() => {
        this.$emit("close");
      }, this.duration);
    }
  },
};
</script>

<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="visible"
        class="toast"
        :class="[`toast--${type}`, { 'toast--dismissible': dismissible }]"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="toast__icon">
          <component :is="iconComponent" />
        </div>
        <div class="toast__content">
          <h4 v-if="title" class="toast__title">{{ title }}</h4>
          <p class="toast__message">{{ message }}</p>
        </div>
        <button
          v-if="dismissible"
          class="toast__close"
          :aria-label="$t('common.close')"
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
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  max-width: 400px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  z-index: 1000;
}

.toast--success {
  border-left: 4px solid var(--color-green-500);
}

.toast--error {
  border-left: 4px solid var(--color-red-500);
}

.toast--warning {
  border-left: 4px solid var(--color-yellow-500);
}

.toast--info {
  border-left: 4px solid var(--color-blue-500);
}

.toast__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.toast--success .toast__icon {
  color: var(--color-green-500);
}

.toast--error .toast__icon {
  color: var(--color-red-500);
}

.toast--warning .toast__icon {
  color: var(--color-yellow-500);
}

.toast--info .toast__icon {
  color: var(--color-blue-500);
}

.toast__content {
  flex: 1;
}

.toast__title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 var(--space-1) 0;
  color: var(--color-gray-900);
}

.toast__message {
  font-size: 0.875rem;
  margin: 0;
  color: var(--color-gray-700);
  line-height: 1.4;
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-base);
}

.toast__close:hover {
  color: var(--color-gray-600);
  background-color: var(--color-gray-100);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .toast {
    left: var(--space-4);
    right: var(--space-4);
    max-width: none;
  }
}
</style>