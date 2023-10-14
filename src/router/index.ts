import Home from "@/views/home/index.vue";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { useProviderStore } from "@/store/modules/provider";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/about", component: () => import("@/views/about/index.vue") },
  {
    path: "/translate",
    component: () => import("@/views/translate/index.vue"),
  },
  {
    path: "/words/details",
    component: () => import("@/views/word-details/index.vue"),
  },
  {
    path: "/record-word",
    component: () => import("@/views/record-word/index.vue"),
  },
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

let loadingBarTimeout: NodeJS.Timeout | null = null;

router.beforeEach(() => {
  // 加载条动画开始，只在加载时间超过100ms时才显示加载条
  loadingBarTimeout && clearTimeout(loadingBarTimeout);
  loadingBarTimeout = setTimeout(() => {
    useProviderStore().loadingBar?.start();
  }, 100);
});

router.afterEach((to, from) => {
  // 加载条动画结束
  loadingBarTimeout && clearTimeout(loadingBarTimeout);
  useProviderStore().loadingBar?.finish();

  const toDepth = to.path.split("/").filter((char) => char).length;
  const fromDepth = from.path.split("/").filter((char) => char).length;
  if (toDepth === fromDepth) to.meta.transition = "fade";
  else to.meta.transition = toDepth < fromDepth ? "slide-right" : "slide-left";
});

export default router;
