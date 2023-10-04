<script lang="ts" setup>
import CommonHeader from "@/components/common-header.vue";
import {
  NButton,
  NIcon,
  useMessage,
  NSkeleton,
  NEmpty,
  FormInst,
  NForm,
  NFormItem,
  NModal,
  NInput,
  NRadioGroup,
  NRadioButton,
} from "naive-ui";
import { PlusRound, WidgetsRound } from "@vicons/material";
import {
  RuleTemplate,
  RuleTemplateCreateForm,
  createRuleTemplate,
  deleteRuleTemplate,
  listRuleTemplates,
} from "@/api/methods/rule-template";
import RuleTemplateItem from "./components/rule-template-item.vue";
import { useRequest, invalidateCache } from "alova";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const message = useMessage();
const router = useRouter();

// 获取模板列表请求
const listRuleTemplatesReq = useRequest(() => listRuleTemplates("mine"));
listRuleTemplatesReq.onError((err) => {
  message.error(err.error.message);
});

// 创建模板弹窗可见性
const createRuleTemplateModalVisible = ref(false);
watch(createRuleTemplateModalVisible, (val) => {
  if (val) {
    createRuleTemplateForm.name = "";
    createRuleTemplateForm.desc = "";
    createRuleTemplateForm.type = "learn";
  }
});

// 创建模板表单
const createRuleTemplateFormRef = ref<FormInst | null>(null);
const createRuleTemplateForm = reactive<RuleTemplateCreateForm>({
  name: "",
  desc: "",
  type: "learn",
});
const createRuleTemplateFormRules = {
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
  type: [{ required: true, message: "请选择规则类型", trigger: "blur" }],
};

// 创建模板
const handleCreateRuleTemplate = async () => {
  createRuleTemplateFormRef.value?.validate().then(createRuleTemplateReq.send);
};

// 创建模板请求
const createRuleTemplateReq = useRequest(
  () => createRuleTemplate(createRuleTemplateForm),
  {
    immediate: false,
  }
);
createRuleTemplateReq.onError((err) => {
  message.error(err.error.message);
});
createRuleTemplateReq.onSuccess((_res) => {
  message.success("创建成功");

  // 刷新模板列表
  invalidateCache(listRuleTemplates("mine"));
  listRuleTemplatesReq.send();

  // 关闭弹窗
  createRuleTemplateModalVisible.value = false;
});

// 添加按钮点击事件
const handleAddClick = () => {
  createRuleTemplateModalVisible.value = true;
};
const handleMarketClick = () => {};

// 删除模板请求
const deleteRuleTemplateReq = useRequest(deleteRuleTemplate, {
  immediate: false,
});
deleteRuleTemplateReq.onError((err) => {
  message.error(err.error.message);
});
deleteRuleTemplateReq.onSuccess((_res) => {
  message.success("删除成功");

  // 刷新模板列表
  invalidateCache(listRuleTemplates("mine"));
  listRuleTemplatesReq.send();
});

// 删除模板
const handleRuleTemplateDelete = (ruleTemplate: RuleTemplate) => {
  deleteRuleTemplateReq.send(ruleTemplate._id);
};

// 点击模板
const handleRuleTemplateClick = (ruleTemplate: RuleTemplate) => {
  router.push({
    path: "/rule-template-management/edit",
    query: {
      id: ruleTemplate._id,
    },
  });
};
</script>

<template>
  <div class="w-full h-full bg-slate-1 c-gray-7">
    <!-- 顶部栏 -->
    <common-header title="规则模板">
      <!-- 配置按钮 -->
      <n-button strong secondary circle type="info" @click="handleMarketClick">
        <template #icon>
          <n-icon><widgets-round /></n-icon>
        </template>
      </n-button>
      <n-button strong secondary round type="primary" @click="handleAddClick">
        <template #icon>
          <n-icon><plus-round /></n-icon>
        </template>
        添加</n-button
      >
    </common-header>

    <!-- 规则模板列表 -->
    <ul class="p-3 flex flex-col gap-3">
      <n-skeleton
        v-if="listRuleTemplatesReq.loading.value"
        :repeat="5"
        height="80px"
        :sharp="false"
      />

      <n-empty
        v-else-if="listRuleTemplatesReq.data.value?.length === 0"
        class="mt-10"
        description="一个模板都没有，害！"
        size="large"
      />

      <template v-else>
        <!-- 模板item -->
        <rule-template-item
          v-for="item in listRuleTemplatesReq.data.value"
          :key="item._id"
          :rule-template="item"
          @click="handleRuleTemplateClick(item)"
          show-delete
          @delete="handleRuleTemplateDelete"
        />
      </template>
    </ul>

    <!-- 创建模板弹窗 -->
    <n-modal
      v-model:show="createRuleTemplateModalVisible"
      preset="card"
      title="创建规则"
      class="mx-5"
    >
      <!-- 表单 -->
      <n-form
        ref="createRuleTemplateFormRef"
        :model="createRuleTemplateForm"
        :rules="createRuleTemplateFormRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="规则名称" path="name">
          <n-input
            v-model:value="createRuleTemplateForm.name"
            placeholder="请输入规则名称"
          />
        </n-form-item>
        <n-form-item label="规则描述" path="desc">
          <n-input
            v-model:value="createRuleTemplateForm.desc"
            placeholder="请输入规则描述"
          />
        </n-form-item>
        <n-form-item label="规则类型" path="type">
          <n-radio-group v-model:value="createRuleTemplateForm.type">
            <n-radio-button value="learn">学习</n-radio-button>
            <n-radio-button value="review">复习</n-radio-button>
            <n-radio-button value="exam">考试</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <template #footer>
        <div class="flex justify-end gap-3">
          <n-button @click="createRuleTemplateModalVisible = false"
            >取消</n-button
          >
          <n-button
            type="primary"
            :loading="createRuleTemplateReq.loading.value"
            :disabled="createRuleTemplateReq.loading.value"
            @click="handleCreateRuleTemplate"
            >创建</n-button
          >
        </div>
      </template>
    </n-modal>
  </div>
</template>
