import { DarkModeTwotone, LightModeTwotone } from "@vicons/material";
import { GlobalThemeOverrides, darkTheme, lightTheme } from "naive-ui";
import { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";
import { Component } from "vue";

export type ThemeType = "light" | "dark";
export const themeMap = {
  light: {
    name: "亮色",
    theme: lightTheme,
    themeOverrides: {
      common: {
        baseColor: "#f1f5f9",
      },
    },
    icon: LightModeTwotone,
  },
  dark: { name: "暗色", theme: darkTheme, icon: DarkModeTwotone },
} as Record<
  ThemeType,
  {
    name: string;
    theme: BuiltInGlobalTheme;
    themeOverrides?: GlobalThemeOverrides;
    icon: Component;
  }
>;
