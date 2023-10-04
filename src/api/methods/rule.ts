import { commonAlova } from "..";

export type Rule = {
  _id: string;
  name: string;
  desc?: string;
};

export type RuleCreateForm = Pick<Rule, "name" | "desc">;

export const createRule = (rule: RuleCreateForm) =>
  commonAlova.Post<{ ruleId: string }>("/create-rule", rule);

export const listRules = () => commonAlova.Get<Rule[]>("/list-rules");

export const deleteRule = (ruleId: string) =>
  commonAlova.Delete(`/delete-rule`, { ruleId });
