<script>
export default {
  name: "HomeView",
};
</script>

<template>
  <div class="flex flex-col p-3">
    <h1 class="text-3xl mb-3">{{$t('home.title')}}</h1>

    <div class="flex flex-col text-justify">
      <p>{{$t('home.message-1')}}</p>
      <RouterLink class="text-left w-fit flex items-center justify-center text-green-400 rounded duration-200 transition-all hover:border-green-400 hover:text-green-200 hover:underline" to="/settings">{{$t('home.goto-settings')}}</RouterLink>
    </div>
    <div class="flex flex-col text-justify">
      <h2 class="text-2xl mt-5">{{$t('home.title2')}}</h2>
      <p>{{$t('home.message2')}}</p>
    </div>
  </div>
</template>
