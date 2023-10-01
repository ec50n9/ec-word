import Home from "@/views/home/index.vue";
import About from "@/views/about/index.vue";
import WordDetails from "@/views/word-details/index.vue";
import RecordWord from "@/views/record-word/index.vue";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/words/:word", component: WordDetails, props: true },
  { path: "/record-word", component: RecordWord },
  { path: "/login", component: () => import("@/views/login/index.vue") },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
