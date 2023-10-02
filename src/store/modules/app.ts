import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  persist: {
    paths: ["firstOpen", "speechType"],
  },
  state: () => ({
    // 初次打开
    firstOpen: true,
    // 发音类型
    speechType: true,
    // 页面滚动位置
    scrollPositionCaches: {} as { [key: string]: { x: number; y: number } },
  }),
  actions: {
    updateFirstOpen(value: boolean) {
      this.firstOpen = value;
    },
    updateSpeechType(type: boolean) {
      this.speechType = type;
    },
    updateScrollPositionCaches(
      flag: string,
      scrollPosition: { x: number; y: number }
    ) {
      this.scrollPositionCaches[flag] = scrollPosition;
    },
  },
});
