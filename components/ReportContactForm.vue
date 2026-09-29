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
const formSubmiting = ref(false);
const alertMessage = ref("");

async function handleSubmit() {
  alertMessage.value = "";
  if (formData.value.reportType === "select") {
    alertMessage.value = t("report-contact-form.report-type.select");
    return;
  }
  try {
    formSubmiting.value = true;
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
    const request = await $fetch("/api/report-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (request.success) {
      formIsSubmitted.value = true;
    } else {
      alertMessage.value = t("report-contact-form.submit.error");
    }
  } catch {
    alertMessage.value = t("report-contact-form.submit.error");
  } finally {
    formSubmiting.value = false;
  }
}
</script>

<template>
  <section class="contact" aria-labelledby="contact-title">
    <div class="contact-intro">
      <h2 id="contact-title">{{ t("report-contact-form.title") }}</h2>
      <p class="contact-question">{{ t("report-contact-form.question") }}</p>
    </div>
    <form v-if="!formIsSubmitted" class="contact-form" :aria-label="t('report-contact-form.form.title')" @submit.prevent="handleSubmit">
      <fieldset id="personnal-informations" class="contact-fieldset contact-fieldset--grid">
        <legend>{{ t("report-contact-form.form.personnal-informations.title") }}</legend>
        <div class="form-group">
          <label for="firstname" class="form-label">{{ t("report-contact-form.form.personnal-informations.firstname") }}</label>
          <input id="firstname" v-model="formData.firstname" class="form-input" name="firstname" type="text" autocomplete="given-name" required>
        </div>
        <div class="form-group">
          <label for="lastname" class="form-label">{{ t("report-contact-form.form.personnal-informations.lastname") }}</label>
          <input id="lastname" v-model="formData.lastname" class="form-input" name="lastname" type="text" autocomplete="family-name" required>
        </div>
        <div class="form-group form-group--full">
          <label for="email" class="form-label">{{ t("report-contact-form.form.personnal-informations.email") }}</label>
          <input id="email" v-model="formData.email" class="form-input" name="email" type="email" autocomplete="email" required>
        </div>
      </fieldset>
      <fieldset id="body-informations" class="contact-fieldset">
        <legend>{{ t("report-contact-form.form.body-informations.title") }}</legend>
        <div class="form-group">
          <label for="report-type" class="form-label">{{ t("report-contact-form.form.body-informations.report-type") }}</label>
          <select id="report-type" v-model="formData.reportType" class="form-select" name="report-type" required>
            <option v-for="(value, key) in REPORT_TYPE" :key="key" :value="key">{{ value }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="subject" class="form-label">{{ t("report-contact-form.form.body-informations.subject") }}</label>
          <input id="subject" v-model="formData.subject" class="form-input" name="subject" type="text" required>
        </div>
        <div class="form-group">
          <label for="message" class="form-label">{{ t("report-contact-form.form.body-informations.message") }}</label>
          <textarea id="message" v-model="formData.body" class="form-textarea" name="message" required></textarea>
        </div>
      </fieldset>
      <p role="alert" class="contact-alert">{{ alertMessage }}</p>
      <button type="submit" class="btn btn--primary contact-submit" :disabled="formSubmiting">{{ t("report-contact-form.form.submit") }}</button>
    </form>
    <p v-else id="success" role="alert">{{ t("report-contact-form.submit.success") }}</p>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: start;
}

.contact-intro {
  display: grid;
  gap: var(--space-4);
}

.contact-question {
  color: var(--text-muted);
  font-size: 1.125rem;
}

.contact-form {
  display: grid;
  gap: var(--space-6);
}

.contact-fieldset {
  display: grid;
  gap: var(--space-4);
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.contact-fieldset--grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-group--full {
  grid-column: 1 / -1;
}

legend {
  float: left;
  width: 100%;
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.contact-fieldset--grid legend {
  grid-column: 1 / -1;
}

textarea {
  min-height: 10rem;
  resize: vertical;
}

.contact-alert {
  color: var(--danger);
  font-weight: 700;
}

.contact-submit {
  justify-self: start;
}

#success {
  padding: var(--space-6);
  font-weight: 600;
  color: var(--text);
  background: var(--accent-soft);
  border: 1.5px solid var(--accent);
  border-radius: var(--radius-lg);
}

@media (max-width: 960px) {
  .contact {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .contact-fieldset--grid {
    grid-template-columns: 1fr;
  }
}
</style>
