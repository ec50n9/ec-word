<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import CodeEditor from "./components/code-editor.vue";
// @ts-ignore
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { Component as VueComponent, h, ref } from "vue";
import { NIcon, DropdownOption, NButton, NDropdown } from "naive-ui";
import {
  MenuRound,
  UndoRound,
  RedoRound,
  SaveRound,
  FormatPaintTwotone,
  KeyboardTabRound,
} from "@vicons/material";

const codeEditor = ref<typeof CodeEditor | null>(null);

const value = ref(`/**
 * @param {string} word
 * @param {object} userRecord
 * @param {Record<string, any>} vars
 */
function filter(word, userRecord, vars) {
  alert('Hello world!');
}
`);

// 依赖编辑器上下文的操作
const withEditor = (fn: (editor: typeof CodeEditor) => void) => () => {
  const editor = codeEditor.value?.monacoEditor;
  if (!editor) return;
  fn(editor);
  editor.focus();
};

// 渲染图标
const renderIcon = (icon: VueComponent) => () =>
  h(NIcon, null, { default: () => h(icon) });

const actions = [
  // 撤销
  {
    icon: renderIcon(UndoRound),
    action: withEditor((editor) => {
      editor.trigger("undo", "undo", {});
    }),
  },
  // 重做
  {
    icon: renderIcon(RedoRound),
    action: withEditor((editor) => {
      editor.trigger("redo", "redo", {});
    }),
  },
  // 缩进
  {
    icon: renderIcon(KeyboardTabRound),
    action: withEditor((editor) => {
      editor.trigger("tab", "editor.action.indentLines", {});
    }),
  },
  // 格式化
  {
    name: "格式化",
    icon: renderIcon(FormatPaintTwotone),
    action: withEditor((editor) => {
      editor.trigger("format", "editor.action.formatDocument", {});
    }),
  },
];

// 配置下拉菜单
type CustomDropdownOption = DropdownOption & { onClick?: () => void };
const dropdownOptions: CustomDropdownOption[] = [
  {
    label: "添加单词",
    key: "add-word",
  },
];
const handleDropdownSelect = (
  _key: string | number,
  option: CustomDropdownOption
) => {
  option.onClick?.();
};

// 完成按钮点击事件
const handleComplete = () => {
  console.log("完成");
};
</script>

<template>
  <div class="w-full h-full flex flex-col bg-slate-1 c-gray-7">
    <!-- 顶部栏 -->
    <common-header class="bg-white" title="编辑模板" size="medium">
      <!-- 菜单按钮 -->
      <n-dropdown
        trigger="click"
        :options="dropdownOptions"
        show-arrow
        size="large"
        @select="handleDropdownSelect"
      >
        <n-button strong secondary round type="tertiary">
          <template #icon>
            <n-icon><menu-round /></n-icon>
          </template>
          菜单
        </n-button>
      </n-dropdown>

      <!-- 完成按钮 -->
      <n-button strong secondary circle type="info" @click="handleComplete">
        <template #icon>
          <n-icon><save-round /></n-icon>
        </template>
      </n-button>
    </common-header>

    <!-- 内容 -->
    <div class="grow h-0">
      <code-editor
        ref="codeEditor"
        class="w-full h-full"
        v-model:value="value"
      />
    </div>

    <!-- 快捷操作栏 -->
    <ul
      class="shrink-0 px-2 py-2 flex gap-2 bg-white b-t of-x-auto"
    >
      <n-button
        v-for="item in actions"
        :key="item.name"
        :round="!!item.name"
        :circle="!item.name"
        type="tertiary"
        size="small"
        @click="item.action"
      >
        <template v-if="item.icon" #icon>
          <component :is="item.icon" />
        </template>
        <span v-if="item.name">
          {{ item.name }}
        </span>
      </n-button>
    </ul>
  </div>
</template>
