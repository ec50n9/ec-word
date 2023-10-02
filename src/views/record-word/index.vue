<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import {
  NInput,
  NButton,
  NDrawer,
  NDrawerContent,
  NIcon,
  NSwitch,
  useMessage,
} from "naive-ui";
import { ArrowForwardRound, ArrowDownwardRound } from "@vicons/material";
import { computed, ref } from "vue";
import { invalidateCache, useRequest } from "alova";
import {
  recordWord,
  listMyWords,
  translate,
  batchQueryWord,
} from "@/api/methods/word";

const message = useMessage();

const inputValue = ref("");

// 上传单词接口
const recordWordReq = useRequest(recordWord, { immediate: false });
recordWordReq.onError((err) => {
  message.error(err.error.message);
});
recordWordReq.onSuccess(() => {
  inputValue.value = "";
  invalidateCache(listMyWords());
  message.success("添加成功");
  drawerVisible.value = false;
});

// 翻译接口
const translateReq = useRequest(translate, { immediate: false });
translateReq.onError((err) => {
  message.error(err.error.message);
});
translateReq.onSuccess((_res) => {
  drawerVisible.value = true;
});

// 批量查询单词接口
const batchQueryReq = useRequest(batchQueryWord, { immediate: false });
batchQueryReq.onError((err) => {
  message.error(err.error.message);
});
batchQueryReq.onSuccess((_res) => {
  drawerVisible.value = true;
});

// 翻译结果查看
const drawerVisible = ref(false);

/**
 * 统计字符串中出现频率最高的非字母字符
 * @param str
 * @returns
 */
const getMostFrequentNonLetter = (str: string) => {
  const map = new Map<string, number>();
  for (const char of str) {
    if (("a" <= char && char <= "z") || ("A" <= char && char <= "Z")) continue;

    if (map.has(char)) {
      map.set(char, map.get(char)! + 1);
    } else {
      map.set(char, 1);
    }
  }
  let max = 0;
  let maxChar = "";
  for (const [char, count] of map) {
    if (count > max) {
      max = count;
      maxChar = char;
    }
  }
  return maxChar;
};

// 是否自动分割
const autoSplit = ref(true);

// 单词列表
const splitedWords = computed(() => {
  if (inputValue.value.trim() === "" || !autoSplit.value) return [];

  const mostFrequentNonLetter = getMostFrequentNonLetter(inputValue.value);
  const words = inputValue.value
    .split(mostFrequentNonLetter)
    .map((word) => word.trim())
    .filter((word) => word);
  return words;
});

// 提交事件
const handleTranslate = () => {
  if (inputValue.value.trim() === "") return message.warning("请输入单词");

  if (autoSplit.value) batchQueryReq.send(splitedWords.value);
  else translateReq.send([inputValue.value]);
};

// 翻译按钮的加载状态
const translateBtnLoading = computed(() =>
  autoSplit.value ? batchQueryReq.loading.value : translateReq.loading.value
);

// 通过上传文件导入
const handleUpload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt";
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      inputValue.value = result;
    };
    reader.readAsText(file);
  };
  input.click();
};

// 上传单词记录
const handleUploadRecord = () => {
  recordWordReq.send(translateReq.data.value.map((item) => item.word));
};
</script>

<template>
  <div class="w-full min-h-screen bg-slate-1">
    <CommonHeader title="添加单词" />

    <div class="px-4 pb-4 flex flex-col">
      <NInput
        v-model:value="inputValue"
        placeholder="请输入单词(们?)"
        type="textarea"
        :autosize="{
          minRows: 3,
          maxRows: 10,
        }"
      />
      <div class="mt-3 flex justify-end items-center gap-3">
        <div class="grow flex flex-col items-start gap-1">
          <span class="c-gray-4">自动分割单词</span>
          <NSwitch v-model:value="autoSplit" />
        </div>
        <NButton class="shrink-0" @click="handleUpload">选择文件</NButton>
        <NButton
          class="shrink-0"
          type="primary"
          :loading="translateReq.loading.value"
          @click="handleTranslate"
          >开始翻译</NButton
        >
      </div>
    </div>

    <n-drawer v-model:show="drawerVisible" placement="bottom" height="90%">
      <n-drawer-content header-style="display:block;">
        <template #header>
          <div class="flex justify-between items-center">
            <span>翻译结果</span>
            <n-button
              class="self-end"
              size="medium"
              type="primary"
              :loading="translateBtnLoading"
              @click="handleUploadRecord"
            >
              确认添加
            </n-button>
          </div>
        </template>

        <!-- 自动切割的单词翻译结果 -->
        <ul v-if="autoSplit" class="flex flex-wrap gap-3">
          <template v-for="item in splitedWords" :key="item">
            <!-- 正常翻译结果 -->
            <li
              v-if="batchQueryReq.data.value?.has(item)"
              class="px-3 py-2 flex justify-between items-center gap-3 b rd-3 bg-emerald-50 b-emerald-5 c-emerald-7"
            >
              <span>{{ item }}</span>
              <n-icon class="text-lg c-emerald-6">
                <arrow-forward-round />
              </n-icon>
              <span>{{
                batchQueryReq.data.value
                  .get(item)!
                  .trans.map((tran) => tran.tranCn)
                  .join("、")
              }}</span>
            </li>

            <!-- 未翻译的 -->
            <li v-else class="px-3 py-2 b rd-3 bg-red-50 b-red-2 c-red-7">
              {{ item }}
            </li>
          </template>
        </ul>

        <!-- 整句翻译结果 -->
        <div v-else class="flex flex-col gap-3">
          <div class="px-5 py-3 b rd-3">
            {{ translateReq.data.value[0].word }}
          </div>
          <n-icon class="self-center text-2xl c-gray-3">
            <arrow-downward-round />
          </n-icon>
          <div class="px-5 py-3 b rd-3">
            {{ translateReq.data.value[0].translation }}
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
