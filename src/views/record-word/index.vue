<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import {
  NInput,
  NButton,
  NDrawer,
  NDrawerContent,
  NIcon,
  useMessage,
} from "naive-ui";
import { ArrowForwardRound } from "@vicons/material";
import { ref } from "vue";
import { invalidateCache, useRequest } from "alova";
import { recordWord, listMyWords, translate } from "@/api/methods/word";

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

// 提交事件
const handleTranslate = () => {
  if (inputValue.value.trim() === "") return message.warning("请输入单词");

  const mostFrequentNonLetter = getMostFrequentNonLetter(inputValue.value);
  const words = mostFrequentNonLetter
    ? inputValue.value
        .split(mostFrequentNonLetter)
        .filter((word) => word.trim() !== "")
    : [inputValue.value];
  translateReq.send(words);
};

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
      <div class="mt-3 flex justify-end gap-3">
        <NButton @click="handleUpload">选择文件</NButton>
        <NButton
          type="primary"
          :loading="translateReq.loading.value"
          @click="handleTranslate"
          >提交</NButton
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
              :loading="recordWordReq.loading.value"
              @click="handleUploadRecord"
            >
              确认添加
            </n-button>
          </div>
        </template>

        <ul class="flex flex-wrap gap-3">
          <li
            v-for="item in translateReq.data.value"
            class="px-3 py-2 flex justify-between items-center gap-3 b rd-3"
          >
            <span>{{ item.word }}</span>
            <n-icon class="text-lg c-gray-3">
              <arrow-forward-round />
            </n-icon>
            <span>{{ item.translation }}</span>
          </li>
        </ul>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
