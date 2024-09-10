import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import i18n from "@/i18n.js";
import UploadFileComponent from "@/components/UploadFileComponent.vue";

const t = i18n.global.t;
describe("UploadFileComponent.vue", () => {

  // Test pour vérifier la gestion de la sélection de fichier
  it("devrait gérer correctement la sélection de fichier", async () => {
    const wrapper = mount(UploadFileComponent);

    // Simule un événement de changement de fichier
    const file = new File(["test content"], "test.bnote", { type: "text/plain" });
    const input = wrapper.find("input[type=\"file\"]");

    // Simule manuellement l'événement `change`
    await input.element.dispatchEvent(new Event("change", { bubbles: true }));
    Object.defineProperty(input.element, "files", { value: [file] });

    // Vérifie que fileInput a bien reçu le fichier
    await wrapper.vm.handleFileUpload({ target: { files: [file] } });
    expect(wrapper.vm.fileInput).toBe(file);
  });

  // Test pour vérifier l'alerte si le format de fichier est incorrect
  it("devrait afficher une alerte si le format du fichier est incorrect", async () => {
    const wrapper = mount(UploadFileComponent, {
      global: {
        mocks: {
          $t: (msg) => t(msg),
        },
      },
    });
    window.alert = vi.fn(); // Mock de window.alert

    // Simule la sélection d'un fichier avec une mauvaise extension
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = wrapper.find("input[type=\"file\"]");

    // Simule manuellement l'événement `change`
    await input.element.dispatchEvent(new Event("change", { bubbles: true }));
    Object.defineProperty(input.element, "files", { value: [file] });

    await wrapper.vm.handleFileUpload({ target: { files: [file] } });

    // Simule la soumission du fichier avec le mauvais format
    wrapper.vm.uploadFile();

    // Vérifie que l'alerte est affichée
    expect(window.alert).toHaveBeenCalledWith(t("uploadFile.incorrectFormatFile"));
  });

  // Test pour vérifier la lecture du fichier et l'émission de l'événement
  it("devrait lire le contenu du fichier et émettre l'événement \"file-uploaded\"", async () => {
    const wrapper = mount(UploadFileComponent);
    const fileContent = JSON.stringify({ message: "hello world" });
    const file = new File([fileContent], "test.bnote", { type: "text/plain" });

    // Mock FileReader et son comportement
    const mockFileReader = {
      readAsText: vi.fn(),
      onloadend: null, // onloadend sera défini après
    };

    // Mock de FileReader global
    window.FileReader = vi.fn(() => mockFileReader);

    // Simule manuellement l'événement `change`
    const input = wrapper.find("input[type=\"file\"]");
    await input.element.dispatchEvent(new Event("change", { bubbles: true }));
    Object.defineProperty(input.element, "files", { value: [file] });

    // Simule la sélection du fichier
    await wrapper.vm.handleFileUpload({ target: { files: [file] } });

    // Définir `onloadend` comme une fonction et simuler l'événement de fin de lecture
    mockFileReader.onloadend = vi.fn((e) => {
      e.target = { result: fileContent }; // Simule le contenu du fichier lu
      wrapper.vm.fileData = JSON.parse(e.target.result); // Met à jour fileData
      wrapper.$emit("file-uploaded"); // Émet l'événement après la lecture
    });

    // Simule la soumission du fichier
    wrapper.vm.uploadFile();

    // Appelle onloadend pour simuler la fin de la lecture du fichier
    mockFileReader.onloadend({ target: { result: fileContent } });

    // Vérifie que fileData a bien été mis à jour
    expect(wrapper.vm.fileData).toEqual(JSON.parse(fileContent));

    // Vérifie que l'événement 'file-uploaded' a bien été émis
    expect(wrapper.emitted("file-uploaded")).toBeTruthy();
  });
});
