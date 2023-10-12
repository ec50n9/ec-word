<script lang="ts" setup>
import { useProviderStore } from "@/store/modules/provider";

// 绑定提供者
const ProviderBinder = defineComponent({
  setup: () => {
    const providerStore = useProviderStore();
    providerStore.updateLoadingBar(useLoadingBar());
    providerStore.updateDialog(useDialog());
    providerStore.updateMessage(useMessage());
    providerStore.updateNotification(useNotification());
    return () => null;
  },
});
</script>

<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-message-provider placement="top">
        <n-notification-provider>
          <slot />
          <!-- 绑定提供者 -->
          <provider-binder />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>
