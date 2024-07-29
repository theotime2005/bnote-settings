<script>
export default {
  data() {
    return {
      fileInput: null,
      fileData: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.fileInput = event.target.files[0];
    },
    uploadFile() {
      if (!this.fileInput) {
        window.alert("Aucun fichier sélectionné");
        return;
      }

      try {
        const extension = this.fileInput.name.split(".").pop();
        if (extension !== "bnote") {
          window.alert("Format de fichier incorrect");
          return;
        }

        const file = new FileReader();
        file.readAsText(this.fileInput);

        file.onloadend = (e) => {
          this.fileData=JSON.parse(e.target.result);

          this.$emit("file-uploaded");
        };

      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <div>
    <h1>Importer un fichier</h1>
    <form @submit.prevent="uploadFile">
      <label for="select">Sélectionner un fichier</label>
      <input type="file" id="select" @change="handleFileUpload" accept=".bnote" required />
      <button type="submit">Afficher</button>
    </form>
  </div>
</template>

<style scoped></style>
