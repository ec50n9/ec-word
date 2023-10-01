import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
