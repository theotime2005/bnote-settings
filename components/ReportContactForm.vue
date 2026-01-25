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
    <fieldset id="personnal-informations">
      <legend>{{ t("report-contact-form.form.personnal-informations.title") }}</legend>
      <label for="firstname">{{ t("report-contact-form.form.personnal-informations.firstname") }}</label>
      <input id="firstname" v-model="formData.firstname" name="firstname" type="text" required>
      <label for="lastname">{{ t("report-contact-form.form.personnal-informations.lastname") }}</label>
      <input id="lastname" v-model="formData.lastname" name="lastname" type="text" required>
      <label for="email">{{ t("report-contact-form.form.personnal-informations.email") }}</label>
      <input id="email" v-model="formData.email" name="email" type="email" required>
    </fieldset>
    <fieldset id="body-informations">
      <legend>{{ t("report-contact-form.form.body-informations.title") }}</legend>
      <label for="report-type">{{ t("report-contact-form.form.body-informations.report-type") }}</label>
      <select id="report-type" v-model="formData.reportType" name="report-type" required>
        <option v-for="(value, key) in REPORT_TYPE" :key="key" :value="key">{{ value }}</option>
      </select>
      <label for="subject">{{ t("report-contact-form.form.body-informations.subject") }}</label>
      <input id="subject" v-model="formData.subject" name="subject" type="text" required>
      <label for="message">{{ t("report-contact-form.form.body-informations.message") }}</label>
      <textarea id="message" v-model="formData.body" name="message" required></textarea>
    </fieldset>
    <p role="alert">{{ alertMessage }}</p>
    <button type="submit">{{ t("report-contact-form.form.submit") }}</button>
  </form>
  <p v-else id="success">{{ t("report-contact-form.submit.success") }}</p>
</template>

<style scoped>
form {
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

fieldset {
  border: 1px solid #e6e7eb;
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
}

legend {
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
  padding: 0 0.25rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  color: #374151;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  box-sizing: border-box;
  font-size: 1rem;
  color: #0f172a;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

textarea {
  min-height: 140px;
  resize: vertical;
}

button[type="submit"] {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  align-self: start;
  transition: background-color 0.12s ease, transform 0.08s ease;
}

button[type="submit"]:hover {
  background: #1e40af;
}

button[type="submit"]:active {
  transform: translateY(1px);
}

p[role="alert"] {
  color: #b91c1c;
  margin: 0;
  font-weight: 700;
}

#success {
  color: #065f46;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 600px) {
  form {
    padding: 0 1rem;
  }
  fieldset {
    padding: 0.75rem;
  }
}

:where(button:focus, input:focus, textarea:focus, select:focus) {
  outline-offset: 2px;
}
</style>
