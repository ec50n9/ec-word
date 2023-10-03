<script lang="ts" setup>
import { CSSProperties, onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { NButton, NIcon, NSwitch, NSkeleton, NEmpty, NResult } from "naive-ui";
import { PlusRound, RecordVoiceOverTwotone } from "@vicons/material";
import { useRequest } from "alova";
import { WordSimpResp, listMyWords } from "@/api/methods/word";
import { useAppStore } from "@/store/modules/app";
import WordDialog from "./components/word-dialog.vue";
import GuideModal from "./components/guide-modal.vue";

const appStore = useAppStore();
const router = useRouter();
const audioBaseURL = "https://dict.youdao.com/dictvoice?audio=";

// 获取单词列表
const listMyWordsReq = useRequest(listMyWords(), {
  initialData: Array.from({ length: 11 }, (_, i) => `word${i}`),
});

// 引导弹窗
const guideModalVisible = ref(false);
listMyWordsReq.onSuccess(() => {
  if (appStore.firstOpen) {
    guideModalVisible.value = true;
  }
});

// 当前查看的单词
const currentWord = ref<WordSimpResp | null>(null);
const wordDetailVisible = ref(false);

// 双击定时器
let doubleClickTimeout: NodeJS.Timeout | null = null;

// 单词点击事件
const handleWordClick = (word: WordSimpResp) => {
  if (doubleClickTimeout) {
    clearTimeout(doubleClickTimeout);
    doubleClickTimeout = null;

    // 双击事件
    audio.set(
      `${audioBaseURL}${word.word}&type=${appStore.speechType ? "2" : "1"}`
    ); // us=2 uk=1
  } else {
    doubleClickTimeout = setTimeout(() => {
      clearTimeout(doubleClickTimeout!);
      doubleClickTimeout = null;

      // 单击事件
      router.push(`/words/${word.word}`);
    }, 300);
  }
};

// 长按的定时器
let longClickTimeout: NodeJS.Timeout | null = null;

// 单词触摸开始
const handleWordTouchStart = (_e: TouchEvent, word: WordSimpResp) => {
  longClickTimeout = setTimeout(() => {
    clearTimeout(longClickTimeout!);
    longClickTimeout = null;

    // 长按事件
    currentWord.value = word;
    wordDetailVisible.value = true;
  }, 300);
};

// 单词触摸移动
const handleWordTouchMove = (_e: TouchEvent) => {
  if (longClickTimeout) {
    clearTimeout(longClickTimeout);
    longClickTimeout = null;
  }
};

// 单词触摸结束
const handleWordTouchEnd = (_e: TouchEvent, _word: WordSimpResp) => {
  if (longClickTimeout) {
    clearTimeout(longClickTimeout);
    longClickTimeout = null;
  }
  if (wordDetailVisible.value) {
    wordDetailVisible.value = false;
    return;
  }
};

// 单词列表滚动事件
const scrollTop = ref(0);
const handleListScroll = (e: Event) => {
  const target = e.target as HTMLDivElement;
  scrollTop.value = target.scrollTop;
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

// 语音类型切换的背景色
const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#ef4444";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

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
    <!-- 顶部栏 -->
    <div
      class="shrink-0 px-5 pt-5 pb-3 flex items-center justify-between gap-3 z-10 transition"
      :class="{ shadow: scrollTop > 0 }"
    >
      <!-- 标题 -->
      <h1 class="grow text-2xl c-slate-7" @click="guideModalVisible = true">
        😡 狠狠记单词
      </h1>

      <!-- 播放器 -->
      <n-switch
        class="shrink-0"
        :value="appStore.speechType"
        @update:value="appStore.updateSpeechType"
        :round="false"
        size="large"
        :rail-style="railStyle"
        :loading="audio.loading.value"
      >
        <template #icon>
          <n-icon><record-voice-over-twotone /></n-icon>
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

    <div
      v-else
      ref="listRef"
      class="grow h-0 px-3 py-2 of-auto"
      @scroll="handleListScroll"
    >
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
            class="px-3 py-3 bg-white c-slate-7 rd-2 b-2 select-none transition active:bg-slate-100 active:c-slate-9 active:scale-95"
            :class="{ 'b-emerald-2': word.detail, 'b-indigo-2': word.note }"
            @click="handleWordClick(word)"
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

    <!-- 单词弹窗 -->
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 transition"
      :class="{ 'scale-90 op-0 pointer-events-none': !wordDetailVisible }"
    >
      <word-dialog :current-word="currentWord" />
    </div>

    <!-- 使用引导弹窗 -->
    <guide-modal v-model:visible="guideModalVisible" />
  </div>
</template>
