import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import { i18n } from "./locales";
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

createApp(App).use(router).use(pinia).use(i18n).mount("#app");
