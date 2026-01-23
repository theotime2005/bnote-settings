import { mount } from "@vue/test-utils";

import ReportContactForm from "@/components/ReportContactForm.vue";
import i18n from "@/tests/helpers/i18n.js";

const { t } = i18n.global;

describe("Report Contact Form", () => {
  let wrapper;
  beforeEach(function() {
    wrapper = mount(ReportContactForm, {
      global: {
        plugins: [i18n],
      },
    });
  });

  it("should display the form correctly", () => {
    // then
    const h2 = wrapper.find("h2");
    const form = wrapper.find("form");
    const legend = wrapper.findAll("legend");
    expect(h2.text()).toBe(t("report-contact-form.title"));
    expect(form.exists()).toBe(true);
    expect(legend).toHaveLength(2);
  });

  describe("Form submition", () => {
    it("should display alert if no option selected", async () => {
      // given
      const firstnameInput = wrapper.find("input[name=\"firstname\"]");
      const lastnameInput = wrapper.find("input[name=\"lastname\"]");
      const emailInput = wrapper.find("input[name=\"email\"]");
      const objectInput = wrapper.find("input[name=\"subject\"]");
      const messageInput = wrapper.find("textarea[name=\"message\"]");
      const submitButton = wrapper.find("button[type=\"submit\"]");

      // when
      firstnameInput.setValue("John");
      lastnameInput.setValue("Doe");
      emailInput.setValue("john.doe@example.net");
      objectInput.setValue("This is a test message.");
      messageInput.setValue("Hello, this is a test message.");
      await submitButton.trigger("submit");

      // then
      const alert = wrapper.find("p[role='alert']");
      expect(alert.text()).toBe(t("report-contact-form.report-type.select"));
    });

    it("should hide form and display success message if form is submited", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: true, status: 200 });
      const firstnameInput = wrapper.find("input[name=\"firstname\"]");
      const lastnameInput = wrapper.find("input[name=\"lastname\"]");
      const emailInput = wrapper.find("input[name=\"email\"]");
      const reportTypeInput = wrapper.find("select[name=\"report-type\"]");
      const objectInput = wrapper.find("input[name=\"subject\"]");
      const messageInput = wrapper.find("textarea[name=\"message\"]");
      const submitButton = wrapper.find("button[type=\"submit\"]");

      // when
      firstnameInput.setValue("John");
      lastnameInput.setValue("Doe");
      emailInput.setValue("john.doe@example.net");
      reportTypeInput.setValue("bug");
      objectInput.setValue("This is a test message.");
      messageInput.setValue("Hello, this is a test message.");
      await submitButton.trigger("submit");
      await wrapper.vm.$nextTick();

      // then
      const form = wrapper.find("form");
      const successMessage = wrapper.find("p[id='success']");
      expect(form.exists()).toBe(false);
      expect(successMessage.text()).toBe(t("report-contact-form.submit.success"));
    });
  });
});
