import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    accessToken: "",
  }),
  actions: {
    updateAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
  },
});
