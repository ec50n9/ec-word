import Home from "@/views/home/index.vue";
import About from "@/views/about/index.vue";
import WordDetails from "@/views/word-details/index.vue";
import RecordWord from "@/views/record-word/index.vue";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { useProviderStore } from "@/store/modules/provider";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/words/:word", component: WordDetails, props: true },
  { path: "/record-word", component: RecordWord },
  { path: "/login", component: () => import("@/views/login/index.vue") },
  {
    path: "/word-source-management",
    component: () => import("@/views/word-source-management/index.vue"),
  },
  {
    path: "/rule-management",
    component: () => import("@/views/rule-management/index.vue"),
  },
  {
    path: "/rule-template-management",
    component: () => import("@/views/rule-template-management/index.vue"),
  },
  {
    path: "/rule-template-management/edit",
    component: () => import("@/views/rule-template-management/edit.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(() => {
  // 加载条动画开始
  useProviderStore().loadingBar?.start();
});

router.afterEach((to, from) => {
  // 加载条动画结束
  useProviderStore().loadingBar?.finish();

  const toDepth = to.path.split("/").filter((char) => char).length;
  const fromDepth = from.path.split("/").filter((char) => char).length;
  if (toDepth === fromDepth) to.meta.transition = "fade";
  else to.meta.transition = toDepth < fromDepth ? "slide-right" : "slide-left";
});

export default router;
