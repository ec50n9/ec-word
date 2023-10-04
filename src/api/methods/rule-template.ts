import { commonAlova } from "..";

export type RuleTemplate = {
  _id: string;
  name: string;
  desc?: string;
  type: "review" | "learn" | "exam";
  public: boolean;
  content: {
    vars: {
      name: string;
      desc: string;
      type: "string" | "number" | "boolean";
      mapName: string;
    }[];
    code: string;
  };
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
