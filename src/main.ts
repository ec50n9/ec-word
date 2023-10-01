import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import '@unocss/reset/tailwind-compat.css'
import "virtual:uno.css";

createApp(App).use(router).mount("#app");
