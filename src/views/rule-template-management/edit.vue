<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import CodeEditor from "./components/code-editor.vue";
// @ts-ignore
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { Component as VueComponent, h, ref } from "vue";
import { NIcon, DropdownOption, NButton, NDropdown, NSkeleton } from "naive-ui";
import {
  MenuRound,
  UndoRound,
  RedoRound,
  SaveRound,
  FormatPaintTwotone,
  KeyboardTabRound,
  ArrowUpwardRound,
  ArrowDownwardRound,
  ArrowBackRound,
  ArrowForwardRound,
} from "@vicons/material";
import {
  getRuleTemplate,
  updateRuleTemplate,
} from "@/api/methods/rule-template";
import { useRequest } from "alova";
import { useRoute } from "vue-router";

const router = useRoute();
const message = useMessage();

const { id } = router.query as { id: string };

const codeEditor = ref<typeof CodeEditor | null>(null);

const value = ref("");

// 获取模板请求
const getRuleTemplateReq = useRequest(() => getRuleTemplate(id));
getRuleTemplateReq.onError((err) => {
  message.error(err.error.message);
});
getRuleTemplateReq.onSuccess((res) => {
  value.value = res.data.code;
});

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
  // 缩进
  {
    icon: renderIcon(KeyboardTabRound),
    action: withEditor((editor) => {
      editor.trigger("tab", "editor.action.indentLines", {});
    }),
  },
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
  // 向上
  {
    icon: renderIcon(ArrowUpwardRound),
    action: withEditor((editor) => {
      editor.trigger("up", "cursorUp", {});
    }),
  },
  // 向下
  {
    icon: renderIcon(ArrowDownwardRound),
    action: withEditor((editor) => {
      editor.trigger("down", "cursorDown", {});
    }),
  },
  // 向左
  {
    icon: renderIcon(ArrowBackRound),
    action: withEditor((editor) => {
      editor.trigger("left", "cursorLeft", {});
    }),
  },
  // 向右
  {
    icon: renderIcon(ArrowForwardRound),
    action: withEditor((editor) => {
      editor.trigger("right", "cursorRight", {});
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
    label: "暂无",
    key: "none",
  },
];
const handleDropdownSelect = (
  _key: string | number,
  option: CustomDropdownOption
) => {
  option.onClick?.();
};

// 更新模板请求
const updateRuleTemplateReq = useRequest(
  () => updateRuleTemplate({ _id: id, code: value.value }),
  { immediate: false }
);
updateRuleTemplateReq.onError((err) => {
  message.error(err.error.message);
});
updateRuleTemplateReq.onSuccess((_res) => {
  message.success("保存成功！");
});

// 完成按钮点击事件
const handleComplete = () => {
  updateRuleTemplateReq.send();
};
</script>

<template>
  <div class="w-full h-full flex flex-col bg-slate-1 c-gray-7">
    <!-- 顶部栏 -->
    <common-header
      class="bg-white"
      :title="getRuleTemplateReq.data.value?.name || '编辑模板'"
      size="medium"
    >
      <!-- 菜单按钮 -->
      <n-dropdown
        trigger="click"
        :options="dropdownOptions"
        show-arrow
        size="large"
        @select="handleDropdownSelect"
      >
        <n-button strong secondary circle type="tertiary">
          <template #icon>
            <n-icon><menu-round /></n-icon>
          </template>
        </n-button>
      </n-dropdown>

      <!-- 完成按钮 -->
      <n-button
        strong
        secondary
        round
        type="primary"
        :loading="updateRuleTemplateReq.loading.value"
        @click="handleComplete"
      >
        <template #icon>
          <n-icon><save-round /></n-icon>
        </template>
        保存
      </n-button>
    </common-header>

    <!-- 内容 -->
    <div class="grow h-0">
      <transition name="fade" mode="out-in">
        <div v-if="getRuleTemplateReq.loading.value" class="py-3 px-5">
          <n-skeleton text size="medium" :repeat="5" />
          <n-skeleton text size="medium" style="width: 60%" />
        </div>

        <code-editor
          v-else
          ref="codeEditor"
          class="w-full h-full"
          v-model:value="value"
        />
      </transition>
    </div>

    <!-- 快捷操作栏 -->
    <ul class="shrink-0 px-2 py-2 flex gap-2 bg-white b-t of-x-auto">
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
