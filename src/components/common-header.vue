<script lang="ts" setup>
import { ArrowBackIosNewRound } from "@vicons/material";
import { Icon } from "@vicons/utils";
import { NButton, NIcon } from "naive-ui";

const props = withDefaults(
  defineProps<{
    title: string;
    showBack?: boolean;
    size?: "small" | "medium" | "large";
  }>(),
  {
    showBack: true,
    size: "large",
  }
);

// 设置页面标题
document.title = props.title;
</script>

<template>
  <header
    class="flex items-center gap-3 z-10 transition"
    :class="{
      'px-4 py-2': props.size === 'small',
      'px-4 py-3': props.size === 'medium',
      'p-4': props.size === 'large',
    }"
  >
    <template v-if="props.showBack">
      <div
        v-if="props.size === 'large'"
        class="flex items-center justify-center w-12 h-12 b-2 b-slate-3 rd-3"
        @click="$router.back()"
      >
        <Icon class="text-xl c-slate-3">
          <ArrowBackIosNewRound />
        </Icon>
      </div>

      <n-button
        v-else-if="props.size === 'medium' || props.size === 'small'"
        circle
        secondary
        type="tertiary"
        @click="$router.back()"
      >
        <template #icon>
          <n-icon>
            <ArrowBackIosNewRound />
          </n-icon>
        </template>
      </n-button>
    </template>

    <h1
      class="grow w-0 c-slate-7"
      :class="{
        'text-lg': props.size === 'small',
        'text-xl': props.size === 'medium',
        'text-2xl': props.size === 'large',
      }"
    >
      {{ props.title }}
    </h1>

    <slot />
  </header>
</template>
