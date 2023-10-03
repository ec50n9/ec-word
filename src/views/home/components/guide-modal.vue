<script lang="ts" setup>
import { NModal } from "naive-ui";
import { useAppStore } from "@/store/modules/app";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
}>();

const appStore = useAppStore();
</script>

<template>
  <n-modal
    :show="props.visible"
    @update:show="emit('update:visible', $event)"
    preset="dialog"
    :show-icon="false"
    title="🤚 桥豆麻袋！"
    positive-text="👌 ok，我懂"
    @positive-click="() => appStore.updateFirstOpen(false)"
  >
    <p class="text-base">
      😠 这里是你的
      <span class="text-lg font-bold">单词列表</span>
      ，如果你看到的是空白的话，那说明你应该先点
      <span class="text-xl c-orange">右上角</span> 添加一些单词进来。
    </p>
    <br />
    <p class="text-base">🧑‍🏫 而这个列表只有几个简单的操作，麻烦记一下：</p>
    <ul class="list-disc list-inside text-base">
      <li>
        👆 <span class="text-lg text-green font-bold">单击</span> 单词
        <span class="text-blue text-lg">查看详情</span>
      </li>
      <li>
        ✌️ <span class="text-2xl text-red">双击</span>
        <span class="line-through">单词</span>
        <span class="text-2xl font-bold text-orange">发音</span>
      </li>
      <li>
        🦶 <span class="text-lg font-italic text-fuchsia">长按</span>
        <span class="text-xs">单词</span>
        <span class="text-3xl c-indigo">快速预览</span>
      </li>
    </ul>
    <br />
    <p class="text-base">
      🤫 就这么多了，如果实在记不住
      <span class="c-gray-4">(扶额、叹气、360度大幅度摇头)</span>
      ，点击
      <span class="text-xl c-red">左上角</span>
      就可以再弹出来了，祝你使用愉...
    </p>
    <p class="text-base">🤔 emmm，即使不愉快的话也别投诉我🙄，拜拜 👋</p>
    <p class="text-xs c-gray-1">
      最终解释权归 <span class="c-gray-1">ec50n9</span> 所有（应该看不到吧）
    </p>
  </n-modal>
</template>
