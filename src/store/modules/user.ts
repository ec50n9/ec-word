import { defineStore } from "pinia";
import router from "@/router";

export const useUserStore = defineStore("user", {
  persist: true,
  state: () => ({
    accessToken: "",
  }),
  actions: {
    updateAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    logout() {
      this.accessToken = "";
      router.replace("/login");
    },
  },
});
