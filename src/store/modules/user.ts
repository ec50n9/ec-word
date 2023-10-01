import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  persist: true,
  state: () => ({
    accessToken: "",
  }),
  actions: {
    updateAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
  },
});
