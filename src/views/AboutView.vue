<script>
export default {
  name: "AboutView",
};
</script>

<template>
  <h1>{{$t('about.title')}}</h1>
  <p>{{$t('about.message1')}}</p>
  <h2>{{$t('about.contribution')}}</h2>
  <p>{{$t('about.message2')}}</p>
  <a href="https://github.com/theotime2005/bnote-settings">{{$t('about.github')}}</a>
  <h2>{{$t('about.feature-bug')}}</h2>
  <p>{{$t('about.message3')}}</p>
  <a href='https://github.com/theotime2005/bnote-settings/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=' target="_blank">{{$t('about.feature')}}</a>
  <a href='https://github.com/theotime2005/bnote-settings/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=' target="_blank">{{$t('about.bug_report')}}</a>

</template>

<style scoped>

</style>
