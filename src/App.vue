<script setup lang="ts">
import { lightTheme } from "naive-ui";
import VConsole from "vconsole";

// 主题覆写
const themeOverrides = {
  common: {
    primaryColor: "#3b82f6",
  },
};

onMounted(() => {
  // vconsole调试
  if (import.meta.env.DEV) {
    const vConsole = new VConsole();
    return () => vConsole.destroy();
  }
});
</script>

<template>
  <n-config-provider :theme="lightTheme" :theme-overrides="themeOverrides">
    <global-provider>
      <main class="h-screen of-y-auto bg-slate-1 c-slate-7 select-none">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition as string || 'fade'">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </global-provider>
  </n-config-provider>
</template>
