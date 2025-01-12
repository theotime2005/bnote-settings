<script>
export default {
  name: "AboutView",
  data() {
    return {
      links: {
        github: {
          issues: {
            feature: "https://github.com/theotime2005/bnote-settings/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=",
            report: "https://github.com/theotime2005/bnote-settings/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=",
          },
          repos: "https://github.com/theotime2005/bnote-settings",
        },
      },
    };
  },
};
</script>

<template>
  <h1>{{$t('about.title')}}</h1>
  <p>{{$t('about.message1')}}</p>
  <h2>{{$t('about.contribution')}}</h2>
  <p>{{$t('about.message2')}}</p>
  <a :href="links.github.repos">{{$t('about.github')}}</a>
  <h2>{{$t('about.feature-bug')}}</h2>
  <p>{{$t('about.message3')}}</p>
  <a :href="links.github.issues.feature" target="_blank">{{$t('about.feature')}}</a>
  <a :href="links.github.issues.report" target="_blank">{{$t('about.bug_report')}}</a>

</template>

<style scoped>

</style>
