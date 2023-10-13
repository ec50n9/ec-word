import { darkTheme, lightTheme } from "naive-ui";
import { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";

export type ThemeType = "light" | "dark";
export const themeMap = {
  light: { name: "亮色", theme: lightTheme },
  dark: { name: "暗色", theme: darkTheme },
} as Record<ThemeType, { name: string; theme: BuiltInGlobalTheme }>;
