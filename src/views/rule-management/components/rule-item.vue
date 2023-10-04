<script lang="ts" setup>
import { Rule } from "@/api/methods/rule";
import { NButton, NIcon, NPopconfirm } from "naive-ui";
import { DeleteOutlineRound } from "@vicons/material";

defineProps<{
  rule: Rule;
}>();

const emit = defineEmits<{
  (e: "delete", rule: Rule): void;
}>();
</script>

<template>
  <li class="px-4 py-3 bg-white c-gray-7 b rd-3">
    <div class="flex items-center gap-3">
      <!-- 标题 -->
      <h2 class="grow w-0 flex items-center flex-wrap gap-2 text-lg">
        <span>
          {{ rule.name }}
        </span>
        <span
          class="shrink-0 px-2 py-1 text-xs rd-1"
          :class="{
            'bg-indigo-50 text-indigo-5': !rule.public,
            'bg-emerald-50 text-emerald-5': rule.public,
          }"
          >{{ rule.public ? "公开" : "私密" }}</span
        >
      </h2>
      <!-- 删除 -->
      <n-popconfirm
        negative-text="算了"
        positive-text="嗯."
        :positive-button-props="{
          type: 'error',
        }"
        @positive-click="emit('delete', rule)"
      >
        <template #trigger>
          <n-button
            tertiary
            circle
            type="error"
            @click="(e) => e.stopPropagation()"
          >
            <template #icon>
              <n-icon class="text-xl"><delete-outline-round /></n-icon>
            </template>
          </n-button>
        </template>
        删除了可就没有了哦
      </n-popconfirm>
    </div>
    <p v-if="rule.desc" class="mt-1 text-base c-gray-4">{{ rule.desc }}</p>
  </li>
</template>
