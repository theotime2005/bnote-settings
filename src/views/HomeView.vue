<script>
export default {
  name: "HomeView",
};
</script>

<template>
  <h1>{{$t('homeTitle')}}</h1>
  <p>{{$t('home.message-1')}}</p>
  <RouterLink to="/settings">{{$t('home.goto-settings')}}</RouterLink>
</template>

<style scoped>

</style>
