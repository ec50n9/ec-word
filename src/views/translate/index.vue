<script lang="ts" setup>
import { translate } from "@/api/methods/word";
import CommonHeader from "@/components/common-header.vue";
import { useRequest } from "alova";
import { useI18n } from "vue-i18n";
import { ArrowForwardRound } from "@vicons/material";
import en from "@/locales/en.json";

const message = useMessage();
const { t } = useI18n();

const inputValue = ref("");
const fromLang = ref("auto");
const toLang = ref("en");

const toLangOptions = Object.keys(en.lang).map((key) => ({
  label: t(`lang.${key}`),
  value: key,
}));
const fromLangOptions = [{ label: t("auto"), value: "auto" }, ...toLangOptions];

// 翻译接口
const translateReq = useRequest(translate, {
  immediate: false,
});
translateReq.onSuccess((_res) => {});

// 翻译事件
const handleTranslate = () => {
  if (inputValue.value.trim() === "") return message.warning("请输入单词");
  translateReq.send(inputValue.value, fromLang.value, toLang.value);
};
</script>

<template>
  <n-el
    tag="div"
    class="w-full min-h-screen"
    style="color: var(--primary-color); background-color: var(--base-color)"
  >
    <!-- 顶部导航栏 -->
    <common-header title="翻译" />

    <div class="px-4 pb-4 flex flex-col">
      <!-- 翻译语言 -->
      <div class="mb-3 flex gap-3">
        <n-select
          v-model:value="fromLang"
          :options="fromLangOptions"
          filterable
          placeholder="请选择源语言"
        />
        <n-icon class="self-center text-2xl c-gray-4">
          <arrow-forward-round />
        </n-icon>
        <n-select
          v-model:value="toLang"
          :options="toLangOptions"
          filterable
          placeholder="请选择目标"
        />
      </div>

      <!-- 翻译输入框 -->
      <n-input
        v-model:value="inputValue"
        placeholder="请输入单词(们?)"
        type="textarea"
        :autosize="{
          minRows: 3,
          maxRows: 10,
        }"
      />

      <!-- 操作栏 -->
      <div class="mt-3 flex justify-end items-center gap-3">
        <!-- <div class="grow flex flex-col items-start gap-1">
          <span class="c-gray-4">自动分割单词</span>
          <NSwitch v-model:value="autoSplit" />
        </div> -->
        <!-- <n-button class="shrink-0" @click="handleUpload">选择文件</n-button> -->
        <n-button
          class="shrink-0"
          type="primary"
          :loading="translateReq.loading.value"
          @click="handleTranslate"
          >开始翻译</n-button
        >
      </div>
    </div>

    <!-- 翻译结果 -->
    <div v-if="translateReq.data.value" class="mx-4 flex flex-col gap-3">
      <n-spin :show="translateReq.loading.value">
        <n-el
          tag="div"
          v-for="item in translateReq.data.value"
          class="px-4 py-3 b rd-3"
          style="
            background-color: var(--input-color);
            color: var(--text-color-2);
          "
        >
          {{ item.translation }}
        </n-el>
      </n-spin>
    </div>
  </n-el>
</template>
