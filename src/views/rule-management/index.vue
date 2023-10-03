<script lang="ts" setup>
import { createRule, listRules } from "@/api/methods/rule";
import CommonHeader from "@/components/common-header.vue";
import { PlusRound } from "@vicons/material";
import { invalidateCache, useRequest } from "alova";
import {
  NIcon,
  NButton,
  NModal,
  NForm,
  NInput,
  NFormItem,
  FormInst,
  NEmpty,
  NSkeleton,
  useMessage,
} from "naive-ui";
import { reactive, ref, watch } from "vue";
import RuleItem from "./components/rule-item.vue";

const message = useMessage();

// 获取规则列表请求
const listRulesReq = useRequest(listRules);
listRulesReq.onError((err) => {
  message.error(err.error.message);
});

// 创建规则弹窗
const createRuleModalVisible = ref(false);
watch(createRuleModalVisible, (val) => {
  if (val) {
    createRuleForm.name = "";
    createRuleForm.desc = "";
  }
});
const createRuleFormRef = ref<FormInst | null>(null);
const createRuleForm = reactive({
  name: "",
  desc: "",
});
const createRuleFormRules = {
  name: [
    { required: true, message: "请输入规则名称", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
    {
      validator: (_rule: any, value: string) =>
        value.length && value.trim() === ""
          ? Promise.reject("不能为空白")
          : Promise.resolve(),
      trigger: "blur",
    },
  ],
  desc: [],
};

// 创建规则请求
const createRuleReq = useRequest(() => createRule(createRuleForm), {
  immediate: false,
});
createRuleReq.onError((err) => {
  message.error(err.error.message);
});
createRuleReq.onSuccess((_res) => {
  message.success("创建成功");

  // 刷新规则列表
  invalidateCache(listRules());
  listRulesReq.send();

  // 关闭弹窗
  createRuleModalVisible.value = false;
});

// 点击添加按钮事件
const handleAddClick = () => {
  createRuleModalVisible.value = true;
};

// 创建规则按钮事件
const handleCreateRule = () => {
  createRuleFormRef.value?.validate().then(createRuleReq.send);
};
</script>

<template>
  <div class="w-full h-full bg-slate-1">
    <common-header title="规则管理">
      <!-- 配置按钮 -->
      <n-button strong secondary type="primary" @click="handleAddClick">
        <template #icon>
          <n-icon><plus-round /></n-icon>
        </template>
        添加</n-button
      >
    </common-header>

    <!-- 词书列表 -->
    <ul class="p-3 flex flex-col gap-3">
      <n-skeleton
        v-if="listRulesReq.loading.value"
        :repeat="5"
        height="80px"
        :sharp="false"
      />

      <n-empty
        v-else-if="listRulesReq.data.value?.length === 0"
        class="mt-10"
        description="啊？你怎么一个词源都没有，害！"
        size="large"
      >
        <!-- <template #extra>
          <n-button size="small" @click="dropdownOptions[0].onClick?.()">
            🤔 看看有啥词书先
          </n-button>
        </template> -->
      </n-empty>

      <template v-else>
        <!-- 词书item -->
        <rule-item
          v-for="item in listRulesReq.data.value"
          :key="item._id"
          :rule="item"
        />
      </template>
    </ul>

    <!-- 创建规则弹窗 -->
    <n-modal
      v-model:show="createRuleModalVisible"
      preset="card"
      title="创建规则"
      class="mx-5"
    >
      <!-- 表单 -->
      <n-form
        ref="createRuleFormRef"
        :model="createRuleForm"
        :rules="createRuleFormRules"
      >
        <n-form-item label="规则名称" path="name">
          <n-input
            v-model:value="createRuleForm.name"
            placeholder="请输入规则名称"
          />
        </n-form-item>
        <n-form-item label="规则描述" path="desc">
          <n-input
            v-model:value="createRuleForm.desc"
            placeholder="请输入规则描述"
          />
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <template #footer>
        <div class="flex justify-end gap-3">
          <n-button @click="createRuleModalVisible = false">取消</n-button>
          <n-button
            type="primary"
            :loading="createRuleReq.loading.value"
            :disabled="createRuleReq.loading.value"
            @click="handleCreateRule"
            >创建</n-button
          >
        </div>
      </template>
    </n-modal>
  </div>
</template>
