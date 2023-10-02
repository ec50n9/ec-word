<script lang="ts" setup>
import { WordSimpResp } from "@/api/methods/word";

defineProps<{
  currentWord: WordSimpResp | null;
}>();
</script>

<template>
  <div
    class="px-5 py-3 text-base bg-white c-slate-7 rd-3 select-none"
    style="
      box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
        rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    "
  >
    <div v-if="currentWord" class="flex items-center">
      <!-- 单词 -->
      <h2 class="grow text-2xl">{{ currentWord.word }}</h2>
      <!-- 音标 -->
      <div
        v-if="currentWord.detail"
        class="flex flex-wrap justify-end gap-x-2 gap-y-1 text-sm"
      >
        <span v-if="currentWord.detail.usphone" class="px-2 bg-red-1 c-red-7"
          >美·{{ currentWord.detail.usphone }}</span
        >
        <span v-if="currentWord.detail.ukphone" class="px-2 bg-blue-1 c-blue-7"
          >英·{{ currentWord.detail.ukphone }}</span
        >
      </div>
    </div>

    <!-- 翻译 -->
    <template v-if="currentWord?.detail?.trans">
      <h2 class="mt-3 inline-block c-gray-4">释义:</h2>
      <p v-for="tran in currentWord?.detail?.trans">
        <span class="px-2 text-sm bg-indigo-1 c-indigo-7 rd-1"
          >{{ tran.pos }}.</span
        >
        <span class="inline-block ml-1">{{ tran.tranCn }}</span>
      </p>
    </template>

    <!-- 助记 -->
    <template v-if="currentWord?.detail?.remMethod">
      <h2 class="mt-3 inline-block c-gray-4">
        {{ currentWord?.detail?.remMethod.desc }}:
      </h2>
      <p>
        {{ currentWord?.detail?.remMethod.val }}
      </p>
    </template>
  </div>
</template>
