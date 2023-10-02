<script setup lang="ts">
import { RouterView } from "vue-router";
import { NDialogProvider, NMessageProvider } from "naive-ui";
</script>

<template>
  <n-dialog-provider>
    <n-message-provider placement="top">
      <main class="h-screen of-y-auto bg-slate-1 c-slate-7 select-none">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition as string || 'fade'">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </n-message-provider>
  </n-dialog-provider>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  position: fixed;
  transition: all 0.3s ease;
}
.slide-left-enter-active {
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-20%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  position: fixed;
  transition: all 0.3s ease;
}
.slide-right-leave-active {
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}

.slide-right-enter-from {
  transform: translateX(-20%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
