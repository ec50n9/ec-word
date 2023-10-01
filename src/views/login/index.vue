<script lang="ts" setup>
import { useRequest } from "alova";
import { registerUser, loginUser } from "@/api/methods/user";
import {
  FormInst,
  NForm,
  NFormItem,
  NInput,
  NButton,
  useDialog,
  useMessage,
} from "naive-ui";
import { useUserStore } from "@/store/modules/user";
import { ref } from "vue";
import { useRouter } from "vue-router";

const dialog = useDialog();
const message = useMessage();
const userStore = useUserStore();
const router = useRouter();

const formRef = ref<FormInst | null>(null);
const formValue = ref({ username: "", password: "" });
const rules = {
  username: [
    { required: true, message: "我得知道你是谁，拜托！", trigger: "blur" },
  ],
  password: [{ required: true, message: "总得有个密码吧？", trigger: "blur" }],
};

// 注册请求
const registerReq = useRequest(
  () => registerUser(formValue.value.username, formValue.value.password),
  { immediate: false }
);
// 注册失败
registerReq.onError((err) => {
  dialog.error({
    title: "注册失败",
    content: err.error.message,
  });
});
// 注册成功
registerReq.onSuccess(() => {
  message.success("注册成功!");
  loginReq.send();
});
// 注册事件
const handleRegister = () => {
  formRef?.value?.validate().then(registerReq.send);
};

// 登录请求
const loginReq = useRequest(
  () => loginUser(formValue.value.username, formValue.value.password),
  { immediate: false }
);
// 登录失败
loginReq.onError((err) => {
  dialog.error({
    title: "登录失败",
    content: err.error.message,
  });
});
// 登录成功
loginReq.onSuccess(({ data }) => {
  message.success("登录成功!");
  const { accessToken } = data;
  userStore.updateAccessToken(accessToken);
  router.replace("/");
});
// 登录事件
const handleLogin = () => {
  formRef?.value?.validate().then(loginReq.send);
};
</script>

<template>
  <div class="w-full min-h-screen pt-20 bg-slate-1">
    <div class="px-5 py-4 mx-5 bg-white rd-3 shadow">
      <h1 class="text-2xl mb-3">登录</h1>

      <!-- 表单 -->
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="formValue.username"
            placeholder="输入用户名"
          />
        </n-form-item>

        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formValue.password"
            placeholder="输入密码"
            type="password"
          />
        </n-form-item>
      </n-form>

      <!-- 按钮 -->
      <div class="flex gap-3 justify-end">
        <n-button @click="handleRegister">注册</n-button>
        <n-button
          type="primary"
          :loading="loginReq.loading.value === true"
          @click="handleLogin"
          >登录</n-button
        >
      </div>
    </div>
  </div>
</template>
