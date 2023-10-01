<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import { NInput, NButton, useMessage } from "naive-ui";
import { ref } from "vue";
import { invalidateCache, useRequest } from "alova";
import { recordWord, listMyWords } from "@/api/methods/word";

const message = useMessage();

const inputValue = ref("");

const recordWordReq = useRequest(recordWord, { immediate: false });
recordWordReq.onError((err) => {
  message.error(err.error.message);
});
recordWordReq.onSuccess(() => {
  message.success("添加成功");
  inputValue.value = "";
  invalidateCache(listMyWords());
});

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

const handleSubmit = () => {
  if (inputValue.value.trim() === "") return message.warning("请输入单词");

  const mostFrequentNonLetter = getMostFrequentNonLetter(inputValue.value);
  const words = inputValue.value
    .split(mostFrequentNonLetter)
    .filter((word) => word.trim() !== "");
  recordWordReq.send(words);
};
</script>

<template>
  <div class="">
    <CommonHeader title="添加单词" />

    <div class="px-4 pb-4 flex flex-col">
      <NInput
        v-model:value="inputValue"
        type="textarea"
        placeholder="请输入单词(们?)"
      />
      <NButton
        class="mt-3 self-end"
        type="primary"
        :loading="recordWordReq.loading.value"
        @click="handleSubmit"
        >提交</NButton
      >
    </div>
  </div>
</template>
