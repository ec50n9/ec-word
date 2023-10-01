import { createAlova } from "alova";
import VueHook from "alova/vue";
import GlobalFetch from "alova/GlobalFetch";

const baseURL = "https://vssu8m.laf.run";

export const userAlova = createAlova({
  baseURL,
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  beforeRequest(method) {
    method.config.headers["Content-Type"] = "application/json;charset=UTF-8";
    method.config.headers.token = "user token";
  },
  async responded(response) {
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    return json
  },
});
