<script lang="ts" setup>
import { useRequest } from "alova";
import { WordSimpResp, listMyWords } from "@/api/methods/word";
import { useAppStore } from "@/store/modules/app";
import { useAudio } from "./hooks/useAudio";
import WordDialog from "./components/word-dialog.vue";
import PageHeader from "./components/page-header.vue";
import GuideModal from "./components/guide-modal.vue";

const appStore = useAppStore();
const router = useRouter();
const audio = useAudio();

const headerRef = ref<InstanceType<typeof PageHeader>>();

const audioBaseURL = "https://dict.youdao.com/dictvoice?audio=";

// 获取单词列表
const listMyWordsReq = useRequest(listMyWords);

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
      router.push({
        path: "/words/details",
        query: {
          id: word.word,
        },
      });
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

// 引导弹窗
const guideModalVisible = ref(false);
const handleOpenGuideModal = () => {
  guideModalVisible.value = true;
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
    <page-header
      ref="headerRef"
      :show-shadow="scrollTop > 0"
      :audio-loading="audio.loading.value"
      @open-guide-modal="handleOpenGuideModal"
    />

    <!-- 单词列表 -->
    <transition name="fade" mode="out-in">
      <n-result
        v-if="listMyWordsReq.error.value"
        status="500"
        title="加载失败"
        :description="listMyWordsReq.error.value.message"
      />

      <n-empty
        v-else-if="listMyWordsReq.data.value?.length === 0"
        class="mt-10"
        :description="$t('word-list-empty-tip')"
        size="large"
      >
        <template #extra>
          <n-button
            size="small"
            @click="headerRef?.dropdownOptions[0].onClick?.()"
          >
            🚪 前往添加
          </n-button>
        </template>
      </n-empty>

      <div
        v-else
        ref="listRef"
        class="grow h-0 px-3 py-2 of-auto"
        @scroll="handleListScroll"
      >
        <transition name="fade" mode="out-in">
          <template v-if="listMyWordsReq.loading.value">
            <ul class="grid grid-cols-2 gap-2">
              <n-skeleton :repeat="11" height="40px" :sharp="false" />
            </ul>
          </template>

          <template v-else>
            <ul class="grid grid-cols-2 gap-2">
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
            </ul>
          </template>
        </transition>
      </div>
    </transition>

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
