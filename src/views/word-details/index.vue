<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { onBeforeUnmount, ref, shallowRef } from "vue";
// @ts-ignore
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = defineProps<{
  word: string;
}>();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const mode = "simple";

// 内容 HTML
const valueHtml = ref("<p>hello</p>");

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<template>
  <div class="w-full min-h-screen bg-slate-1">
    <CommonHeader :title="props.word" />

    <div class="px-3 pb-3">
      <!-- <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      /> -->
    </div>
  </div>
</template>
