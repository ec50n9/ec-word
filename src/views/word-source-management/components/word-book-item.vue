<script lang="ts" setup>
import { WordBook } from "@/api/methods/word";
import { NImage, NTag, NBadge, NButton, NIcon, NPopconfirm } from "naive-ui";
import { DeleteOutlineRound } from "@vicons/material";

defineProps<{
  wordBook: WordBook;
  checked?: boolean;
  badge?: string;
  showDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: "delete", wordBook: WordBook): void;
}>();
</script>

<template>
  <li
    class="p-3 flex items-start gap-3 b-2 rd-3 transition"
    :class="{
      'bg-white': !checked,
      'b-emerald-5 bg-emerald-50 scale-95': checked,
      'b-blue-2': badge,
    }"
  >
    <!-- 封面 -->
    <n-badge :value="badge" type="info">
      <n-image
        class="shrink-0 w-22 rd-1 of-hidden"
        :src="wordBook.cover"
        preview-disabled
      />
    </n-badge>
    <div class="grow py-1 flex flex-col">
      <div class="shrink-0 flex justify-between items-start text-lg">
        <!-- 标题 -->
        <span>{{ wordBook.title }}</span>
        <!-- 删除 -->
        <n-popconfirm
          v-if="showDelete"
          negative-text="算了"
          positive-text="嗯."
          :positive-button-props="{
            type: 'error',
          }"
          @positive-click="emit('delete', wordBook)"
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
      <!-- 词书描述 -->
      <p class="mt-1 text-sm c-gray-4">{{ wordBook.desc }}</p>
      <!-- 单词数量 -->
      <p class="mt-1 text-sm c-gray-4">单词数量: {{ wordBook.word_count }}</p>
      <!-- 标签 -->
      <p class="mt-3 flex flex-wrap gap-x-3 gap-y-2">
        <n-tag
          v-for="tag in wordBook.tags"
          :key="tag"
          size="small"
          type="success"
          >{{ tag }}</n-tag
        >
      </p>
    </div>
  </li>
</template>
