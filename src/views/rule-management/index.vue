<script lang="ts" setup>
import { createRule, deleteRule, listRules } from "@/api/methods/rule";
import CommonHeader from "@/components/common-header.vue";
import { PlusRound } from "@vicons/material";
import { invalidateCache, useRequest } from "alova";
import {
  NIcon,
  NButton,
  NForm,
  NInput,
  NFormItem,
  FormInst,
  NEmpty,
  NSkeleton,
  useMessage,
  NDrawer,
  NDrawerContent,
  NSelect,
  NTabs,
  NTabPane,
} from "naive-ui";
import { computed, reactive, ref, watch } from "vue";
import RuleItem from "./components/rule-item.vue";
import RuleTemplateItem from "@/views/rule-template-management/components/rule-template-item.vue";
import { listRuleTemplates } from "@/api/methods/rule-template";

const message = useMessage();

// 获取规则列表请求
const listRulesReq = useRequest(listRules);
listRulesReq.onError((err) => {
  message.error(err.error.message);
});

// 创建规则弹窗
const createRuleDrawerVisible = ref(false);
watch(createRuleDrawerVisible, (val) => {
  if (val) {
    createRuleForm.name = "";
    createRuleForm.desc = "";
    createRuleForm.templateId = null;
  }
});
const createRuleFormRef = ref<FormInst | null>(null);
const createRuleForm = reactive({
  name: "",
  desc: "",
  templateId: null as null | string,
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
  templateId: [
    { required: true, message: "请选择规则模板", trigger: ["blur", "focus"] },
  ],
};

// 加载规则模板列表请求
const listRuleTemplatesReq = useRequest(listRuleTemplates, {
  immediate: false,
});
listRuleTemplatesReq.onError((err) => {
  message.error(err.error.message);
});

const ruleTemplateOptions = computed(() => {
  return listRuleTemplatesReq.data.value?.map((item) => ({
    label: item.name,
    value: item._id,
  }));
});

// 规则模板tabs
const ruleTemplateTabs = [
  {
    name: "mine",
    label: "我的",
  },
  {
    name: "public",
    label: "广场",
  },
];
const currentRuleTemplateTab = ref(ruleTemplateTabs[0].name);
watch(currentRuleTemplateTab, (val) => {
  listRuleTemplatesReq.send(val);
});

// 规则模板选择drawer
const ruleTemplateDrawerVisible = ref(false);
watch(ruleTemplateDrawerVisible, (val) => {
  if (val) {
    listRuleTemplatesReq.send(currentRuleTemplateTab.value);
  }
});

// 规则模板点击事件
const handleRuleTemplateClick = (ruleTemplateId: string) => {
  createRuleForm.templateId = ruleTemplateId;
  ruleTemplateDrawerVisible.value = false;
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
  createRuleDrawerVisible.value = false;
});

// 点击添加按钮事件
const handleAddClick = () => {
  createRuleDrawerVisible.value = true;
};

// 创建规则按钮事件
const handleCreateRule = () => {
  createRuleFormRef.value?.validate().then(createRuleReq.send);
};

// 删除规则请求
const deleteRuleReq = useRequest(deleteRule, { immediate: false });
deleteRuleReq.onError((err) => {
  message.error(err.error.message);
});
deleteRuleReq.onSuccess((_res) => {
  message.success("删除成功");

  // 刷新规则列表
  invalidateCache(listRules());
  listRulesReq.send();
});

// 删除规则事件
const handleDeleteRule = (ruleId: string) => {
  deleteRuleReq.send(ruleId);
};
</script>

<template>
  <div class="w-full h-full bg-slate-1">
    <common-header title="规则管理">
      <!-- 配置按钮 -->
      <n-button strong secondary round type="primary" @click="handleAddClick">
        <template #icon>
          <n-icon><plus-round /></n-icon>
        </template>
        添加</n-button
      >
    </common-header>

    <transition name="fade" mode="out-in">
      <n-empty
        v-if="listRulesReq.data.value?.length === 0"
        class="mt-10"
        description="还没有规则呢"
        size="large"
      >
        <template #extra>
          <n-button size="small" @click="handleAddClick">
            🤔 新建一个
          </n-button>
        </template>
      </n-empty>

      <!-- 词书列表 -->
      <transition v-else name="fade" mode="out-in">
        <ul v-if="listRulesReq.loading.value" class="p-3 flex flex-col gap-3">
          <n-skeleton :repeat="5" height="80px" :sharp="false" />
        </ul>

        <ul v-else class="p-3 flex flex-col gap-3">
          <!-- 词书item -->
          <rule-item
            v-for="item in listRulesReq.data.value"
            :key="item._id"
            :rule="item"
            @delete="handleDeleteRule(item._id)"
          />
        </ul>
      </transition>
    </transition>

    <!-- 创建规则弹窗 -->
    <n-drawer
      v-model:show="createRuleDrawerVisible"
      height="90%"
      placement="bottom"
    >
      <n-drawer-content title="创建规则" closable>
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
          <n-form-item label="规则模板" path="templateId">
            <n-select
              placeholder="请选择规则模板"
              v-model:value="createRuleForm.templateId"
              :options="ruleTemplateOptions"
              :show="false"
              @click="ruleTemplateDrawerVisible = true"
            />
          </n-form-item>
        </n-form>

        <!-- 操作按钮 -->
        <template #footer>
          <div class="flex justify-end gap-3">
            <n-button @click="createRuleDrawerVisible = false">取消</n-button>
            <n-button
              type="primary"
              :loading="createRuleReq.loading.value"
              :disabled="createRuleReq.loading.value"
              @click="handleCreateRule"
              >创建</n-button
            >
          </div>
        </template>
      </n-drawer-content>

      <!-- 规则模板列表 -->
      <n-drawer
        v-model:show="ruleTemplateDrawerVisible"
        height="85%"
        placement="bottom"
      >
        <n-drawer-content
          :title="`规则模板（共${
            listRuleTemplatesReq.data.value?.length || 0
          }个）`"
          closable
        >
          <n-tabs type="segment" v-model:value="currentRuleTemplateTab">
            <!-- 我的模板 -->
            <n-tab-pane
              v-for="tab in ruleTemplateTabs"
              :key="tab.name"
              :name="tab.name"
              :tab="tab.label"
            >
              <ul class="flex flex-col gap-3 c-gray-7">
                <n-skeleton
                  v-if="listRuleTemplatesReq.loading.value"
                  :repeat="3"
                  height="80px"
                  :sharp="false"
                />

                <template v-else>
                  <!-- 规则模板item -->
                  <rule-template-item
                    v-for="item in listRuleTemplatesReq.data.value"
                    :key="item._id"
                    :rule-template="item"
                    @click="handleRuleTemplateClick(item._id)"
                  />
                </template>
              </ul>
            </n-tab-pane>
          </n-tabs>
        </n-drawer-content>
      </n-drawer>
    </n-drawer>
  </div>
</template>
