<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  NDialogProvider,
  NMessageProvider,
  NLoadingBarProvider,
  useLoadingBar,
  NConfigProvider,
  useDialog,
  useMessage,
} from "naive-ui";
import { defineComponent, onMounted } from "vue";
import { useProviderStore } from "./store/modules/provider";
import VConsole from "vconsole";

// 主题覆写
const themeOverrides = {
  common: {
    primaryColor: "#3b82f6",
  },
};

// 绑定提供者
const ProviderBinder = defineComponent({
  setup: () => {
    const providerStore = useProviderStore();
    providerStore.updateLoadingBar(useLoadingBar());
    providerStore.updateDialog(useDialog());
    providerStore.updateMessage(useMessage());
    return () => null;
  },
});

onMounted(() => {
  // vconsole调试
  if (import.meta.env.DEV) {
    console.log("初始化vconsole");
    const vConsole = new VConsole();
    return () => vConsole.destroy();
  }
});
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider placement="top">
          <main class="h-screen of-y-auto bg-slate-1 c-slate-7 select-none">
            <router-view v-slot="{ Component, route }">
              <transition :name="route.meta.transition as string || 'fade'">
                <component :is="Component" />
              </transition>
            </router-view>
            <!-- 绑定提供者 -->
            <provider-binder />
          </main>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
