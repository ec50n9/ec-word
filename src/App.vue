<script setup lang="ts">
import { RouterView } from "vue-router";
import { NDialogProvider, NMessageProvider } from "naive-ui";
</script>

<template>
  <n-dialog-provider>
    <n-message-provider placement="top">
      <main class="h-screen of-y-auto bg-slate-1 c-slate-7">
        <RouterView />
      </main>
    </n-message-provider>
  </n-dialog-provider>
</template>
