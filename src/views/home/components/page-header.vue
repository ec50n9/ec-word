<script lang="ts" setup>
import {
  PlusRound,
  RecordVoiceOverTwotone,
  LogOutRound,
  LibraryBooksRound,
  AutoAwesomeRound,
  TranslateRound,
  HelpRound,
  MenuRound,
  SourceRound,
} from "@vicons/material";
import CommonHeader from "@/components/common-header.vue";
import { NIcon, DropdownOption } from "naive-ui";
import { CSSProperties } from "vue";
import router from "@/router";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";
import { ThemeType, themeMap } from "@/config/theme";

defineProps<{
  showShadow: boolean;
  audioLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:showShadow", showShadow: boolean): void;
  (e: "open-guide-modal"): void;
}>();

const userStore = useUserStore();
const appStore = useAppStore();
const dialog = useDialog();
const message = useMessage();

// 语音类型切换的背景色
const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#fca5a5";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    style.background = "#93c5fd";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

const renderIcon = (icon: Component) => () =>
  h(NIcon, null, { default: () => h(icon) });

// 配置下拉菜单
type CustomDropdownOption = DropdownOption & { onClick?: () => void };
const dropdownOptions: CustomDropdownOption[] = [
  {
    label: "添加单词",
    key: "add-word",
    icon: renderIcon(PlusRound),
    onClick: () => router.push("/record-word"),
  },
  {
    label: "翻译",
    key: "translate",
    icon: renderIcon(TranslateRound),
  },
  {
    type: "divider",
    key: "d0",
  },
  {
    label: "发音",
    key: "speech",
    icon: renderIcon(RecordVoiceOverTwotone),
    children: [
      {
        label: "美式发音",
        key: "us",
        icon: () => h("span", null, "🇺🇸"),
        onClick: () => {
          appStore.updateSpeechType(true);
        },
      },
      {
        label: "英式发音",
        key: "uk",
        icon: () => h("span", null, "🇬🇧"),
        onClick: () => {
          appStore.updateSpeechType(false);
        },
      },
    ],
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "词源管理",
    key: "word-source-management",
    icon: renderIcon(LibraryBooksRound),
    onClick: () => {
      router.push("/word-source-management");
    },
  },
  {
    label: "规则管理",
    key: "rule-management",
    icon: renderIcon(AutoAwesomeRound),
    onClick: () => {
      router.push("/rule-management");
    },
  },
  {
    label: "规则模板",
    key: "rule-template-management",
    icon: renderIcon(SourceRound),
    onClick: () => {
      router.push("/rule-template-management");
    },
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "主题",
    key: "theme",
    icon: renderIcon(RecordVoiceOverTwotone),
    children: Object.keys(themeMap).map((key) => {
      const theme = themeMap[key as ThemeType];
      return {
        label: theme.name,
        key: theme.name,
        icon: () => h("span", null, ""),
        onClick: () => {
          appStore.updateCurrentTheme(key as ThemeType);
        },
      };
    }),
  },
  {
    label: "帮助",
    key: "help",
    icon: renderIcon(HelpRound),
    onClick: () => emit("open-guide-modal"),
  },
  // {
  //   label: "设置",
  //   key: "setting",
  //   icon: renderIcon(SettingsRound),
  // },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogOutRound),
    onClick: () => {
      dialog.warning({
        showIcon: false,
        title: "🥹 能和你交流一下吗",
        content:
          "🚶‍♀️ 真的要走了吗？还会再回来吗？我们还会再见吗？你一定要幸福要开心啊...",
        positiveText: "嗯",
        negativeText: "手滑",
        onNegativeClick() {
          message.info("😚 斗晓得侬离不开鹅", {
            showIcon: false,
          });
        },
        onPositiveClick() {
          userStore.logout();
          message.info("👋 拜拜了您嘞", { showIcon: false });
        },
      });
    },
  },
];
const handleDropdownSelect = (
  _key: string | number,
  option: CustomDropdownOption
) => {
  option.onClick?.();
};

// 暴露方法
defineExpose({
  dropdownOptions,
});
</script>

<template>
  <!-- 顶部栏 -->
  <common-header
    :title="$t('hello')"
    :show-back="false"
    :class="{ shadow: showShadow }"
  >
    <div class="flex items-center gap-3">
      <!-- 播放器 -->
      <n-switch
        class="shrink-0"
        :value="appStore.speechType"
        @update:value="appStore.updateSpeechType"
        :round="false"
        size="large"
        :rail-style="railStyle"
        :loading="audioLoading"
      >
        <template #icon>
          <n-icon><record-voice-over-twotone /></n-icon>
        </template>
        <template #checked>🇺🇸</template>
        <template #unchecked>🇬🇧</template>
      </n-switch>

      <!-- 配置按钮 -->
      <n-dropdown
        trigger="click"
        :options="dropdownOptions"
        show-arrow
        size="large"
        @select="handleDropdownSelect"
      >
        <n-button strong secondary round type="primary">
          <template #icon>
            <n-icon><menu-round /></n-icon>
          </template>
          菜单
        </n-button>
      </n-dropdown>
    </div>
  </common-header>
</template>
