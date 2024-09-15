<script>
export default {
  name: "UploadFileComponent",
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
      try {
        const extension = this.fileInput.name.split(".").pop();
        if (extension !== "bnote") {
          window.alert(this.$t("uploadFile.incorrectFormatFile"));
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
    <h2>{{$t('uploadFile.title')}}</h2>
    <form @submit.prevent="uploadFile">
      <label for="select">{{$t('uploadFile.select')}}</label>
      <input type="file" id="select" @change="handleFileUpload" accept=".bnote" required />
      <button type="submit">{{$t('uploadFile.show')}}</button>
    </form>
  </div>
</template>

<style scoped></style>
