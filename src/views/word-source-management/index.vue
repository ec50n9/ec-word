<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import WordBookItem from "./components/word-book-item.vue";
import {
  DropdownOption,
  NDropdown,
  NButton,
  NIcon,
  NDrawer,
  NDrawerContent,
  NSkeleton,
  NSpace,
  useMessage,
  NEmpty,
} from "naive-ui";
import { PlusRound, BookRound } from "@vicons/material";
import { Component, computed, h, reactive, ref, watch } from "vue";
import { invalidateCache, useRequest } from "alova";
import {
  WordBook,
  bindWordBook,
  listMyWordBooks,
  listWordBooks,
  unbindWordBook,
} from "@/api/methods/word";

const message = useMessage();

const renderIcon = (icon: Component) => () =>
  h(NIcon, null, { default: () => h(icon) });

// 下拉菜单相关
type CustomDropdownOption = DropdownOption & { onClick?: () => void };
const dropdownOptions: CustomDropdownOption[] = [
  {
    label: "添加词书",
    key: "add-word-book",
    icon: renderIcon(BookRound),
    onClick: () => {
      selectWordBookDrawerVisible.value = true;
    },
  },
  {
    label: "自定义词书",
    key: "create-custom-word-source",
    icon: renderIcon(PlusRound),
  },
];
const handleDropdownSelect = (
  _key: string | number,
  option: CustomDropdownOption
) => {
  option.onClick?.();
};

// 加载用户词书列表的接口
const listMyWordBooksReq = useRequest(listMyWordBooks);
const myWordBookIds = computed(
  () => new Set(listMyWordBooksReq.data.value?.map((book) => book._id))
);

// 选择词书弹窗相关
const selectWordBookDrawerVisible = ref(false);
watch(selectWordBookDrawerVisible, (visible) => {
  if (visible) listWordBooksReq.send();
  else checkedWordBookIds.clear();
});

// 获取全部词书列表的接口
const listWordBooksReq = useRequest(listWordBooks, {
  immediate: false,
  initialData: Array.from({ length: 5 }, (_, i) => ({
    _id: i,
    title: `词书${i}`,
  })),
});
const checkedWordBookIds = reactive(new Set());
const handleCheckWordBook = (id: string) => {
  if (myWordBookIds.value.has(id)) return message.warning("该词书已添加");

  if (checkedWordBookIds.has(id)) {
    checkedWordBookIds.delete(id);
  } else {
    checkedWordBookIds.add(id);
  }
};
// 添加选中的词书
const handleAddCheckedWordBook = () => {
  bindWordBookReq.send(Array.from(checkedWordBookIds));
};
// 取消选择词书
const handleCancelSelectWordBook = () => {
  selectWordBookDrawerVisible.value = false;
};

// 绑定词书的请求
const bindWordBookReq = useRequest(bindWordBook, { immediate: false });
bindWordBookReq.onSuccess(() => {
  message.success("添加词书 📖 成功");

  // 刷新词书列表
  invalidateCache(listMyWordBooks());
  listMyWordBooksReq.send();

  // 关闭弹窗，清理选择
  selectWordBookDrawerVisible.value = false;
});

// 解绑词书的请求
const unbindWordBookReq = useRequest(unbindWordBook, { immediate: false });
unbindWordBookReq.onSuccess(() => {
  message.success("删除词书 📖 成功");

  // 刷新词书列表
  invalidateCache(listMyWordBooks());
  listMyWordBooksReq.send();
});

// 删除词书
const handleMyWordBookDelete = (wordBook: WordBook) => {
  unbindWordBookReq.send([wordBook._id]);
};

// 点击词书
const handleWordBookClick = (_wordBook: WordBook) => {
  message.info("等等，这里还没写好呢伙计 🦃️");
};
</script>

<template>
  <div class="w-full h-full flex flex-col bg-slate-1">
    <!-- 顶部栏 -->
    <common-header title="词源管理">
      <!-- 配置按钮 -->
      <n-dropdown
        trigger="click"
        :options="dropdownOptions"
        show-arrow
        size="large"
        @select="handleDropdownSelect"
      >
        <n-button strong secondary type="primary">
          <template #icon>
            <n-icon><plus-round /></n-icon>
          </template>
          添加</n-button
        >
      </n-dropdown>
    </common-header>

    <!-- 词书列表 -->
    <ul class="p-3 flex flex-col gap-3">
      <n-skeleton
        v-if="listMyWordBooksReq.loading.value"
        :repeat="5"
        height="80px"
        :sharp="false"
      />

      <n-empty
        v-else-if="listMyWordBooksReq.data.value?.length === 0"
        class="mt-10"
        description="啊？你怎么一个词源都没有，害！"
        size="large"
      >
        <template #extra>
          <n-button size="small" @click="dropdownOptions[0].onClick?.()">
            🤔 看看有啥词书先
          </n-button>
        </template>
      </n-empty>

      <template v-else>
        <!-- 词书item -->
        <word-book-item
          v-for="item in listMyWordBooksReq.data.value"
          :key="item._id"
          :word-book="item"
          show-delete
          @delete="handleMyWordBookDelete"
          @click="handleWordBookClick(item)"
        />
      </template>
    </ul>

    <!-- 选择词书弹窗 -->
    <n-drawer
      v-model:show="selectWordBookDrawerVisible"
      height="90%"
      placement="bottom"
    >
      <n-drawer-content
        :title="`选择词书（共${listWordBooksReq.data.value?.length || 0}本）`"
        closable
      >
        <ul class="flex flex-col gap-3 c-gray-7">
          <template v-if="listWordBooksReq.loading.value">
            <n-skeleton :repeat="5" height="80px" :sharp="false" />
          </template>
          <template v-else>
            <!-- 词书item -->
            <word-book-item
              v-for="item in listWordBooksReq.data.value"
              :key="item._id"
              :word-book="item"
              :checked="checkedWordBookIds.has(item._id)"
              :badge="myWordBookIds.has(item._id) ? '已添加' : ''"
              @click="handleCheckWordBook(item._id)"
            />
          </template>
        </ul>

        <template #footer>
          <n-space>
            <n-button size="medium" @click="handleCancelSelectWordBook">
              取消
            </n-button>

            <n-button
              size="medium"
              type="primary"
              @click="handleAddCheckedWordBook"
              :loading="bindWordBookReq.loading.value"
              :disabled="checkedWordBookIds.size === 0"
            >
              添加 {{ checkedWordBookIds.size }} 本
            </n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
