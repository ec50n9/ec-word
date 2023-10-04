<script lang="ts" setup>
// @ts-ignore
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import monacoJsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import monacoTsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import monacoEditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { computed, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    value: string;
    language?: string;
  }>(),
  {
    language: "javascript",
  }
);

const emit = defineEmits<{
  (e: "update:value", value: string): void;
}>();

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    switch (label) {
      case "json":
        return new monacoJsonWorker();
      case "typescript":
      case "javascript":
        return new monacoTsWorker();
      default:
        return new monacoEditorWorker();
    }
  },
};

const editorRef = ref<HTMLDivElement | null>(null);
let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;

defineExpose({
  monacoEditor: computed(() => monacoEditor),
  focus() {
    monacoEditor?.focus();
  },
});

watch(
  () => props.value,
  (value) => {
    if (value !== monacoEditor?.getValue()) {
      monacoEditor?.setValue(value);
    }
  }
);

onMounted(() => {
  monacoEditor = monaco.editor.create(editorRef.value!, {
    value: props.value,
    language: props.language,
    // theme: "vs-dark",
    // selectOnLineNumbers: true,
    // renderSideBySide: false,
    automaticLayout: true,
    minimap: { enabled: false },
    contextmenu: false,
    tabSize: 2,
  });
  // 监听值变化
  monacoEditor.onDidChangeModelContent(() => {
    emit("update:value", monacoEditor!.getValue());
  });

  return () => {
    monacoEditor?.dispose();
  };
});
</script>

<template>
  <div ref="editorRef"></div>
</template>
