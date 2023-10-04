<script lang="ts" setup>
import { RuleTemplate } from "@/api/methods/rule-template";
import { NButton, NIcon, NPopconfirm } from "naive-ui";
import { DeleteOutlineRound } from "@vicons/material";
import { computed } from "vue";

const props = defineProps<{
  ruleTemplate: RuleTemplate;
  showDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: "delete", ruleTemplate: RuleTemplate): void;
}>();

const type2view = {
  learn: { className: "bg-blue-50 text-blue-5", text: "学习" },
  review: { className: "bg-amber-50 text-amber-5", text: "复习" },
  exam: { className: "bg-red-50 text-red-5", text: "考试" },
};
const typeView = computed(() => type2view[props.ruleTemplate.type]);
</script>

<template>
  <li class="px-4 py-3 bg-white c-gray-7 b rd-3 of-x-hidden">
    <div class="flex items-center gap-3">
      <!-- 标题 -->
      <h2 class="grow w-0 flex items-center flex-wrap gap-2 text-lg">
        <span>
          {{ ruleTemplate.name }}
        </span>
        <!-- 类型 -->
        <span
          class="shrink-0 px-2 py-1 text-xs rd-1"
          :class="typeView.className"
          >{{ typeView.text }}</span
        >
        <!-- 开放性 -->
        <span
          class="shrink-0 px-2 py-1 text-xs rd-1"
          :class="{
            'bg-indigo-50 text-indigo-5': !ruleTemplate.public,
            'bg-emerald-50 text-emerald-5': ruleTemplate.public,
          }"
          >{{ ruleTemplate.public ? "公开" : "私密" }}</span
        >
      </h2>
      <!-- 删除 -->
      <n-popconfirm
        v-if="props.showDelete"
        negative-text="算了"
        positive-text="嗯."
        :positive-button-props="{
          type: 'error',
        }"
        @positive-click="emit('delete', ruleTemplate)"
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
    <p v-if="ruleTemplate.desc" class="mt-1 text-base c-gray-4 of-x-hidden">
      {{ ruleTemplate.desc }}
    </p>
  </li>
</template>
