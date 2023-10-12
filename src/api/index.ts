import { createAlova } from "alova";
import VueHook from "alova/vue";
import GlobalFetch from "alova/GlobalFetch";
import { useUserStore } from "@/store/modules/user";
import router from "@/router";

const baseURL = import.meta.env.VITE_APP_BASE_URL;

export const commonAlova = createAlova({
  baseURL,
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  // 请求拦截
  beforeRequest(method) {
    const userStore = useUserStore();
    method.config.headers["Content-Type"] = "application/json;charset=UTF-8";
    if (userStore.accessToken) {
      method.config.headers["Authorization"] = `Bear ${userStore.accessToken}`;
    }
  },
  // 响应拦截
  async responded(response) {
    const json = await response.json();
    if (json.code === -1) router.replace("/login");
    if (json.error) throw new Error(json.error);
    return json;
  },
});
