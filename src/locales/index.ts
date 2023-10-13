import { createI18n } from "vue-i18n";
import localesZh from "./zh.json";
import localesEn from "./en.json";

export const i18n = createI18n({
  legacy: false,
  locale: "zh_CN",
  messages: {
    zh_CN: { ...localesZh },
    en_US: { ...localesEn },
  },
});
