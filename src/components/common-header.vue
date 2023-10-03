<script lang="ts" setup>
import { ArrowBackIosNewRound } from "@vicons/material";
import { Icon } from "@vicons/utils";

const props = withDefaults(
  defineProps<{
    title: string;
    showBack?: boolean;
  }>(),
  {
    showBack: true,
  }
);

// 设置页面标题
document.title = props.title;
</script>

<template>
  <header class="p-4 flex items-center gap-3 z-10 transition">
    <div
      v-if="props.showBack"
      class="flex items-center justify-center w-12 h-12 b-2 b-slate-3 rd-3"
      @click="$router.back()"
    >
      <Icon class="text-xl c-slate-3">
        <ArrowBackIosNewRound />
      </Icon>
    </div>

    <h1 class="grow w-0 text-2xl c-slate-7">{{ props.title }}</h1>

    <slot />
  </header>
</template>
