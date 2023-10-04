import { LoadingBarApi } from "naive-ui";
import { defineStore } from "pinia";

export const useProviderStore = defineStore("provider", {
  state: () => ({
    loadingBar: null as LoadingBarApi | null,
  }),
  actions: {
    updateLoadingBar(loadingBar: LoadingBarApi) {
      this.loadingBar = loadingBar;
    },
  },
})