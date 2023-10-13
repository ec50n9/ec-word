<script setup lang="ts">
import VConsole from "vconsole";
import { useAppStore } from "./store/modules/app";

const appStore = useAppStore();

// 主题覆写
// const themeOverrides = {
//   common: {
//     baseColor: "#f1f5f9",
//   },
// };

onMounted(() => {
  // vconsole调试
  if (import.meta.env.DEV) {
    const vConsole = new VConsole();
    return () => vConsole.destroy();
  }
});
</script>

<template>
  <n-config-provider :theme="appStore.currentTheme.theme">
    <global-provider>
      <n-el
        tag="main"
        class="h-screen of-y-auto select-none"
        style="color: var(--primary-color); background-color: var(--base-color)"
      >
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition as string || 'fade'">
            <component :is="Component" />
          </transition>
        </router-view>
      </n-el>
    </global-provider>
  </n-config-provider>
</template>
