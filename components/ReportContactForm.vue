<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const REPORT_TYPE = {
  select: t("report-contact-form.report-type.select"),
  bug: t("report-contact-form.report-type.bug"),
  suggestion: t("report-contact-form.report-type.suggestion"),
};

const formData = ref({
  firstname: "",
  lastname: "",
  email: "",
  reportType: "select",
  subject: "",
  body: "",
});
const formIsSubmitted = ref(false);
const alertMessage = ref("");

async function handleSubmit() {
  alertMessage.value = "";
  if (formData.value.reportType === "select") {
    alertMessage.value = t("report-contact-form.report-type.select");
    return;
  }
  const { value } = formData;
  const payload = {
    firstname: value.firstname,
    lastname: value.lastname,
    email: value.email,
    reportType: value.reportType,
    subject: value.subject,
    body: value.body,
    language: locale.value,
  };
  const request = await fetch("/api/report-contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (request.ok) {
    formIsSubmitted.value = true;
  } else {
    alertMessage.value = t("report-contact-form.submit.error");
  }
}
</script>

<template>
  <h2>{{ t("report-contact-form.title") }}</h2>
  <p>{{ t("report-contact-form.question") }}</p>
  <form v-if="!formIsSubmitted" :aria-label="t('report-contact-form.form.title')" @submit.prevent="handleSubmit">
    <div id="personnal-informations">
      <h3>{{ t("report-contact-form.form.personnal-informations.title") }}</h3>
      <label for="firstname">{{ t("report-contact-form.form.personnal-informations.firstname") }}</label>
      <input id="firstname" v-model="formData.firstname" name="firstname" type="text" required>
      <label for="lastname">{{ t("report-contact-form.form.personnal-informations.lastname") }}</label>
      <input id="lastname" v-model="formData.lastname" name="lastname" type="text" required>
      <label for="email">{{ t("report-contact-form.form.personnal-informations.email") }}</label>
      <input id="email" v-model="formData.email" name="email" type="email" required>
    </div>
    <div id="body-informations">
      <h3>{{ t("report-contact-form.form.body-informations.title") }}</h3>
      <label for="report-type">{{ t("report-contact-form.form.body-informations.report-type") }}</label>
      <select id="report-type" v-model="formData.reportType" name="report-type" required>
        <option v-for="(value, key) in REPORT_TYPE" :key="key" :value="key">{{ value }}</option>
      </select>
      <label for="subject">{{ t("report-contact-form.form.body-informations.subject") }}</label>
      <input id="subject" v-model="formData.subject" name="subject" type="text" required>
      <label for="message">{{ t("report-contact-form.form.body-informations.message") }}</label>
      <textarea id="message" v-model="formData.body" name="message" required></textarea>
    </div>
    <p role="alert">{{ alertMessage }}</p>
    <button type="submit">{{ t("report-contact-form.form.submit") }}</button>
  </form>
  <p v-else id="success">{{ t("report-contact-form.submit.success") }}</p>
</template>

<style scoped>

</style>
