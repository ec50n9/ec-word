<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";

const props = defineProps<{
  word: string;
}>();
</script>

<template>
  <div class="w-full min-h-screen bg-slate-1">
    <CommonHeader :title="props.word" />

    <div class="px-3 pb-3"></div>
  </div>
</template>
