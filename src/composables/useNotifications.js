import { ref } from "vue";

const notifications = ref([]);
let notificationId = 0;

export function useNotifications() {
  function addNotification(notification) {
    const id = ++notificationId;
    const newNotification = {
      id,
      visible: true,
      dismissible: true,
      duration: 5000,
      ...notification,
    };

    notifications.value.push(newNotification);

    // Auto-remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value[index].visible = false;
      setTimeout(() => {
        notifications.value.splice(index, 1);
      }, 300); // Wait for animation
    }
  }

  function clearAll() {
    notifications.value.forEach(n => n.visible = false);
    setTimeout(() => {
      notifications.value.length = 0;
    }, 300);
  }

  // Convenience methods
  function success(message, options = {}) {
    return addNotification({ type: "success", message, ...options });
  }

  function error(message, options = {}) {
    return addNotification({ type: "error", message, ...options });
  }

  function warning(message, options = {}) {
    return addNotification({ type: "warning", message, ...options });
  }

  function info(message, options = {}) {
    return addNotification({ type: "info", message, ...options });
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}