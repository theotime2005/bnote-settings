<script setup>
defineProps({
  decorative: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <img
    class="eurobraille-logo"
    src="/images/eurobraille-logo.svg"
    :alt="decorative ? '' : 'Eurobraille'"
    width="300"
    height="120"
    loading="lazy"
    decoding="async"
  />
</template>

<style scoped>
.eurobraille-logo {
  display: block;
  width: auto;
  max-width: none;
  height: var(--logo-height, 2.5rem);
}
</style>
