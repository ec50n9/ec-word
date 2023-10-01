<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { NButton, NIcon, NSkeleton, NEmpty, NResult } from "naive-ui";
import { PlusRound } from "@vicons/material";
import { useRequest } from "alova";
import { listMyWords } from "@/api/methods/word";

const router = useRouter();

const listMyWordsReq = useRequest(listMyWords(), {
  initialData: Array.from({ length: 5 }, (_, i) => `word${i}`),
});

const currentWord = ref<string | null>(null);
const currentWordInfo = ref<{
  word: string;
  meaning: string;
  example: string;
}>({
  word: "Project",
  meaning: "项目",
  example:
    "This is a project.This is a project.This is a project.This is a project.This is a project.This is a project.This is a project.",
});

let timeout: NodeJS.Timeout | null = null;

const handleWordTouchStart = (_e: TouchEvent, word: string) => {
  timeout = setTimeout(() => {
    currentWord.value = word;
    clearTimeout(timeout!);
    timeout = null;
  }, 300);
};

const handleWordTouchMove = (_e: TouchEvent) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
};

const handleWordTouchEnd = (_e: TouchEvent, word: string) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
    // 点击事件
    router.push(`/words/${word}`);
  }
  currentWord.value = null;
};
</script>

<template>
  <div class="flex flex-col">
    <div class="shrink-0 px-5 pt-5 pb-4 flex items-center justify-between">
      <h1 class="text-2xl c-slate-7">松叶</h1>
      <n-button
        strong
        secondary
        type="primary"
        @click="$router.push('/record-word')"
      >
        <template #icon>
          <n-icon><plus-round /></n-icon>
        </template>
        添加
      </n-button>
    </div>

    <!-- 单词列表 -->
    <n-result
      v-if="listMyWordsReq.error.value"
      status="500"
      title="加载失败"
      :description="listMyWordsReq.error.value.message"
    />

    <n-empty v-else-if="listMyWordsReq.data.value.length === 0" />

    <ul v-else class="grow h-0 px-3 grid grid-cols-2 gap-2">
      <template v-if="listMyWordsReq.loading.value">
        <n-skeleton
          v-for="item in listMyWordsReq.data.value"
          :key="item"
          height="40px"
          :sharp="false"
        />
      </template>

      <template v-else>
        <li
          v-for="word in listMyWordsReq.data.value"
          :key="word"
          class="px-3 py-3 bg-white c-slate-7 rd-2 b select-none transition active:bg-slate-100 active:c-slate-9 active:scale-95"
          @touchstart="(e) => handleWordTouchStart(e, word)"
          @touchmove="(e) => handleWordTouchMove(e)"
          @touchend="(e) => handleWordTouchEnd(e, word)"
          @touchcancel="(e) => handleWordTouchEnd(e, word)"
        >
          {{ word }}
        </li>
      </template>
    </ul>

    <!-- 弹窗 -->
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 transition"
      :class="{ 'scale-90 op-0 pointer-events-none': !currentWord }"
    >
      <div class="px-5 py-3 bg-white c-slate-7 rd-3 shadow select-none">
        <h2 class="text-xl">{{ currentWordInfo.word }}</h2>
        <p class="mt-2">{{ currentWordInfo.meaning }}</p>
        <p class="mt-1">{{ currentWordInfo.example }}</p>
      </div>
    </div>
  </div>
</template>
