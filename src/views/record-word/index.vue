<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import { NInput, NButton } from "naive-ui";
import { ref } from "vue";

const inputValue = ref("");

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

const submitLoading = ref(false);
const handleSubmit = () => {
  submitLoading.value = true;
  const words = inputValue.value
    .split(getMostFrequentNonLetter(inputValue.value))
    .map((word) => word.trim());
  console.log(words);
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
        :loading="submitLoading"
        @click="handleSubmit"
        >提交</NButton
      >
    </div>
  </div>
</template>
