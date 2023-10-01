import { createAlova } from "alova";
import VueHook from "alova/vue";
import GlobalFetch from "alova/GlobalFetch";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

const baseURL = "https://vssu8m.laf.run";

export const userAlova = createAlova({
  baseURL,
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  beforeRequest(method) {
    method.config.headers["Content-Type"] = "application/json;charset=UTF-8";
    method.config.headers.token = userStore.accessToken;
  },
  async responded(response) {
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    return json;
  },
});
