import { commonAlova } from "..";

export type RuleTemplate = {
  _id: string;
  name: string;
  desc?: string;
  type: "review" | "learn" | "exam";
  public: boolean;
  code: string;
};

export type RuleTemplateCreateForm = Pick<
  RuleTemplate,
  "name" | "desc" | "type"
>;

export const createRuleTemplate = (rule: RuleTemplateCreateForm) =>
  commonAlova.Post<{ ruleTemplateId: string }>("/create-rule-template", rule);

export const listRuleTemplates = (type: "mine" | "public") =>
  commonAlova.Post<RuleTemplate[]>("/list-rule-templates", { type });

export const deleteRuleTemplate = (ruleTemplateId: string) =>
  commonAlova.Delete("/delete-rule-template", { ruleTemplateId });

export const getRuleTemplate = (ruleTemplateId: string) =>
  commonAlova.Post<RuleTemplate>("/get-rule-template", { ruleTemplateId });

export const updateRuleTemplate = (ruleTemplate: Partial<RuleTemplate>) =>
  commonAlova.Post("/update-rule-template", ruleTemplate);
