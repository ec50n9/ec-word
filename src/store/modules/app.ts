import { lightTheme } from "naive-ui";
import { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";
import { defineStore } from "pinia";

export type ThemeType = "light" | "dark";
export const themeMap = {
  light: { name: "", theme: lightTheme },
  dark: { name: "", theme: lightTheme },
} as Record<ThemeType, { name: string; theme: BuiltInGlobalTheme }>;

export const useAppStore = defineStore("app", {
  persist: {
    paths: ["firstOpen", "speechType"],
  },
  state: () => ({
    // 初次打开
    firstOpen: true,
    // 发音类型
    speechType: true,
    // 主题
    theme: themeMap.light,
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
