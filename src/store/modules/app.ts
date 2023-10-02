import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    scrollPositionCaches: {} as { [key: string]: { x: number; y: number } },
  }),
  actions: {
    updateScrollPositionCaches(
      flag: string,
      scrollPosition: { x: number; y: number }
    ) {
      this.scrollPositionCaches[flag] = scrollPosition;
    },
  },
});
