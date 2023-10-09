<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  NDialogProvider,
  NMessageProvider,
  NLoadingBarProvider,
  useLoadingBar,
  NConfigProvider,
} from "naive-ui";
import { defineComponent } from "vue";
import { useProviderStore } from "./store/modules/provider";

// 主题覆写
const themeOverrides = {
  common: {
    primaryColor: "#3b82f6",
  },
};

// 绑定提供者
const ProviderBinder = defineComponent({
  setup: () => {
    useProviderStore().updateLoadingBar(useLoadingBar());
    return () => null;
  },
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
