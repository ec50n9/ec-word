import { defineStore } from "pinia";
import { useProviderStore } from "./provider";
import { ThemeType, themeMap } from "@/config/theme";

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
    currentTheme: themeMap.light,
    // 页面滚动位置
    scrollPositionCaches: {} as { [key: string]: { x: number; y: number } },
  }),
  actions: {
    /** 更新是否第一次打开 */
    updateFirstOpen(value: boolean) {
      this.firstOpen = value;
    },

    /** 更新发音类型 */
    updateSpeechType(type: boolean) {
      this.speechType = type;

      const providerStore = useProviderStore();
      if (this.speechType) {
        providerStore.message?.info("🇺🇸 美式发音", { showIcon: false });
      } else {
        providerStore.message?.info("🇬🇧 英式发音", { showIcon: false });
      }
    },

    /** 更新主题 */
    updateCurrentTheme(theme: ThemeType) {
      this.currentTheme = themeMap[theme];
    },

    /** 更新页面滚动位置 */
    updateScrollPositionCaches(
      flag: string,
      scrollPosition: { x: number; y: number }
    ) {
      this.scrollPositionCaches[flag] = scrollPosition;
    },
  },
});
