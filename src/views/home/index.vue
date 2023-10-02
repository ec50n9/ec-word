<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { NButton, NIcon, NSwitch, NSkeleton, NEmpty, NResult } from "naive-ui";
import { PlusRound, VolumeUpTwotone } from "@vicons/material";
import { useRequest } from "alova";
import { WordSimpResp, listMyWords } from "@/api/methods/word";
import { useAppStore } from "@/store/modules/app";

const appStore = useAppStore();
const router = useRouter();
const audioBaseURL = "https://dict.youdao.com/dictvoice?audio=";

// 获取单词列表
const listMyWordsReq = useRequest(listMyWords(), {
  initialData: Array.from({ length: 5 }, (_, i) => `word${i}`),
});

// 当前查看的单词
const currentWord = ref<WordSimpResp | null>(null);
const wordDetailVisible = ref(false);

// 发音类型
const speechType = ref(true);

// 长按的定时器
let timeout: NodeJS.Timeout | null = null;

const handleWordTouchStart = (_e: TouchEvent, word: WordSimpResp) => {
  timeout = setTimeout(() => {
    currentWord.value = word;
    wordDetailVisible.value = true;
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

const handleWordTouchEnd = (_e: TouchEvent, word: WordSimpResp) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
    // 点击事件
    if (word.detail) {
      audio.set(
        audioBaseURL +
          (speechType.value ? word.detail?.usspeech : word.detail?.ukspeech)
      );
    } else {
      router.push(`/words/${word.word}`);
    }
  }
  wordDetailVisible.value = false;
};

// 创建一个音频播放器
const useAudio = () => {
  const audio = new Audio();

  const playing = ref(false);
  const loading = ref(false);
  const set = (src: string) => {
    audio.src = src;
    audio.play();
  };

  audio.addEventListener("play", () => {
    playing.value = true;
  });
  audio.addEventListener("pause", () => {
    playing.value = false;
  });
  audio.addEventListener("waiting", () => {
    loading.value = true;
  });
  audio.addEventListener("canplay", () => {
    loading.value = false;
  });
  audio.addEventListener("error", () => {
    loading.value = false;
  });

  return {
    playing,
    loading,
    set,
  };
};
const audio = useAudio();

// 跳转页面前记录滚动位置
const listRef = ref<HTMLDivElement>();
onBeforeRouteLeave((_to, from, next) => {
  appStore.updateScrollPositionCaches(from.path!, {
    x: listRef.value?.scrollLeft || 0,
    y: listRef.value?.scrollTop || 0,
  });
  next();
});
// 跳转页面后恢复滚动位置
onMounted(() => {
  const { x, y } = appStore.scrollPositionCaches[
    router.currentRoute.value.path
  ] || { x: 0, y: 0 };

  setTimeout(() => {
    listRef.value?.scrollTo({
      left: x,
      top: y,
    });
  });
});
</script>

<template>
  <div class="w-full min-h-screen flex flex-col bg-slate-1">
    <div
      class="shrink-0 px-5 pt-5 pb-4 flex items-center justify-between gap-3"
    >
      <!-- 标题 -->
      <h1 class="grow text-2xl c-slate-7">松叶</h1>

      <!-- 播放器 -->
      <n-switch
        class="shrink-0"
        v-model:value="speechType"
        :round="true"
        size="large"
        :loading="audio.loading.value"
      >
        <template #icon>
          <n-icon><volume-up-twotone /></n-icon>
        </template>
        <template #checked>美</template>
        <template #unchecked>英</template>
      </n-switch>

      <!-- 添加按钮 -->
      <n-button
        class="shrink-0"
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

    <div v-else ref="listRef" class="grow h-0 px-3 pb-3 of-auto">
      <ul class="grid grid-cols-2 gap-2">
        <template v-if="listMyWordsReq.loading.value">
          <n-skeleton
            v-for="item in listMyWordsReq.data.value"
            :key="item.word"
            height="40px"
            :sharp="false"
          />
        </template>

        <template v-else>
          <li
            v-for="(word, index) in listMyWordsReq.data.value"
            :key="index"
            class="px-3 py-3 bg-white c-slate-7 rd-2 b select-none transition active:bg-slate-100 active:c-slate-9 active:scale-95"
            :class="{ 'b-emerald-4': word.detail, 'b-indigo-4': word.note }"
            @touchstart="(e) => handleWordTouchStart(e, word)"
            @touchmove="(e) => handleWordTouchMove(e)"
            @touchend="(e) => handleWordTouchEnd(e, word)"
            @touchcancel="(e) => handleWordTouchEnd(e, word)"
          >
            {{ word.word }}
          </li>
        </template>
      </ul>
    </div>

    <!-- 弹窗 -->
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 transition"
      :class="{ 'scale-90 op-0 pointer-events-none': !wordDetailVisible }"
    >
      <div class="px-5 py-3 bg-white c-slate-7 rd-3 shadow select-none">
        <h2 class="text-xl">{{ currentWord?.word }}</h2>
        <p v-if="currentWord?.detail?.trans[0]" class="mt-2">
          <span class="px-2 bg-indigo-1 c-indigo-7 rd-1">{{
            currentWord?.detail?.trans[0].pos
          }}</span>
          <span class="inline-block ml-1">{{
            currentWord?.detail?.trans[0].tranCn
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
