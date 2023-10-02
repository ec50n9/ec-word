<script lang="ts" setup>
import { ArrowBackIosNewRound } from "@vicons/material";
import { Icon } from "@vicons/utils";

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <header class="p-4 flex items-center gap-3">
    <div
      class="flex items-center justify-center w-12 h-12 b-2 b-slate-3 rd-3"
      @click="$router.back()"
    >
      <Icon class="text-xl c-slate-3">
        <ArrowBackIosNewRound />
      </Icon>
    </div>

    <h1 class="text-2xl c-slate-7">{{ props.title }}</h1>
  </header>
</template>
