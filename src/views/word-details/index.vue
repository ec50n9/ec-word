<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { id } = route.query as { id: string };
</script>

<template>
  <div class="w-full min-h-screen bg-slate-1">
    <CommonHeader :title="id" />

    <div class="px-3 pb-3"></div>
  </div>
</template>
