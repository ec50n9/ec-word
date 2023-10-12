import { DialogApi, LoadingBarApi, MessageApi } from "naive-ui";
import { defineStore } from "pinia";

export const useProviderStore = defineStore("provider", {
  state: () => ({
    loadingBar: null as LoadingBarApi | null,
    dialog: null as DialogApi | null,
    message: null as MessageApi | null,
  }),
  actions: {
    updateLoadingBar(loadingBar: LoadingBarApi) {
      this.loadingBar = loadingBar;
    },
    updateDialog(dialog: DialogApi) {
      this.dialog = dialog;
    },
    updateMessage(message: MessageApi) {
      this.message = message;
    },
  },
});
